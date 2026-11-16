---
name: vertrag-kuendigen
description: Verwenden, wenn der Nutzer einen erfassten Vertrag kündigen will oder ein Kündigungsschreiben haben möchte. Auch verwenden, wenn die Versuchung entsteht, in das Schreiben eine rechtliche Begründung, einen Paragrafen oder eigene Sätze zu setzen.
---

# Eine Kündigung vorbereiten

Das Schreiben setzt das Skript mit festem Wortlaut. Du lieferst drei Dinge: wer kündigt, zu wann, und ob ein vorgesehener Zusatz hineinsoll.

## 1. Frisch auswerten

`node baukasten/vertraege.mjs auswerten`. Fristen ändern sich mit dem Datum; du arbeitest mit den Terminen von heute. Finde den gemeinten Vertrag über Anbieter oder Art. Ist er nicht eindeutig, frag nach und nenne die zwei Kandidaten.

## 2. Wer kündigt: angaben.json

```json
{ "name": "Thomas Reimann", "anschrift": "Kaiserstraße 77, 44135 Dortmund" }
```

Name und Anschrift übernimmst du wörtlich aus einem Dokument (die meisten sind an ihn adressiert). Steht beides nirgends, fragst du ihn in einer Nachricht danach und hältst seine Antwort zusätzlich unter `"zitat"` fest. Gibt es die Datei schon, bleibt sie.

## 3. Zu wann: kuendigungen/<id des Vertrags>.json

```json
{ "zum": "2026-12-31", "zusatz": [] }
```

- `zum` ist der Tag, den das Skript für diesen Vertrag als Ende nennt („dann endet er am …“ oder „frühestens zum …“), in der Form `2026-12-31`. Das Schreiben kündigt dann „fristgerecht zum …, hilfsweise zum nächstmöglichen Zeitpunkt“.
- Lässt sich kein Termin rechnen, ist die Frist für den gewünschten Termin laut Skript verstrichen, oder will der Nutzer einfach so früh wie möglich heraus: `"zum": "naechstmoeglich"`. Das Schreiben kündigt dann „zum nächstmöglichen Zeitpunkt“.
- `zusatz` kennt genau zwei feste Sätze: `"schadenfreiheit"` (nur bei einer Kfz-Versicherung: Bitte um die Bescheinigung über Schadenfreiheitsrabatt und Schadenverlauf, wenn er wechseln will) und `"daten_loeschen"`. Anderes gibt es nicht: keine Begründung, kein Paragraf, kein Widerruf einer Einzugsermächtigung, keine eigenen Sätze.
- Fehlt im Vertrag, wohin die Kündigung geht (`kuendigung_an`), sagst du dem Nutzer, dass in seinen Dokumenten keine Adresse dafür steht, und bittest ihn um ein Schreiben des Anbieters, in dem sie steht, oder um die Adresse. Die trägst du mit seinen Worten als Zitat ein (das Dokument dazu legst du als `eingang/eingefuegt-….txt` ab).

## 4. Setzen lassen und prüfen

`node baukasten/vertraege.mjs auswerten` setzt `kuendigungen/<id>.html` (zum Drucken und Unterschreiben) und `kuendigungen/<id>.txt` (zum Einfügen in eine E-Mail). Meldet es „NICHT AUSGEWERTET“, berichtige genau das Genannte. Danach `node baukasten/vertraege.mjs pruefen`.

## 5. Übergeben

Deine Nachricht hat diese Teile und nicht mehr:

1. Ein Satz: Das Kündigungsschreiben für (Anbieter, Vertrag) liegt als Entwurf im Ordner „kuendigungen“.
2. Die zwei Daten, auf die es ankommt: zu wann gekündigt wird und bis wann die Kündigung beim Anbieter sein muss (beides vom Skript).
3. Wohin sie geht, so wie es im Vertrag steht (Anschrift, E-Mail, verlangte Form).
4. Der Satz: „Bitte lesen, unterschreiben und selbst abschicken, am besten so, dass Sie den Zugang nachweisen können. Sagen Sie mir danach einfach ‚gekündigt‘.“

Du gibst keine Tipps zu Versandarten im Einzelnen, zur neuen Versicherung, zum Anbieterwechsel oder zu Rückbuchungen, und du kündigst nichts selbst.

## Wenn es dich drängt, das Schreiben stärker zu machen

| Gedanke | Was gilt |
|---|---|
| „Ich schreibe den Paragrafen hinein, dann nimmt der Anbieter es ernst.“ | Eine rechtliche Begründung im Namen des Nutzers ist Rechtsberatung, und eine falsche schadet ihm. „Hilfsweise zum nächstmöglichen Zeitpunkt“ wahrt seine Rechte, ohne etwas zu behaupten. |
| „Die Verlängerungsklausel ist bestimmt unwirksam, ich kündige zu einem früheren Termin.“ | Der feste Termin ist der, den das Skript aus dem Vertrag rechnet. Für alles andere gibt es „naechstmoeglich“ und die Verbraucherzentrale. |
| „Ich widerrufe gleich die Einzugsermächtigung mit.“ | Das kann Mahnkosten auslösen. Es steht nicht im Schreiben. |
