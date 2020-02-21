---
title: "MailMate replaces GyazMail after four years"
slug: "mailmate-replaces-gyazmail-after-four-years"
date: 2014-05-16T09:15:05+02:00
lastmod: 2016-05-18T09:15:11+02:00
author: "Fredrik Jonsson"
tags: ["email","mailmate","macOS","software","technology"]
aliases:
  - /node/1608/

---

{{< figure src="/images/mailmate.png" width="400" class="right" alt="MailMate logo" >}}

Four years ago I replaced Eudora with GyazMail and wrote about it in [GyazMail replaces Eudora after 15 years](/node/1341) and [Two weeks with GyazMail](/node/1343).

Now [GyazMail](http://gyazsquare.com/gyazmail/) has been replaced with [MailMate](https://freron.com/).

After moving all my locally stored mail to a local IMAP server switching mail client got a lot easier. See my blog [Running dovecot as a local only IMAP server on OS X](/node/1607).

GyazMail is a very solid and stable application. I have had very few issues with it for the last four years, it just works. There are however a number of features I have been missing more and more.

With MailMate I get:

* Fast and powerful search
* Smart folders (really smart!)
* Rules per folder/smart folder.
* Custom key bindings (everything can be done from the keyboard)
* Unified Inbox, Sent, Draft, Archive, Trash and Junk.
* Format Flow support when replying to mail.
* OpenPGP integration.
* Markdown support.
* Write e-mail in your favourite editor. (I wrote my own [bundle for BBEdit](https://github.com/frjo/mailmate-bundles))
* Integrate with todo lists etc.
* [SpamSieve](https://c-command.com/spamsieve/) integration.

MailMate is *the* e-mail client for power users in my opinion.

With MailMate I use smart folders extensively and just archive all mails in one "Archive" mailbox instead.

I have set up my own key bindings so "i" will select the inbox, "a" will archive mail, "d" will delete them, "f" flag them and "r" for making a reply. This takes care of most of my mail interaction. See all my key bindings below.

The development of MailMate is active to put it mildly. I'm running nightly builds and have activated "Experimental 2.0 features". The application crash about ones a day on average. Nothing bad has happened however, just need to restart. The official releases are of course more stable but also less fun.

With some 60000+ mails MailMate performs perfectly ok, search is really fast. It does use up quite a lot of RAM, some 300+ MB. The developer, Benny Kjær Nielsen, has mentioned that he will trim both performance and resource use after he got all the 2.0 functionality in place.

Besides som nitpicks there are one feature I currently miss in MailMate and that is interaction between contacts (especially groups) in OS X and smart folders. I would e.g. like to be able to set up smart folders for a mail that are to/from the people in a contact group. This is on the todo list according to Benny.

So if you are looking for a better e-mail client do check out [MailMate](https://freron.com/). If you are any kind of power users I think you will like it and it only cost 50 USD.


File: `~/Library/Application Support/MailMate/Resources/KeyBindings/Mycustom.plist`

~~~~
{
  // Custom keybindings for Mailmate

  " " = "scrollPageDownOrNextUnreadMessage:"; // Space
  "n" = "newMessage:";
  "r" = "replyAll:";
  "o" = "openMessages:";
  "z" = "undo:";

  "s" = ( "goToMailbox:", "ALL_MESSAGES", "mailboxSearch:" );
  "/" = "mailboxSearch:";

  "a" = "archive:";
  "d" = "deleteMessage:";
  "m" = "moveToMailbox:";

  "k" = "toggleReadState:";
  "f" = "toggleFlag:";
  "h" = "toggleMuteState:";

  "j" = ( "markAsJunk:", "moveToJunk:" );
  "J" = ( "markAsNotJunk:", "archive:" );

  "c" = "showCorrespondence:";
  "e" = "showThread:";

  // Set focus.
  "v" = ( "makeFirstResponder:", "mailboxesOutline" );
  "b" = ( "makeFirstResponder:", "mainOutline" );

  "i" = ( "goToMailbox:", "INBOX", "makeFirstResponder:", "mainOutline" );
  "g" = {
    "g" = "goToMailbox:";
    "a" = ( "goToMailbox:", "ARCHIVE", "makeFirstResponder:", "mainOutline" );
    "d" = ( "goToMailbox:", "DRAFTS", "makeFirstResponder:", "mainOutline" );
    "f" = ( "goToMailbox:", "FLAGGED", "makeFirstResponder:", "mainOutline" );
    "j" = ( "goToMailbox:", "JUNK", "makeFirstResponder:", "mainOutline" );
    "m" = ( "goToMailbox:", "ALL_MESSAGES", "makeFirstResponder:", "mainOutline" );
    "s" = ( "goToMailbox:", "SENT", "makeFirstResponder:", "mainOutline" );
    "t" = ( "goToMailbox:", "TRASH", "makeFirstResponder:", "mainOutline" );
  };

  "t" = {
    "f" = ( "setTag:", "Family" );
    "v" = ( "setTag:", "Friend" );
    "c" = ( "setTag:", "Customer" );
    "w" = ( "setTag:", "Work" );
  };

  // In composer.
  "^i" = "showIdentities:";
  "^s" = "showSignatures:";

}
~~~~

