-- Tabellen des Kundenportals. Mehrfach ausführbar.
CREATE TABLE IF NOT EXISTS kunde (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  kontakt TEXT NOT NULL DEFAULT '',
  vorgang TEXT NOT NULL,
  stufe INTEGER NOT NULL DEFAULT 0,
  token_hash TEXT NOT NULL UNIQUE,
  angelegt TEXT NOT NULL,
  abgeschlossen_am TEXT
);
-- Alles Weitere hängt an genau einem Kunden. Jede Abfrage für die Kundenseite nennt die Kundennummer mit.
CREATE TABLE IF NOT EXISTS mitteilung (id INTEGER PRIMARY KEY AUTOINCREMENT, kunde_id INTEGER NOT NULL, text TEXT NOT NULL, angelegt TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS mitteilung_kunde ON mitteilung (kunde_id);
CREATE TABLE IF NOT EXISTS termin (id INTEGER PRIMARY KEY AUTOINCREMENT, kunde_id INTEGER NOT NULL, start TEXT NOT NULL, text TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS termin_kunde ON termin (kunde_id);
CREATE TABLE IF NOT EXISTS datei (id INTEGER PRIMARY KEY AUTOINCREMENT, kunde_id INTEGER NOT NULL, name TEXT NOT NULL, typ TEXT NOT NULL, groesse INTEGER NOT NULL, angelegt TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS datei_kunde ON datei (kunde_id);
-- Dateien liegen in Stücken in der Datenbank (höchstens 1 MB je Stück).
CREATE TABLE IF NOT EXISTS dateiteil (datei_id INTEGER NOT NULL, nr INTEGER NOT NULL, daten BLOB NOT NULL, PRIMARY KEY (datei_id, nr));
CREATE TABLE IF NOT EXISTS sitzung (hash TEXT PRIMARY KEY, marke TEXT NOT NULL, bis INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS versuch (art TEXT NOT NULL, wer TEXT NOT NULL, zeit INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS versuch_suche ON versuch (art, wer, zeit);
CREATE TABLE IF NOT EXISTS einstellung (k TEXT PRIMARY KEY, v TEXT NOT NULL);
