@echo off
setlocal

cd /d "%~dp0"

if not exist ".venv\Scripts\python.exe" (
    echo Python environment not found.
    echo Please run setup.bat first.
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo Frontend dependencies not found.
    echo Please run setup.bat first.
    pause
    exit /b 1
)

echo Starting Flask backend at http://localhost:5000...
start "Student Project - Flask Backend" cmd /k "cd /d ""%~dp0backend"" && ""%~dp0.venv\Scripts\python.exe"" app.py"

echo Starting React frontend at http://localhost:5173...
start "Student Project - React Frontend" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo Application windows started.
echo Open http://localhost:5173 in your browser.
echo Keep both command windows open while using the application.
timeout /t 3 /nobreak >nul
exit /b 0
