---
title: "Två veckor av skräppost och den mesta är Svensk"
slug: "tva-veckor-av-skrappost-och-den-mesta-ar-svensk"
date: 2015-11-13T01:42:25+01:00
lastmod: 2018-03-28T14:31:15+02:00
author: "Fredrik Jonsson"
tags: ["spam","email","teknologi"]
aliases:
  - /node/1611/
language: sv

---

{{< figure src="/images/14_days_of_spam.png" width="400" class="right" alt="Två veckor av skräppost." >}}

På två veckor har det ansamlats 26 stycken skräppost i min skräppostmapp. Av dessa är 17 stycken på svenska, de flesta skickade från Sverige av svenska företag! I Sverige är det obegripligt nog lagligt för företag att spamma andra företag.

Att det är så pass få spam totalt beror på att all post går via min egen [Mail relay och MX backup tjänst](https://xdeb.net/mailrelay). Den tar bort minst 95 procent eller mer av all skräppost med hjälp av spärrlistor, DNS och SPF kollar m. m. Kör du egen e-postserver så kolla gärna in tjänsten.

De brev som slinker igenom skickar normalt SpamSieve, mitt filtreringsprogram på datorn, direkt till skräppostmappen. Kör du macOS så skaffa [SpamSieve](https://c-command.com/spamsieve/), det är väldigt bra!

Något brev i veckan får jag manuellt märka som skräppost och ännu mer sällan hamnar ett riktiga brev i skräppostmappen. Med jämna mellanrum behöver man därför ta sig en titt där, som i dag.

I de flesta länder är det olagligt att skicka skräppost. Spammare behöver därmed ta till diverse metoder för att få ut sina brev. Det gör det relativt enkelt att filtrera skräppost. IP adresser som skickar ut skräppost hamnar på olika spärrlistor och e-postservrar kan sedan använda listorna för att helt blockera post från dessa adresser.

Svensk skräppost är dock ett problem. Då det är lagligt (helt obegripligt som sagt) så skickas den oftast ut av riktiga företag som driver olika e-posttjänster. Förutom skräppost så skickar dessa företag också ut legitima utskicka åt sina kunder. Blockerar man dessa servrar helt missar man därför en hel del riktig e-post också.

På företagets egen e-postserver (vågar vara lite hårdare där) har jag lagt in manuella regler för att komma tillrätta med de värsta svenska spammarna men det tar tid att få till filtreringsregler som bara tar bort den dåliga e-posten och det tillkommer hela tiden nya servrar och utskick.

Så därför ligger det nu 17 stycken svenska skäppostmeddeladen i mitt e-postprogram. Lite drygt ett om dagen.

Visst finns det gott om viktigare problem idag men det kan inte vara så svårt att anpassa lagen mot skräppost från något av de andra EU-länderna och banka igenom den i riksdagen. 
