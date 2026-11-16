---
name: wohnung-besichtigung
description: Verwenden, wenn der Nutzer eine Besichtigung für ein erfasstes Wohnungsangebot vorbereiten, beim Anbieter nachfragen oder Unterlagen anfordern will.
---

# Besichtigung vorbereiten

Du arbeitest mit dem Angebot, das der Nutzer meint; sagt er „das beste“, ist es das erste, das `node baukasten/wohnung.mjs auswerten` nennt und das er nicht abgelehnt hat. Du öffnest dafür keine Anzeige im Netz.

Lege eine Datei `besichtigung/<id>.md` an, in einfachen Worten, mit genau diesen vier Teilen:

1. **Das wissen wir aus der Anzeige.** Die erfassten Angaben in drei bis fünf Zeilen, dazu die geschätzten Gesamtkosten aus der Auswertung.
2. **Das fragen Sie nach.** Zuerst alles, was die Auswertung zu diesem Angebot als offen nennt. Dann, soweit noch nicht bekannt: Hausgeld und was darin enthalten ist, Höhe der Rücklage der Eigentümergemeinschaft, beschlossene oder geplante Sonderumlagen, Zustand von Heizung, Dach und Fenstern, Energieausweis, ob die Wohnung frei oder vermietet ist und ab wann sie übergeben wird.
3. **Diese Unterlagen lassen Sie sich geben.** Teilungserklärung mit Gemeinschaftsordnung, Protokolle der Eigentümerversammlungen der letzten drei Jahre, aktueller Wirtschaftsplan und die letzten Hausgeldabrechnungen, Energieausweis, Grundriss, aktueller Grundbuchauszug.
4. **Entwurf einer Nachricht an den Anbieter.** Höflich, kurz, mit der Bitte um einen Termin, den offenen Fragen aus Teil 2 und der Bitte um die Unterlagen aus Teil 3. Darüber steht: „Entwurf. Bitte selbst prüfen, ergänzen und abschicken.“ Platzhalter für Name, Telefonnummer und Terminwünsche stehen in eckigen Klammern. Höchstpreis, Eigenkapital und Finanzierung des Nutzers stehen nicht darin.

Berührt das Angebot Recht oder Steuern (vermietet, Erbbaurecht, Wohnrecht, Zwangsversteigerung), steht in Teil 2 eine Zeile: „Vor einer Entscheidung mit Notar, Bank oder einer Beratungsstelle klären: …“ Du erklärst nicht selbst, was rechtlich gilt, und gibst keine Tipps zum Verhandeln.

Sag dem Nutzer danach in zwei Sätzen, dass die Vorbereitung als Datei im Ordner „besichtigung“ liegt, dass die Nachricht ein Entwurf ist, den er selbst abschickt, und nenne die zwei wichtigsten offenen Fragen. Setze den Status des Angebots nicht von dir aus auf `besichtigung`; das tut `wohnung-merkliste`, wenn der Nutzer einen Termin hat.
