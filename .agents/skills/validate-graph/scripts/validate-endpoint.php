<?php

declare(strict_types=1);

namespace Orkestria\ValidateGraph;

use App\Models\MicrosoftConnection;
use App\Models\Tenant;
use App\Support\Microsoft365\GraphAccessFailure;
use App\Tenancy\TenantExecutionRunner;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Http\Client\Factory as HttpFactory;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use RuntimeException;
use Throwable;

/*
 * Base versionada para as coletas temporárias da skill validate-graph.
 *
 * Os arquivos de trabalho em ../tmp devem apenas requerer este arquivo e
 * chamar EndpointValidator::validate(). Esta base é a única responsável por
 * bootstrap, seleção de conexão, token e I/O autenticado.
 */
final class EndpointValidator
{
    private const GRAPH_HOST = 'graph.microsoft.com';
    private const OFFICE365_MANAGEMENT_ACTIVITY_HOST = 'manage.office.com';
    private const GRAPH_PROVIDER = 'graph';
    private const OFFICE365_MANAGEMENT_ACTIVITY_PROVIDER = 'office365-management-activity';
    private const AZURE_PROVIDER = 'azure';
    private const CSV_MAX_BYTES = 52_428_800;
    private const CSV_MAX_RECORD_BYTES = 1_048_576;
    private const CSV_READ_CHUNK_BYTES = 8_192;
    private const CSV_INVALID = 1;
    private const CSV_LIMIT_EXCEEDED = 2;

    /** @var list<string> */
    private const AZURE_HOST_SUFFIXES = ['.azure.com', '.windows.net'];

    public function __construct(
        private readonly HttpFactory $http,
        private readonly TenantExecutionRunner $tenants,
    ) {}

    /**
     * @param array<string, scalar|null> $query
     * @param array<string, scalar> $headers
     * @return array{result: 'viable'|'restricted'|'blocked'|'failed', attempts: list<array<string, mixed>>}
     */
    public function validate(string $method, string $endpoint, array $query = [], array $headers = [], array $requiredAppRoles = []): array
    {
        $destination = $this->destination($endpoint);
        $this->assertMethod($method);
        $this->assertHeaders($headers);
        $this->assertQuery($query);

        try {
            $connections = $this->connections();
        } catch (Throwable) {
            return ['result' => 'blocked', 'attempts' => [$this->blocked(0, 'database')]];
        }

        if ($connections === []) {
            return ['result' => 'blocked', 'attempts' => [$this->blocked(0, 'connection')]];
        }

        $attempts = [];
        $first = $this->attempt($connections[0], $destination, $query, $headers, 1, $requiredAppRoles);
        $attempts[] = $first;

        if (! isset($connections[1]) || $this->isServerError($first)) {
            return ['result' => $this->result($attempts), 'attempts' => $attempts];
        }

        $second = $this->attempt($connections[1], $destination, $query, $headers, 2, $requiredAppRoles);
        $attempts[] = $second;

        return ['result' => $this->result($attempts), 'attempts' => $attempts];
    }

    /** @param list<array<string, mixed>> $attempts */
    private function result(array $attempts): string
    {
        if (collect($attempts)->contains(fn (array $attempt): bool => $attempt['outcome'] === 'success')) {
            return 'viable';
        }

        if (collect($attempts)->every(fn (array $attempt): bool => $attempt['outcome'] === 'license_restricted')) {
            return 'restricted';
        }

        return collect($attempts)->contains(fn (array $attempt): bool => $attempt['outcome'] === 'blocked') ? 'blocked' : 'failed';
    }

    /** @param array<string, mixed> $attempt */
    private function isServerError(array $attempt): bool
    {
        return is_int($attempt['status'] ?? null) && $attempt['status'] >= 500 && $attempt['status'] < 600;
    }

