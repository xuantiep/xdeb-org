---
title: "Guide till starka lösenord"
date: 2019-11-20T09:01:59+01:00
lastmod: 2019-11-20T09:01:59+01:00
author: "Fredrik Jonsson"
tags: ["security","passwords"]
draft: true

---

## Lösenord, den korta versionen

### För användare

1. Minst tolv (12) tecken långa.
2. Olika lösenord för varje tjänst.
3. Använd en lösenordshanterare (eller skriv ned dem i din anteckningsbok).

Bäst är att låta ens lösenordshanterare generera lösenorden så de blir så slumpmässiga som möjligt.


### För utvecklare:

1. Spara lösenord som ett saltat hash (helst unikt salt per lösenord).
2. Minst tolv (12) tecken långa.
3. Får inte finnas med i listor på tidigare hackade lösenord.
4. Testa så loginformuläret fungerar med lösenordshanterare (dvs. att du inte strulat till det med diverse JavaScript etc.).

Tvinga inte på användarna komplicerade regler för lösenorden eller att byta lösenord regelbundet. Dessa saker har ingen reell effekt på säkerheten. Deras enda effekt är att krångla till det för dina användare.


## Lösenord, den längre versionen



Tidigare sågs lösenord som ett användarproblem. Idag har det omvärderats och det är lösenorden i sig som är problemet. Att lasta över problemet på användarna är inte svaret, det fungerar dessutom inte. Folk har annat viktigt att tänka på.

Så rådet att folk ska "byta lösenord" är inte det bästa.

Vill du ge folk ett bra råd så är det att ha olika lösenord. Helst olika för varenda tjänst hen använder, men i alla fall olika för de viktigaste tjänsterna. När kriminella får tag på dina uppgifter från företag A kan de då inte komma åt alla dina andra tjänster.

Apple, Microsoft, Google och Firefox har alla inbyggda system som gör detta relativt enkelt. Det finns dessutom en rad lösenords-hanterare som fixar det (1Password, LastPass etc.).

Att lösa lösenordsproblemet åligger oss utvecklare och säkerhetsexperter.

När jag utvecklar system idag finns det två regler för lösenord:

1. Minst 12 tecken långt.
2. Får inte finnas med listor på tidigare hackade lösenord, t. ex. <https://haveibeenpwned.com/>.

Inget krångel med "minst en versal och två krumelurer" och inget tjat om att byta.

Läs NIST rekommendationer här <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63b.pdf>.

NIST: <https://sv.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology>
