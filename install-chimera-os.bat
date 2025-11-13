@echo off
REM ============================================
REM CHIMERA OS - Windows Installer
REM Deploy to eKo.vision, 0r8.ai, or local
REM ============================================

setlocal enabledelayedexpansion

echo.
echo    _____ _    _ _____ __  __ ______ _____            ____   _____
echo   / ____^| ^|  ^| ^|_   _^|  \/  ^|  ____^|  __ \     /\   / __ \ / ____^|
echo  ^| ^|    ^| ^|__^| ^| ^| ^| ^| \  / ^| ^|__  ^| ^|__) ^|   /  \ ^| ^|  ^| ^| (___
echo  ^| ^|    ^|  __  ^| ^| ^| ^| ^|\/^| ^|  __^ |  _  /   / /\ \^| ^|  ^| ^|\___ \
echo  ^| ^|____^| ^|  ^| ^|_^| ^|_^| ^|  ^| ^| ^|____^| ^| \ \  / ____ \ ^|__^| ^|____) ^|
echo   \_____^|_^|  ^|_^|_____^|_^|  ^|_^|______^|_^|  \_\/_/    \_\____/^|_____/
echo.
echo Universal Installer for eKo.vision
echo Truth Above All. Everybody Eats. Daily +1%% Minimum.
echo.

REM Check if running as admin
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Warning: Running as Administrator. Consider using a regular user.
    echo.
)

REM Check Node.js
echo [1/10] Checking prerequisites...
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo [X] Node.js not found
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)
node --version
echo [OK] Node.js found

REM Check npm
where npm >nul 2>&1
if %errorLevel% neq 0 (
    echo [X] npm not found
    pause
    exit /b 1
)
npm --version
echo [OK] npm found

REM Check git
where git >nul 2>&1
if %errorLevel% neq 0 (
    echo [X] git not found
    echo Please install git from https://git-scm.com
    pause
    exit /b 1
)
git --version
echo [OK] git found

echo.

REM Installation mode
echo [2/10] Select installation mode:
echo   1) Development (local, with hot reload)
echo   2) Production (Docker)
echo   3) Production (Vercel - eKo.vision)
echo   4) Production (Windows Service)
echo.
set /p INSTALL_MODE="Enter choice [1-4]: "

if "%INSTALL_MODE%"=="1" (
    set MODE=development
) else if "%INSTALL_MODE%"=="2" (
    set MODE=docker
) else if "%INSTALL_MODE%"=="3" (
    set MODE=vercel
) else if "%INSTALL_MODE%"=="4" (
    set MODE=service
) else (
    echo Invalid choice
    pause
    exit /b 1
)

echo Selected mode: %MODE%
echo.

REM Set installation directory
set INSTALL_DIR=%USERPROFILE%\chimera-os

REM Clone or update repository
echo [3/10] Setting up repository...

if exist "%INSTALL_DIR%" (
    echo Directory exists. Pulling latest changes...
    cd /d "%INSTALL_DIR%"
    git pull origin claude/build-feature-011CV2XMi6WYeCzZv4Q4dMHC
) else (
    echo Cloning repository...
    git clone https://github.com/JB3ARD3N/Project-Sundae.git "%INSTALL_DIR%"
    cd /d "%INSTALL_DIR%"
    git checkout claude/build-feature-011CV2XMi6WYeCzZv4Q4dMHC
)

echo [OK] Repository ready
echo.

REM Navigate to eko-vision
cd eko-vision

REM Install dependencies
echo [4/10] Installing dependencies...
call npm install
echo [OK] Dependencies installed
echo.

REM Configure environment
echo [5/10] Configuring environment...

if not exist ".env.local" (
    if not exist ".env.production" (
        copy .env.example .env.local
        echo [!] Created .env.local from template
        echo [!] Please edit .env.local with your API keys
        echo.
        set /p EDIT_ENV="Do you want to edit .env.local now? (y/n): "
        if /i "!EDIT_ENV!"=="y" (
            notepad .env.local
        )
    )
)

echo [OK] Environment configured
echo.

REM Mode-specific setup
if "%MODE%"=="development" (
    echo [6/10] Development setup complete
    echo [OK] Ready to run
    echo.
    echo [7-10] Skipped (development mode)
    echo.
    echo ========================================
    echo   INSTALLATION COMPLETE
    echo ========================================
    echo.
    echo To start development server:
    echo   cd %INSTALL_DIR%\eko-vision
    echo   npm run dev
    echo.
    echo Then visit:
    echo   http://localhost:3000/os
    echo.
    pause
    exit /b 0
)

