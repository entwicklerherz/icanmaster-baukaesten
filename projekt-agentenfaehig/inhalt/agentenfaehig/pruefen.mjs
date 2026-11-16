// Prüft, ob dieses Projekt vollständig „agentenfähig“ eingerichtet ist. Aufruf im Projektordner: node agentenfaehig/pruefen.mjs
// Das Skript liest Dateien und fragt Git nach geänderten Dateien (ein fester Aufruf: git status). Es führt keine Befehle des
// Projekts aus, ändert nichts, braucht kein Netz und liest keine .env-Dateien.
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const hier = new URL('./', import.meta.url);
const wurzel = new URL('../', import.meta.url);
const lies = (basis, pfad) => { try { return readFileSync(new URL(pfad, basis), 'utf8'); } catch { return null; } };
const ergebnisse = [];
const pruefe = (name, gut, detail) => { ergebnisse.push({ name, gut: Boolean(gut), detail: detail || '' }); };

// ---- 1. Regeldatei
const agents = lies(wurzel, 'AGENTS.md') || '';
pruefe('AGENTS.md ist vorhanden', agents.length > 400, agents.length + ' Zeichen');
pruefe('AGENTS.md enthält keine Platzhalter mehr', agents.length > 0 && !agents.includes('{{') && !agents.includes('}}'));
const abschnitte = ['## Das Projekt in drei Sätzen', '## Befehle', '## Bekannter Zustand', '## Aufbau', '## Grenzen', '## Arbeitsweise', '## Fertig heißt'];
const fehlend = abschnitte.filter(a => !agents.includes(a));
pruefe('AGENTS.md hat alle sieben Abschnitte', fehlend.length === 0, fehlend.join(', '));
pruefe('AGENTS.md bleibt kurz genug, um gelesen zu werden (höchstens 12.000 Zeichen)', agents.length <= 12000, agents.length + ' Zeichen');
const claude = lies(wurzel, 'CLAUDE.md') || '';
pruefe('CLAUDE.md ist vorhanden und enthält dieselben Regeln', claude.length > 0 && abschnitte.every(a => claude.includes(a)));
const geheim = [/sk-[A-Za-z0-9_-]{20,}/, /AKIA[0-9A-Z]{16}/, /ghp_[A-Za-z0-9]{30,}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /(passwor[dt]|secret|token|api[_-]?key)\s*[:=]\s*["'][^"'\s]{8,}["']/i];
pruefe('In AGENTS.md und CLAUDE.md stehen keine Zugangsdaten', !geheim.some(muster => muster.test(agents) || muster.test(claude)));
pruefe('Die Regeln verlangen die Gegenprüfung durch einen zweiten Agenten und nennen den Satz dafür', /gegenpruefung/.test(agents) && /zweite[rn]? (Agent|Sitzung)/i.test(agents) && agents.includes('Prüf die letzte Änderung gegen'));

// ---- 2. Befehle
let befehle = null;
try { befehle = JSON.parse(lies(wurzel, 'docs/agenten/befehle.json') || ''); } catch { befehle = null; }
const zwecke = ['abhaengigkeiten', 'build', 'tests', 'einzelner_test', 'lint', 'typpruefung'];
const erlaubt = ['laeuft', 'schlaegt_fehl', 'nicht_vorhanden', 'nicht_ausgefuehrt'];
const eintraege = befehle && befehle.befehle ? befehle.befehle : {};
pruefe('docs/agenten/befehle.json ist vorhanden und lesbar', befehle !== null && /^\d{4}-\d{2}-\d{2}$/.test(String(befehle.stand || '')), befehle ? String(befehle.stand) : 'fehlt oder kein JSON');
pruefe('Für jeden der sechs Zwecke gibt es einen Eintrag mit gültigem Ergebnis', zwecke.every(z => eintraege[z] && erlaubt.includes(eintraege[z].ergebnis)), zwecke.filter(z => !eintraege[z] || !erlaubt.includes(eintraege[z].ergebnis)).join(', '));
const mitBefehl = zwecke.filter(z => eintraege[z] && eintraege[z].ergebnis !== 'nicht_vorhanden');
pruefe('Jeder vorhandene Befehl ist ausgeschrieben', mitBefehl.every(z => String(eintraege[z].befehl || '').trim().length > 1), mitBefehl.filter(z => !String(eintraege[z].befehl || '').trim()).join(', '));
const nichtInRegeln = mitBefehl.filter(z => !agents.includes('`' + String(eintraege[z].befehl || '').trim() + '`'));
pruefe('Jeder Befehl steht Wort für Wort auch in AGENTS.md', nichtInRegeln.length === 0, nichtInRegeln.join(', '));
const ohneNotiz = zwecke.filter(z => eintraege[z] && ['schlaegt_fehl', 'nicht_ausgefuehrt'].includes(eintraege[z].ergebnis) && String(eintraege[z].notiz || '').trim().length < 10);
pruefe('Fehlschläge und nicht ausgeführte Befehle sind begründet', ohneNotiz.length === 0, ohneNotiz.join(', '));
const fehlschlaege = zwecke.filter(z => eintraege[z] && eintraege[z].ergebnis === 'schlaegt_fehl');
const zustand = agents.includes('## Bekannter Zustand') ? agents.split('## Bekannter Zustand')[1].split('\n## ')[0] : '';
pruefe('Was fehlschlägt, steht unter „Bekannter Zustand“', fehlschlaege.length === 0 || (zustand.trim().length > 30 && !/nichts bekannt/i.test(zustand)), fehlschlaege.join(', '));

