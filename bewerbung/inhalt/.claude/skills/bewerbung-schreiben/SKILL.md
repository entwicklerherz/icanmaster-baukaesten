---
name: bewerbung-schreiben
description: Verwenden, wenn der Nutzer sich auf eine erfasste Stelle bewerben will („Schreib die Bewerbung für …“, „für die beste Stelle“), wenn Lebenslauf oder Anschreiben für eine Stelle entstehen oder geändert werden sollen. Auch verwenden, wenn die Versuchung entsteht, im Anschreiben etwas zu behaupten, das im Profil nicht belegt ist, oder ein Gehalt oder einen Eintrittstermin selbst einzusetzen.
---

# Lebenslauf und Anschreiben für eine Stelle

Du arbeitest mit der Stelle, die der Nutzer meint; sagt er „die beste“, ist es die erste, die `node baukasten/bewerbung.mjs auswerten` nennt und die er nicht verworfen hat. Die Bewerbung liegt unter `bewerbungen/<id der Stelle>/`. Du schreibst zwei kleine Dateien; die Blätter setzt das Skript.

## 1. Erst fragen, was nur der Nutzer weiß

Sieh in der Stelle unter `verlangt` nach. Für jeden Eintrag (Eintrittstermin, Gehaltsvorstellung) brauchst du seine Antwort, bevor du schreibst. Du fragst eine Sache je Nachricht:

- „Die Anzeige möchte wissen, ab wann Sie anfangen können. Welchen Termin soll ich nennen?“
- „Die Anzeige fragt nach Ihrer Gehaltsvorstellung. Welche Zahl möchten Sie nennen? Wenn Sie keine nennen wollen, lasse ich den Satz weg.“

Diese beiden Fragen stellst du genau so, ohne ein Beispiel mit einer Zahl oder einem Datum: Ein Beispiel wie „2.400 Euro“ lenkt die Antwort, und es ist seine Zahl, nicht deine.

Seine Antwort hältst du wörtlich in `unterlagen/gespraech.txt` fest (`JJJJ-MM-TT: …`). Du schlägst keine Zahl vor, nennst keine „übliche Spanne“ und rechnest nichts um. Hat er die Angabe schon gemacht (sie steht in `gespraech.txt`), fragst du nicht noch einmal. Verlangt die Anzeige nichts davon, steht auch nichts davon im Anschreiben.

## 2. auswahl.json: was der Lebenslauf für diese Stelle zeigt

```json
{
  "kurzprofil": { "text": "Bürokaufmann mit sieben Jahren im Rechnungswesen eines Möbelhauses. Ich prüfe und buche rund 300 Eingangsrechnungen im Monat und habe den Monatsabschluss mit vorbereitet.", "stuetzt_sich_auf": ["ab-1", "st-1", "st-1-a", "st-1-c"] },
  "punkte": { "st-1": ["st-1-a", "st-1-c", "st-1-b"], "st-3": ["st-3-a"] },
  "kenntnisse": ["k-2", "k-1", "k-3"]
}
```

- Der Lebenslauf zeigt immer alle Stationen und die ganze Ausbildung; das setzt das Skript. Du wählst nur, **welche Punkte je Station** erscheinen (höchstens fünf, die wichtigsten für diese Stelle zuerst) und **in welcher Reihenfolge die Kenntnisse** stehen. Wortlaut und Daten kommen aus dem Profil; hier steht nur die id.
- `kurzprofil` (zwei bis drei Sätze, 80 bis 420 Zeichen, in der Ich-Form oder ohne Subjekt): wer die Person beruflich ist und was sie für genau diese Stelle mitbringt. Unter `stuetzt_sich_auf` stehen die Einträge des Profils, auf denen jeder Satz beruht.
- Fehlt im Profil ein Punkt, den du brauchst, ergänzt du ihn dort mit Beleg (`bewerbung-profil`), nicht hier.

## 3. anschreiben.json

```json
{
  "betreff": "Bewerbung als Sachbearbeiter Rechnungswesen",
  "anrede": "Sehr geehrte Frau Okafor,",
  "absaetze": [
    { "text": "Eingangsrechnungen prüfen, buchen und zur Zahlung vorbereiten: Das ist seit 2019 meine tägliche Arbeit im Möbelhaus Brüning, mit rund 300 Rechnungen im Monat.", "stuetzt_sich_auf": ["st-1", "st-1-a"] },
    { "text": "…", "stuetzt_sich_auf": ["st-1-c", "ab-1"] },
    { "text": "Mit SAP FI habe ich bisher nicht gearbeitet. Unser Haus bucht mit einem anderen Programm; die Abläufe dahinter kenne ich, und in neue Programme habe ich mich bisher zügig eingearbeitet.", "stuetzt_sich_auf": ["st-1"] },
    { "text": "Meine Gehaltsvorstellung liegt bei 3.200 Euro brutto im Monat. Über eine Einladung zum Gespräch freue ich mich.", "stuetzt_sich_auf": [] }
  ],
  "gruss": "Mit freundlichen Grüßen",
  "angaben": { "gehaltsvorstellung": { "text": "3.200 Euro brutto im Monat", "zitat": "3.200 Euro brutto im Monat wären mein Wunsch." } }
}
```