    /** @return list<array{tenant: Tenant, connection_id: string}> */
    private function connections(): array
    {
        $connections = [];

        foreach (Tenant::query()
            ->where('kind', Tenant::KIND_CUSTOMER)
            ->where('state', Tenant::STATE_ACTIVE)
            ->orderBy('id')
            ->cursor() as $tenant) {
            $connection = $this->tenants->run($tenant, fn (): ?MicrosoftConnection => MicrosoftConnection::query()
                ->where('tenant_id', $tenant->getKey())
                ->where('state', MicrosoftConnection::STATE_CONNECTED)
                ->orderBy('id')
                ->first());

            if ($connection === null || ! is_string($connection->getKey()) || $connection->getKey() === '') {
                continue;
            }

            $connections[] = ['tenant' => $tenant, 'connection_id' => $connection->getKey()];
            if (count($connections) === 2) {
                break;
            }
        }

        return $connections;
    }

    /**
     * @param array{tenant: Tenant, connection_id: string} $candidate
     * @param array{provider: string, host: string, path: string, audience: string} $destination
     * @param array<string, scalar|null> $query
     * @param array<string, scalar> $headers
     * @return array<string, mixed>
     */
    private function attempt(array $candidate, array $destination, array $query, array $headers, int $position, array $requiredAppRoles): array
    {
        $destinationSummary = $this->destinationSummary($position, $destination);

        try {
            $microsoftTenantId = $this->tenants->run($candidate['tenant'], function () use ($candidate): string {
                $connection = MicrosoftConnection::query()
                    ->whereKey($candidate['connection_id'])
                    ->where('tenant_id', $candidate['tenant']->getKey())
                    ->where('state', MicrosoftConnection::STATE_CONNECTED)
                    ->lockForUpdate()
                    ->sole();

                $tenantId = $connection->microsoft_tenant_id;
                if (! is_string($tenantId) || $tenantId === '') {
                    throw new RuntimeException('A conexão não possui um tenant Microsoft verificável.');
                }

                return $tenantId;
            });
        } catch (Throwable) {
            return $this->blocked($position, 'connection') + $destinationSummary;
        }

        try {
            $token = $this->token($microsoftTenantId, $this->scope($destination));
        } catch (Throwable) {
            return $this->blocked($position, 'token_endpoint') + $destinationSummary;
        }

        $roleSummary = $this->roleSummary($token, $requiredAppRoles);

        try {
            $path = $this->resolvePath($destination['host'], $destination['path'], $token, $microsoftTenantId);
            if ($path === null) {
                return $this->blocked($position, 'path_parameter') + $destinationSummary + $roleSummary;
            }

            $request = $this->http
                ->withToken($token)
                ->withHeaders($headers);
            $request = $this->isGraphCsvReport($destination, $headers)
                ? $request->accept('text/csv')
                : $request->acceptJson();
            $response = $request
                ->withOptions(['allow_redirects' => false, 'timeout' => 20])
                ->get('https://'.$destination['host'].$path, $query);
        } catch (Throwable) {
            return $this->failed($position, 'transport') + $destinationSummary + $roleSummary;
        }

        if ($this->isGraphCsvReport($destination, $headers) && $response->status() === 302) {
            return $this->downloadCsvReport($position, $destination, $response) + $roleSummary;
        }

        return $this->response($position, $destination, $response) + $roleSummary;
    }

    /** @param array{provider: string, host: string, path: string, audience: string} $destination
     * @param array<string, scalar> $headers
     */
    private function isGraphCsvReport(array $destination, array $headers): bool
    {
        if ($destination['provider'] !== self::GRAPH_PROVIDER) {
            return false;
        }

        foreach ($headers as $name => $value) {
            if (strtolower($name) === 'accept' && is_string($value)) {
                return str_contains(strtolower($value), 'text/csv');
            }
        }

        return false;
    }

