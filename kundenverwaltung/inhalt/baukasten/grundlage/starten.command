#!/bin/sh
# Startet die Kundenverwaltung auf diesem Rechner und öffnet sie im Browser. Zum Beenden dieses Fenster schließen.
cd "$(dirname "$0")" || exit 1
( sleep 1; open "http://127.0.0.1:4310" ) &
node server.mjs
