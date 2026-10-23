<?php

declare(strict_types=1);

$original = getenv('ORKESTRIA_APP_PATH');
$temporary = sys_get_temp_dir().'/planning-path-'.bin2hex(random_bytes(8));
mkdir($temporary, 0700);

function assertRejected(string|false $value): void
{
    putenv($value === false ? 'ORKESTRIA_APP_PATH' : 'ORKESTRIA_APP_PATH='.$value);
    try {
        require __DIR__.'/application-path.php';
    } catch (RuntimeException) {
        return;
    }
    throw new RuntimeException('An absent, relative, missing or incomplete application must be rejected.');
}

try {
    assertRejected(false);
    assertRejected('');
    assertRejected('../orkestria360');
    assertRejected($temporary.'/missing');
    assertRejected($temporary);
    mkdir($temporary.'/vendor');
    mkdir($temporary.'/bootstrap');
    foreach (['artisan', 'vendor/autoload.php', 'bootstrap/app.php'] as $file) {
        file_put_contents($temporary.'/'.$file, '<?php throw new RuntimeException("This file must never be executed by path selection.");');
    }
    putenv('ORKESTRIA_APP_PATH='.$temporary);
    $resolved = require __DIR__.'/application-path.php';
    if ($resolved !== realpath($temporary)) {
        throw new RuntimeException('An explicit complete application path must resolve without bootstrapping it.');
    }
    echo "application path tests passed (no bootstrap, database or network)\n";
} finally {
    putenv($original === false ? 'ORKESTRIA_APP_PATH' : 'ORKESTRIA_APP_PATH='.$original);
    foreach (['artisan', 'vendor/autoload.php', 'bootstrap/app.php'] as $file) {
        if (is_file($temporary.'/'.$file)) {
            unlink($temporary.'/'.$file);
        }
    }
    foreach (['vendor', 'bootstrap'] as $directory) {
        if (is_dir($temporary.'/'.$directory)) {
            rmdir($temporary.'/'.$directory);
        }
    }
    rmdir($temporary);
}
