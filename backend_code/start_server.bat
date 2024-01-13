@echo off

REM Start Mosquitto
start "" "C:\Program Files\mosquitto\mosquitto.exe"

REM Wait for a moment
timeout /nobreak /t 2 >nul

REM Start Node.js server
cd V:\GitHub\Zifbee2mqtt-Analytics-Dashboard\backend_code\
start "" node server_Test.js

REM Inform the user that Mosquitto and server_Test.js are now running 
echo Mosquitto and server_Test.js are now running.

