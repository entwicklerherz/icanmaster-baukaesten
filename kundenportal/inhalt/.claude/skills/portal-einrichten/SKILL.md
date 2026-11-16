---
name: portal-einrichten
description: Zweiter Schritt des Baukastens Kundenportal. Legt die fertige Grundlage in den Ordner kundenportal und schneidet sie über einstellungen.json auf den Betrieb zu, ohne das Programm zu ändern.
---

# Einrichten: Grundlage kopieren und zuschneiden

## Schritte

1. Kopiere den **Inhalt** von `baukasten/grundlage/` in einen neuen Ordner `kundenportal/` (also `kundenportal/src/`, `kundenportal/schema.sql`, `kundenportal/einstellungen.json`, `kundenportal/wrangler.jsonc`). Gibt es den Ordner schon, überschreibe `einstellungen.json` nicht blind: Lies sie und ändere nur, was sich geändert hat.
2. Fülle `kundenportal/einstellungen.json` aus dem Gespräch:
   - `name`: Name des Betriebs.
   - `begruessung`: ein, zwei freundliche Sätze für die Seite der Kunden, in „Sie“-Form, ohne Werbesprache, passend zu den Bezeichnungen (zum Beispiel „Hier sehen Sie den Stand Ihres Auftrags, Ihre Termine und Ihre Unterlagen.“).
   - `wort_kunde`, `wort_kunden`: die Bezeichnung für eine Person und für mehrere (zum Beispiel „Mandant“ und „Mandanten“). Sie erscheinen nur in der Verwaltung.
   - `wort_vorgang`: worum es je Person geht (zum Beispiel „Auftrag“, „Projekt“, „Mandat“).
   - `stufen`: zwei bis sieben kurze Bezeichnungen in der Reihenfolge des Ablaufs. Die letzte bedeutet „abgeschlossen“; ab ihr läuft die Löschfrist.
   - `erreichbar`: der Satz, wie man den Betrieb bei Fragen erreicht.
   - `aufbewahrung_tage`: Vorgabe 90, außer der Nutzer wollte es anders.
   - `rechtliches`: `verantwortlich`, `anschrift`, `telefon`, `email` genau so, wie der Nutzer sie genannt hat; `weitere_angaben` nur, wenn er welche genannt hat (zum Beispiel Berufsbezeichnung und zuständige Kammer). Erfinde nichts.
   - `zeitzone` bleibt `Europe/Berlin`, außer der Betrieb sitzt nachweislich woanders.
3. Die Dateien unter `kundenportal/src/` und `kundenportal/schema.sql` änderst du **nicht**. Die Prüfung vergleicht sie mit der Grundlage.
4. Du legst keine Kunden an, auch keine Beispielkunden, und trägst nirgends Namen oder Unterlagen von Kunden ein.

## Wünsche, die über die Einstellungen hinausgehen

Kunden laden selbst etwas hoch oder schreiben zurück, Benachrichtigung per E-Mail, Anmeldung mit Passwort, mehrere Vorgänge je Person, mehrere Mitarbeiter mit eigenen Zugängen, größere Dateien, Bezahlung, Unterschrift: Das kann diese Fassung nicht. Bau es nicht nach und richte dafür keinen anderen Dienst ein. Sag dem Nutzer in einem Satz, dass es fehlt, und merke es für die Übergabe vor.

Danach weiter mit `portal-pruefen`.
