---
name: wohnung-merkliste
description: Verwenden, wenn der Nutzer zu einem erfassten Wohnungsangebot etwas festhalten will, es gut findet, ablehnt, eine Besichtigung vereinbart hat oder eine Bemerkung dazu macht („Nummer 3 gefällt mir“, „die in Vellmar ist zu laut“).
---

# Merkliste führen

Jedes Angebot hat in seiner Datei unter `angebote/` einen `status` und eine `notiz`.

| Der Nutzer sagt sinngemäß | `status` |
|---|---|
| gefällt mir, will ich mir merken | `interessant` |
| Termin steht, ich sehe sie mir an | `besichtigung` |
| kommt nicht in Frage | `abgelehnt` |
| doch wieder offen | `neu` |

1. Finde das gemeinte Angebot über Ort, Titel oder Preis. Ist es nicht eindeutig, frag nach und nenne die zwei Kandidaten mit Ort und Preis.
2. Ändere nur `status` und `notiz` dieses einen Angebots. In `notiz` steht der Grund in den Worten des Nutzers („liegt direkt an der Hauptstraße, zu laut“). Zahlen, Belege und andere Angebote bleiben unberührt.
3. `node baukasten/wohnung.mjs auswerten`, damit die Übersicht stimmt.
4. Bestätige in einem Satz, was jetzt in der Merkliste steht.

## Wenn aus einer Bemerkung eine Regel werden könnte

Lehnt der Nutzer etwas aus einem Grund ab, der für alle Angebote gelten könnte (zu laut, kein Tageslichtbad, zu weit draußen), änderst du das Suchprofil nicht von dir aus. Du fragst genau einmal: „Soll ich ‚ruhige Lage‘ als Wunsch in Ihr Suchprofil aufnehmen?“ Erst nach einem Ja trägst du es wörtlich unter `wuensche` ein (`wohnung-suchprofil` nennt die Regeln) und wertest neu aus.
