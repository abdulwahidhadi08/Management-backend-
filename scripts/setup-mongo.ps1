$url = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.12.zip"
$zipPath = "d:\SMIT COURSE\student management\backend\mongodb.zip"
$extractPath = "d:\SMIT COURSE\student management\backend\mongodb-temp"
$destPath = "d:\SMIT COURSE\student management\backend\mongodb"
$dataPath = "d:\SMIT COURSE\student management\backend\mongodb-data"

if (!(Test-Path $destPath)) {
    Write-Host "Creating destination directory..."
    New-Item -ItemType Directory -Path $destPath -Force | Out-Null

    Write-Host "Downloading MongoDB ZIP..."
    Import-Module BitsTransfer
    Start-BitsTransfer -Source $url -Destination $zipPath
    
    Write-Host "Extracting MongoDB..."
    Expand-Archive -Path $zipPath -DestinationPath $extractPath
    
    Write-Host "Moving files..."
    $binFolder = Get-ChildItem -Path $extractPath -Directory | Select-Object -First 1
    Move-Item -Path "$($binFolder.FullName)\*" -Destination $destPath -Force
    
    Write-Host "Cleaning up ZIP and temp files..."
    Remove-Item -Path $zipPath -Force
    Remove-Item -Path $extractPath -Recurse -Force
}

if (!(Test-Path $dataPath)) {
    New-Item -ItemType Directory -Path $dataPath | Out-Null
}

Write-Host "Starting MongoDB Server..."
# Run in background
Start-Process -FilePath "$destPath\bin\mongod.exe" -ArgumentList "--dbpath=`"$dataPath`" --bind_ip 127.0.0.1" -NoNewWindow
Write-Host "MongoDB Server started!"
