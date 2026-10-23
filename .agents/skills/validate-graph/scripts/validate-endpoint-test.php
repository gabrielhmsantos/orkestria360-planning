<?php

declare(strict_types=1);

define('ORKESTRIA_VALIDATE_GRAPH_TESTING', true);

$applicationDirectory = require __DIR__.'/application-path.php';
require $applicationDirectory.'/vendor/autoload.php';
require __DIR__.'/validate-endpoint.php';

use GuzzleHttp\Psr7\Response as PsrResponse;
use Illuminate\Http\Client\Factory as HttpFactory;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response as ClientResponse;
use Orkestria\ValidateGraph\EndpointValidator;
/** @return mixed */
function invoke(EndpointValidator $validator, string $method, mixed ...$arguments): mixed
{
    $reflection = new ReflectionMethod($validator, $method);
    $reflection->setAccessible(true);

    return $reflection->invoke($validator, ...$arguments);
}

/** @param array<string, mixed>|list<array<string, mixed>> $payload */
function response(array $payload, int $status = 200): ClientResponse
{
    return new ClientResponse(new PsrResponse(
        $status,
        ['Content-Type' => 'application/json'],
        json_encode($payload, JSON_THROW_ON_ERROR),
    ));
}

/** @param array<string, string> $headers */
function textResponse(string $body, int $status = 200, array $headers = []): ClientResponse
{
    return new ClientResponse(new PsrResponse(
        $status,
        ['Content-Type' => 'text/csv'] + $headers,
        $body,
    ));
}

/** @return resource */
function csvStream(string $body)
{
    $stream = fopen('php://temp', 'r+');
    if ($stream === false) {
        throw new RuntimeException('Unable to create CSV test stream.');
    }
    fwrite($stream, $body);
    rewind($stream);

    return $stream;
}

function assertSame(mixed $expected, mixed $actual, string $message): void
{
    if ($expected !== $actual) {
        throw new RuntimeException($message.' Expected '.var_export($expected, true).', received '.var_export($actual, true).'.');
    }
}

function assertFalse(bool $value, string $message): void
{
    if ($value) {
        throw new RuntimeException($message);
    }
}

function assertTrue(bool $value, string $message): void
{
    assertFalse(! $value, $message);
}

function assertThrowsCode(callable $callback, int $expectedCode, string $message): void
{
    try {
        $callback();
    } catch (RuntimeException $exception) {
        assertSame($expectedCode, $exception->getCode(), $message);

        return;
    }

    throw new RuntimeException($message.' Expected RuntimeException.');
}

$validator = (new ReflectionClass(EndpointValidator::class))->newInstanceWithoutConstructor();

$activity = invoke($validator, 'destination', 'https://manage.office.com/api/v1.0/{tenant-id}/activity/feed/subscriptions/list');
assertSame('office365-management-activity', $activity['provider'], 'Management Activity provider must be explicit.');
assertSame('https://manage.office.com', $activity['audience'], 'Management Activity audience must use the exact host.');
assertSame('https://manage.office.com/.default', invoke($validator, 'scope', $activity), 'Management Activity token scope must use .default.');
assertSame('/api/v1.0/customer-tenant/activity/feed/subscriptions/list', invoke($validator, 'resolvePath', $activity['host'], $activity['path'], 'unused-token', 'customer-tenant'), 'Management Activity tenant placeholder must resolve locally.');

$activitySuccess = invoke($validator, 'response', 1, $activity, response([]));
assertSame('success', $activitySuccess['outcome'], 'An empty Management Activity list is a valid response.');
assertSame('list', $activitySuccess['json_shape'], 'A Management Activity array must not be interpreted as an OData envelope.');
assertSame(0, $activitySuccess['item_count'], 'Empty Management Activity list count must be preserved.');
assertSame('/api/v1.0/{tenant-id}/activity/feed/subscriptions/list', $activitySuccess['path'], 'Output must retain the safe placeholder instead of a customer tenant ID.');

$activitySubscriptions = invoke($validator, 'response', 1, $activity, response([['contentType' => 'Audit.SharePoint', 'status' => 'enabled']]));
assertSame('success', $activitySubscriptions['outcome'], 'Management Activity subscriptions must be read successfully.');
assertSame(1, $activitySubscriptions['item_count'], 'Management Activity subscription count must be preserved.');
assertSame(['contentType', 'status'], $activitySubscriptions['item_keys'], 'Management Activity output must include only the first item keys, not its values.');

