param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Arguments
)

$bash = Get-Command bash -ErrorAction SilentlyContinue
if (-not $bash) {
    throw "bash was not found in PATH. Install Git Bash or another bash-compatible shell, then rerun this wrapper."
}

$scriptPath = Join-Path $PSScriptRoot "recover-local-surrealdb.sh"
& $bash.Source $scriptPath @Arguments
exit $LASTEXITCODE
