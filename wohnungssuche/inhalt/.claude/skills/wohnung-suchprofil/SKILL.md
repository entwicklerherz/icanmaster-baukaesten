---
name: wohnung-suchprofil
description: Verwenden, wenn jemand Hilfe bei der Suche nach einer Eigentumswohnung möchte und noch kein suchprofil.json existiert, oder wenn er seine Vorgaben ändern will (Ort, Höchstpreis, Größe, Zimmer, was sein muss, was ausgeschlossen ist).
---

# Das Suchprofil

Bevor du ein einziges Angebot ansiehst, weißt du, was der Nutzer sucht. Du stellst höchstens sechs Fragen, eine je Nachricht, jede mit einem Beispiel für die Art der Antwort. Was er schon gesagt hat, fragst du nicht noch einmal. Deine erste Nachricht ist die erste Frage, die noch offen ist, nichts sonst: keine Auswertung, keine Liste, kein Ausblick.

## Die Fragen (nur die, deren Antwort noch fehlt, in dieser Reihenfolge)

1. **Wo?** „In welchen Orten oder Stadtteilen suchen Sie? Zum Beispiel: ‚In Münster und Telgte.‘“ Das Bundesland leitest du aus den Orten ab; nur wenn es nicht eindeutig ist, fragst du danach.
2. **Wie viel höchstens?** „Wie hoch darf der Kaufpreis höchstens sein, ohne Nebenkosten? Zum Beispiel: ‚Bis 250.000 Euro.‘“
3. **Wie groß?** „Wie groß soll die Wohnung mindestens sein, und wie viele Zimmer brauchen Sie? Zum Beispiel: ‚Mindestens 70 Quadratmeter und drei Zimmer.‘“
4. **Wozu?** „Möchten Sie selbst einziehen oder die Wohnung vermieten?“
5. **Was muss sein, was wäre schön?** „Was muss die Wohnung unbedingt haben, und was wäre schön, ist aber kein Muss? Zum Beispiel: ‚Ein Balkon muss sein, ein Aufzug wäre schön.‘“ Was er als Muss nennt, kommt nach `muss`; was er schön fände, nach `wuensche`.
6. **Was geht gar nicht?** „Gibt es etwas, das Sie ausschließen? Zum Beispiel: ‚Kein Erdgeschoss, kein Erbbaurecht.‘“

Nennt der Nutzer an anderer Stelle etwas, das schön wäre, aber kein Muss ist, nimmst du es ebenfalls als Wunsch auf. Nach Eigenkapital, Einkommen oder Finanzierung fragst du nicht.

## Aus den Antworten wird suchprofil.json

```json
{
  "version": 1,
  "orte": ["Münster", "Telgte"],
  "stadtteile": [],
  "bundesland": "NW",
  "kaufpreis_max": 250000,
  "wohnflaeche_min": 70,
  "zimmer_min": 3,
  "nutzung": "selbst",
  "muss": ["balkon", "aufzug"],
  "ausschluss": ["erdgeschoss", "erbbaurecht"],
  "wuensche": ["ruhige Lage"],
  "eigenkapital": null,
  "notizen": []
}
```

- `orte` sind Städte und Gemeinden. Nennt er Stadtteile („in Leipzig, aber nur Gohlis oder Lindenau“), steht die Stadt unter `orte` und jeder Stadtteil einzeln unter `stadtteile`; sonst bleibt `stadtteile` leer.
- `bundesland`: BW, BY, BE, BB, HB, HH, HE, MV, NI, NW, RP, SL, SN, ST, SH oder TH.
- `nutzung`: `selbst` oder `vermieten`. `wohnflaeche_min` und `zimmer_min` dürfen `null` sein, wenn es dem Nutzer egal ist.
- `muss` kennt nur: `balkon` (auch Terrasse), `aufzug`, `stellplatz` (auch Garage), `keller`, `einbaukueche`, `garten`, `barrierearm`.
- `ausschluss` kennt nur: `erdgeschoss`, `dachgeschoss`, `erbbaurecht`, `vermietet`, `sanierungsbedarf`, `zwangsversteigerung`, `wohnrecht`.
- Alles andere, was er nennt („Grundschule in der Nähe“, „nicht an einer Hauptstraße“), kommt wörtlich in seinen Worten nach `wuensche`. In `muss` und `ausschluss` steht nur, was er ausdrücklich verlangt oder ausgeschlossen hat.
- `eigenkapital` bleibt `null`, außer er nennt es von sich aus.

Prüfe danach mit `node baukasten/wohnung.mjs pruefen` und berichtige, was das Skript meldet.

## So schließt du ab

Eine kurze Nachricht in dieser Form: Sie wiederholt in zwei Sätzen und in seinen Worten, was er sucht, und sagt, wie es weitergeht: Er legt die Benachrichtigungen seiner Suchaufträge in den Ordner „eingang“ oder fügt ihren Text hier ein und sagt „Neue Angebote“. Mehr steht nicht darin. Fragt er, wie er an Benachrichtigungen kommt, weiter mit `wohnung-suchauftrag`.
