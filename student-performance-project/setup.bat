@echo off
setlocal

cd /d "%~dp0"

echo ==========================================
echo Student Performance Project - Setup
echo ==========================================
echo.

where py >nul 2>nul
if errorlevel 1 (
    echo ERROR: Python was not found.
    echo Install Python from https://www.python.org/downloads/
    echo Make sure "Add Python to PATH" is enabled.
    pause
    exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js was not found.
    echo Install the Node.js LTS version from https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo ERROR: npm was not found. Reinstall Node.js LTS and reopen this window.
    pause
    exit /b 1
)

if not exist ".venv\Scripts\python.exe" (
    echo Creating Python virtual environment...
    py -m venv .venv
    if errorlevel 1 (
        echo ERROR: Could not create the Python virtual environment.
        pause
        exit /b 1
    )
) else (
    echo Python virtual environment already exists.
)

echo Installing backend dependencies...
call ".venv\Scripts\python.exe" -m pip install --upgrade pip
if errorlevel 1 (
    echo ERROR: Could not upgrade pip.
    pause
    exit /b 1
)

call ".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Could not install Python dependencies.
    pause
    exit /b 1
)

echo Installing frontend dependencies...
pushd frontend
call npm ci
if errorlevel 1 (
    popd
    echo ERROR: Could not install frontend dependencies.
    pause
    exit /b 1
)
popd

echo.
echo Setup complete. Double-click run.bat to start the application.
pause
