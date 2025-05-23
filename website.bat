@REM @echo off

@REM REM === Iniciar backend ===
@REM if exist "C:\Users\Isaque\Desktop\PAP\Projecto\backend" (
@REM     start "Backend" cmd /K "cd /d C:\Users\Isaque\Documents\GitHub\Projecto\backend && node server.js"
@REM     start "Backend" cmd /K "cd /d C:\Users\Isaque\Desktop\PAP\Projecto\backend && node server.js"
@REM ) else if exist "C:\Users\migue\Documents\GitHub\Projecto\backend" (
@REM     start "Backend" cmd /K "cd /d C:\Users\migue\Documents\GitHub\Projecto\backend && node server.js"
@REM )

@REM REM === Iniciar frontend ===
@REM if exist "C:\Users\Isaque\Desktop\PAP\Projecto" (
@REM     start "Frontend" cmd /K "cd /d C:\Users\Isaque\Documents\GitHub\Projecto && npm run dev"
@REM ) else if exist "C:\Users\migue\Documents\GitHub\Projecto" (
@REM     start "Frontend" cmd /K "cd /d C:\Users\migue\Documents\GitHub\Projecto && npm run dev"
@REM )

@REM REM === Aguardar 2 segundos para o frontend arrancar ===
@REM ping -n 3 127.0.0.1 >nul

@REM REM === Abrir o browser ===
@REM start "" "http://localhost:5173/"


@echo off
cd /d "%~dp0"

REM === Iniciar backend ===
if exist "backend" (
    start "Backend" cmd /K "cd /d %cd%\backend && node server.js"
)

REM === Iniciar frontend ===
start "Frontend" cmd /K "cd /d %cd% && npm run dev"

REM === Aguardar 2 segundos para o frontend arrancar ===
ping -n 3 127.0.0.1 >nul

REM === Abrir o browser ===
start "" "http://localhost:5173/"