$activityFailure = invoke($validator, 'response', 1, $activity, response(['error' => ['code' => 'AF20023', 'message' => 'Access denied']], 403));
assertSame('AF20023', $activityFailure['provider_error_code'], 'Management Activity errors must preserve safe provider codes.');
assertFalse(array_key_exists('graph_error_code', $activityFailure), 'Management Activity errors must not use Graph-specific classification fields.');

$graph = invoke($validator, 'destination', 'https://graph.microsoft.com/v1.0/{tenant-id}/organization');
assertSame('graph', $graph['provider'], 'Graph provider must remain supported.');
assertSame('https://graph.microsoft.com/.default', invoke($validator, 'scope', $graph), 'Graph token scope must remain unchanged.');
assertSame('/v1.0/customer-tenant/organization', invoke($validator, 'resolvePath', $graph['host'], $graph['path'], 'unused-token', 'customer-tenant'), 'Graph tenant placeholder must remain supported.');

$graphSuccess = invoke($validator, 'response', 1, $graph, response(['value' => [['id' => 'opaque-resource']]]));
assertSame('object', $graphSuccess['json_shape'], 'Graph OData envelopes must remain objects.');
assertSame(1, $graphSuccess['value_count'], 'Graph OData value count must remain available.');
assertSame(['id'], $graphSuccess['value_item_keys'], 'Graph OData item fields must remain available.');

assertTrue(invoke($validator, 'isGraphCsvReport', $graph, ['Accept' => 'text/csv']), 'Graph requests accepting CSV must use the report redirect flow.');
assertFalse(invoke($validator, 'isGraphCsvReport', $activity, ['Accept' => 'text/csv']), 'Only Graph CSV reports may use the preauthorized redirect flow.');
assertTrue(invoke($validator, 'isAllowedPreauthorizedCsvUrl', 'https://reports.office.com/download/report.csv?opaque=token'), 'HTTPS office.com report URLs must be accepted.');
assertFalse(invoke($validator, 'isAllowedPreauthorizedCsvUrl', 'http://reports.office.com/download/report.csv'), 'Non-HTTPS report URLs must be rejected.');
assertFalse(invoke($validator, 'isAllowedPreauthorizedCsvUrl', 'https://reports.office.com:444/download/report.csv'), 'Non-standard report ports must be rejected.');
assertFalse(invoke($validator, 'isAllowedPreauthorizedCsvUrl', 'https://user:pass@reports.office.com/download/report.csv'), 'Report URL credentials must be rejected.');
assertFalse(invoke($validator, 'isAllowedPreauthorizedCsvUrl', 'https://reports.office.com/download/report.csv#fragment'), 'Report URL fragments must be rejected.');
assertFalse(invoke($validator, 'isAllowedPreauthorizedCsvUrl', 'https://reports.office.com.evil.example/download/report.csv'), 'Non-Microsoft report hosts must be rejected.');

$csvSchema = invoke($validator, 'csvSummary', csvStream("\xEF\xBB\xBFText,Count,Amount,Active,Day,Timestamp,Optional\n\"person@example.test\",7,12.50,true,2026-02-01,2026-02-01T03:04:05Z,\n\"quoted, text\",-2,3.0,FALSE,2026-02-02,2026-02-02 03:04:05,\n"));
assertSame('UTF-8', $csvSchema['csv']['encoding'], 'CSV schema must report its sanitized encoding.');
assertSame(true, $csvSchema['csv']['bom'], 'CSV BOM must be detected.');
assertSame(7, $csvSchema['csv']['column_count'], 'CSV column count must be collected.');
assertSame(2, $csvSchema['csv']['rows_read'], 'CSV row count must be collected.');
assertSame(0, $csvSchema['csv']['malformed_rows'], 'Well-formed CSV rows must not be marked malformed.');
assertSame(['string', 'integer', 'decimal', 'boolean', 'date', 'date-time', 'empty'], array_column($csvSchema['csv']['columns'], 'type'), 'CSV types must be inferred without retaining values.');
assertSame([false, false, false, false, false, false, true], array_column($csvSchema['csv']['columns'], 'nullable'), 'CSV nullability must be inferred from empty cells.');
assertFalse(str_contains(json_encode($csvSchema, JSON_THROW_ON_ERROR), 'person@example.test'), 'CSV cell values must never appear in the schema output.');

