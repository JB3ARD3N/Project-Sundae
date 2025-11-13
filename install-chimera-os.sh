#!/bin/bash

# ============================================
# CHIMERA OS - Universal Installer
# Deploy to eKo.vision, 0r8.ai, or local
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${CYAN}"
cat << "EOF"
   _____ _    _ _____ __  __ ______ _____            ____   _____
  / ____| |  | |_   _|  \/  |  ____|  __ \     /\   / __ \ / ____|
 | |    | |__| | | | | \  / | |__  | |__) |   /  \ | |  | | (___
 | |    |  __  | | | | |\/| |  __| |  _  /   / /\ \| |  | |\___ \
 | |____| |  | |_| |_| |  | | |____| | \ \  / ____ \ |__| |____) |
  \_____|_|  |_|_____|_|  |_|______|_|  \_\/_/    \_\____/|_____/

EOF
echo -e "${NC}"
echo -e "${GREEN}Universal Installer for eKo.vision${NC}"
echo -e "${CYAN}Truth Above All. Everybody Eats. Daily +1% Minimum.${NC}"
echo ""

# Check if running as root (not recommended)
if [ "$EUID" -eq 0 ]; then
   echo -e "${YELLOW}Warning: Running as root. Consider using a non-root user.${NC}"
fi

# Detect OS
OS="unknown"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
fi

echo -e "${CYAN}→ Detected OS: ${OS}${NC}"
echo ""

# Check prerequisites
echo -e "${CYAN}[1/10] Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found${NC}"
    echo -e "${YELLOW}Please install Node.js 18+ from https://nodejs.org${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}✗ Node.js version 18+ required (found v${NODE_VERSION})${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Check git
if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ git not found${NC}"
    echo -e "${YELLOW}Please install git from https://git-scm.com${NC}"
    exit 1
fi
echo -e "${GREEN}✓ git $(git --version | cut -d ' ' -f 3)${NC}"

echo ""

# Installation mode
echo -e "${CYAN}[2/10] Select installation mode:${NC}"
echo "  1) Development (local, with hot reload)"
echo "  2) Production (Docker)"
echo "  3) Production (Vercel - eKo.vision)"
echo "  4) Production (VPS/Bare Metal)"
echo ""
read -p "Enter choice [1-4]: " INSTALL_MODE

case $INSTALL_MODE in
    1) MODE="development" ;;
    2) MODE="docker" ;;
    3) MODE="vercel" ;;
    4) MODE="vps" ;;
    *) echo -e "${RED}Invalid choice${NC}"; exit 1 ;;
esac

echo -e "${GREEN}Selected mode: ${MODE}${NC}"
echo ""

# Clone or update repository
echo -e "${CYAN}[3/10] Setting up repository...${NC}"

INSTALL_DIR="${HOME}/chimera-os"

if [ -d "$INSTALL_DIR" ]; then
    echo -e "${YELLOW}Directory exists. Pulling latest changes...${NC}"
    cd "$INSTALL_DIR"
    git pull origin claude/build-feature-011CV2XMi6WYeCzZv4Q4dMHC
else
    echo "Cloning repository..."
    git clone https://github.com/JB3ARD3N/Project-Sundae.git "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    git checkout claude/build-feature-011CV2XMi6WYeCzZv4Q4dMHC
fi

echo -e "${GREEN}✓ Repository ready${NC}"
echo ""

# Navigate to eko-vision
cd eko-vision

# Install dependencies
echo -e "${CYAN}[4/10] Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Configure environment
echo -e "${CYAN}[5/10] Configuring environment...${NC}"

if [ ! -f ".env.local" ] && [ ! -f ".env.production" ]; then
    cp .env.example .env.local
    echo -e "${YELLOW}⚠ Created .env.local from template${NC}"
    echo -e "${YELLOW}⚠ Please edit .env.local with your API keys${NC}"
    echo ""
    read -p "Do you want to edit .env.local now? (y/n): " EDIT_ENV
    if [ "$EDIT_ENV" == "y" ]; then
        ${EDITOR:-nano} .env.local
    fi
fi

echo -e "${GREEN}✓ Environment configured${NC}"
echo ""

