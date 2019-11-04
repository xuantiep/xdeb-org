---
title: "The dog is running again - I\'m back with Fetch"
date: 2007-06-22T01:02:23+02:00
lastmod: 2012-07-22T13:28:38+02:00
author: "Fredrik Jonsson"
tags: ["macOS","sftp","technology"]
aliases:
  - /node/776/

---

{{< figure src="/images/fetch_icon.png" width="128" class="right" alt="fetch icon" >}}

The first Internet application I ever used was [Fetch](http://www.fetchsoftworks.com/), a FTP-client for the Mac. This was in the early 1990s, before the web. The IT-staff at the University showed me how to use it for downloading shareware and freeware from Info-Mac and other places.

The first version of [Fetch](http://en.wikipedia.org/wiki/Fetch_%28FTP_client%29) (Wikipedia link) was released 1989. When we are talking about Internet applications that is maybe not ancient but certainly very old.

When I started to make homepages in 1995 I used Fetch to upload the HTML files and images to the web server. This continued up until around 2001-2002 when security aspects made me want to move from the FTP protokoll to encrypted connections with SFTP/SCP.

By this time I was running Mac OS X and had easy access to the commandline OpenSSH. I used different script to upload and download files via SCP. It worked but I missed a GUI.

It was then that I found some early version of [Fugu](http://rsug.itd.umich.edu/software/fugu/). A really nice open source GUI for SFTP/SCP with good support for SSH keys and ssh-agent. I used it for many years but unfortunately development stopped in 2006. A Intel-version was released but it has a number of bugs, editing remote files don't work e.g. and that makes it almost useless for me.

The PowerPC version worked on my new Intel-Mac but it was a bit slow and used more memory since in must run under Rosetta emulation. I therefor moved to [Cyberduck](http://cyberduck.ch/), a open source browser for FTP and SFTP.

I like Cyberducks interface a lot! I would still willingly use it if it was not for two big drawbacks. The biggest problem is that it is slow, I mean really slow! Slow interface and slow transfers. The other problem is that it doesn't support ssh-agent so you need to enter the password for your keys every time (unless you save it in your keychain).

Now I'm back with Fetch, it nowadays have support for SFTP as well as SSH keys and ssh-agent. I got a new licens for upgrade price, nice. It feels as solid and stabil as ever!

I use [Keychain](http://www.gentoo.org/proj/en/keychain/) from Gentoo Linux as a front-end to ssh-agent. Convenient and secure, warmly recommended. Applications that you launch in the Finder can't see the normal shell variables, like the ones ssh-agent sets. There are ways to include them in ~/.MacOSX/environment.plist, that the Finder can read, but I find it easier to just start the application via the shell itself instead. 

Here is the script I use and a way to wrap it up and make in look and act as a Finder application.

~~~~
#!/bin/sh
# Open Fetch via the shell so it gets access to ssh-agent.

source ~/.keychain/${HOSTNAME}-sh
open /Applications/Fetch.app
~~~~

Save it as "FetchStart.sh" and then do this. 

~~~~
mkdir -p FetchStart.app/Contents/MacOS
mv FetchStart.sh FetchStart.app/Contents/MacOS/FetchStart
chmod +x foo.app/Contents/MacOS/FetchStart
~~~~

I found this metod in a comment to [Another way to create Finder-clickable shell scripts](http://www.macosxhints.com/article.php?story=20030728055235121) on macosxhints.com.

Do a show info on the Fetch.app and new FetchStart.app and copy over the icon so it looks nice.

