---
name: website-pruefen
description: Sechster Schritt des Baukastens „Website ohne Backend“. Prüft die gebaute Website mit dem mitgelieferten Prüfskript und bessert nach, bis sie besteht. Immer vor website-ansehen und der Übergabe verwenden.
---

# Selbst prüfen

1. Führe im Projektordner aus: `node baukasten/pruefen.mjs`
2. Lies jede Zeile mit `FEHLT` oder `FEHLER`, behebe die Ursache in den Dateien unter `website/` und führe das Skript erneut aus.
3. Wiederhole das, bis die letzte Zeile `BESTANDEN` lautet. Gib nicht vorher ab und ändere das Prüfskript nicht.
4. Vergleiche `index.html` noch einmal mit dem Muster der gewählten Komposition (`baukasten/muster-….html`): Stimmen Verschachtelung und Klassen der Bausteine, sind alle `{{…}}` und Kommentare weg, stehen bei den Zeiten nur genannte Tage?
5. Lies danach die drei Seiten noch einmal als Besucher: Stimmen Name, Telefon, E-Mail, Adresse und Zeiten überall überein? Steht irgendwo etwas, das der Nutzer nicht gesagt hat (auch Gefolgertes wie „Samstag geschlossen“ oder Versprechen zur Wirkung einer Leistung)? Dann streichen.

Lässt sich `node` nicht ausführen, gehe die Punkte aus `website-gestalten`, `website-bauen` und `website-datenschutz` von Hand durch und sag das in der Übergabe.
