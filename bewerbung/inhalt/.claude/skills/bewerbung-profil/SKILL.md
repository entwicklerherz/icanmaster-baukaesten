---
name: bewerbung-profil
description: Verwenden, wenn jemand Hilfe bei Bewerbungen möchte und noch kein profil.json existiert, oder wenn er seinen Werdegang ergänzen oder seine Vorgaben ändern will (gesuchte Tätigkeit, Orte, Arbeitszeit, Ausschlüsse). Auch verwenden, wenn die Versuchung entsteht, sofort Anzeigen auszuwerten oder eine Bewerbung zu schreiben, bevor klar ist, was die Person sucht.
---

# Das Profil: Werdegang mit Belegen und was gesucht wird

Bevor du eine einzige Stelle ansiehst oder eine Zeile Bewerbung schreibst, steht das Profil. Es entsteht in drei Schritten, in dieser Reihenfolge.

## 1. Unterlagen lesen (ohne Rückfrage)

`node baukasten/bewerbung.mjs lesen`, dann liest du alles im Ordner `unterlagen/`. PDF-Dateien liest du direkt und speicherst ihren Wortlaut unverändert als `unterlagen/lesbar/<name>.txt`, damit Belege prüfbar sind. Ist der Ordner leer, fragst du den Werdegang im Gespräch ab (Schritt 2, zuerst die Stationen).

Anzeigen im Ordner `eingang/` liest du jetzt noch nicht.

## 2. Das Gespräch: höchstens sechs Fragen, eine je Nachricht

Deine erste Nachricht hat genau zwei Teile: ein Satz, was du in den Unterlagen gefunden hast („Ich habe Ihren Lebenslauf und das Zwischenzeugnis gelesen.“), und die erste offene Frage. Nichts sonst: keine Auswertung, keine Liste, kein Ausblick.

Du fragst nur, was die Unterlagen nicht beantworten, in dieser Reihenfolge, jede Frage mit einem Beispiel für die Art der Antwort:

1. **Was suchen Sie?** „Was für eine Stelle suchen Sie? Zum Beispiel: ‚Etwas im Büro, gern in der Buchhaltung.‘“
2. **Wo?** „In welchen Orten kommt eine Stelle für Sie in Frage? Zum Beispiel: ‚In Bielefeld, höchstens noch Herford.‘“
3. **Wie viel?** „Suchen Sie Vollzeit oder Teilzeit, und mit wie vielen Stunden etwa?“
4. **Was geht gar nicht?** „Gibt es etwas, das Sie ausschließen? Zum Beispiel: ‚Keine Schichtarbeit, keine Wochenenden.‘“
5. **Was fehlt in den Unterlagen?** Eine Frage zu dem, was offen ist: ob die letzte Station noch läuft, was in einer Lücke von mehr als drei Monaten war, oder: „Gibt es etwas, das Sie gut können oder gemacht haben und das in Ihren Unterlagen nicht steht?“
6. **Persönliche Angaben:** „Soll Ihr Geburtsdatum im Lebenslauf stehen? Familienstand und Kinder lasse ich weg, das ist heute üblich.“

Nach Gehalt, Kündigungsfrist und Eintrittstermin fragst du jetzt nicht; das kommt erst, wenn eine Anzeige es verlangt.

**Jede Antwort hältst du sofort wörtlich fest**, als neue Zeile in `unterlagen/gespraech.txt`: `JJJJ-MM-TT: <die Worte des Nutzers, unverändert>`. Diese Datei ist die Quelle für alles, was er gesagt hat. Du schreibst dort nichts hinein, was er nicht gesagt hat, und formulierst nichts um.

## 3. profil.json schreiben

```json
{
  "version": 1,
  "person": { "name": "Jonas Wegener", "anschrift": "Lindenweg 8, 48143 Münster", "telefon": "0251 5550117", "email": "jonas.wegener@beispiel.example", "geburtsdatum": null },
  "suche": { "taetigkeit": "Büro, gern Buchhaltung", "orte": ["Münster", "Telgte"], "arbeitszeit": "vollzeit", "stunden": null, "ausschluss": ["Schichtarbeit"], "ab_wann": null },
  "stationen": [
    { "id": "st-1", "art": "arbeit", "von": "2019-04", "bis": null, "rolle": "Sachbearbeiter Rechnungswesen", "arbeitgeber": "Möbelhaus Brüning", "ort": "Münster", "zusatz": null,
      "beleg": { "quelle": "unterlagen/lebenslauf.txt", "zitat": "seit 04/2019 Sachbearbeiter Rechnungswesen" },
      "punkte": [
        { "id": "st-1-a", "text": "Prüfung und Buchung von rund 300 Eingangsrechnungen im Monat", "beleg": { "quelle": "unterlagen/arbeitszeugnis.txt", "zitat": "prüft und bucht monatlich rund 300 Eingangsrechnungen" } }
      ] },
    { "id": "st-2", "art": "auszeit", "von": "2018-07", "bis": "2019-03", "rolle": "Pflege eines Angehörigen",
      "beleg": { "quelle": "unterlagen/gespraech.txt", "zitat": "Von Juli 2018 bis März 2019 habe ich meinen Vater gepflegt." }, "punkte": [] }
  ],
  "ausbildung": [ { "id": "ab-1", "von": "2012-08", "bis": "2015-06", "abschluss": "Ausbildung zum Bürokaufmann", "einrichtung": "Stadtwerke Münster", "zusatz": null, "beleg": { "quelle": "unterlagen/lebenslauf.txt", "zitat": "08/2012 – 06/2015 Ausbildung zum Bürokaufmann, Stadtwerke Münster" } } ],
  "kenntnisse": [ { "id": "k-1", "text": "Excel (sicher)", "beleg": { "quelle": "unterlagen/lebenslauf.txt", "zitat": "Excel (sicher)" } } ],
  "sprachen": [ { "id": "sp-1", "sprache": "Englisch", "niveau": "Schulkenntnisse", "beleg": { "quelle": "unterlagen/lebenslauf.txt", "zitat": "Englisch (Schulkenntnisse)" } } ]
}
```

