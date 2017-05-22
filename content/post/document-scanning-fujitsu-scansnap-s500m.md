---
title: "Document scanning with Fujitsu ScanSnap S500M"
date: 2007-03-15T16:48:50+01:00
lastmod: 2007-03-19T09:39:38+01:00
author: "Fredrik Jonsson"
tags: ["automator","document","mac os x","scanner","technology"]
aliases: ["node/728"]

---

{{< figure src="/images/scansnap_s500m.jpg" width="400" class="right" alt="scansnap s500m" >}}
{{< figure src="/images/automator_workflow_example.png" width="400" class="right" alt="automator workflow example" >}}

The paperless office is not here yet but the [Fujitsu ScanSnap S500M](http://www.fujitsu.com/global/services/computing/peripheral/scanners/product/s500m/) can be a good step in the right direction. This is the Mac version of the S500 modell, it's only the colour and the software that are different.

I needed some way to get a lot of pappers in to my computer as PDFs. After researching on the web I desided to get a Fujutsi ScanSnap, that was what other Mac users was recommending. I ordered the latest modell, the S500M, from [TECHNIKdirekt.de](http://technikdirekt.de/).

Update 2007-03-19: The [Swedish Apple Store](http://www.apple.com/swedenstore/) sell this scanner even cheaper than TECHNIKdirekt and they include ReadIris Pro 11. Reminder to self, always check the Apple Store first!

It's smaller than I imagined and feels well built. It even looks quite OK, not like an Apple product but above average. When you open the lid it turns on automatically.

The software installation is quick and easy. You end up with the "ScanSnap Manager" and a small "RegistScanSnap" application. ScanSnap Manager is Universal (Intel support) and seems to behave nicly so it should be no problem leaving it running all the time.

Acrobat 7 Standard is also included but I have not installed it. If I want to use it I will first upgrade it to version 8 that has a much better user interface and is Universal (Intel support).

Time for the first test. I made sure ScanSnap Manager was running, grabbed three papers from my desk, put them in the scanner and pressed the "Scan" button on the scanner.

It's really fast, that was my first surprice. The second surprice was that the resulting PDF had four pages. The scanner had automatically detected that one of the pappers had text on two sides and done the right thing. My guess is that the scanner really scans both sides of all pages but the software is smart enough to remove the empty ones. A really neat function!

The quality with the default settings is low. After some testing I settled on image quality "Better (Faster)" and compression "Normal (3)". That results in 200 dpi scans and it's still fast.

For my first project I need some way to set up a workflow. Name file, move to folder, send via e-mail to these addresses and similar steps. [ScanTango](http://www.scantango.com/) does this and a lot of other things. It works well but it's a bit complicated to set up and the price was a little high for this project.

I was instead able to to all I needed with [Automator](http://www.apple.com/macosx/features/automator/) that is part of Mac OS X 10.4. I use AppleScript a lot but this was the first time I seriously used Automater. It was easy to set up actions that renamed the PDF, marked it (so I know it has been processed) and e-mail it to the addresses I wanted.

[DEVONthink](http://www.devon-technologies.com/products/devonthink/) Pro Office looks like the perfect companion to this scanner. I use DEVONthink Pro myself a lot and the Office version adds OCR (makes the PDFs searchable) and some other advanced features. I will probably upgrade soon.

Make sure you have the latest [Mac OS X drivers for ScanSnap](http://www.fujitsu.com/global/support/computing/peripheral/scanners/drivers/5110eoxm.html). The page only mention the older ScanSnap fi-5110EOXM but the driver is also for the S500M.

So far I'm more than pleased with the ScanSnap scanner. I add some more information here when I have used it for some time.

