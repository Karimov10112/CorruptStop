@echo off
taskkill /F /IM node.exe /T
timeout /t 2
start "Backend Server" node server.cjs
timeout /t 2
start "SMS Bot" node bot.cjs
timeout /t 2
start "Complaint Bot" node complaint_bot.cjs
