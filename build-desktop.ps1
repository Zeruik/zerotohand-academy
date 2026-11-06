param([switch]$AllowPrivateToolchain,[switch]$RuntimeOnly,[switch]$RefreshApp)
$ErrorActionPreference = 'Stop'
# Async Node operations support the deeply nested ESP32 SDK on Windows.
# Validated previous output is quarantined; no recursive deletion is needed.
$buildArguments = @((Join-Path $PSScriptRoot 'build-desktop.cjs'))
if ($AllowPrivateToolchain) { $buildArguments += '--allow-private-toolchain' }
if ($RuntimeOnly) { $buildArguments += '--runtime-only' }
if ($RefreshApp) { $buildArguments += '--refresh-app' }
& node @buildArguments
if ($LASTEXITCODE -ne 0) { throw 'Desktop bundle build failed; inspect the message above.' }
