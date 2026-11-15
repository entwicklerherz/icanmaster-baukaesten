// Selbstprüfung des Baukastens „Website ohne Backend“. Ohne Abhängigkeiten. Aufruf im Projektordner: node baukasten/pruefen.mjs
import {readFileSync, existsSync, readdirSync, statSync} from 'node:fs';
import path from 'node:path';

const root = path.resolve('website'), problems = [], notes = [];
const fail = (kind, msg) => problems.push(`${kind}: ${msg}`);
if (!existsSync(root)) { console.log('FEHLT: Ordner website/'); console.log('NICHT BESTANDEN'); process.exit(1); }
const walk = d => readdirSync(d).flatMap(n => { const p = path.join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(root), rel = p => path.relative(root, p);
for (const need of ['index.html', 'impressum.html', 'datenschutz.html', 'assets/style.css']) if (!existsSync(path.join(root, need))) fail('FEHLT', `Datei website/${need}`);

const external = /^(?:https?:)?\/\//i;
for (const file of files.filter(f => /\.(html|css|js|svg)$/i.test(f))) {
  const src = readFileSync(file, 'utf8'), name = rel(file);
  if (/\.html$/i.test(file)) {
    // Was die Seite lädt (nicht: Links, auf die man klickt)
    for (const m of src.matchAll(/<(script|img|iframe|source|video|audio|embed|object|link)\b[^>]*?\b(?:src|href|data|poster)\s*=\s*["']([^"']+)["'][^>]*>/gi)) {
      const tag = m[1].toLowerCase(), url = m[2];
      if (tag === 'link' && !/rel\s*=\s*["'](?:[^"']*\s)?(stylesheet|icon|preload|preconnect|dns-prefetch|manifest|apple-touch-icon)/i.test(m[0])) continue;
      if (external.test(url)) fail('FEHLER', `${name} lädt etwas von außen: ${url}`);
    }
    for (const m of src.matchAll(/srcset\s*=\s*["']([^"']+)["']/gi)) if (m[1].split(',').some(u => external.test(u.trim()))) fail('FEHLER', `${name} lädt Bilder von außen (srcset)`);
    if (/<form\b/i.test(src)) fail('FEHLER', `${name} enthält ein Formular (Kontakt nur über Telefon- und E-Mail-Links)`);
    if (/<iframe\b/i.test(src)) fail('FEHLER', `${name} bettet fremde Inhalte ein (iframe)`);
    if (!/<html[^>]*\blang\s*=\s*["'][a-z]{2}/i.test(src)) fail('FEHLT', `${name}: Sprachangabe <html lang="de">`);
    if (!/<title>\s*[^<\s][^<]*<\/title>/i.test(src)) fail('FEHLT', `${name}: Seitentitel`);
    if (!/<meta[^>]+name\s*=\s*["']description["'][^>]+content\s*=\s*["'][^"']{20,}/i.test(src) && !/<meta[^>]+content\s*=\s*["'][^"']{20,}["'][^>]+name\s*=\s*["']description/i.test(src)) fail('FEHLT', `${name}: Beschreibung (meta description, mindestens 20 Zeichen)`);
    if (!/<meta[^>]+name\s*=\s*["']viewport["']/i.test(src)) fail('FEHLT', `${name}: viewport-Angabe für Handys`);
    const h1 = (src.match(/<h1\b/gi) || []).length; if (h1 !== 1) fail('FEHLER', `${name}: genau eine Hauptüberschrift (h1) erwartet, gefunden ${h1}`);
    for (const m of src.matchAll(/<img\b[^>]*>/gi)) if (!/\balt\s*=/i.test(m[0])) fail('FEHLT', `${name}: Bild ohne Beschreibung (alt)`);
    if (!/href\s*=\s*["'][^"']*impressum\.html/i.test(src)) fail('FEHLT', `${name}: Link zum Impressum`);
    if (!/href\s*=\s*["'][^"']*datenschutz\.html/i.test(src)) fail('FEHLT', `${name}: Link zur Datenschutzseite`);
    for (const m of src.matchAll(/\sstyle\s*=\s*["']([^"']*)["']/gi)) if (!/^\s*(--[a-z-]+\s*:\s*[\d.]+\s*;?\s*)+$/i.test(m[1])) fail('FEHLER', `${name} enthält Inline-Stil „${m[1].slice(0, 40)}“; erlaubt sind nur Zahlenwerte wie --von und --bis im Wochenplan`);
    if (/\{\{|\}\}/.test(src)) fail('FEHLER', `${name} enthält noch Platzhalter aus dem Muster ({{…}})`);
    for (const m of src.matchAll(/<script\b[^>]*>/gi)) if (!/src\s*=\s*["']assets\/seite\.js["']/.test(m[0])) fail('FEHLER', `${name}: nur assets/seite.js ist als Skript vorgesehen`);
    for (const m of src.matchAll(/href\s*=\s*["']([^"'#?]+\.(?:html|css|js|svg|png|jpg|jpeg|webp|ico))(?:[#?][^"']*)?["']/gi)) { const u = m[1]; if (external.test(u) || /^(mailto|tel):/i.test(u)) continue; if (!existsSync(path.resolve(path.dirname(file), u))) fail('FEHLER', `${name}: Verweis ins Leere: ${u}`); }
    if (/lorem ipsum|blindtext|mustermann|musterstra(ß|ss)e|max\.?\s*muster|\bTODO\b|xxx-?xxx/i.test(src)) fail('FEHLER', `${name} enthält Platzhaltertext`);
    for (const m of src.matchAll(/\[Bitte ergänzen:[^\]]*\]/g)) notes.push(`OFFEN (gehört in die Übergabe): ${name}: ${m[0]}`);
  }
  if (/\.css$/i.test(file) || /\.html$/i.test(file)) {
    for (const m of src.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) if (external.test(m[1])) fail('FEHLER', `${name} lädt etwas von außen: ${m[1]}`);
    if (/@import\s+(?:url\()?\s*["']?(?:https?:)?\/\//i.test(src)) fail('FEHLER', `${name} importiert ein Stylesheet von außen`);
  }
  if (/\b(localStorage|sessionStorage|document\.cookie|indexedDB)\b/.test(src)) fail('FEHLER', `${name} speichert etwas im Browser`);
  if (/(\bfetch\s*\(|\bXMLHttpRequest\b|navigator\.sendBeacon|new\s+WebSocket)/.test(src)) fail('FEHLER', `${name} schickt Daten übers Netz`);
  if (/googletagmanager|google-analytics|gtag\(|fonts\.googleapis|fonts\.gstatic|facebook\.net|hotjar|matomo|plausible|cdn\.jsdelivr|unpkg\.com|cdnjs/i.test(src)) fail('FEHLER', `${name} verweist auf einen fremden Dienst`);
}
// Gestaltung: Plan, eigene Schriften, flüssige Maße
const cssPath = path.join(root, 'assets/style.css'), css = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : '';
if (css) {
  if (!/GESTALTUNGSPLAN/.test(css.slice(0, 2500))) fail('FEHLT', 'style.css: Kommentar GESTALTUNGSPLAN am Anfang');
  const faces = [...css.matchAll(/@font-face\s*\{[^}]*\}/g)].map(m => m[0]);
  if (!faces.length) fail('FEHLT', 'style.css: eigene Schrift aus baukasten/schriften (mit @font-face eingebunden)');
  for (const f of faces) { const u = (f.match(/url\(\s*["']?([^"')]+)/) || [])[1] || ''; if (!u || !existsSync(path.resolve(path.dirname(cssPath), u))) fail('FEHLER', `style.css: Schriftdatei nicht gefunden: ${u || '(keine)'}`); if (!/font-display\s*:\s*swap/.test(f)) fail('FEHLT', 'style.css: font-display: swap bei @font-face'); }
  if (faces.length && !files.some(f => /LIZENZ|OFL|licen/i.test(f))) fail('FEHLT', 'Lizenztext der verwendeten Schrift unter website/assets/schriften/');
  for (const v of ['--stufe-4', '--raum-6', '--rahmen', '--grund', '--akzent', '--tief', '--familie-titel', '.titel', '.band__nummer', '.zeiten', '.buehne', '.werkbank', '.ruhe']) if (!css.includes(v)) fail('FEHLT', `style.css: Grundlage unvollständig (${v} fehlt)`);
  // Die Hauptüberschrift passt nur, wenn --titel-zeichen der längsten Zeile entspricht
  const idx = existsSync(path.join(root, 'index.html')) ? readFileSync(path.join(root, 'index.html'), 'utf8') : '', h1 = (idx.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '';
  const zeilen = [...h1.matchAll(/<span\b[^>]*>([\s\S]*?)<\/span>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;/g, 'x').trim());
  const laengste = Math.max(0, ...zeilen.map(z => [...z].length)), gesetzt = Number((css.match(/--titel-zeichen\s*:\s*(\d+)/) || [])[1] || 0);
  if (idx && (zeilen.length < 2 || zeilen.length > 3)) fail('FEHLER', `index.html: Die Hauptüberschrift braucht zwei oder drei Zeilen, je Zeile ein <span> (gefunden: ${zeilen.length})`);
  if (laengste > 16) fail('FEHLER', `index.html: Eine Zeile der Hauptüberschrift hat ${laengste} Zeichen (höchstens 16): „${zeilen.find(z => [...z].length === laengste)}“`);
  if (laengste && gesetzt < laengste) fail('FEHLER', `style.css: --titel-zeichen ist ${gesetzt}, die längste Zeile der Hauptüberschrift hat ${laengste} Zeichen`);
  if (laengste && gesetzt > laengste + 1) fail('FEHLER', `style.css: --titel-zeichen ist ${gesetzt}, die längste Zeile hat nur ${laengste} Zeichen; setze ${laengste}, damit die Überschrift groß genug steht`);
  const komp = ['buehne', 'werkbank', 'ruhe'].filter(k => new RegExp(`<section[^>]*class="[^"]*\\b${k}\\b`).test(idx));
  if (idx && komp.length !== 1) fail('FEHLT', `index.html: genau eine Komposition aus dem Muster (buehne, werkbank oder ruhe), gefunden: ${komp.join(', ') || 'keine'}`);
  if (idx && !/<h1\b[^>]*class="[^"]*\btitel\b/.test(idx)) fail('FEHLT', 'index.html: Hauptüberschrift mit der Klasse „titel“ wie im Muster');
  for (const m of idx.matchAll(/data-tage\s*=\s*"([^"]*)"/g)) if (!/^[1-7](-[1-7])?$/.test(m[1])) fail('FEHLER', `index.html: data-tage="${m[1]}" ist ungültig (1 = Montag … 7 = Sonntag, Bereich als "2-7")`);
  for (const m of idx.matchAll(/data-(von|bis)\s*=\s*"([^"]*)"/g)) if (!/^\d{1,2}([.:][0-5]\d)?$/.test(m[2])) fail('FEHLER', `index.html: data-${m[1]}="${m[2]}" ist ungültig (Uhrzeit als "9" oder "17.30")`);
  if (idx && /data-status/.test(idx) && !/data-tage/.test(idx)) fail('FEHLER', 'index.html: Die Statuszeile (data-status) braucht Zeiten mit data-tage; ohne feste Zeiten die Statuszeile entfernen');
  const einleitung = ((idx.match(/<h1\b[\s\S]*?<\/h1>\s*<p\b[^>]*class="[^"]*\bgross\b[^>]*>([\s\S]*?)<\/p>/i) || idx.match(/<p\b[^>]*class="[^"]*\bgross\b[^>]*>([\s\S]*?)<\/p>/i) || [])[1] || '').replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, 'x').trim();
  if (einleitung.length > (komp[0] === 'buehne' ? 120 : 150)) fail('FEHLER', `index.html: Die Einleitung unter der Überschrift hat ${einleitung.length} Zeichen; höchstens ${komp[0] === 'buehne' ? 110 : 140}, damit die Anruf-Schaltfläche im ersten Bildschirm bleibt`);
  if (idx && !/class="[^"]*\bband\b/.test(idx)) fail('FEHLT', 'index.html: Baustein „band“ (Kontakt) aus dem Muster');
  if (/baukasten\/(schriften|illustrationen|szenen|grundlage|pruefen)/.test(css)) fail('FEHLER', 'style.css verweist auf den Ordner baukasten');
  const eigene = css.split(/Druck -+/)[1] || css, px = (eigene.match(/font-size\s*:\s*\d+(\.\d+)?px/g) || []);
  if (px.length) fail('FEHLER', `style.css: feste Pixelgrößen für Schrift (${px.slice(0, 3).join(', ')}); nimm --stufe-…`);
  if (/letter-spacing\s*:\s*0?\.(0[6-9]|[1-9])\d*em[^}]*text-transform\s*:\s*uppercase|text-transform\s*:\s*uppercase[^}]*letter-spacing\s*:\s*0?\.(0[6-9]|[1-9])/.test(css)) fail('FEHLER', 'style.css: gesperrte Großbuchstaben-Zeilen sind nicht vorgesehen');
}
// Bilder: Illustration aus dem Baukasten oder vom Nutzer, nichts selbst Gezeichnetes
const startseite = existsSync(path.join(root, 'index.html')) ? readFileSync(path.join(root, 'index.html'), 'utf8') : '';
if (startseite && !/<img\b[^>]*src\s*=\s*["']assets\/bilder\//i.test(startseite)) fail('FEHLT', 'index.html: Bild aus website/assets/bilder/ (Szenenbild aus baukasten/szenen oder Bild des Nutzers)');
for (const file of files.filter(f => /\.html$/i.test(f))) { const src = readFileSync(file, 'utf8');
  if (/<svg\b/i.test(src)) fail('FEHLER', `${rel(file)}: selbst gezeichnetes SVG; nimm ein Bild aus baukasten/szenen oder baukasten/illustrationen`);
  for (const m of src.matchAll(/<img\b[^>]*>/gi)) { if (!/\bwidth\s*=/.test(m[0]) || !/\bheight\s*=/.test(m[0])) fail('FEHLT', `${rel(file)}: Bild ohne width und height`); const u = (m[0].match(/\bsrc\s*=\s*["']([^"']+)/) || [])[1] || ''; if (u && !/^(https?:)?\/\//.test(u) && !existsSync(path.resolve(path.dirname(file), u))) fail('FEHLER', `${rel(file)}: Bilddatei nicht gefunden: ${u}`); } }
if (files.some(f => /\.svg$/i.test(f))) fail('FEHLER', 'SVG-Datei im Ordner website; Bilder kommen als WebP, PNG oder JPG');
for (const file of files.filter(f => /\.html$/i.test(f))) { const src = readFileSync(file, 'utf8'); if (/<style\b/i.test(src)) fail('FEHLER', `${rel(file)}: Stil gehört in assets/style.css, nicht ins HTML`); if (/baukasten\/(schriften|illustrationen|szenen|grundlage|pruefen)/.test(src)) fail('FEHLER', `${rel(file)} verweist auf den Ordner baukasten`); }

const imp = existsSync(path.join(root, 'impressum.html')) ? readFileSync(path.join(root, 'impressum.html'), 'utf8').replace(/<[^>]+>/g, ' ') : '';
if (imp && !/\b\d{5}\b/.test(imp)) fail('FEHLT', 'impressum.html: Anschrift mit Postleitzahl');
if (imp && !/(tel|telefon|fon)[^a-z]{0,6}[+\d(]/i.test(imp) && !/@/.test(imp)) fail('FEHLT', 'impressum.html: Telefon oder E-Mail');
const ds = existsSync(path.join(root, 'datenschutz.html')) ? readFileSync(path.join(root, 'datenschutz.html'), 'utf8').replace(/<[^>]+>/g, ' ') : '';
for (const [word, what] of [[/verantwortlich/i, 'wer verantwortlich ist'], [/protokoll|logfile|log-datei|logdatei/i, 'was beim Aufruf der Seite verarbeitet wird'], [/auskunft/i, 'die Rechte der Besucher'], [/aufsichtsbeh(ö|oe)rde/i, 'das Beschwerderecht bei der Aufsichtsbehörde'], [/cookies?/i, 'dass keine Cookies gesetzt werden']]) if (ds && !word.test(ds)) fail('FEHLT', `datenschutz.html: Abschnitt dazu, ${what}`);
const size = files.reduce((s, f) => s + statSync(f).size, 0); if (size > 3000000) fail('FEHLER', `Die Seite ist ${Math.round(size / 1024)} KB groß (höchstens 3000 KB)`);

for (const n of notes) console.log(n);
for (const p of problems) console.log(p);
console.log(problems.length ? `NICHT BESTANDEN (${problems.length} Punkte)` : 'BESTANDEN');
process.exit(problems.length ? 1 : 0);
