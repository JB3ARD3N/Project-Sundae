@echo off
echo ========================================
echo    CHIMERA OS - PRODUCTION BUILD
echo ========================================
echo.

echo [1/4] Installing dependencies...
call npm install
echo.

echo [2/4] Running build...
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ Build failed! Check errors above.
    pause
    exit /b 1
)
echo.

echo [3/4] Testing production build...
echo.

echo [4/4] Build complete! ✓
echo.
echo ========================================
echo    PRODUCTION BUILD READY
echo ========================================
echo.
echo To start production server:
echo   npm start
echo.
echo To deploy to Vercel:
echo   npm i -g vercel
echo   vercel
echo.
pause
