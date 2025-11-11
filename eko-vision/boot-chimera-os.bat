@echo off
echo ========================================
echo    CHIMERA OS - BOOT SEQUENCE
echo ========================================
echo.

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [1/3] Installing dependencies...
    call npm install
    echo.
) else (
    echo [1/3] Dependencies already installed ✓
    echo.
)

:: Check if .env.local exists, if not create from example
if not exist ".env.local" (
    if exist ".env.example" (
        echo [2/3] Creating .env.local from example...
        copy .env.example .env.local
        echo.
    )
) else (
    echo [2/3] Environment configured ✓
    echo.
)

echo [3/3] Booting Chimera OS...
echo.
echo ========================================
echo    COCKPIT READY
echo ========================================
echo.
echo Main Dashboard:  http://localhost:3000
echo Chimera OS:      http://localhost:3000/os
echo.
echo Press Ctrl+C to shutdown
echo ========================================
echo.

:: Start the dev server
call npm run dev
