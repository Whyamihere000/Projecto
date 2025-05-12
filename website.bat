@echo off

REM Iniciar backend
start "Backend" cmd /K "cd /d C:\Users\Isaque\Desktop\PAP\Projecto\backend && node server.js"

REM Iniciar frontend
start "Frontend" cmd /K "cd /d C:\Users\Isaque\Desktop\PAP\Projecto && npm run dev"

REM Aguardar 2 segundos apenas para garantir que o React já arrancou minimamente
ping -n 3 127.0.0.1 >nul

REM Abrir o browser
start "" "http://localhost:5173/"
