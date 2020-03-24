try {
    Write-Output 'Fixing line endings in package.json ...'

    $package = Get-Content -Path ./package.json -Raw -ErrorAction Stop

    $package.Replace("`r`n", "`n") | Out-File -FilePath ./package.json -ErrorAction Stop

    Write-Output 'Line endings fixed'
} catch {
    Write-Error "Could not fix line endings:`n$_"
    exit 1
}