So füllst du es:

- **Jeder Eintrag hat einen Beleg**: `quelle` ist eine Datei im Ordner `unterlagen/` (für Gesagtes `unterlagen/gespraech.txt`), `zitat` der Wortlaut von dort, zeichengenau kopiert. Das Skript vergleicht beides. Ohne Beleg kein Eintrag.
- **`von` und `bis`** haben die Form `2019-04` (oder nur `2019`, wenn kein Monat genannt ist); `bis` ist `null` für „bis heute“. Die Jahreszahlen müssen im Zitat stehen. Du verschiebst und glättest kein Datum.
- **Jede Zeit ist eine Station**, auch Elternzeit, Pflege, Arbeitssuche, Krankheit: `art: "auszeit"`, die `rolle` nennt sie beim Namen. Das Skript meldet Lücken von mehr als drei Monaten, auch die Zeit zwischen der letzten Station und heute; dann fragst du den Nutzer (Frage 5) und trägst seine Antwort ein.
- **`punkte`** sind die Aufgaben und Ergebnisse einer Station, je Punkt eine Sache, als knappe Wendung wie im Lebenslauf (keine ganzen Sätze, kein „ich“). Zeugnisse liefern oft die besseren Belege als der alte Lebenslauf: konkrete Aufgaben, Zahlen, eigene Vorhaben. Nimm sie auf. Zahlen übernimmst du nur, wenn sie im Zitat stehen.
- **`kenntnisse` und `sprachen`** mit genau der Stufe, die dasteht („Grundkenntnisse“ bleibt „Grundkenntnisse“).
- **`person`**: Name, Anschrift, Telefon, E-Mail wörtlich aus den Unterlagen. `geburtsdatum` ist `null`, außer der Nutzer will es im Lebenslauf; dann steht es so da, wie es in den Unterlagen steht oder wie er es gesagt hat.
- **`suche`**: `arbeitszeit` ist `vollzeit`, `teilzeit`, `beides` oder `null`; `orte` ist leer, wenn der Ort egal ist; `ausschluss` in seinen Worten, kurz („Samstagsarbeit“, „Schichtarbeit“).

Prüfe mit `node baukasten/bewerbung.mjs pruefen` und berichtige, was das Skript meldet. Passt ein Beleg nicht, korrigierst du den Eintrag nach der Quelle, nie die Quelle.

## So schließt du ab

Eine kurze Nachricht mit genau diesen Teilen: zwei Sätze, die in seinen Worten sagen, was er sucht; ein Satz, was du aus den Unterlagen übernommen hast und was dir als Stärke aufgefallen ist (nur Belegtes); und wie es weitergeht: Er legt Stellenanzeigen in den Ordner „eingang“ oder fügt ihren Text hier ein und sagt „Neue Stellen“. Liegt dort schon etwas, sagst du das dazu. Die Nachricht endet ohne Frage.

## Wenn es dich drängt, gleich loszulegen

| Gedanke | Was gilt |
|---|---|
| „Im Eingang liegen schon Anzeigen, ich werte sie gleich mit aus.“ | Ohne seine Vorgaben ordnest du falsch ein: Eine Stelle mit Samstagsdienst sieht gut aus, bis er sagt, dass Samstage nicht gehen. Erst das Profil. |
| „Ich schreibe schon einmal einen Lebenslauf, dann hat er etwas in der Hand.“ | Ein Lebenslauf ohne Stelle und ohne seine Antworten ist geraten. Er entsteht im Schritt `bewerbung-schreiben`. |
| „Ich stelle alle Fragen auf einmal, das spart Zeit.“ | Fünf Fragen in einer Nachricht beantwortet ein Laie halb. Eine je Nachricht. |
| „Diese Kenntnis hat sie bestimmt, das ergibt sich aus der Stelle.“ | Was nicht dasteht und was sie nicht gesagt hat, gibt es im Profil nicht. Frag (Frage 5). |
