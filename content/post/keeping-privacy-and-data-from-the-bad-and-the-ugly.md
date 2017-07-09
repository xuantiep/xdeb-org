---
title: "Keeping my privacy and data from the bad and the ugly"
date: 2017-07-08T22:23:52+02:00
lastmod: 2017-07-08T22:23:52+02:00
author: "Fredrik Jonsson"
tags: ["technology","security", "macOS", "iphone"]
draft: true

---

In order of importance, in my personal opinion.

## Backups and encrypted disks

The importance of good backups can not be overstated. You need more than one and you need to test that retrieving data from them really works. All your disks, main disk as well as all backups need to be encrypted.

When you set a password for your iOS device they get encrypted, and Apple strongly urge you to do this when you set up a new device. Apple strongly suggest macOS users to use FileVault to encrypt disk on a Mac. FileVault can easily be activated for extra disk, just right click and select the encryption command.

I do three different backups. First one backup with the built in Time Machine to a local disk on the network, second a online backup to Amazon S3 with the excellent Arq program and third a clone (rotating disks) with Carbon Copy Cloner (CCC).

Time Machine runs every hour as long as I'm connected to my home network. Arq runs every hour as long as I'm connected to the Internet. Lastly I clone my main disk with Carbon Copy Cloner about once a week and before travel/upgrades.

Two of the backups, Time Machine and Arq, are set up and forget. This is vital I believe, backups are done automatically or not at all in my experience.

* [Apple Time Machine](https://support.apple.com/en-us/HT201250)
* [Arq Backup](https://www.arqbackup.com/)
* [Carbon Copy Cloner](https://bombich.com/)

## Keep all software updated

Updated systems has far less security problems. When Apple or Microsoft suggest an update just do it.

## Unique and long passwords for each site/service

This is well known and with built in technology like Apples Cloud Keychain it's easy and secure. Just use it.

If you need something more advanced than Keychain there are a multitude of services.

* [I have switched to pwSafe password manager and liking it so far – xdeb.org](/post/2016/01/20/i-have-switched-to-pwsafe-password-manager-and-liking-it-so-far/)

## Set good passwords on routers and web cameras

This goes for everything connected to the Internet.

Old routers should most likely be replaced with more modern version. Faster and more secure. Pick some bigger brand like Ubiquiti or Netgear since they are more likely to release firmware updates when needed.

I now use Apple Airports but they seem unfortunately to have stopped developing them so my next router will likely be from Ubiquiti.

* [AmpliFi Wi-Fi](https://www.amplifi.com/) (Ubiquiti for home users)

## Not using social media sites

I do not like social media, nor do I think it's good for anyone in the long run. At best it's a waste of time and attention, at the worst it's private monopolies manipulating people and society for shortsighted profit.

Since I will not convince anyone anyway I leave it at that.

## Block ads and trackers

There is noting wrong with advertising as a principal. Today however it has become a quagmire of privacy invasive trackers that makes the web insecure, slow and ugly.

Blockers like Firefox Focus and Ghostery makes the web usable again.

* [Firefox Focus](https://support.mozilla.org/en-US/kb/focus) (iOS)
* [Ghostery](https://www.ghostery.com/) (macOS)

## Use Apples devices and services

Among the large tech companies Apple is without a doubt the one most committed to user privacy and security. It seems that Apples top executives truly believes in it. And it's made a lot easier by the fact that Apple gets its money from the users directly and not from advertisers like many others.

In our family we use iMessage, FaceTime and Photo streams almost exclusively to communicate. It's secure, private, built in and it just works.

## Use Signal with non Apple users and customers

Most likely the most secure way to communicate today. May look a bit plain but it's easy to use for anyone and works really well for text, voice and video.

Perfect for communicating with people that use Android.

* [Signal | Open Whisper Systems](https://whispersystems.org/)

## Search with DuckDuckGo

DuckDuckGo is good and don't track you. When you need Google it's only a "!g" away.

* [DuckDuckGo](https://duckduckgo.com/)

## Run your own mail server

I run my own mail server since many years and if you know how it's a good and cheep option. My family and people in our company have accounts here so mail between us stays on the server (TLS only). The server host mailing lists for the company, family, friends and neighbours. I know mailing lists are out of fashion but that doesn't stop them from being useful.

For most people a e-mail service like Runbox, FastMail or ProtoMail, to name a few, is most likely a better option.

Free options like Gmail and Outlook are not horrible but I prefer to pay with money for my services. They tend also not to be standard compliant.

I have been using e-mail for 20+ years and it's still my preferred way of communication.

#### If you run your own server

* [My first 2 minutes on a server - letting Ansible do the work – xdeb.org](/post/2016/06/23/my-first-2-minutes-on-a-server---letting-ansible-do-the-work/)
* [Dovecot](https://dovecot.org/), this is the imap server to use.
* [The Spamhaus Project - ZEN](https://www.spamhaus.org/zen/), plug this in to postfix and most spam is gone.
* [Email Protection - Spam and Virus Filtering Services](https://www.mailroute.net/)
* [Mail relay, MX backup och skräppostfilter | xdeb.net](https://xdeb.net/mailrelay) (this is my own service, build your own with the Ansible roles below)
* [frjo/ansible-roles](https://github.com/frjo/ansible-roles)

#### Mail providers

* [Runbox](https://runbox.com/) (Norway)
* [ProtonMail](https://protonmail.com/) (Switzerland)
* [FastMail](https://www.fastmail.com/) (USA)

#### Mail clients

Most people use a web client and/or whatever client comes with their device.

If you want something more and use macOS then MailMate is for you.

* [MailMate](https://freron.com/)
* [MailMate replaces GyazMail after four years – xdeb.org](/post/2014/05/16/mailmate-replaces-gyazmail-after-four-years/)
* [MailMate - The email client for the rest of us – xdeb.org](/post/2015/01/30/mailmate---the-email-client-for-the-rest-of-us/)

#### PGP

PGP does not make mail secure, only the content inside the mail. It's difficult and cumbersome to set up and use. Been using PGP since 1996 so I know.
