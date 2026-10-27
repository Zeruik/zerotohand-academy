param([switch]$AllowPrivateToolchain)
$ErrorActionPreference = 'Stop'
$bundleRoot = Join-Path $PSScriptRoot 'dist/desktop'
$runtimeRoot = Join-Path $PSScriptRoot 'qa/desktop-runtime/node_modules/electron/dist'
if (!(Test-Path -LiteralPath (Join-Path $runtimeRoot 'electron.exe'))) { throw 'Install Electron 45.0.0 and run its install.js first.' }
$flashingRoot = Join-Path $PSScriptRoot 'dist/flashing-v10'
$flashingManifest = Join-Path $flashingRoot 'bundle.json'
if (!(Test-Path -LiteralPath $flashingManifest)) { throw 'Offline toolchain missing. Run build-flashing.cjs and complete its corresponding-source checks before building the desktop distribution.' }
$flashingBundle = Get-Content -LiteralPath $flashingManifest -Raw | ConvertFrom-Json
if ($flashingBundle.format -ne 'zth-flashing-toolchain' -or $flashingBundle.version -ne 10) { throw 'Unexpected toolchain manifest.' }
if (!$flashingBundle.distributionReady -and !$AllowPrivateToolchain) { throw 'Corresponding-source review is incomplete. This toolchain is not ready for distribution.' }
$resolvedBundleRoot = [IO.Path]::GetFullPath($bundleRoot)
$resolvedWorkspaceRoot = [IO.Path]::GetFullPath($PSScriptRoot).TrimEnd('\') + '\'
if (!$resolvedBundleRoot.StartsWith($resolvedWorkspaceRoot,[StringComparison]::OrdinalIgnoreCase) -or $resolvedBundleRoot -ne [IO.Path]::GetFullPath((Join-Path $PSScriptRoot 'dist/desktop'))) { throw 'Unsafe generated-output path.' }
if (Test-Path -LiteralPath $resolvedBundleRoot) {
  if (Get-ChildItem -LiteralPath $resolvedBundleRoot -Recurse -File -Filter 'learning-store.zthdb' | Select-Object -First 1) { throw 'The generated output contains a learner archive. Preserve it outside the build folder before rebuilding.' }
  Remove-Item -LiteralPath $resolvedBundleRoot -Recurse -Force
}
New-Item -ItemType Directory -Force (Join-Path $bundleRoot 'resources/app') | Out-Null
Copy-Item -Path "$runtimeRoot/*" -Destination $bundleRoot -Recurse -Force
Move-Item -LiteralPath (Join-Path $bundleRoot 'electron.exe') -Destination (Join-Path $bundleRoot 'ZeroToHand.exe') -Force
& node (Join-Path $PSScriptRoot 'build-exe-brand-v10.cjs')
if ($LASTEXITCODE -ne 0) { throw 'Executable branding failed.' }
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'desktop/package.json'),(Join-Path $PSScriptRoot 'desktop/main.cjs'),(Join-Path $PSScriptRoot 'desktop/preload.cjs'),(Join-Path $PSScriptRoot 'desktop/store.cjs'),(Join-Path $PSScriptRoot 'desktop/storage-path.cjs'),(Join-Path $PSScriptRoot 'desktop/flashing.cjs'),(Join-Path $PSScriptRoot 'desktop/protection.cjs') -Destination (Join-Path $bundleRoot 'resources/app')
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'ZeroToHand-Engineering-Academy.html') -Destination (Join-Path $bundleRoot 'resources/app/index.html')
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'ZeroToHand-Academy.ico') -Destination (Join-Path $bundleRoot 'resources/app/icon.ico')
Copy-Item -LiteralPath $flashingRoot -Destination (Join-Path $bundleRoot 'resources/flashing-v10') -Recurse
Write-Output 'Desktop bundle built.'

