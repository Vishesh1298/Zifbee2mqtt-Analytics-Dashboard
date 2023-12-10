@echo off

REM Start Mosquitto
start "" "C:\Program Files\mosquitto\mosquitto.exe"

REM Wait for a moment
timeout /nobreak /t 2 >nul

REM Start Node.js server
cd V:\FYP_Maynooth\FYP_Maynooth\backend_code\
start "" node server.js

REM Inform the user that Mosquitto and server.js are now running 
echo Mosquitto and server.js are now running.