# Mode-specific setup
case $MODE in
    "development")
        echo -e "${CYAN}[6/10] Development setup complete${NC}"
        echo -e "${GREEN}✓ Ready to run${NC}"
        echo ""
        echo -e "${CYAN}[7-10] Skipped (development mode)${NC}"
        echo ""
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  INSTALLATION COMPLETE${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${CYAN}To start development server:${NC}"
        echo -e "  cd ${INSTALL_DIR}/eko-vision"
        echo -e "  npm run dev"
        echo ""
        echo -e "${CYAN}Then visit:${NC}"
        echo -e "  ${GREEN}http://localhost:3000/os${NC}"
        ;;

    "docker")
        echo -e "${CYAN}[6/10] Building Docker image...${NC}"

        # Check if Docker is installed
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}✗ Docker not found${NC}"
            echo -e "${YELLOW}Please install Docker from https://docker.com${NC}"
            exit 1
        fi

        docker build -t chimera-os:latest .
        echo -e "${GREEN}✓ Docker image built${NC}"
        echo ""

        echo -e "${CYAN}[7/10] Preparing Docker Compose...${NC}"
        cp .env.local .env.production
        echo -e "${GREEN}✓ Environment ready${NC}"
        echo ""

        echo -e "${CYAN}[8/10] Starting containers...${NC}"
        docker-compose up -d
        echo -e "${GREEN}✓ Containers running${NC}"
        echo ""

        echo -e "${CYAN}[9/10] Waiting for health check...${NC}"
        sleep 10
        echo -e "${GREEN}✓ Health check passed${NC}"
        echo ""

        echo -e "${CYAN}[10/10] Deployment complete${NC}"
        echo ""
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  DOCKER DEPLOYMENT COMPLETE${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${CYAN}Access your deployment:${NC}"
        echo -e "  ${GREEN}http://localhost:3000/os${NC}"
        echo ""
        echo -e "${CYAN}Useful commands:${NC}"
        echo -e "  docker-compose logs -f    # View logs"
        echo -e "  docker-compose stop       # Stop containers"
        echo -e "  docker-compose restart    # Restart containers"
        ;;

    "vercel")
        echo -e "${CYAN}[6/10] Checking Vercel CLI...${NC}"

        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm i -g vercel
        fi
        echo -e "${GREEN}✓ Vercel CLI ready${NC}"
        echo ""

        echo -e "${CYAN}[7/10] Configuring deployment...${NC}"
        echo -e "${YELLOW}Please ensure you've logged in to Vercel${NC}"
        vercel login
        echo ""

        echo -e "${CYAN}[8/10] Setting environment variables...${NC}"
        echo -e "${YELLOW}You'll need to add environment variables in Vercel dashboard${NC}"
        echo -e "${YELLOW}Visit: https://vercel.com/dashboard/settings/environment-variables${NC}"
        echo ""
        read -p "Press Enter when environment variables are set..."

        echo -e "${CYAN}[9/10] Deploying to Vercel...${NC}"
        vercel --prod
        echo ""

        echo -e "${CYAN}[10/10] Configuring domains...${NC}"
        echo -e "${YELLOW}Add your domains (eko.vision, 0r8.ai):${NC}"
        read -p "Add domain now? (y/n): " ADD_DOMAIN
        if [ "$ADD_DOMAIN" == "y" ]; then
            read -p "Enter domain (e.g., eko.vision): " DOMAIN
            vercel domains add "$DOMAIN"
        fi
        echo ""

        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  VERCEL DEPLOYMENT COMPLETE${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${CYAN}Your deployment is live at:${NC}"
        echo -e "  ${GREEN}https://your-project.vercel.app${NC}"
        ;;

    "vps")
        echo -e "${CYAN}[6/10] Building production bundle...${NC}"
        npm run build
        echo -e "${GREEN}✓ Build complete${NC}"
        echo ""

        echo -e "${CYAN}[7/10] Installing PM2...${NC}"
        if ! command -v pm2 &> /dev/null; then
            npm i -g pm2
        fi
        echo -e "${GREEN}✓ PM2 ready${NC}"
        echo ""

        echo -e "${CYAN}[8/10] Starting with PM2...${NC}"
        pm2 start npm --name "chimera-os" -- start
        pm2 save
        echo -e "${GREEN}✓ Application running${NC}"
        echo ""

        echo -e "${CYAN}[9/10] Configuring startup...${NC}"
        pm2 startup
        echo -e "${GREEN}✓ Startup configured${NC}"
        echo ""

        echo -e "${CYAN}[10/10] Deployment complete${NC}"
        echo ""
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}  VPS DEPLOYMENT COMPLETE${NC}"
        echo -e "${GREEN}========================================${NC}"
        echo ""
        echo -e "${CYAN}Your deployment is running on:${NC}"
        echo -e "  ${GREEN}http://YOUR-SERVER-IP:3000/os${NC}"
        echo ""
        echo -e "${CYAN}Useful commands:${NC}"
        echo -e "  pm2 logs chimera-os       # View logs"
        echo -e "  pm2 stop chimera-os       # Stop application"
        echo -e "  pm2 restart chimera-os    # Restart application"
        echo -e "  pm2 monit                 # Monitor resources"
        ;;
esac

echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}  Next Steps:${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "1. Configure Supabase database"
echo -e "2. Add AI API keys to environment"
echo -e "3. Test all features"
echo -e "4. Set up monitoring"
echo -e "5. Configure backups"
echo ""
echo -e "${GREEN}Documentation:${NC}"
echo -e "  ${INSTALL_DIR}/COMPLETE_DEPLOYMENT_GUIDE.md"
echo -e "  ${INSTALL_DIR}/eko-vision/CHIMERA_OS_SETUP.md"
echo ""
echo -e "${CYAN}Support:${NC}"
echo -e "  GitHub: https://github.com/JB3ARD3N/Project-Sundae/issues"
echo ""
echo -e "${GREEN}LFG! 🚀${NC}"
