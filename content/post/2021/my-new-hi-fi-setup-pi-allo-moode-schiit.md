---
title: "My new Hi-Fi setup, Raspberry Pi, Allo DigiOne, Moode and Schiit DAC"
slug: "my-new-hi-fi-setup-pi-allo-moode-schiit"
date: 2021-03-22T17:41:44+01:00
lastmod: 2021-03-22T17:41:44+01:00
author: "Fredrik Jonsson"
tags: ["hi-fi","music"]

---

Back in 2007 I wrote [My new Hi-Fi setup, Apple iTunes - AirPort Express - Musical Fidelity X-DAC V3](/post/2007/08/17/my-new-hi-fi-setup-apple-itunes-airport-express-musical-fidelity-x-dac-v3/). Time for an update.

Since around 2013 I have played music via an Apple TV connected to the DAC via Toslink (optical). The music is streamed from Apples servers so only 256 Kbps AAC. Using the Apple TV is easy and convenient but no lossless or hi res audio. Also the TV must be on.


## A new Raspberry Pi based streamer

Inspired by [Darko.Audio](https://darko.audio/) I started to look at to using a [Raspberry Pi](https://www.raspberrypi.org/) as a music streamer. I had a couple laying around from other projects, they are really fun to play with. I opted to use a Pi 3 Model B but this setup works equally well with a Pi 4 Model B.

Raspberry Pi audio outputs are poor sounding but there a number of companies that makes solutions for this via HAT boards (Hardware Attached on Top). You can get everything from optimised digital outputs to complete DAC and amplifiers.

Since I wanted to use an external DAC I started looking for a HAT with digital outputs. I picked the [Allo DigiOne](https://allo.com/sparky/digione.html) based on some [good](https://www.youtube.com/watch?v=8Iey5yKd-p4) [reviews](https://darko.audio/2017/08/allos-digione-pulls-five-star-sound-quality-from-the-raspberry-pi/). 

The Raspberry Pi then need some software to turn in it to a streamer. For the first few month I used [Volumio](https://volumio.org/) and it worked well. I then tested [Moode audio](https://moodeaudio.org/) to see if I liked the UI better. I find both UI unsatisfactory, mostly because they are both web based with all its drawbacks.

To my surprise I preferred the sounds of the Moode audio player. My assumption was that they would sound more or less identical since they both use [MPD](https://www.musicpd.org/) (Music Player Daemon). So Moode is what I'm using now.


### Audio quality

The Raspberry Pi/Allo DigiOne/Moode audio streamer sounds excellent. A definite step up from the Apple TV, and the TV no longer needs to be on. I happen to have more time to listen to music and I'm rediscovering pearls in my collection. So much fun!

If one want to go a step up, the [DigiOne Signature](https://allo.com/sparky/digione-signature.html) looks interesting. Getting new low noice power supplies can improve things as well.

For now I use Apple USB chargers that are good quality and relative low noice.


## Rigelian app for iOS and Mac

The UI issue was solved when I found the iOS and Mac app [Rigelian](https://www.rigelian.net/). A really nice app that works with any MPD or Kodi based player.

It is a pleasure to use and cost only €4 per year.


## Flic buttons

I have also set up a couple of [Flic buttons](https://flic.io/) for quick play/pause etc.

Configure a button to do an "Internet Request" and paste this in for a play/pause button.

~~~~
http://moode.local/command/?cmd=pause
~~~~


## Music storage

I have a copy of my music library on a local NAS (another Raspberry PI project). So I started with pointing Volumio/Moode to the NAS. This worked well but I have the drives spin down when inactive so the upstart time was a bit long.

I now have all the music on a large USB memory stick plugged in directly to the Pi. Simple and fast.

Moode audio makes the memory stick available over the network via SMB so easy to update the music library when I buy new music.


## A new Schiit DAC

I have replaced the old Musical Fidelity X-DAC V3 with a [Schiit Modi 3 DAC](https://www.schiit-europe.com/product/modi-3-affordable-do-all-dacs/). Mostly because I wanted something smaller to save space.

I really like the Schiit sound and for the price I think the Modi 3 is hard to beat.


## Conclusion

A significant improvement in audio quality for only around $250 (Modi 3 + DigiOne + case etc.) plus the Raspberry Pi I had laying around.

A fun project to do.