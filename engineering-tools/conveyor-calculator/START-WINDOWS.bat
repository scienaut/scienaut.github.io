@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required to start the local calculator.
  echo Install Node.js, then double-click this file again.
  pause
  exit /b 1
)

start "Open Conveyor Calculator server" /D "%~dp0" cmd /k "node tools\serve.mjs"
timeout /t 2 /nobreak >nul
start "" http://127.0.0.1:8000/
