# Bewerbung: Stellen prüfen, Lebenslauf und Anschreiben aus den eigenen Unterlagen · Helfer für KI-Agenten

Version 0.1.0 · I Can Master AI · https://icanmaster.ai/

Du suchst eine neue Stelle. Dieser Helfer macht aus deinen Unterlagen und den Stellenanzeigen, die du bekommst, fertige Bewerbungen: Dein Agent liest deinen bisherigen Lebenslauf und deine Zeugnisse, vergleicht jede Anzeige Anforderung für Anforderung mit deinem Werdegang, sagt ehrlich, was belegt ist und was fehlt, und schreibt für die Stelle deiner Wahl Lebenslauf und Anschreiben als druckfertige Blätter. Abschicken tust du selbst.

## Voraussetzung

- Ein KI-Agent, zum Beispiel Claude Code oder Codex.
- Node.js ab Version 22 (kostenlos, nodejs.org, die Fassung „LTS“). Das ist das Programm, mit dem der Helfer prüft und die Blätter setzt.

## In fünf Schritten

1. Kopiere den **Inhalt** des Ordners `inhalt` in einen neuen, leeren Ordner, zum Beispiel „Bewerbungen“. Achtung: Darin liegt auch ein versteckter Ordner `.claude` mit den Skills. Er muss mit (im Finder zeigt Befehl + Umschalt + Punkt versteckte Ordner; unter Windows „Ausgeblendete Elemente“ einschalten).
2. Leg in den Ordner `unterlagen`, was du hast: deinen bisherigen Lebenslauf, Arbeitszeugnisse, Abschlusszeugnisse. Am besten als Text oder PDF. Hast du nichts zur Hand, fragt dich der Agent Station für Station.
3. Starte in diesem Ordner deinen KI-Agenten und schreib einen Satz: **„Hilf mir bei meinen Bewerbungen.“** Er liest deine Unterlagen und stellt dir höchstens sechs kurze Fragen (was du suchst, wo, wie viele Stunden, was nicht geht, was in den Unterlagen fehlt).
4. Leg Stellenanzeigen oder die Benachrichtigungen deiner Jobalarme in den Ordner `eingang` oder füge ihren Text ins Gespräch ein und schreib: **„Neue Stellen“.** Danach öffnest du die Datei `uebersicht.html` mit einem Doppelklick im Browser.
5. Schreib: **„Schreib die Bewerbung für …“** Anschreiben und Lebenslauf liegen danach im Ordner `bewerbungen`. Im Browser öffnen, über „Drucken“ als PDF sichern, lesen, selbst abschicken.

So geht es weiter: „Abgeschickt“, „Ich bin eingeladen, bereite mich auf das Gespräch vor“, „Die Stelle in Gütersloh verwerfe ich“, „Wie richte ich einen Jobalarm ein?“

## Was der Helfer bewusst nicht tut

- **Er erfindet nichts.** In Lebenslauf und Anschreiben steht nur, was in deinen Unterlagen steht oder was du ihm gesagt hast. Jede Angabe trägt den Wortlaut ihrer Quelle als Beleg; ein Skript vergleicht beides. Verlangt eine Stelle etwas, das du nicht hast, steht dort „fehlt“, und das Anschreiben spricht es offen an.
- **Er schickt nichts ab und füllt keine Formulare aus.** Du liest jede Bewerbung und schickst sie selbst.
- **Er ruft keine Portale und keine Anzeigen ab.** Er arbeitet mit dem, was du bekommen hast.
- **Er nennt kein Gehalt.** Fragt eine Anzeige nach deiner Gehaltsvorstellung, fragt er dich.
- **Er sagt nicht voraus, ob eine Bewerbung Erfolg hat,** deutet keine Zeugnisformulierungen und berät nicht zu Arbeitsrecht.

## Was im Paket liegt

- `inhalt/AGENTS.md`, `inhalt/CLAUDE.md`: die Leitdatei für den Agenten
- `inhalt/.claude/skills/`: sechs Skills (Profil, neue Stellen, Bewerbung schreiben, Stand, Vorstellungsgespräch, Jobalarm)
- `inhalt/baukasten/bewerbung.mjs`, `lesen.mjs`, `seiten.mjs`: das Skript, das Nachrichten lesbar macht, Belege prüft, Stellen einordnet und Lebenslauf, Anschreiben und Übersicht setzt. Es lädt nichts aus dem Netz und schickt nichts hinaus.
- `inhalt/baukasten/grundlage/schriften/`: zwei Schriften für die Blätter
- `inhalt/unterlagen/`, `inhalt/eingang/`: hier hinein kommen deine Dokumente und die Anzeigen
- `PRUEFBERICHT.md`: wie getestet und gescannt wurde, mit Ergebnissen und Grenzen
- `LIZENZ.md`: was du mit dem Helfer tun darfst

## Gut zu wissen

- Alles bleibt in deinem Ordner auf deinem Rechner. Der Agent selbst arbeitet bei seinem Anbieter (Anthropic, OpenAI); was er liest, geht dorthin. Deine Unterlagen enthalten persönliche Daten: Leg nur hinein, was du ihm zeigen willst.
- Was du im Gespräch sagst, hält der Agent wörtlich in der Datei `unterlagen/gespraech.txt` fest. Du kannst sie jederzeit lesen und berichtigen.
- Familienstand, Kinder und Foto lässt der Helfer im Lebenslauf weg; das Geburtsdatum steht nur darin, wenn du es willst.
- Lies jede Bewerbung, bevor du sie abschickst. Du musst jeden Satz im Gespräch vertreten können.
- Wenn du nicht weiterkommst: kontakt@entwicklerherz.de
