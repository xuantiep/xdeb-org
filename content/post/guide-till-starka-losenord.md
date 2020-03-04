---
title: "Guide till starka lösenord"
slug: "guide-till-starka-losenord"
date: 2020-03-04T16:09:34+01:00
lastmod: 2020-03-04T16:09:34+01:00
author: "Fredrik Jonsson"
tags: ["security","passwords"]

---

Använd minst 12 tecken långa lösenord. Ha olika lösenord för varje tjänst. Låt en lösenordshanterare komma ihåg dem så du slipper.

Tre råd som löser de flesta lösenordsproblem för användare. Läs vidare för mer information.


## Lösenord, den korta versionen

### För användare

1. Tolv (12) tecken långt (minst, ju längre desto säkrare).
2. Olika lösenord för varje tjänst.
3. Använd en lösenordshanterare (eller skriv ned dem i din anteckningsbok).

Bäst är att låta ens lösenordshanterare generera lösenorden så de blir så slumpmässiga som möjligt.

Apple, Microsoft, Google och Firefox har alla inbyggda lösenordshanterare, använd dem.

Vill hen ha en lösning med mer funktioner och som fungerar på flera plattformar finns en rad lösenordshanterare att välja mellan. Här är tre populära tjänster:

* [1Password](https://1password.com/)
* [Bitwarden](https://bitwarden.com/)
* [LastPass](https://www.lastpass.com/)


### För utvecklare:

1. Spara lösenord som ett saltat hash (unikt salt per lösenord och med en modern algoritm som t. ex. PBKDF2 eller Argon2).
2. Minst tolv (12) tecken långa.
3. Får inte finnas med i listor på tidigare hackade lösenord.
4. Testa så loginformuläret fungerar med lösenordshanterare (dvs. att du inte strulat till det med diverse JavaScript etc.).

Tvinga inte på användarna komplicerade regler för lösenorden eller att byta lösenord regelbundet. Dessa saker ger ingen ökad säkerheten. Deras enda effekt är att krångla till det för dina användare.


## Lösenord, den längre versionen


Tidigare sågs lösenord som ett användarproblem. Idag har det omvärderats och det är lösenorden i sig som är problemet. Att lasta över problemet på användarna är inte svaret, det fungerar dessutom inte. Folk har annat viktigt att tänka på.

Vill du ge folk ett bra råd så är det att ha olika lösenord för alla tjänster. När kriminella får tag på deras uppgifter från företag A kan de då inte komma åt alla deras tjänster hos företag B, C och D.

Att lösa lösenordsproblemet åligger oss utvecklare och säkerhetsexperter.

När jag utvecklar system idag finns det två regler för lösenord:

1. Minst 12 tecken långt.
2. Får inte finnas med listor på tidigare hackade lösenord, t. ex. <https://haveibeenpwned.com/>.

Inget krångel med "minst en versal och två krumelurer" och inget tjat om att byta.

Bra resurser:

* [Diceware Secure Passphrase and Password Generator (Swedish)](https://www.rempe.us/diceware/#swedish)
* [How to Safely Store Your Users' Passwords in 2016 - Paragon Initiative Enterprises Blog](https://paragonie.com/blog/2016/02/how-safely-store-password-in-2016)
* Läs NIST rekommendationer här <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63b.pdf>.
* NIST: <https://sv.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology>

