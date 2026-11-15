# Website ohne Backend und Datenbank · Baukasten für KI-Agenten

Version 0.5.1 · I Can Master AI · https://icanmaster.ai/baukaesten/website-ohne-backend/

## In drei Schritten

1. Kopiere den **Inhalt** des Ordners `inhalt` in einen neuen, leeren Ordner. Achtung: Darin liegt auch ein versteckter Ordner `.claude` mit den Skills. Er muss mit (im Finder zeigt Befehl + Umschalt + Punkt versteckte Ordner; unter Windows „Ausgeblendete Elemente“ einschalten).
2. Starte in diesem neuen Ordner deinen KI-Agenten, zum Beispiel Claude Code oder Codex.
3. Schreib einen Satz: **„Bau mir eine Website.“**

Der Agent stellt dir höchstens fünf kurze Fragen. Hast du schon eine Seite, nennst du ihm die Adresse; er übernimmt die Inhalte und auf Wunsch das Aussehen. Danach baut er, prüft sein Ergebnis selbst und erklärt dir, wie du die Seite ansiehst und veröffentlichst.

## Was im Paket liegt

- `inhalt/AGENTS.md`, `inhalt/CLAUDE.md`: die Leitdatei für den Agenten
- `inhalt/.claude/skills/`: acht Skills (Gespräch, Übernahme, Gestaltung, Bau, Datenschutz, Selbstprüfung, Ansehen, Übergabe)
- `inhalt/baukasten/`: drei fertig gestaltete Kompositionen (`grundlage.css` und die Muster `muster-buehne.html` für Laden und Gastronomie, `muster-werkbank.html` für Handwerk, `muster-ruhe.html` für Praxis und Beratung), sechs Schriften, neun gemalte Szenenbilder und neun Stillleben, ein kleines Skript für „heute geöffnet“ (`seite.js`), das Prüfskript `pruefen.mjs` (liest nur den Ordner `website/`) und `ansehen.mjs` (macht mit einem bereits installierten Browser drei Bildschirmfotos der fertigen Seite, damit der Agent sein Ergebnis ansehen kann; lädt nichts aus dem Netz).
- `PRUEFBERICHT.md`: wie getestet und gescannt wurde, mit Ergebnissen und Grenzen
- `LIZENZ.md`: was du mit dem Baukasten tun darfst

## Gut zu wissen

- Der Agent legt dabei Dateien im Ordner an und führt das Prüfskript aus. Fragt er um Erlaubnis, ist das der Grund.
- Getestet mit Claude Code und Codex. Andere Agenten lesen `AGENTS.md` ebenfalls, sind aber noch nicht geprüft.
- Wenn du nicht weiterkommst: kontakt@entwicklerherz.de oder live im Workshop, https://icanmaster.ai/seminare/