    /** @param array{provider: string, host: string, path: string, audience: string} $destination
     * @return array<string, mixed>
     */
    private function downloadCsvReport(int $position, array $destination, Response $redirect): array
    {
        $summary = $this->destinationSummary($position, $destination) + [
            'stage' => 'csv_download',
            'redirect_status' => $redirect->status(),
        ];
        $location = $redirect->header('Location');
        if (! is_string($location) || trim($location) === '') {
            return $this->failed($position, 'redirect_missing_location') + $summary;
        }

        if (! $this->isAllowedPreauthorizedCsvUrl($location)) {
            return $this->failed($position, 'redirect_location_rejected') + $summary;
        }

        try {
            // Deliberately no withToken(): Location already authorizes this download.
            $download = $this->http
                ->accept('text/csv')
                ->withOptions(['allow_redirects' => false, 'timeout' => 20, 'stream' => true])
                ->get($location);
        } catch (Throwable) {
            return $this->failed($position, 'csv_download_failed') + $summary;
        }

        $downloadSummary = $summary + [
            'status' => $download->status(),
            'content_type' => $download->header('Content-Type'),
            'retry_after' => $download->header('Retry-After'),
        ];
        if (! $download->successful()) {
            return $this->failed($position, 'csv_download_failed') + $downloadSummary;
        }

        try {
            return $downloadSummary + ['outcome' => 'success'] + $this->csvSummary($download->resource());
        } catch (RuntimeException $exception) {
            $stage = $exception->getCode() === self::CSV_LIMIT_EXCEEDED ? 'csv_limit_exceeded' : 'csv_invalid';

            return $this->failed($position, $stage) + $downloadSummary;
        }
    }

    private function isAllowedPreauthorizedCsvUrl(string $location): bool
    {
        $url = parse_url($location);
        if (! is_array($url)
            || ($url['scheme'] ?? null) !== 'https'
            || ! is_string($url['host'] ?? null)
            || ($url['port'] ?? 443) !== 443
            || isset($url['user']) || isset($url['pass']) || isset($url['fragment'])) {
            return false;
        }

        return preg_match('/^(?:[a-z0-9-]+\\.)+office\\.com$/i', $url['host']) === 1;
    }

    /** @param resource $stream
     * @return array{csv: array{encoding: string, bom: bool, delimiter: string, header_hash: string, column_count: int, columns: list<array{name: string, type: string, nullable: bool}>, rows_read: int, malformed_rows: int}}
     */
    private function csvSummary($stream): array
    {
        if (! is_resource($stream)) {
            throw new RuntimeException('invalid CSV stream', self::CSV_INVALID);
        }

        $bytesRead = 0;
        $record = '';
        $inQuotes = false;
        $bom = false;
        $headers = null;
        $columnTypes = [];
        $nullable = [];
        $rowsRead = 0;
        $malformedRows = 0;

        $consumeRecord = function (string $raw) use (&$headers, &$columnTypes, &$nullable, &$rowsRead, &$malformedRows, &$bom): void {
            $raw = rtrim($raw, "\r");
            if ($raw === '') {
                return;
            }
            if (preg_match('//u', $raw) !== 1) {
                throw new RuntimeException('invalid CSV encoding', self::CSV_INVALID);
            }

            $cells = str_getcsv($raw, ',', '"', '\\');
            if (! is_array($cells)) {
                throw new RuntimeException('invalid CSV record', self::CSV_INVALID);
            }
            if ($headers === null) {
                if (str_starts_with($cells[0] ?? '', "\xEF\xBB\xBF")) {
                    $cells[0] = substr($cells[0], 3);
                    $bom = true;
                }
                if ($cells === [] || in_array('', $cells, true) || count($cells) !== count(array_unique($cells))) {
                    throw new RuntimeException('invalid CSV header', self::CSV_INVALID);
                }
                $headers = $cells;
                $columnTypes = array_fill(0, count($headers), []);
                $nullable = array_fill(0, count($headers), false);

                return;
            }

            $rowsRead++;
            if (count($cells) !== count($headers)) {
                $malformedRows++;

                return;
            }
            foreach ($cells as $index => $value) {
                $type = $this->csvValueType($value);
                if ($type === 'empty') {
                    $nullable[$index] = true;
                } else {
                    $columnTypes[$index][$type] = true;
                }
            }
        };

        while (! feof($stream)) {
            $chunk = fread($stream, self::CSV_READ_CHUNK_BYTES);
            if ($chunk === false || $chunk === '') {
                continue;
            }
            $bytesRead += strlen($chunk);
            if ($bytesRead > self::CSV_MAX_BYTES) {
                throw new RuntimeException('CSV limit exceeded', self::CSV_LIMIT_EXCEEDED);
            }

            $length = strlen($chunk);
            for ($index = 0; $index < $length; $index++) {
                $character = $chunk[$index];
                if ($character === '"') {
                    if ($inQuotes && ($chunk[$index + 1] ?? null) === '"') {
                        $record .= '""';
                        $index++;
                        continue;
                    }
                    $inQuotes = ! $inQuotes;
                    $record .= $character;
                    continue;
                }
                if ($character === "\n" && ! $inQuotes) {
                    $consumeRecord($record);
                    $record = '';
                    continue;
                }
                $record .= $character;
                if (strlen($record) > self::CSV_MAX_RECORD_BYTES) {
                    throw new RuntimeException('CSV record limit exceeded', self::CSV_LIMIT_EXCEEDED);
                }
            }
        }

        if ($inQuotes) {
            throw new RuntimeException('unterminated CSV quote', self::CSV_INVALID);
        }
        $consumeRecord($record);
        if ($headers === null) {
            throw new RuntimeException('CSV header missing', self::CSV_INVALID);
        }

        $columns = [];
        foreach ($headers as $index => $header) {
            $columns[] = [
                'name' => $header,
                'type' => $this->mergeCsvTypes(array_keys($columnTypes[$index])),
                'nullable' => $nullable[$index],
            ];
        }

        return ['csv' => [
            'encoding' => 'UTF-8',
            'bom' => $bom,
            'delimiter' => ',',
            'header_hash' => hash('sha256', implode("\x1F", $headers)),
            'column_count' => count($headers),
            'columns' => $columns,
            'rows_read' => $rowsRead,
            'malformed_rows' => $malformedRows,
        ]];
    }

