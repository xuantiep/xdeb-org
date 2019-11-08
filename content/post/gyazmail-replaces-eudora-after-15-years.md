---
title: "GyazMail replaces Eudora after 15 years"
date: 2010-03-11T21:32:08+01:00
lastmod: 2010-04-19T17:03:06+02:00
author: "Fredrik Jonsson"
tags: ["email","gyazmail","macOS","software","technology"]
aliases:
  - /node/1341/

---

{{< figure src="/images/gyazmail_logo.gif" width="150" class="right" alt="GyazMail" >}}
{{< figure src="/images/gyazmail_settings.png" width="400" class="right" alt="GyazMail preferences" >}}

I have been using Eudora as my mail client since 1995, except for a couple of years when I used Claris Emailer. This week I made the switch to [GyazMail](http://www.gyazsquare.com/gyazmail/).

(Also check out the followup [Two weeks with GyazMail](/node/1343)).

In 2006 Qualcomm announced that there would be no more development of the original Eudora client. I have on and off been looking for a replacement ever since. It is not easy to find a good replacement for Eudora.

Eudora does so many small things just right, has really fast search, can handle any amount of mail with ease and have settings for everything.

The last version of Eudora (6.2.4 from October 2006) still works on Mac OS X 10.5/10.6 with some minor problems. It is less rock solid than it used to be. You must run in under Rosetta since it's a PowerPC app and this makes it use substantially more RAM. Amazing that it still works as well as it does.

What Eudora lacks is good integration with Mac OS X and native Intel support. There are other things as well but these two are the big things for me.

Here are the clients I have looked at:

* Apple Mail is not bad but surprisingly week in many areas. You can only do rather simple filtering, slow when dealing with huge amount of mail and you are more or less stuck with the "three pane view" look etc. Excellent integration with the rest of Mac OS X is its strongest point.
* [Thunderbird](http://www.mozillamessaging.com/thunderbird/) in version 3 looks really good, the new search especially and the Mac OS X Addressbook integration. It does however not integrate very well with Mac OS X. No Services, use its own spelling system etc. Thunderbird use a lot of RAM also for some reason.
* [Mailsmith](http://mailsmith.org/) has truly excellent text editing and filtering but no IMAP support and it is slow.
* [GyazMail](http://www.gyazsquare.com/gyazmail/) is what I finally settled on. It is not perfect but the best I have found.

[Letters.app](http://twitter.com/lettersapp), the new project to build a really good mail client by Brent Simmons and John Gruber etc., is still only vaporware. I'm definitely keeping an eye on this one however.

Here are GyazMail strong points:

* Stable and fast
* Good Mac OS X integration (Address Book, Spelling, Services and AppleScript)
* Good filtering
* Use little RAM (70 MB on my Mac)
* Easy to set up the way you like (at least for me)

My wish list for GyazMail:

* Spotlight support
* A "Transfer" menu to easily move messages between mailboxes
* Better Folder and Message list navigation via keyboard
* Option to view HTML formatted mail in plain text ("Hide HTML content" is a slightly different function)
* Unified Inbox and Trash
* A Rule that checks if the senders address is one of the addresses on a specified contact in the Address Book. Many people use more than one address today so it would be nice to have one rule per person instead of one per address.
* Option to place cursor after cited text when replying (have fixed this myself with the help of [Keyboard Maestro](http://www.keyboardmaestro.com/)).

GyazMail can only send plain text mail, so no pink text on yellow background. Some may see this as a problem but for me it's just the way I like it. It can display HTML-formatted mail you receive just fine.

Chuck Goolsbee, another long time Eudora user, mentioned on the Eudora-Mac list that he had switch to Gyazmail and that made me look at it more closely. He has written on his blog about it, [Gyazmail from Eudora « chuck.goolsbee.org](http://chuck.goolsbee.org/archives/category/technology/gyazmail-from-eudora).

## How I made the switch from Eudora to GyazMail

First step is to use the excellent [Eudora Mailbox Cleaner](http://homepage.mac.com/aamann/Eudora_Mailbox_Cleaner.html) to export all mail to Apple Mail and all addresses to the Address Book.

In GyazMail you create a "Local" account, this is the same as "On my Mac" in Apple Mail. Then use the command "File -> Import -> Mail…" to import all your old mail in to the "Local" account. I now have all my old mail in GyazMail with the folder structure etc. intact.

GyazMail use the Address Book in Mac OS X so that should just work.

The Rules you will need to set up from scratch. A lot of work but see it as a chance to get a good clean system in place. The accounts and signatures must be set up again as well but that is a smaller problem.

To finish it off go through the settings to make GyazMail work the way you like.

I already feel quite comfortable with GyazMail. If Goichi Hirakawa, the developer, implements some of the things on my wish list GyazMail has the potential to be even better than Eudora.