$malformedCsv = invoke($validator, 'csvSummary', csvStream("First,Second\nvalue\n"));
assertSame(1, $malformedCsv['csv']['rows_read'], 'Malformed CSV rows must still be counted.');
assertSame(1, $malformedCsv['csv']['malformed_rows'], 'Divergent CSV cardinality must be reported.');
assertThrowsCode(fn (): mixed => invoke($validator, 'csvSummary', csvStream('')), 1, 'Empty CSV must be invalid.');
assertThrowsCode(fn (): mixed => invoke($validator, 'csvSummary', csvStream("Only\n\xFF\n")), 1, 'Invalid CSV encoding must be invalid.');
assertThrowsCode(fn (): mixed => invoke($validator, 'csvSummary', csvStream("Only\n".str_repeat('x', 1_048_577))), 2, 'Oversized CSV records must stop at the configured limit.');

$redirectValidator = (new ReflectionClass(EndpointValidator::class))->newInstanceWithoutConstructor();
$downloadHttp = \Mockery::mock(HttpFactory::class);
$downloadRequest = \Mockery::mock(PendingRequest::class);
$downloadLocation = 'https://reports.office.com/download/report.csv?opaque=preauthorized';
$downloadHttp->shouldNotReceive('withToken');
$downloadHttp->shouldReceive('accept')->once()->with('text/csv')->andReturn($downloadRequest);
$downloadRequest->shouldReceive('withOptions')->once()->with(['allow_redirects' => false, 'timeout' => 20, 'stream' => true])->andReturnSelf();
$downloadRequest->shouldReceive('get')->once()->with($downloadLocation)->andReturn(textResponse("Header\nvalue\n"));
(new \ReflectionProperty(EndpointValidator::class, 'http'))->setValue($redirectValidator, $downloadHttp);
$csvDownload = invoke($redirectValidator, 'downloadCsvReport', 1, $graph, textResponse('', 302, ['Location' => $downloadLocation]));
assertSame('success', $csvDownload['outcome'], 'A preauthorized CSV download must be summarized successfully.');
assertSame('csv_download', $csvDownload['stage'], 'CSV download stage must remain explicit.');
assertFalse(str_contains(json_encode($csvDownload, JSON_THROW_ON_ERROR), 'opaque=preauthorized'), 'Preauthorized report URLs must never appear in output.');
\Mockery::close();

$missingLocation = invoke($validator, 'downloadCsvReport', 1, $graph, textResponse('', 302));
assertSame('redirect_missing_location', $missingLocation['stage'], 'Redirects without Location must be distinguishable.');
$rejectedLocation = invoke($validator, 'downloadCsvReport', 1, $graph, textResponse('', 302, ['Location' => 'https://evil.example/report.csv']));
assertSame('redirect_location_rejected', $rejectedLocation['stage'], 'Rejected redirect URLs must be distinguishable.');

$failedDownloadValidator = (new ReflectionClass(EndpointValidator::class))->newInstanceWithoutConstructor();
$failedDownloadHttp = \Mockery::mock(HttpFactory::class);
$failedDownloadRequest = \Mockery::mock(PendingRequest::class);
$failedDownloadHttp->shouldReceive('accept')->once()->with('text/csv')->andReturn($failedDownloadRequest);
$failedDownloadRequest->shouldReceive('withOptions')->once()->with(['allow_redirects' => false, 'timeout' => 20, 'stream' => true])->andReturnSelf();
$failedDownloadRequest->shouldReceive('get')->once()->with($downloadLocation)->andReturn(textResponse('', 503));
(new \ReflectionProperty(EndpointValidator::class, 'http'))->setValue($failedDownloadValidator, $failedDownloadHttp);
assertSame('csv_download_failed', invoke($failedDownloadValidator, 'downloadCsvReport', 1, $graph, textResponse('', 302, ['Location' => $downloadLocation]))['stage'], 'Failed report downloads must be distinguishable.');
\Mockery::close();