    private function csvValueType(string $value): string
    {
        if (trim($value) === '') {
            return 'empty';
        }
        if (preg_match('/^(?:true|false)$/i', $value) === 1) {
            return 'boolean';
        }
        if (preg_match('/^-?(?:0|[1-9][0-9]*)$/', $value) === 1) {
            return 'integer';
        }
        if (preg_match('/^-?(?:[0-9]+\\.[0-9]+)$/', $value) === 1) {
            return 'decimal';
        }
        if (preg_match('/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/', $value) === 1) {
            return 'date';
        }
        if (preg_match('/^[0-9]{4}-[0-9]{2}-[0-9]{2}[T ][0-9]{2}:[0-9]{2}:[0-9]{2}(?:\\.[0-9]+)?(?:Z|[+-][0-9]{2}:[0-9]{2})?$/', $value) === 1) {
            return 'date-time';
        }

        return 'string';
    }

    /** @param list<string> $types */
    private function mergeCsvTypes(array $types): string
    {
        if ($types === []) {
            return 'empty';
        }
        if (count($types) === 1) {
            return $types[0];
        }
        if (count(array_diff($types, ['integer', 'decimal'])) === 0) {
            return 'decimal';
        }

        return 'string';
    }

    private function resolvePath(string $host, string $path, string $token, string $microsoftTenantId): ?string
    {
        $path = str_replace('{tenant-id}', rawurlencode($microsoftTenantId), $path);
        if ($host !== self::GRAPH_HOST && preg_match('/\{first-(?:domain|conditional-access-policy|user|drive|drive-item)-id\}/', $path) === 1) {
            return null;
        }

        $identifiers = [];
        $resolveCollection = function (string $placeholder, string $sourcePath, array $sourceQuery = [], bool $force = false) use (&$path, &$identifiers, $token): bool {
            if (! $force && ! str_contains($path, $placeholder)) {
                return true;
            }

            $response = $this->http
                ->withToken($token)
                ->acceptJson()
                ->withOptions(['allow_redirects' => false, 'timeout' => 20])
                ->get('https://'.self::GRAPH_HOST.$sourcePath, $sourceQuery);
            $items = $response->successful() ? $response->json('value') : null;
            $first = is_array($items) ? Arr::first($items) : null;
            $identifier = is_array($first) ? ($first['id'] ?? null) : null;

            if (! is_string($identifier) || $identifier === '') {
                return false;
            }

            $identifiers[$placeholder] = $identifier;
            $path = str_replace($placeholder, rawurlencode($identifier), $path);

            return true;
        };

        if (! $resolveCollection('{first-domain-id}', '/v1.0/domains')
            || ! $resolveCollection('{first-conditional-access-policy-id}', '/v1.0/identity/conditionalAccess/policies')
            || ! $resolveCollection('{first-user-id}', '/v1.0/users', ['$top' => 1])) {
            return null;
        }

        if (str_contains($path, '{first-drive-id}') || str_contains($path, '{first-drive-item-id}')) {
            if (! isset($identifiers['{first-user-id}'])
                && ! $resolveCollection('{first-user-id}', '/v1.0/users', ['$top' => 1], true)) {
                return null;
            }
            $userId = $identifiers['{first-user-id}'] ?? null;
            if (! is_string($userId) || $userId === '') {
                return null;
            }

            $drive = $this->http
                ->withToken($token)
                ->acceptJson()
                ->withOptions(['allow_redirects' => false, 'timeout' => 20])
                ->get('https://'.self::GRAPH_HOST.'/v1.0/users/'.rawurlencode($userId).'/drive');
            $driveId = $drive->successful() ? $drive->json('id') : null;
            if (! is_string($driveId) || $driveId === '') {
                return null;
            }
            $path = str_replace('{first-drive-id}', rawurlencode($driveId), $path);

            if (str_contains($path, '{first-drive-item-id}')) {
                $children = $this->http
                    ->withToken($token)
                    ->acceptJson()
                    ->withOptions(['allow_redirects' => false, 'timeout' => 20])
                    ->get('https://'.self::GRAPH_HOST.'/v1.0/drives/'.rawurlencode($driveId).'/root/children', ['$top' => 1]);
                $first = $children->successful() ? Arr::first($children->json('value')) : null;
                $itemId = is_array($first) ? ($first['id'] ?? null) : null;
                if (! is_string($itemId) || $itemId === '') {
                    return null;
                }
                $path = str_replace('{first-drive-item-id}', rawurlencode($itemId), $path);
            }
        }

        return $path;
    }