// Abgleich mit dem Projekt, soweit ohne Ausführen möglich (Node-Projekte)
let paket = null;
try { paket = JSON.parse(lies(wurzel, 'package.json') || ''); } catch { paket = null; }
if (paket && paket.scripts) {
  const genannt = zwecke.map(z => String((eintraege[z] || {}).befehl || '')).join('\n');
  const skripte = (genannt.match(/(?:npm|pnpm|yarn|bun)(?: run)? ([\w:-]+)/g) || []).map(t => t.split(' ').pop()).filter(n => !['install', 'ci', 'run', 'test', 'exec', 'add'].includes(n));
  const unbekannt = skripte.filter(n => !(n in paket.scripts));
  pruefe('Genannte Skripte gibt es in package.json', unbekannt.length === 0, unbekannt.join(', '));
  if (paket.scripts.test) pruefe('Das Projekt hat ein Test-Skript, und es ist eingetragen', String((eintraege.tests || {}).befehl || '').trim().length > 0 && (eintraege.tests || {}).ergebnis !== 'nicht_vorhanden');
}

// ---- 3. Skills
const namen = ['aenderung-umsetzen', 'selbstpruefung', 'gegenpruefung', 'uebergabe'];
for (const name of namen) {
  const soll = lies(hier, 'vorlagen/skills/' + name + '/SKILL.md'), ist = lies(wurzel, '.claude/skills/' + name + '/SKILL.md');
  pruefe('Skill ' + name + ' liegt unverändert unter .claude/skills', soll !== null && ist === soll, ist === null ? 'fehlt' : (ist === soll ? '' : 'weicht von der Vorlage ab'));
}

// ---- 4. Am Produktcode wurde nichts geändert
const erlaubteOrte = ['AGENTS.md', 'CLAUDE.md', '.claude/', 'docs/agenten/', 'agentenfaehig/'];
let status = null;
try { status = execFileSync('git', ['status', '--porcelain', '--untracked-files=all'], { cwd: wurzel, encoding: 'utf8' }); } catch { status = null; }
if (status === null) pruefe('Git ist vorhanden, damit sich prüfen lässt, was geändert wurde', false, 'kein Git-Repository oder Git fehlt');
else {
  const pfade = status.split('\n').filter(Boolean).map(zeile => zeile.slice(3).replace(/^"|"$/g, '').split(' -> ').pop());
  const fremd = pfade.filter(pfad => !erlaubteOrte.some(ort => pfad === ort || pfad.startsWith(ort)));
  pruefe('Außerhalb der erlaubten Orte ist nichts geändert', fremd.length === 0, fremd.slice(0, 6).join(', '));
}

const schlecht = ergebnisse.filter(e => !e.gut);
for (const e of ergebnisse) console.log((e.gut ? 'ok      ' : 'FEHLER  ') + e.name + (e.gut || !e.detail ? '' : ' (' + e.detail + ')'));
console.log('Hinweis: Dieses Skript hat keine Befehle des Projekts ausgeführt. Ob die eingetragenen Befehle laufen, belegt der Lauf des Agenten.');
console.log(schlecht.length ? '\nNICHT BESTANDEN: ' + schlecht.length + ' von ' + ergebnisse.length + ' Prüfungen' : '\nBESTANDEN: ' + ergebnisse.length + ' Prüfungen');
process.exitCode = schlecht.length ? 1 : 0;
