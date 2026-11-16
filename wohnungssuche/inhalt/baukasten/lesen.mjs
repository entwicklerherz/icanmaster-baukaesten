// Macht gespeicherte E-Mails (.eml) und HTML-Dateien zu lesbarem Text. Ohne fremde Programmteile, ohne Netz.
// Verweise bleiben als Adresse in eckigen Klammern hinter ihrem Text stehen, damit die Quelle eines Angebots erhalten bleibt.

const namen = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', euro: '€', auml: 'ä', ouml: 'ö', uuml: 'ü', Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü', szlig: 'ß', ndash: '–', mdash: '—', sup2: '²', middot: '·', bull: '•', hellip: '…', laquo: '«', raquo: '»', bdquo: '„', ldquo: '“', rdquo: '”' };
const zeichen = text => text.replace(/&(#x[\da-f]+|#\d+|[a-z]+\d?);/gi, (alles, code) => code[0] === '#' ? String.fromCodePoint(code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1))) : (namen[code] ?? alles));

export function htmlZuText(html) {
  let text = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style|head|title)\b[\s\S]*?<\/\1\s*>/gi, '');
  text = text.replace(/<a\b[^>]*?href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a\s*>/gi, (alles, adresse, inhalt) => { const wort = inhalt.replace(/<[^>]+>/g, ' ').trim(); return /^https?:/i.test(adresse) ? `${wort} [${adresse}]` : wort; });
  text = text.replace(/<img\b[^>]*?alt\s*=\s*["']([^"']*)["'][^>]*>/gi, ' $1 ');
  text = text.replace(/<(br|hr|\/p|\/div|\/tr|\/li|\/h[1-6]|h[1-6]|\/table|\/section|\/article)\b[^>]*>/gi, '\n').replace(/<\/t[dh]\s*>/gi, '  ').replace(/<li\b[^>]*>/gi, '- ').replace(/<[^>]+>/g, '');
  return zeichen(text).split('\n').map(zeile => zeile.replace(/[ \t ]+/g, ' ').trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

const entfalten = kopf => kopf.replace(/\r?\n[ \t]+/g, ' ');
const dekoder = satz => { try { return new TextDecoder((satz || 'utf-8').trim().toLowerCase()); } catch { return new TextDecoder('utf-8'); } };
const ausQP = text => Buffer.from(text.replace(/=\r?\n/g, '').replace(/=([\da-f]{2})/gi, (alles, hex) => String.fromCharCode(parseInt(hex, 16))), 'latin1');
// Kopfzeilen mit Umlauten: =?utf-8?Q?...?= oder =?utf-8?B?...?=
const kopfwort = text => text.replace(/=\?([^?]+)\?([bq])\?([^?]*)\?=(\s+(?==\?))?/gi, (alles, satz, art, inhalt) => dekoder(satz).decode(art.toLowerCase() === 'b' ? Buffer.from(inhalt, 'base64') : ausQP(inhalt.replace(/_/g, ' '))));

function teil(roh) {
  const quelle = roh.toString('latin1'), grenze = quelle.search(/\r?\n\r?\n/);
  const kopf = entfalten(grenze < 0 ? quelle : quelle.slice(0, grenze)), rumpf = grenze < 0 ? '' : quelle.slice(grenze).replace(/^\r?\n\r?\n/, '');
  const feld = name => (kopf.match(new RegExp('^' + name + ':\\s*(.*)$', 'im')) || [])[1] || '';
  const art = feld('Content-Type') || 'text/plain', kodierung = feld('Content-Transfer-Encoding').trim().toLowerCase();
  const trenner = (art.match(/boundary\s*=\s*"?([^";]+)"?/i) || [])[1];
  if (/^multipart\//i.test(art) && trenner) {
    const stuecke = rumpf.split('--' + trenner).slice(1).filter(stueck => !stueck.startsWith('--')).map(stueck => teil(Buffer.from(stueck.replace(/^\r?\n/, ''), 'latin1')));
    return { kopf: feld, teile: stuecke.flatMap(stueck => stueck.teile) };
  }
  const bytes = kodierung === 'base64' ? Buffer.from(rumpf.replace(/\s+/g, ''), 'base64') : kodierung === 'quoted-printable' ? ausQP(rumpf) : Buffer.from(rumpf, 'latin1');
  return { kopf: feld, teile: [{ art: art.split(';')[0].trim().toLowerCase(), text: dekoder((art.match(/charset\s*=\s*"?([^";\s]+)"?/i) || [])[1]).decode(bytes) }] };
}

export function mailLesbar(roh) {
  const mail = teil(roh), html = mail.teile.find(t => t.art === 'text/html'), schlicht = mail.teile.find(t => t.art === 'text/plain');
  // Benachrichtigungen tragen ihre Verweise meist nur im HTML-Teil; deshalb hat er Vorrang.
  const text = html ? htmlZuText(html.text) : schlicht ? schlicht.text.replace(/\r/g, '') : '';
  return { absender: kopfwort(mail.kopf('From')), betreff: kopfwort(mail.kopf('Subject')), datum: mail.kopf('Date'), text };
}
