-- Tabellen der Terminbuchung. Mehrfach ausführbar.
CREATE TABLE IF NOT EXISTS buchung (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  start TEXT NOT NULL,
  leistung TEXT NOT NULL,
  name TEXT NOT NULL,
  kontakt TEXT NOT NULL,
  notiz TEXT NOT NULL DEFAULT '',
  token_hash TEXT NOT NULL UNIQUE,
  angelegt TEXT NOT NULL,
  abgesagt INTEGER NOT NULL DEFAULT 0
);
-- Ein Termin kann nur einmal aktiv vergeben sein; die Datenbank selbst verhindert die Doppelbuchung.
CREATE UNIQUE INDEX IF NOT EXISTS buchung_start_aktiv ON buchung (start) WHERE abgesagt = 0;
CREATE TABLE IF NOT EXISTS sperre (tag TEXT PRIMARY KEY);
CREATE TABLE IF NOT EXISTS sitzung (hash TEXT PRIMARY KEY, marke TEXT NOT NULL, bis INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS versuch (art TEXT NOT NULL, wer TEXT NOT NULL, zeit INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS versuch_suche ON versuch (art, wer, zeit);
CREATE TABLE IF NOT EXISTS einstellung (k TEXT PRIMARY KEY, v TEXT NOT NULL);