if "%MODE%"=="docker" (
    echo [6/10] Checking Docker...
    where docker >nul 2>&1
    if %errorLevel% neq 0 (
        echo [X] Docker not found
        echo Please install Docker Desktop from https://docker.com
        pause
        exit /b 1
    )

    echo [OK] Docker found
    echo.

    echo [7/10] Building Docker image...
    docker build -t chimera-os:latest .
    echo [OK] Image built
    echo.

    echo [8/10] Preparing environment...
    copy .env.local .env.production
    echo [OK] Environment ready
    echo.

    echo [9/10] Starting containers...
    docker-compose up -d
    echo [OK] Containers running
    echo.

    echo [10/10] Deployment complete
    echo.
    echo ========================================
    echo   DOCKER DEPLOYMENT COMPLETE
    echo ========================================
    echo.
    echo Access your deployment:
    echo   http://localhost:3000/os
    echo.
    echo Useful commands:
    echo   docker-compose logs -f    # View logs
    echo   docker-compose stop       # Stop containers
    echo   docker-compose restart    # Restart containers
    echo.
    pause
    exit /b 0
)

if "%MODE%"=="vercel" (
    echo [6/10] Checking Vercel CLI...
    where vercel >nul 2>&1
    if %errorLevel% neq 0 (
        echo Installing Vercel CLI...
        call npm i -g vercel
    )
    echo [OK] Vercel CLI ready
    echo.

    echo [7/10] Logging in to Vercel...
    call vercel login
    echo.

    echo [8/10] Setting environment variables...
    echo [!] You'll need to add environment variables in Vercel dashboard
    echo [!] Visit: https://vercel.com/dashboard/settings/environment-variables
    echo.
    pause

    echo [9/10] Deploying to Vercel...
    call vercel --prod
    echo.

    echo [10/10] Configuring domains...
    echo Add your domains (eko.vision, 0r8.ai)
    set /p ADD_DOMAIN="Add domain now? (y/n): "
    if /i "%ADD_DOMAIN%"=="y" (
        set /p DOMAIN="Enter domain (e.g., eko.vision): "
        call vercel domains add !DOMAIN!
    )
    echo.

    echo ========================================
    echo   VERCEL DEPLOYMENT COMPLETE
    echo ========================================
    echo.
    echo Your deployment is live!
    echo.
    pause
    exit /b 0
)

if "%MODE%"=="service" (
    echo [6/10] Building production bundle...
    call npm run build
    echo [OK] Build complete
    echo.

    echo [7/10] Installing PM2...
    where pm2 >nul 2>&1
    if %errorLevel% neq 0 (
        call npm i -g pm2
        call npm i -g pm2-windows-startup
        call pm2-startup install
    )
    echo [OK] PM2 ready
    echo.

    echo [8/10] Starting with PM2...
    call pm2 start npm --name "chimera-os" -- start
    call pm2 save
    echo [OK] Application running
    echo.

    echo [9/10] Configuring Windows service...
    call pm2 save
    echo [OK] Service configured
    echo.

    echo [10/10] Deployment complete
    echo.
    echo ========================================
    echo   WINDOWS SERVICE DEPLOYMENT COMPLETE
    echo ========================================
    echo.
    echo Your deployment is running on:
    echo   http://localhost:3000/os
    echo.
    echo Useful commands:
    echo   pm2 logs chimera-os       # View logs
    echo   pm2 stop chimera-os       # Stop application
    echo   pm2 restart chimera-os    # Restart application
    echo   pm2 monit                 # Monitor resources
    echo.
    pause
    exit /b 0
)

echo.
echo ========================================
echo   Next Steps:
echo ========================================
echo.
echo 1. Configure Supabase database
echo 2. Add AI API keys to environment
echo 3. Test all features
echo 4. Set up monitoring
echo 5. Configure backups
echo.
echo Documentation:
echo   %INSTALL_DIR%\COMPLETE_DEPLOYMENT_GUIDE.md
echo   %INSTALL_DIR%\eko-vision\CHIMERA_OS_SETUP.md
echo.
echo Support:
echo   GitHub: https://github.com/JB3ARD3N/Project-Sundae/issues
echo.
echo LFG! 🚀
echo.
pause
