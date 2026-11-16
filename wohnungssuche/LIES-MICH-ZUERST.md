# Wohnungssuche: Angebote lesen, prüfen und vergleichen lassen · Helfer für KI-Agenten

Version 0.1.0 · I Can Master AI · https://icanmaster.ai/

Du suchst eine Eigentumswohnung und bekommst täglich Benachrichtigungen von Portalen. Dieser Helfer macht daraus eine Übersicht: Dein Agent liest die Nachrichten, die du ohnehin bekommst, sortiert nach deinen Vorgaben, rechnet die Kaufnebenkosten dazu, erkennt doppelte Anzeigen und sagt zu jedem Angebot, warum es passt, was zu klären ist oder warum es ausscheidet. Für die Besichtigung bereitet er Fragen, Unterlagen und einen Entwurf für die Nachricht an den Anbieter vor.

## Voraussetzung

- Ein KI-Agent, zum Beispiel Claude Code oder Codex.
- Node.js ab Version 22 (kostenlos, nodejs.org, die Fassung „LTS“). Das ist das Programm, mit dem der Helfer rechnet und die Übersicht baut.

## In vier Schritten

1. Kopiere den **Inhalt** des Ordners `inhalt` in einen neuen, leeren Ordner, zum Beispiel „Wohnungssuche“. Achtung: Darin liegt auch ein versteckter Ordner `.claude` mit den Skills. Er muss mit (im Finder zeigt Befehl + Umschalt + Punkt versteckte Ordner; unter Windows „Ausgeblendete Elemente“ einschalten).
2. Starte in diesem Ordner deinen KI-Agenten.
3. Schreib einen Satz: **„Hilf mir bei der Wohnungssuche.“** Der Agent stellt dir höchstens sechs kurze Fragen (wo, wie teuer höchstens, wie groß, selbst einziehen oder vermieten, was sein muss, was ausgeschlossen ist).
4. Leg die Benachrichtigungen deiner Suchaufträge in den Ordner `eingang` oder füge ihren Text ins Gespräch ein und schreib: **„Neue Angebote“.** Danach öffnest du die Datei `uebersicht.html` mit einem Doppelklick im Browser.

So geht es weiter: „Nummer 3 gefällt mir“, „Die in Vellmar ist mir zu laut“, „Bereite die Besichtigung für die beste vor“, „Wie richte ich einen Suchauftrag ein?“

## Was der Helfer bewusst nicht tut

- **Er ruft keine Portale und keine Anzeigen ab.** Die Portale untersagen automatisierte Abfragen. Er arbeitet nur mit dem, was du bekommen hast. Die Anzeige selbst öffnest du über den Verweis in der Übersicht.
- **Er schickt nichts in deinem Namen.** Nachrichten an Anbieter sind Entwürfe; abschicken tust du.
- **Er berät nicht zu Recht, Steuern, Finanzierung oder Preis.** Er sagt, ob ein Angebot zu deinen Vorgaben passt und was es mit Nebenkosten ungefähr kostet. Für alles andere nennt er die Stelle, die du fragst (Notar, Bank, Beratungsstelle).
- **Er übernimmt nur, was in der Anzeige steht.** Jede Zahl trägt den Wortlaut der Anzeige als Beleg; ein Skript vergleicht beides. Was fehlt, steht als offene Frage in der Übersicht.

## Was im Paket liegt

- `inhalt/AGENTS.md`, `inhalt/CLAUDE.md`: die Leitdatei für den Agenten
- `inhalt/.claude/skills/`: fünf Skills (Suchprofil, neue Angebote, Merkliste, Besichtigung, Suchauftrag)
- `inhalt/baukasten/wohnung.mjs`, `lesen.mjs`, `uebersicht.mjs`: das Skript, das Nachrichten lesbar macht, Belege prüft, rechnet, einordnet und die Übersicht baut. Es lädt nichts aus dem Netz und schickt nichts hinaus.
- `inhalt/baukasten/grundlage/`: die Sätze der Grunderwerbsteuer je Bundesland (mit Stand) und zwei Schriften für die Übersicht
- `inhalt/eingang/`: hier hinein kommen deine Benachrichtigungen
- `PRUEFBERICHT.md`: wie getestet und gescannt wurde, mit Ergebnissen und Grenzen
- `LIZENZ.md`: was du mit dem Helfer tun darfst

## Gut zu wissen

- Alles bleibt in deinem Ordner auf deinem Rechner. Der Agent selbst arbeitet bei seinem Anbieter (Anthropic, OpenAI); was er liest, geht dorthin. Leg nur hinein, was du ihm zeigen willst.
- Die Kaufnebenkosten sind eine Schätzung: Grunderwerbsteuer nach Bundesland, Notar und Grundbuch pauschal mit 2 Prozent, Maklerprovision nur, wenn die Anzeige sie nennt. Den Stand der Steuersätze zeigt die Übersicht; vor einer Entscheidung beim Notar oder Finanzamt bestätigen lassen.
- Benachrichtigungen kommen in vielen Formen. Kann der Agent eine nicht lesen, füge ihren Text einfach ins Gespräch ein.
- Wenn du nicht weiterkommst: kontakt@entwicklerherz.de
