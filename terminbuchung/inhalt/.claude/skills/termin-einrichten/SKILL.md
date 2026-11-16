---
name: termin-einrichten
description: Zweiter Schritt des Baukastens Online-Terminbuchung. Legt die fertige Grundlage in den Ordner terminbuchung und schneidet sie über einstellungen.json auf den Betrieb zu, ohne das Programm zu ändern.
---

# Einrichten: Grundlage kopieren und zuschneiden

## Schritte

1. Kopiere den **Inhalt** von `baukasten/grundlage/` in einen neuen Ordner `terminbuchung/` (also `terminbuchung/src/`, `terminbuchung/schema.sql`, `terminbuchung/einstellungen.json`, `terminbuchung/wrangler.jsonc`). Gibt es den Ordner schon, überschreibe `einstellungen.json` nicht blind: Lies sie und ändere nur, was sich geändert hat.
2. Fülle `terminbuchung/einstellungen.json` aus dem Gespräch:
   - `name`: Name des Betriebs.
   - `einleitung`: ein, zwei freundliche Sätze für die Startseite, in „Sie“-Form, ohne Werbesprache.
   - `leistungen`: Liste der Anliegen (ein bis sechs kurze Bezeichnungen).
   - `termin_minuten`: Länge eines Termins in Minuten (15 bis 240).
   - `zeiten`: je Wochentag (`mo` bis `so`) eine Liste von Zeitfenstern `["HH:MM", "HH:MM"]`; ein Tag ohne Termine bekommt `[]`. Ein Fenster muss mindestens einen ganzen Termin fassen.
   - `vorlauf_stunden`, `tage_im_voraus`, `aufbewahrung_tage`: Vorgaben 12, 28 und 30, außer der Nutzer wollte es anders.
   - `hinweis_nach_buchung`: ein Satz, der nach der Buchung erscheint.
   - `rechtliches`: `verantwortlich`, `anschrift`, `telefon`, `email` genau so, wie der Nutzer sie genannt hat; `weitere_angaben` nur, wenn er welche genannt hat (zum Beispiel Berufsbezeichnung und zuständige Kammer). Erfinde nichts.
   - `zeitzone` bleibt `Europe/Berlin`, außer der Betrieb sitzt nachweislich woanders.
3. Die Dateien unter `terminbuchung/src/` und `terminbuchung/schema.sql` änderst du **nicht**. Die Prüfung vergleicht sie mit der Grundlage.

## Wünsche, die über die Einstellungen hinausgehen

Verschiedene Terminlängen, mehrere Mitarbeiter mit eigenen Kalendern, Bestätigung per E-Mail, Bezahlung, Anbindung an einen vorhandenen Kalender: Das kann diese Fassung nicht. Bau es nicht nach. Sag dem Nutzer in einem Satz, dass es fehlt, und merke es für die Übergabe vor.

Danach weiter mit `termin-pruefen`.
