---
title: "Protecting my privacy and data from the bad and the ugly"
slug: "protecting-my-privacy-and-data-from-the-bad-and-the-ugly"
date: 2018-05-03T14:44:53+02:00
lastmod: 2018-05-03T14:44:56+02:00
author: "Fredrik Jonsson"
tags: ["technology","security", "macOS", "iphone"]
draft: true

---

In order of importance, in my personal opinion.

## Backups and encrypted disks

The importance of good backups can not be overstated. You need more than one and you need to test that retrieving data from them really works. All your disks, main disk as well as all backups should to be encrypted.

When you set a password for your iOS device they get encrypted, and Apple strongly urge you to do this when you set up a new device. Apple also strongly suggest that macOS users activate FileVault to encrypt disk on a Mac. FileVault can easily be activated for extra disk, just right click and select the encryption command.

I do three different backups. First one backup with the built in Time Machine to a local disk on the network, second a online backup to Amazon S3 with the excellent Arq program and third a clone (rotating disks) with Carbon Copy Cloner (CCC).

Time Machine runs every hour as long as I'm connected to my home network. Arq runs every hour as long as I'm connected to the Internet. Lastly I clone my main disk with Carbon Copy Cloner about once a week and before travel/upgrades.

Two of the backups, Time Machine and Arq, are set up and forget. This is vital I believe, backups are done automatically or not at all in my experience.

Another online backup option that people I know use and like is Backblaze.

* [Apple Time Machine](https://support.apple.com/en-us/HT201250)
* [Arq Backup](https://www.arqbackup.com/)
* [Carbon Copy Cloner](https://bombich.com/)
* [Backblaze](https://www.backblaze.com/)

## Keep all software updated

Updated systems has far less security problems. When Apple or Microsoft suggest an update just do it.

Bigger upgrades like from macOS 10.13 to 10.14 one does not need to rush into. I normally wait for the 10.x.1 release.

## Unique and long passwords for each site/service

This is well known and with built in technology like Apples Cloud Keychain it's easy and secure. Just use it.

If you need something more advanced than Keychain there are a multitude of services.

* [I have switched to pwSafe password manager and liking it so far – xdeb.org](/post/2016/01/20/i-have-switched-to-pwsafe-password-manager-and-liking-it-so-far/)

## Set good passwords and update firmware on routers and web cameras

This goes for everything connected to the Internet.

Old routers should most likely be replaced with more modern version. Faster and more secure. Pick some bigger brand like Ubiquiti or Netgear since they are more likely to release firmware updates when needed.

I now use Apple Airports but they seem unfortunately to have stopped developing them so my next router will likely be from Ubiquiti.

* [AmpliFi Wi-Fi](https://www.amplifi.com/) (Ubiquiti for home users)

## Not using social media

I do not like social media, nor do I think it's good for anyone in the long run. At best it's a waste of time and attention, at the worst it's private monopolies manipulating people and society for shortsighted profit.

Since I will not convince anyone anyway I leave it at that.

## Block ads and trackers

There is as a principal nothing wrong with advertising. Today it has however become a quagmire of privacy invasive trackers that makes the web insecure, slow and ugly.

Blockers like Firefox Focus and Ghostery makes the web usable again.

* [Firefox Focus](https://support.mozilla.org/en-US/kb/focus) (iOS)
* [Ghostery](https://www.ghostery.com/) (macOS)
* [uBlock Origin](https://github.com/gorhill/uBlock) (multi plattform)

## Use Apples devices and services

Among the large tech companies Apple is without a doubt the one most committed to user privacy and security. It seems that Apples top executives truly believes in it. And it's made a lot easier by the fact that Apple gets its money from the users directly and not from advertisers like many others.

In our family we use iMessage, FaceTime and Photo streams almost exclusively to communicate. It's secure, private, built in and it just works.

## Use Signal with non Apple users

Most likely the most secure way to communicate today. May look a bit plain but it's easy to use for anyone and works really well for text, voice and video.

Perfect for communicating with people that use Android.

* [Signal | Open Whisper Systems](https://whispersystems.org/)

## Search with DuckDuckGo

DuckDuckGo is good and don't track you. When you need Google it's only a "!g" away.

* [DuckDuckGo](https://duckduckgo.com/)

