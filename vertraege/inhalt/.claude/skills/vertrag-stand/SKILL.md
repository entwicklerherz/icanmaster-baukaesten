---
name: vertrag-stand
description: Verwenden, wenn der Nutzer sagt, dass er eine Kündigung abgeschickt hat, eine Kündigungsbestätigung bekommen hat, dass ein Vertrag beendet ist, oder wenn er sich etwas zu einem Vertrag merken will.
---

# Den Stand eines Vertrags festhalten

Jeder Vertrag hat in seiner Datei unter `vertraege/` die Felder `status`, `gekuendigt_am`, `gekuendigt_zum`, `bestaetigt` und `notiz`.

| Der Nutzer sagt sinngemäß | Du trägst ein |
|---|---|
| Kündigung abgeschickt | `status: "gekuendigt"`, `gekuendigt_am`: der Tag, den er nennt („heute“ ist das heutige Datum, Form `2026-11-16`), `gekuendigt_zum`: der Termin aus dem Schreiben (bei „naechstmoeglich“ `null`) |
| Bestätigung ist da | `bestaetigt: true`; nennt die Bestätigung ein Enddatum, steht es unter `gekuendigt_zum`. Liegt das Schreiben im Eingang, kommt es unter `quellen` dazu |
| Vertrag ist ausgelaufen | `status: "beendet"` |
| eine Bemerkung dazu | `notiz`, in seinen Worten |

1. Finde den gemeinten Vertrag. Ist er nicht eindeutig, frag nach.
2. Ändere nur diese Felder dieses einen Vertrags. Als gekündigt gilt ein Vertrag nur, wenn der Nutzer sagt, dass die Kündigung draußen ist; ein vorbereitetes Schreiben ist noch keine Kündigung.
3. `node baukasten/vertraege.mjs auswerten`, damit Übersicht, Summe und Kalender stimmen.
4. Bestätige in ein bis zwei Sätzen, was festgehalten ist. Bei einer abgeschickten Kündigung sagst du dazu: Den Nachweis für das Abschicken aufheben; kommt innerhalb von zwei Wochen keine Bestätigung, beim Anbieter nachfragen. Nennt die Bestätigung ein anderes Enddatum als erwartet, sagst du das ohne Wertung und verweist für die Frage, was daraus folgt, auf `vertrag-auskunft`.