    private function token(string $microsoftTenantId, string $scope): string
    {
        $clientId = (string) config('services.microsoft_graph.client_id');
        $clientSecret = (string) config('services.microsoft_graph.client_secret');
        if ($clientId === '' || $clientSecret === '') {
            throw new RuntimeException('A credencial de aplicação não está configurada.');
        }

        $response = $this->http
            ->asForm()
            ->acceptJson()
            ->withOptions(['allow_redirects' => false, 'timeout' => 20])
            ->post('https://login.microsoftonline.com/'.rawurlencode($microsoftTenantId).'/oauth2/v2.0/token', [
                'client_id' => $clientId,
                'client_secret' => $clientSecret,
                'grant_type' => 'client_credentials',
                'scope' => $scope,
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('O endpoint de token não aceitou a credencial.');
        }

        $token = $response->json('access_token');
        if (! is_string($token) || $token === '') {
            throw new RuntimeException('O endpoint de token não retornou um access token válido.');
        }

        return $token;
    }

    /** @param list<string> $requiredAppRoles
     * @return array<string, mixed>
     */
    private function roleSummary(string $token, array $requiredAppRoles): array
    {
        if ($requiredAppRoles === []) {
            return [];
        }

        $segments = explode('.', $token);
        $payload = $segments[1] ?? '';
        $decoded = base64_decode(strtr($payload, '-_', '+/').str_repeat('=', (4 - strlen($payload) % 4) % 4), true);
        $claims = is_string($decoded) ? json_decode($decoded, true) : null;
        $roles = is_array($claims) && is_array($claims['roles'] ?? null) ? $claims['roles'] : [];
        $granted = array_values(array_filter($roles, 'is_string'));
        $required = array_values(array_filter($requiredAppRoles, 'is_string'));

        return [
            'required_app_roles' => $required,
            'missing_required_app_roles' => array_values(array_diff($required, $granted)),
        ];
    }

    /**
     * @param  array{provider: string, host: string, path: string, audience: string}  $destination
     * @return array<string, mixed>
     */
    private function response(int $position, array $destination, Response $response): array
    {
        $summary = $this->destinationSummary($position, $destination) + [
            'stage' => 'endpoint',
            'status' => $response->status(),
            'content_type' => $response->header('Content-Type'),
            'retry_after' => $response->header('Retry-After'),
        ];

        if ($response->successful()) {
            $payload = $response->json();

            return $summary + ['outcome' => 'success'] + $this->jsonSummary($payload);
        }

        $classification = $destination['provider'] === self::GRAPH_PROVIDER
            ? GraphAccessFailure::classify(
                new RequestException($response),
                'não avaliada na coleta técnica',
                'exigida pelo endpoint',
            )
            : null;
        $error = $response->json('error');

        return $summary + [
            'outcome' => $classification !== null && $classification['availabilityStatus'] === 'restricted' ? 'license_restricted' : 'failed',
            'error_kind' => $classification !== null && $classification['availabilityStatus'] === 'restricted' ? 'license' : 'http',
        ] + $this->providerErrorSummary($error);
    }

    /** @return array<string, mixed> */
    private function jsonSummary(mixed $payload): array
    {
        $isList = is_array($payload) && array_is_list($payload);
        $isObject = is_array($payload) && ! $isList;
        $firstItem = $isList ? Arr::first($payload) : null;
        $value = $isObject ? ($payload['value'] ?? null) : null;
        $firstValueItem = is_array($value) ? Arr::first($value) : null;

        return [
            'json_shape' => $payload === null ? 'null' : ($isList ? 'list' : ($isObject ? 'object' : 'scalar')),
            'item_count' => $isList ? count($payload) : null,
            'item_keys' => is_array($firstItem) ? array_values(array_filter(array_keys($firstItem), 'is_string')) : [],
            'envelope_keys' => $isObject ? array_values(array_filter(array_keys($payload), 'is_string')) : [],
            'value_count' => is_array($value) ? count($value) : null,
            'value_item_keys' => is_array($firstValueItem) ? array_values(array_filter(array_keys($firstValueItem), 'is_string')) : [],
        ];
    }

    /** @return array<string, ?string> */
    private function providerErrorSummary(mixed $error): array
    {
        $innerError = is_array($error) ? ($error['innerError'] ?? $error['innererror'] ?? null) : null;

        return [
            'provider_error_code' => $this->safeErrorCode(is_array($error) ? ($error['code'] ?? null) : null),
            'provider_error_message' => $this->safeErrorMessage(is_array($error) ? ($error['message'] ?? null) : null),
            'provider_inner_error_code' => $this->safeErrorCode(is_array($innerError) ? ($innerError['code'] ?? null) : null),
        ];
    }

    private function safeErrorCode(mixed $value): ?string
    {
        if (! is_string($value) || preg_match('/^[A-Za-z0-9._-]{1,100}$/', $value) !== 1) {
            return null;
        }

        return $value;
    }

    private function safeErrorMessage(mixed $value): ?string
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        $sanitized = preg_replace([
            '/[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}/i',
            '/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i',
        ], ['[redacted]', '[redacted-email]'], $value);

        return is_string($sanitized) ? mb_substr($sanitized, 0, 500) : null;
    }

