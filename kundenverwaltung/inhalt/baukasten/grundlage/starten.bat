@echo off
rem Startet die Kundenverwaltung auf diesem Rechner und oeffnet sie im Browser. Zum Beenden dieses Fenster schliessen.
cd /d "%~dp0"
start "" http://127.0.0.1:4310
node server.mjs
pause
