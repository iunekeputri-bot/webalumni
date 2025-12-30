$models = Get-ChildItem -Path "app/Models" -Filter *.php
foreach ($file in $models) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace "namespace App;", "namespace App\Models;"
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Updated namespace in $($file.Name)"
    }
}

$allFiles = Get-ChildItem -Path "app" -Recurse -Filter *.php
$targets = @("User", "Alumni", "Company", "Document", "JobApplication", "JobPosting", "Message")

foreach ($file in $allFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    foreach ($target in $targets) {
        # Replace 'use App\Target;'
        $content = $content -replace "use App\\$target;", "use App\Models\\$target;"
        # Replace 'App\Target' (in strings)
        $content = $content -replace "'App\\$target'", "'App\Models\\$target'"
        # Replace App\Target::class
        $content = $content -replace "App\\$target::class", "App\Models\\$target::class"
    }

    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content
        Write-Host "Updated usages in $($file.Name)"
    }
}
