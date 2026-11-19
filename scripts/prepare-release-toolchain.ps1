$ErrorActionPreference = 'Stop'
trap { Write-Output ('::error::' + $_.Exception.Message.Replace('%','%25').Replace("`r",'%0D').Replace("`n",'%0A')); exit 1 }
if ($env:GITHUB_ACTIONS -ne 'true' -or $env:RUNNER_OS -ne 'Windows') { throw 'Ephemeral Windows runner required' }
$work = Join-Path $env:RUNNER_TEMP ('academy-baseline-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory $work | Out-Null
$archive = Join-Path $work 'baseline.zip'
$uri = 'https://github.com/Zeruik/zerotohand-academy/releases/download/v14.0.0/ZeroToHand-Academy-Windows-v14.0.0.zip'
Invoke-WebRequest $uri -OutFile $archive
if ((Get-FileHash $archive -Algorithm SHA256).Hash.ToLowerInvariant() -ne '1598c774a979b9d257eb4e6754a1988edb33a657e3f11ae55f6ac08d690be71e') { throw 'Published baseline ZIP checksum mismatch' }
# Extract only the release installer and corresponding-source materials.
$zip = [IO.Compression.ZipFile]::OpenRead($archive)
try {
  $prefix = 'ZeroToHand-Academy-Windows-v14.0.0/'
  foreach ($entry in $zip.Entries) {
    if (!$entry.FullName.StartsWith($prefix, [StringComparison]::Ordinal)) { throw 'Unexpected baseline archive root' }
    $relative = $entry.FullName.Substring($prefix.Length)
    if ($relative -ne 'Install-ZeroToHand-v14.exe' -and !$relative.StartsWith('ThirdPartySources/', [StringComparison]::Ordinal)) { continue }
    if ($relative -match '(^|/)\.\.(/|$)|[\\:\x00-\x1f]') { throw 'Unsafe baseline archive path' }
    if ($relative.EndsWith('/')) { continue }
    $destination = Join-Path $work $relative
    New-Item -ItemType Directory -Force (Split-Path $destination) | Out-Null
    [IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $destination, $false)
  }
} finally { $zip.Dispose() }
Remove-Item $archive
$setup = Join-Path $work 'Install-ZeroToHand-v14.exe'
if ((Get-FileHash $setup -Algorithm SHA256).Hash.ToLowerInvariant() -ne '04f2e12dd80934f54ba4738b666cc0e9f62ff52f16ce838b13f694d7fdf82b1f') { throw 'Published installer checksum mismatch' }
$registration = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\{CFF45F03-4D61-4AF0-93F5-5C21174D7510}_is1'
if (Test-Path $registration) { throw 'Refusing to replace an existing production installation' }
$install = Join-Path $work 'BaselineApp'
$process = Start-Process $setup -ArgumentList @('/VERYSILENT','/SUPPRESSMSGBOXES','/NORESTART','/ACCEPTLICENSE=1','/TASKS=',('/DIR="' + $install + '"')) -Wait -PassThru
if ($process.ExitCode -ne 0) { throw 'Baseline installation failed' }
$tools = Join-Path $install 'resources/flashing-v10'
if (!(Test-Path (Join-Path $tools 'bundle.json'))) { throw 'Baseline toolchain manifest missing' }
$target = Join-Path $PWD 'dist/flashing-v10'
$materials = Join-Path $PWD 'dist/flashing-sources-v10'
if ((Test-Path $target) -or (Test-Path $materials)) { throw 'Refusing to replace prepared toolchain inputs' }
New-Item -ItemType Directory -Force (Split-Path $target) | Out-Null
Move-Item $tools $target
Move-Item (Join-Path $work 'ThirdPartySources') $materials
$uninstaller = Join-Path $install 'unins000.exe'
if (!(Test-Path $uninstaller)) { throw 'Baseline uninstaller missing' }
$process = Start-Process $uninstaller -ArgumentList @('/VERYSILENT','/SUPPRESSMSGBOXES','/NORESTART') -Wait -PassThru
if ($process.ExitCode -ne 0) { throw 'Baseline uninstall failed' }
if (Test-Path $registration) { throw 'Baseline uninstall did not remove its registration' }
# The current builder checks every copied toolchain file and the paired source
# manifest before distribution. No --allow-private-toolchain override is used.
Write-Host 'Prepared unchanged, published toolchain and corresponding sources from checksum-verified 14.0.0 baseline.'
