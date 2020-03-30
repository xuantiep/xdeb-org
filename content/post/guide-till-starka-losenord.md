---
title: "Guide till starka lösenord"
slug: "guide-till-starka-losenord"
date: 2020-03-04T16:09:34+01:00
lastmod: 2020-03-04T16:09:34+01:00
author: "Fredrik Jonsson"
tags: ["security","passwords"]

---

Använd minst 12 tecken långa lösenord. Ha olika lösenord för varje tjänst. Låt en lösenordshanterare komma ihåg dem så du slipper.

Tre råd som löser de flesta lösenordsproblem för användare. Läs vidare för mer information om lösenord för både användare och utvecklare.


## Lösenord, den korta versionen

### För användare

1. Tolv (12) tecken långt (minst, ju längre desto säkrare).
2. Olika lösenord för varje tjänst.
3. Använd en lösenordshanterare (eller skriv ned dem i din anteckningsbok).

Bäst är att låta ens lösenordshanterare generera lösenorden så de blir så slumpmässiga som möjligt.

Apple, Microsoft, Google och Firefox har alla inbyggda lösenordshanterare, använd dem.

Vill hen ha en lösning med mer funktioner och som fungerar på flera plattformar finns en rad lösenordshanterare att välja mellan. Här är tre populära program:

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


### För användare

Råd nummer ett att ha olika lösenord för alla tjänster. När kriminella får tag på dina uppgifter från företag A kan de då inte komma åt alla dina tjänster hos företag B, C och D.

En lösenordshanterare gör det enkelt att ha olika lösenord överallt, det är råd nummer två. Du behöver då bara komma ihåg ett huvudlösenord och sedan fyller datorn i alla andra.

För viktiga konton som e-post, Google (Gmail), Microsoft (OutLook), sociala medier osv. är det en väldigt god idé att slå på tvåfaktorautentisering ifall det finns.

När du aktiverar tvåfaktorautentisering visas en QR kod som du läser av med en app i din mobiltelefon. Appen ger tillbaka en sex siffrig kod som de matar in och aktiveringen är klar.

När du ska logga in nästa gång kommer systemet att fråga efter en sexsiffrig kod från appen utöver användarnamn och lösenord. Detta ger betydligt ökad säkerhet.

Apple har ett eget system för tvåfaktorautentisering som fungerar mellan alla enheter med samma Apple ID. Det är inbyggt i macOS och iOS så väldigt smidigt och något Apple-användare definitivt bör aktivera. Aktivera på valfri enhet eller på sidan [Hantera ditt Apple-ID](https://appleid.apple.com/).

Program för tvåfaktorautentisering:

* [Authy](https://authy.com/download/) (säkerhetskopiering och andra bra funktioner)
* [Google Authenticator](https://support.google.com/accounts/answer/1066447) (fungerar men är primitiv)
* Lösenordshanterare som 1Password och LastPass har inbyggd stöd för att generera engångskoder.


### För utvecklare:

Att lösa lösenordsproblemet åligger oss utvecklare och säkerhetsexperter.

När jag utvecklar system idag finns det två regler för lösenord:

1. Minst 12 tecken långt.
2. Får inte finnas med listor på tidigare hackade lösenord, t. ex. <https://haveibeenpwned.com/>.

Inget krångel med "minst en versal och två krumelurer" och inget tjat om att byta.

Det finns så mycket bra information och tjänster runt detta att det är oförsvarbart att inte bygga bra system för hantering av lösenord.

Normalt lägger jag också till ett system for tvåfaktorautentisering (2FA/TFA). Jag undviker system som använder SMS då dessa inte är säkra. De tvingar dessutom folk att lämna ut sina telefonnummer.

Bra resurser:

* [Diceware Secure Passphrase and Password Generator (Swedish)](https://www.rempe.us/diceware/#swedish)
* [How to Safely Store Your Users' Passwords in 2016 - Paragon Initiative Enterprises Blog](https://paragonie.com/blog/2016/02/how-safely-store-password-in-2016)
* [Läs NIST rekommendationer här](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63b.pdf>) (PDF)
* [National Institute of Standards and Technology - NIST](https://sv.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology)