    /** @return array{provider: string, host: string, path: string, audience: string} */
    private function destination(string $endpoint): array
    {
        $url = parse_url($endpoint);
        if (! is_array($url)
            || ($url['scheme'] ?? null) !== 'https'
            || ! is_string($url['host'] ?? null)
            || ($url['port'] ?? 443) !== 443
            || isset($url['user']) || isset($url['pass']) || isset($url['fragment']) || isset($url['query'])) {
            throw new RuntimeException('O endpoint deve ser uma URL HTTPS permitida, sem credenciais, fragmento ou query.');
        }

        $host = strtolower($url['host']);
        $provider = $this->providerForHost($host);
        if ($provider === null) {
            throw new RuntimeException('O host do endpoint está fora da allowlist de APIs Microsoft externas suportadas.');
        }

        return [
            'provider' => $provider,
            'host' => $host,
            'path' => is_string($url['path'] ?? null) && $url['path'] !== '' ? $url['path'] : '/',
            'audience' => 'https://'.$host,
        ];
    }

    private function providerForHost(string $host): ?string
    {
        if ($host === self::GRAPH_HOST) {
            return self::GRAPH_PROVIDER;
        }

        if ($host === self::OFFICE365_MANAGEMENT_ACTIVITY_HOST) {
            return self::OFFICE365_MANAGEMENT_ACTIVITY_PROVIDER;
        }

        foreach (self::AZURE_HOST_SUFFIXES as $suffix) {
            if (str_ends_with($host, $suffix) && $host !== ltrim($suffix, '.')) {
                return self::AZURE_PROVIDER;
            }
        }

        return null;
    }