Das Anschreiben hat drei bis fünf Absätze und zusammen 700 bis 1900 Zeichen. So ist es gebaut:

1. **Einstieg an der Stelle, nicht an der Bewerbung.** Der erste Satz greift eine Aufgabe aus der Anzeige auf und verbindet sie mit etwas, das die Person nachweislich tut. Kein „hiermit bewerbe ich mich“, kein „mit großem Interesse“.
2. **Ein bis zwei Absätze Beleg.** Je Absatz ein Gedanke: eine verlangte Anforderung und das konkrete Stück Werdegang dazu (Aufgabe, Zahl, eigenes Vorhaben), mit den ids unter `stuetzt_sich_auf`. Eigenschaftswörter ohne Beleg (teamfähig, belastbar, flexibel) kommen nicht vor.
3. **Die Lücke beim Namen, wenn es eine gibt.** Steht eine Anforderung auf `fehlt` oder `teilweise`, sagt ein Satz ehrlich, was die Person dazu bisher nicht gemacht hat, und was sie stattdessen mitbringt. Bei einer Kann-Anforderung genügt ein Halbsatz, oder du lässt sie weg. Du behauptest nie das Gegenteil.
4. **Schluss:** was die Anzeige verlangt (Eintrittstermin, Gehaltsvorstellung) in den Worten des Nutzers, dann ein schlichter Satz zum Gespräch.

Regeln, die das Skript prüft:

- `betreff`: „Bewerbung als …“ mit der Bezeichnung der Stelle, ohne den Zusatz „(m/w/d)“.
- `anrede`: Nennt die Stelle eine Ansprechperson, richtet sich die Anrede an sie; sonst lautet sie „Sehr geehrte Damen und Herren,“. Der erste Absatz beginnt danach klein.
- Jede Zahl im Text steht in den Unterlagen, in `gespraech.txt` oder in der Anzeige. Jeder Name eines Programms oder Abschlusses ebenso.
- `angaben`: für jedes, was die Anzeige verlangt, `text` (so wie es im Anschreiben steht) und `zitat` (die Worte des Nutzers aus `gespraech.txt`). Will er nichts nennen, ist `text` `null` und das Zitat seine Absage.
- Abgegriffene Wendungen meldet das Skript; ersetze sie durch etwas Konkretes.

## 4. Setzen lassen und prüfen

`node baukasten/bewerbung.mjs auswerten` setzt `lebenslauf.html`, `anschreiben.html`, `anschreiben.txt` und, wenn die Bewerbung per E-Mail geht, `mail-entwurf.txt`. Meldet es „NICHT AUSGEWERTET“, berichtige genau das Genannte. Danach `node baukasten/bewerbung.mjs pruefen`. Lies zum Schluss das Anschreiben einmal als Ganzes: Würde die Person jeden Satz im Gespräch so wiederholen können?

## 5. Übergeben

Deine Nachricht hat diese Teile und nicht mehr:

1. Ein Satz: Die Bewerbung für (Stelle, Arbeitgeber) liegt als Entwurf vor.
2. Worauf das Anschreiben baut (zwei Sätze) und welche Lücke es offen anspricht.
3. So wird sie fertig: Im Ordner „bewerbungen“ liegen Anschreiben und Lebenslauf; mit Doppelklick im Browser öffnen, über „Drucken“ als PDF sichern. Geht die Bewerbung per E-Mail, liegt ein Entwurf für die Nachricht dabei.
4. Der Satz: „Bitte lesen Sie beides in Ruhe; abschicken tun Sie selbst. Sagen Sie mir danach einfach ‚abgeschickt‘.“ Bei einer Frist das Datum.

## Wenn es dich drängt, nachzuhelfen

| Gedanke | Was gilt |
|---|---|
| „Die Anzeige verlangt SAP, ein Satz ‚Grundkenntnisse‘ schadet nicht.“ | Es ist eine falsche Angabe in einer Bewerbung. Sie fällt im Gespräch oder in der Probezeit auf die Person zurück. Die Lücke wird benannt. |
| „Eine Zahl macht den Satz stärker.“ | Nur eine, die in den Unterlagen steht. Sonst ohne Zahl. |
| „Ich nenne ein marktübliches Gehalt, damit sie nicht fragen muss.“ | Du kennst weder ihren Lohn noch den Markt. Sie nennt die Zahl, oder der Satz entfällt. |
| „Jede Frage braucht ein Beispiel, also nenne ich eine Beispielzahl.“ | Bei Gehalt und Eintrittstermin gibt es kein Beispiel. Wer eine Zahl vorgesagt bekommt, übernimmt sie leicht. |
| „Als Word-Datei kann sie es leichter ändern.“ | Änderungen sagt sie dir; du passt die Vorlage an und lässt neu setzen. Es gibt genau eine Fassung. |
