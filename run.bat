@echo off
setlocal

@echo off

REM Paths to installers
set chrome_installer="C:\Users\Bliss-Bot\Required Apps\ChromeSetup.exe"
set blissbot="C:\Users\Bliss-Bot\Bliss-Bot.lnk"

REM Check if Chrome is installed
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    @echo off
) else (
    @echo off
    start /wait "" %chrome_installer%
    @echo off
)


REM Close Google Chrome if it is running
@echo off
tasklist /fi "imagename eq chrome.exe" | find /i "chrome.exe" >nul
if %errorlevel% equ 0 (
    @echo off
    taskkill /f /im chrome.exe >nul
    @echo off
) else (
    @echo off
)

REM Check if the shortcut already exists in the destination folder
if exist "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Bliss-Bot.lnk" (
    @echo off
) else (
    @echo off
    copy "C:\Users\Bliss-Bot\Bliss-Bot.lnk" "C:\ProgramData\Microsoft\Windows\Start Menu\Programs\"
    @echo off
)

REM Check if Chocolatey is installed
where choco >nul 2>nul
if %errorlevel% neq 0 (
    @echo off
    @powershell -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
    @echo off
    choco install nodejs -y
    @echo off
    start /wait "" %blissbot%
    @echo off
) else (
    @echo off
)

@echo off

endlocal

REM Navigate to specific directory and run node script
cd /d "C:\Users\Bliss-Bot\"
node Bliss_Bot_Script.js

REM Check the exit code of the node script and open log file if it exits with code 1
if %errorlevel% equ 1 (
    echo Review Bliss Bot Logs
    start notepad.exe "C:\Users\Bliss-Bot\Bliss_Bot_logs.txt"
)

REM Close the command prompt
pause
