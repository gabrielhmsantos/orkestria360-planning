<?php

declare(strict_types=1);

$configured = getenv('ORKESTRIA_APP_PATH');
if (! is_string($configured) || $configured === '' || ! str_starts_with($configured, DIRECTORY_SEPARATOR)) {
    throw new RuntimeException('Defina ORKESTRIA_APP_PATH com o caminho absoluto do worktree autorizado da aplicação.');
}
$directory = realpath($configured);
if ($directory === false || ! is_dir($directory)) {
    throw new RuntimeException('ORKESTRIA_APP_PATH não aponta para um diretório existente.');
}
foreach (['artisan', 'vendor/autoload.php', 'bootstrap/app.php'] as $required) {
    if (! is_file($directory.'/'.$required)) {
        throw new RuntimeException('O worktree indicado não possui o bootstrap Laravel e suas dependências.');
    }
}
return $directory;
