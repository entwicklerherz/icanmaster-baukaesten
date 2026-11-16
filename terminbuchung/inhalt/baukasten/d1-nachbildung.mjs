// Nachbildung der Datenbank des Anbieters (D1) für die Prüfung: läuft über node:sqlite im Arbeitsspeicher, ohne Netz.
// Bietet, was das Programm braucht: prepare → bind → first / all / run, dazu batch. Über „roh“ liest die Prüfung nach.
import { DatabaseSync } from 'node:sqlite';

// „pause“ (nur für die Prüfung gleichzeitiger Anfragen): eine Funktion, die nach dem Zählen der Versuche kurz wartet.
function nachbildung(schema, pause) {
  const db = new DatabaseSync(':memory:');
  db.exec(schema);
  const anweisung = (sql, werte = []) => ({
    bind: (...neu) => anweisung(sql, neu),
    first: async () => { const zeile = db.prepare(sql).get(...werte) ?? null; if (pause && sql.includes('FROM versuch')) await pause(); return zeile; },
    all: async () => ({ results: db.prepare(sql).all(...werte) }),
    run: async () => { const ergebnis = db.prepare(sql).run(...werte); return { success: true, meta: { changes: Number(ergebnis.changes) } }; },
  });
  return { prepare: sql => anweisung(sql), batch: async liste => { const aus = []; for (const a of liste) aus.push(await a.run()); return aus; }, roh: db };
}

// Eine frische, leere Umgebung mit hinterlegtem Kurzwert des Prüfschlüssels.
export function neueUmgebung(schema, schluesselHash, pause) {
  const DB = nachbildung(schema, pause);
  DB.roh.prepare("INSERT INTO einstellung (k, v) VALUES ('zugang_hash', ?), ('salz', 'pruefsalz')").run(schluesselHash);
  return { DB };
}
