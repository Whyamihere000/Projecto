@echo off

REM === Iniciar backend ===
if exist "C:\Users\Isaque\Desktop\PAP\Projecto\backend" (
    start "Backend" cmd /K "cd /d C:\Users\Isaque\Documents\GitHub\Projecto\backend && node server.js"
    start "Backend" cmd /K "cd /d C:\Users\Isaque\Desktop\PAP\Projecto\backend && node server.js"
) else if exist "C:\Users\migue\Documents\GitHub\Projecto\backend" (
    start "Backend" cmd /K "cd /d C:\Users\migue\Documents\GitHub\Projecto\backend && node server.js"
)

REM === Iniciar frontend ===
if exist "C:\Users\Isaque\Desktop\PAP\Projecto" (
    start "Frontend" cmd /K "cd /d C:\Users\Isaque\Documents\GitHub\Projecto && npm run dev"
) else if exist "C:\Users\migue\Documents\GitHub\Projecto" (
    start "Frontend" cmd /K "cd /d C:\Users\migue\Documents\GitHub\Projecto && npm run dev"
)

REM === Aguardar 2 segundos para o frontend arrancar ===
ping -n 3 127.0.0.1 >nul

REM === Abrir o browser ===
start "" "http://localhost:5173/"