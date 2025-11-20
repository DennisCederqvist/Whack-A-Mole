# Whack-A-Mole
Övning vecka 47


## Uppgift
Skapa ett enkelt Whack-A-Mole spel.

## Syfte och koppling till kursmål: Träna DOM-manipulation, eventhantering, modulär kod
## (ES-moduler) och enkel tillgänglighet. Detta adresserar bl.a. kursmålen om eventhantering,
## modulära komponenter, DOM-interaktion och WCAG-anpassning.
## Regler för dagens övning
• Vanilla HTML/CSS/JS i webbläsaren. Inga ramverk.
• ES-moduler med import/export. Inga globala variabler.
• Inga inline-events (onclick osv). Använd addEventListener och gärna
eventdelegering.
• Skapa/ta bort DOM-element dynamiskt via klasser (t.ex. spelbräde, mullvad).
• Layouta spelbrädet med flexbox.
• Håll HTML semantisk och tangentbordsbar (t.ex. button för hål; aria-live för status).
Detta följer kursens tillgänglighetsfokus.

## Leverabler (inlämning i ett repo)
1. index.html, styles.css
2. src/ med minst två ES6-klasser (t.ex. Game, Mole) och en main.js som startpunkt
3. README.md med kort beskrivning, hur man kör, och vilka val som gjorts

## Acceptanskriterier (G)
• Spelbräde 3×3 skapas dynamiskt i JS (ingen statisk HTML för hålen).
• Flexbox används för brädelayout (responsivt kvadratiskt bräde).
• Game-klass startar/stoppar spelet; Mole (eller motsv.) lägger till och tar bort en
mullvad-nod i slumpmässiga hål med tidsgräns.
• Klick på mullvad +1 poäng; klick bredvid räknas som miss; statusfält uppdateras i realtid.
• Tangentbord: Tab för fokus, Enter/mellanslag för “whack”.
• Eventdelegering från brädet (en lyssnare hanterar alla hål).
• Modulär struktur med import/export.


## Väl godkänt (VG) , utökat
• Svårighetsnivå (ökar frekvens/kortare TTL över tid).
• Paus/återställ, tydligt slutläge och timer.
• Rensa timers/listeners korrekt vid reset (undvik “hängande” lyssnare , vanligt
nybörjarmisstag).
• Tillgänglig status med role="status"/aria-live, tydliga focus states.
• Ren filstruktur och läsbar CSS/JS med tydligt ansvar per modul.
