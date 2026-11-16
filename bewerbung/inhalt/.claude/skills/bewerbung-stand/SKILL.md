---
name: bewerbung-stand
description: Verwenden, wenn der Nutzer sagt, dass er eine Bewerbung abgeschickt hat, eine Einladung, Absage oder Zusage bekommen hat, eine Stelle verwirft oder vormerkt, sich etwas zu einer Stelle merken will oder fragt, wo seine Bewerbungen stehen.
---

# Den Stand der Bewerbungen führen

Jede Stelle hat in ihrer Datei unter `stellen/` einen `status`, eine `notiz` und, sobald die Bewerbung draußen ist, `abgeschickt_am`.

| Der Nutzer sagt sinngemäß | `status` | dazu |
|---|---|---|
| die merke ich mir | `interessant` | |
| abgeschickt, ist raus | `abgeschickt` | `abgeschickt_am`: der Tag, den er nennt („heute“ ist das heutige Datum, Form `2026-11-16`) |
| ich bin eingeladen | `einladung` | `termin`: Tag, Uhrzeit, Ort in seinen Worten |
| Absage bekommen | `absage` | |
| Zusage, ich habe die Stelle | `zusage` | |
| kommt nicht in Frage | `verworfen` | Grund in seinen Worten unter `notiz` |

1. Finde die gemeinte Stelle über Arbeitgeber oder Titel. Ist sie nicht eindeutig, frag nach und nenne die zwei Kandidaten.
2. Ändere nur `status`, `notiz`, `abgeschickt_am` und `termin` dieser einen Stelle. Anforderungen, Zitate und andere Stellen bleiben unberührt. Als abgeschickt gilt eine Bewerbung nur, wenn er es sagt; du trägst es nie von dir aus ein.
3. `node baukasten/bewerbung.mjs auswerten`, damit die Übersicht stimmt.
4. Bestätige in ein bis zwei Sätzen, was jetzt festgehalten ist. Bei „abgeschickt“ nennst du das Datum, ab dem eine kurze Nachfrage passt (das Skript gibt es in der Übersicht aus: 14 Tage danach). Bei einer Einladung bietest du an, das Gespräch vorzubereiten (`bewerbung-gespraech`). Bei einer Absage ein freundlicher Satz, keine Deutung der Gründe.

Fragt er, wo alles steht: `auswerten`, dann ein Satz je laufender Bewerbung (Arbeitgeber, Stand, nächster Schritt) und der Hinweis auf die Übersicht.

## Wenn aus einer Bemerkung eine Vorgabe werden könnte

Verwirft er eine Stelle aus einem Grund, der für alle gelten könnte (zu weit, Schichtarbeit, befristet), änderst du sein Profil nicht von dir aus. Du fragst genau einmal: „Soll ich ‚befristete Stellen‘ künftig als Ausschluss führen?“ Erst nach einem Ja trägst du es unter `suche.ausschluss` ein und wertest neu aus.
