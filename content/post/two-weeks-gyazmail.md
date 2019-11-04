---
title: "Two weeks with GyazMail"
date: 2010-03-28T19:57:05+02:00
lastmod: 2010-04-12T17:51:08+02:00
author: "Fredrik Jonsson"
tags: ["email","gyazmail","macOS","software","technology"]
aliases:
  - /node/1343/

---

{{< figure src="/images/gyazmail.png" width="128" class="right" alt="GyazMail" >}}

This is a followup to [GyazMail replaces Eudora after 15 years](/node/1341). I have now used [GyazMail](http://www.gyazsquare.com/gyazmail/) for two weeks and it's working well but has room for improvement.

### What I really like with GyazMail

GyazMail is rock solid and fast, it feels like software I can depend upon. It uses only 50-60 MB RAM in everyday use! The developer Goichi Hirakawa must be an excellent coder to pull this off!

The Mac OS X integration with Address Book, Spelling, Services and AppleScript is working very well. Excellent integration with [SpamSieve](http://c-command.com/spamsieve/), one of the best client side spam filtering solutions there is.

Additional things to like in GyazMail is filtering, settings options and the ability to change/add shortcuts to commands.

### Where I find GyazMail lacking

The search is slow, not incremental and to search multiple folders you must select them manually first. Spotlight support would fix all this.

Users need to use the mouse to much. I have four mail accounts and I filter my mail to multiple folders. To get an overview of my mail it feels like I have to click around a lot.

Then there are a lot of small things that I miss from Eudora. Format Flow support when replying to mail. Option clicking to sort on any content. The way you can easily differentiate incoming and outgoing mail in the same folder. That each folder opened in its own window. Holding down Shift when opening the filters window shows what filters the selected mail matches.

### My updated wish list for GyazMail

1. Spotlight support
2. Smart folders or at least some special folders like "Flagged" and "Unread"
3. Format Flow support when replying to messages (now only support incoming messages)
4. Unified Inbox and Trash
5. A "Transfer" menu to easily move messages between mailboxes
6. Make "Next unread message" command walk through all folders
7. A Rule that checks if the senders address is one of the addresses in a specified contact in the Address Book. Many people use more than one address today so it would be nice to have one rule per person instead of one per address
8. Use same commands as the Finder for Message list keyboard navigation
9. Option to place cursor after cited text when replying
10. Option to view HTML formatted mail in plain text ("Hide HTML content" is a different function)

Goichi Hirakawa has shown interest in the feedback I have sent him so I'm hopeful. I also know that GyazMail is a hobby project and that he is the single developer.

### Fixing some GyazMail shortcomings

I have used [Keyboard Maestro](http://www.keyboardmaestro.com/) to map Commando + R to a makro that reply to a mail and then places the cursor after the quoted text with an empty line in between. Read about what I use Keyboard Maestro and other automation software for in [It's all about fewer keystrokes](/node/1164).

While poking around inside the GyazMail package I found this file "GyazMail.app/Contents/Resources/userStyleSheet.css". It turns out that this CSS file is loaded on viewing mails. By putting the following code there I have made all HTML mails a lot more readable.

~~~~
body {
  color: body-color !important;
  background: body-background-color !important;
}

p, p span,
div, div span {
  color: body-color !important;
  font-family: "Lucida Grande" !important;
  font-size: 11px !important;
  font-weight: normal !important;
  line-height: 14px  !important;
}
a, a span {
  color: link-color !important;
  text-decoration: link-text-decoration !important;
}
a:hover {
  text-decoration: underline !important;
}
~~~~

So all in all I'm happy with GyazMail and I recommend other who is looking for a new e-mail client to seriously consider it.

What I find surprising is that there are so few good e-mail clients to choose from. Is Apple Mail "good enough" and has killed the market?

