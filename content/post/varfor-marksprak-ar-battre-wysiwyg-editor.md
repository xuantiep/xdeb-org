---
title: "Varför märkspråk är bättre än wysiwyg-editor"
date: 2006-10-17T19:25:31+02:00
lastmod: 2017-05-22T16:15:32+02:00
author: "Fredrik Jonsson"
tags: ["markdown","märkspråk","wysiwyg","teknologi"]
aliases:
  - /node/686/

---



Det finns förenklat tre olika metoder man kan använda för att mata in artiklar och annan text på en hemsida med ett publiceringssystem, t ex Drupal som vi använder här.

1. Användaren gör all formatering av texten helt manuellt med html-taggar. Detta är mycket flexibelt men kräver att användaren kan skriva html-kod, och även då är det krångligt och blir lätt fel.
2. Användaren använder ett märksystem som systemet översätter till html-taggar innan texten visas för besökare. Den inmatade texten blir förhållandevis ren och kan översättas till annat än html vid behov. Märksystem brukar vara relativt lätta att lära sig och de har inbyggda kontrollera så att felaktig kod undviks.
3. En wysiwyg-editor som fungerar ungefär som en ordbehandlare, t ex MS Word. Enkelt för användaren men koden som produceras blir ofta inte så ren och snygg. Användaren lockas ofta också att använda väl mycket formatering.

En wysiwyg-editor är vad många kräver då de tycker allt annat verkar för krångligt, de vill inte lära sig någonting nytt. Jag har till dags dato lyckats övertyga nästan alla mina kunder att välj alternativ två trots det initiala motståndet.


## Mina argument för märkspråk

* Skärskådar man vilken formatering som verkligen behövs är det normalt mycket basal behov som finns. Ju mer seriöst en text ska läsas ju mindre formateras den normalt. Jämför t ex en flyer för något party med en skönlitterär bok.
* Ren text och text som skrivits med t ex. Markdown-taggar är lätt att konvertera mellan system och till andra filformat. Det är en framtidssäker lösning. Text som har ett sammelsurium av HTML-taggar, som ofta blir resultat av en wysiwyg-editor, kräver mycket mer jobb vid flyttning och konvertering.
* Det går att göra det enkelt för användaren utan wysiwyg-editor. Verktygsrader med knappar för vanliga märk-taggar, block med hjälpinformation som dyker upp när man behöver dem etc.

## Exempel på olika formateringar

Här följer fem exempel på samma text.

1. Det första är den rena orginaltexten. 
2. Markdown, kommer att automatiskt konverteras till exempel III. 
3. HTML tolkad av webb-läsaren.
4. HTML-koden som man kan skriva manuellt eller via Markdown som i exempel II.
5. HTML-kod genererad av en wysiwyg-editorer.

### I. Ren text:

    The Cluetrain Manifesto

    A powerful global conversation has begun. Through the Internet, people
    are discovering and inventing new ways to share relevant knowledge with
    blinding speed. As a direct result, markets are getting smarter—and
    getting smarter faster than most companies.

    These markets are conversations. Their members communicate in language
    that is natural, open, honest, direct, funny and often shocking. Whether
    explaining or complaining, joking or serious, the human voice is
    unmistakably genuine. It can't be faked.

    1. Markets are conversations.
    2. Markets consist of human beings, not demographic sectors.
    3. Conversations among human beings sound human. They are conducted in a
    human voice.


### II. Markdown som den skrivs:

    # The Cluetrain Manifesto

    A **powerful** global conversation has begun. Through the Internet,
    people are discovering and inventing new ways to share relevant
    knowledge with blinding speed. As a direct result, markets are getting
    smarter—and getting smarter faster than most companies.

    These markets are
    [conversations](http://en.wikipedia.cm/wiki/conversations). Their
    members communicate in language that is natural, open, honest, direct,
    funny and often shocking. Whether explaining or complaining, joking or
    serious, the human voice is unmistakably genuine. It can't be faked.

    1. Markets are conversations.
    2. Markets consist of human beings, not demographic sectors.
    3. Conversations among human beings sound human. They are conducted in a
    human voice.

### III. Markdown som den visas för besökare:

# The Cluetrain Manifesto

A **powerful** global conversation has begun. Through the Internet, people are discovering and inventing new ways to share relevant knowledge with blinding speed. As a direct result, markets are getting smarter—and getting smarter faster than most companies.

These markets are [conversations](http://en.wikipedia.cm/wiki/conversations). Their members communicate in language that is natural, open, honest, direct, funny and often shocking. Whether explaining or complaining, joking or serious, the human voice is unmistakably genuine. It can't be faked.

1. Markets are conversations.
2. Markets consist of human beings, not demographic sectors.
3. Conversations among human beings sound human. They are conducted in a human voice.


### IV. HTML:

    <h1>The Cluetrain Manifesto</h1>

    <p>A <strong>powerful</strong> global conversation has begun. Through
    the Internet, people are discovering and inventing new ways to share
    relevant knowledge with blinding speed. As a direct result, markets are
    getting smarter—and getting smarter faster than most companies.</p>

    <p>These markets are <a
    href="http://en.wikipedia.cm/wiki/conversations">conversations</a>.
    Their members communicate in language that is natural, open, honest,
    direct, funny and often shocking. Whether explaining or complaining,
    joking or serious, the human voice is unmistakably genuine. It can't be
    faked.</p>

    <ul>
    <li>Markets are conversations.</li>
    <li>Markets consist of human beings, not demographic sectors.</li>
    <li>Conversations among human beings sound human. They are conducted in
    a human voice.</li>
    </ul>


### V. Wysiwyg-editor:

    <font face="helvetica" size="6">The Cluetrain Manifesto</font><br />
    <br />
    A <strong>powerful</strong> global conversation has begun. Through the
    Internet, people are discovering and inventing new ways to share
    relevant knowledge with blinding speed. As a direct result, markets are
    getting smarter—and getting smarter faster than most companies.<br />
    <br />
    These markets are <a
    href="http://en.wikipedia.cm/wiki/conversations">conversations</a>.
    Their members communicate in language that is natural, open, honest,
    direct, funny and often shocking. Whether explaining or complaining,
    joking or serious, the human voice is unmistakably genuine. It can&#39;t
    be faked.<br />
    <br />
    <ol><li>Markets are conversations.</li>
    <li>Markets consist of human beings, not demographic sectors.</li>
    <li>Conversations among human beings sound human. 
    They are conducted in a human voice.</li></ol><br />


