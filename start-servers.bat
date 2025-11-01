@echo off
echo FBI CrimeConnect - Server Startup Script
echo ======================================

echo Starting backend server on port 8002...
start "Backend Server" /D "c:\Users\anama\internship\crime-connect-fbi\backend" python server.py

timeout /t 5 /nobreak >nul

echo Starting frontend development server on port 5174...
cd /d "c:\Users\anama\internship\crime-connect-fbi\frontend"
npm run dev

echo.
echo FBI CrimeConnect servers started successfully!
echo Backend: http://localhost:8002
echo Frontend: http://localhost:5174
echo.