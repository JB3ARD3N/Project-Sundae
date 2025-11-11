#!/bin/bash

echo "========================================"
echo "   CHIMERA OS - BOOT SEQUENCE"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[1/3] Installing dependencies..."
    npm install
    echo ""
else
    echo "[1/3] Dependencies already installed ✓"
    echo ""
fi

# Check if .env.local exists, if not create from example
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        echo "[2/3] Creating .env.local from example..."
        cp .env.example .env.local
        echo ""
    fi
else
    echo "[2/3] Environment configured ✓"
    echo ""
fi

echo "[3/3] Booting Chimera OS..."
echo ""
echo "========================================"
echo "   COCKPIT READY"
echo "========================================"
echo ""
echo "Main Dashboard:  http://localhost:3000"
echo "Chimera OS:      http://localhost:3000/os"
echo ""
echo "Press Ctrl+C to shutdown"
echo "========================================"
echo ""

# Start the dev server
npm run dev
