using namespace System.IO
using namespace System.Security.Cryptography

[CmdletBinding(SupportsShouldProcess, HelpUri = 'https://github.com/2chevskii/dot-not#building')]
param (
    [string]$OutFolder = 'build/src/',
    [string]$PackageJson = 'package.json'
)

[hashtable]$package_json

function Read-PackageJson {
    $json = Get-Content -Path $PackageJson -Raw -Encoding utf8

    return ConvertFrom-Json -InputObject $json
}

function Write-PackageJson {
    $package_json | ConvertTo-Json | Out-File $PackageJson -Force -Encoding utf8
}

function Compute-BuildHash {
    if (!(Test-Path -Path $OutFolder)) {
        throw 'Coult not find output folder.'
    }

    $files = Get-ChildItem $OutFolder -Recurse -File -Exclude 'tsbuildinfo.json' | Select-Object -ExpandProperty FullName

    if ($files.Length -lt 1) {
        throw 'Could not find any file in the build folder.'
    }

    Write-Verbose "Files in the out folder:`n$($files | Format-List | Out-String)"

    $all_bytes = @()

    foreach ($filename in $files) {
        $all_bytes += [File]::ReadAllBytes($filename)
    }

    $md5 = [MD5]::Create()

    $hash_bytes = $md5.ComputeHash($all_bytes)

    $hash_string = ''

    foreach ($byte in $hash_bytes) {
        $hash_string += $byte.ToString('x2')
    }

    return $hash_string
}

function Run-Script {
    param(
        [string]$name
    )

    [string]$script = $package_json.scripts.$name

    $process = Start-Process -FilePath 'npx' -ArgumentList $script -NoNewWindow -Wait -PassThru

    return $process.ExitCode
}

Write-Output 'Preparing build ...'

$PackageJson = Join-Path $PSScriptRoot $PackageJson
$OutFolder = Join-Path $PSScriptRoot $OutFolder

Write-Debug "Resolved package.json path to: $PackageJson"
Write-Debug "Resolved out folder path to: $OutFolder"

Write-Output 'Cleaning output directory ...'
Remove-Item -Path $OutFolder -Force -ErrorAction SilentlyContinue -Recurse

Write-Output "Reading package.json file from path: $PackageJson ..."

$package_json = Read-PackageJson

Write-Output "Starting project '$($package_json.name)' build ..."

Write-Output "Running ESLint tests ..."

$code = Run-Script 'lint'

if ($code -ne 0) {
    throw "Failed to lint project! ($code)"
}

Write-Output "Compiling project ..."

$code = Run-Script 'build:project'

if ($code -ne 0) {
    throw "Failed to build project! ($code)"
}

Write-Output "Running mocha tests ..."

## Running tests directly instead of 'npm run test' to skip pretest hook unnecessary here

$code = Run-Script 'test'

if ($code -ne 0) {
    throw "Failed to test project! ($code)"
}

Write-Output "Computing file hash ..."

$hash = Compute-BuildHash

Write-Output "Build hash: $hash"

$old_hash = $package_json.buildHash
$need_bump = $false

if (!$old_hash) {
    Write-Output 'No build hash found in package.json'
    $package_json | Add-Member -MemberType NoteProperty -Name 'buildHash' -Value $hash -Force
    $need_bump = $true
} else {
    Write-Output "Old build hash: $old_hash"
    if ($old_hash -eq $hash) {
        Write-Output 'No hash change detected, keeping the build number'
    } else {
        Write-Output 'Build hash changed, bumping build number'
        $need_bump = $true
    }
}

if ($need_bump) {
    $package_json.buildHash = $hash
}

[uint]$build_num = $package_json.buildNum

if (!$build_num) {
    Write-Output "No build number found in package.json, setting it to 1"
    $package_json | Add-Member -MemberType NoteProperty -Name 'buildNum' -Value 1 -Force
} elseif (!$need_bump) {
    Write-Output "Keeping old build number: $build_num"
} else {
    $package_json.buildNum = $build_num + 1
    Write-Output "Bumping build number: $build_num -> $($package_json.buildNum)"
}

Write-Output "Saving package.json to: $PackageJson ..."

$distr_dir = $package_json.main | Split-Path -Parent

Write-Output 'Cleaning distribution directory ...'
Remove-Item -Path $distr_dir -Recurse -Force -ErrorAction SilentlyContinue

Write-Output "Copying files to the distribution directory: $distr_dir"

Copy-Item -path $OutFolder -Destination $distr_dir -Force -Recurse -Exclude 'tsbuildinfo.json'

Write-PackageJson