    private function assertMethod(string $method): void
    {
        if (strtoupper($method) === 'GET') {
            return;
        }
        throw new RuntimeException('A coleta técnica permite somente GET.');
    }

    /** @param array{provider: string, host: string, path: string, audience: string} $destination */
    private function scope(array $destination): string
    {
        return $destination['audience'].'/.default';
    }

    /**
     * @param  array{provider: string, host: string, path: string, audience: string}  $destination
     * @return array{connection_position: int, provider: string, host: string, path: string, audience: string, scope: string}
     */
    private function destinationSummary(int $position, array $destination): array
    {
        return [
            'connection_position' => $position,
            'provider' => $destination['provider'],
            'host' => $destination['host'],
            'path' => $destination['path'],
            'audience' => $destination['audience'],
            'scope' => $this->scope($destination),
        ];
    }

    /** @param array<string, scalar> $headers */
    private function assertHeaders(array $headers): void
    {
        $forbidden = ['authorization', 'cookie', 'host', 'content-length', 'transfer-encoding'];
        foreach ($headers as $name => $value) {
            if (! is_string($name) || ! is_scalar($value) || preg_match('/[\r\n]/', $name.(string) $value) === 1 || in_array(strtolower($name), $forbidden, true)) {
                throw new RuntimeException('Os headers da coleta não são permitidos.');
            }
        }
    }

    /** @param array<string, scalar|null> $query */
    private function assertQuery(array $query): void
    {
        foreach ($query as $name => $value) {
            if (! is_string($name) || (! is_scalar($value) && $value !== null)) {
                throw new RuntimeException('A query da coleta deve conter apenas valores escalares.');
            }
        }
    }

    /** @return array<string, mixed> */
    private function blocked(int $position, string $stage): array
    {
        return ['connection_position' => $position, 'stage' => $stage, 'outcome' => 'blocked'];
    }

    /** @return array<string, mixed> */
    private function failed(int $position, string $stage): array
    {
        return ['connection_position' => $position, 'stage' => $stage, 'outcome' => 'failed'];
    }
}

if (! defined('ORKESTRIA_VALIDATE_GRAPH_TESTING')) {
    $applicationDirectory = require __DIR__.'/application-path.php';
    require $applicationDirectory.'/vendor/autoload.php';

    $application = require $applicationDirectory.'/bootstrap/app.php';
    $application->make(Kernel::class)->bootstrap();

    return new EndpointValidator(
        $application->make(HttpFactory::class),
        $application->make(TenantExecutionRunner::class),
    );
}