$invalidDownloadValidator = (new ReflectionClass(EndpointValidator::class))->newInstanceWithoutConstructor();
$invalidDownloadHttp = \Mockery::mock(HttpFactory::class);
$invalidDownloadRequest = \Mockery::mock(PendingRequest::class);
$invalidDownloadHttp->shouldReceive('accept')->once()->with('text/csv')->andReturn($invalidDownloadRequest);
$invalidDownloadRequest->shouldReceive('withOptions')->once()->with(['allow_redirects' => false, 'timeout' => 20, 'stream' => true])->andReturnSelf();
$invalidDownloadRequest->shouldReceive('get')->once()->with($downloadLocation)->andReturn(textResponse("Header\n\"unterminated"));
(new \ReflectionProperty(EndpointValidator::class, 'http'))->setValue($invalidDownloadValidator, $invalidDownloadHttp);
assertSame('csv_invalid', invoke($invalidDownloadValidator, 'downloadCsvReport', 1, $graph, textResponse('', 302, ['Location' => $downloadLocation]))['stage'], 'Invalid CSV downloads must be distinguishable.');
\Mockery::close();

$graphResolverValidator = (new ReflectionClass(EndpointValidator::class))->newInstanceWithoutConstructor();
$http = \Mockery::mock(HttpFactory::class);
$request = \Mockery::mock(PendingRequest::class);
$http->shouldReceive('withToken')->times(3)->with('unused-token')->andReturn($request);
$request->shouldReceive('acceptJson')->times(3)->andReturnSelf();
$request->shouldReceive('withOptions')->times(3)->with(['allow_redirects' => false, 'timeout' => 20])->andReturnSelf();
$request->shouldReceive('get')->once()->with('https://graph.microsoft.com/v1.0/domains', [])->andReturn(response(['value' => [['id' => 'first-domain']]]));
$request->shouldReceive('get')->once()->with('https://graph.microsoft.com/v1.0/identity/conditionalAccess/policies', [])->andReturn(response(['value' => [['id' => 'first-policy']]]));
$request->shouldReceive('get')->once()->with('https://graph.microsoft.com/v1.0/users', ['$top' => 1])->andReturn(response(['value' => [['id' => 'first-user']]]));
(new \ReflectionProperty(EndpointValidator::class, 'http'))->setValue($graphResolverValidator, $http);
assertSame('/v1.0/domains/first-domain', invoke($graphResolverValidator, 'resolvePath', $graph['host'], '/v1.0/domains/{first-domain-id}', 'unused-token', 'customer-tenant'), 'Existing Graph domain resolvers must remain functional.');
assertSame('/v1.0/identity/conditionalAccess/policies/first-policy', invoke($graphResolverValidator, 'resolvePath', $graph['host'], '/v1.0/identity/conditionalAccess/policies/{first-conditional-access-policy-id}', 'unused-token', 'customer-tenant'), 'Existing Graph conditional-access resolvers must remain functional.');
assertSame('/v1.0/users/first-user', invoke($graphResolverValidator, 'resolvePath', $graph['host'], '/v1.0/users/{first-user-id}', 'unused-token', 'customer-tenant'), 'Existing Graph-only resource resolvers must remain functional.');
\Mockery::close();
assertSame(null, invoke($validator, 'resolvePath', $activity['host'], '/api/v1.0/{tenant-id}/activity/feed/{first-user-id}', 'unused-token', 'customer-tenant'), 'Graph-only resource placeholders must remain unavailable to Management Activity.');

$azure = invoke($validator, 'destination', 'https://management.azure.com/subscriptions');
assertSame('azure', $azure['provider'], 'Azure providers must remain supported.');
assertSame('https://management.azure.com/.default', invoke($validator, 'scope', $azure), 'Azure token scope must use its resource audience.');

try {
    $validator->validate('POST', 'https://manage.office.com/api/v1.0/{tenant-id}/activity/feed/subscriptions/start');
    throw new RuntimeException('POST must be rejected before a connection is read.');
} catch (RuntimeException $exception) {
    assertSame('A coleta técnica permite somente GET.', $exception->getMessage(), 'Only GET may reach the external provider.');
}

try {
    invoke($validator, 'destination', 'https://evil.example/api/v1.0/subscriptions/list');
    throw new RuntimeException('Hosts outside the allowlist must be rejected.');
} catch (RuntimeException $exception) {
    assertSame('O host do endpoint está fora da allowlist de APIs Microsoft externas suportadas.', $exception->getMessage(), 'Allowlist failure must remain explicit.');
}

echo "validate-endpoint tests passed\n";
