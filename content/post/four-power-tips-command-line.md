---
title: "Four power tips for the command line"
date: 2010-09-07T23:18:16+02:00
lastmod: 2010-11-25T10:46:29+01:00
author: "Fredrik Jonsson"
tags: ["bash","bazaar","cli","ssh","terminal","development"]
aliases:
  - /node/1390/

---

{{< figure src="/images/terminal.png" width="400" class="right" alt="The Terminal.app logo." >}}

This post assumes that you are familiar with the unix command line. If you are not then I recommend the video from Addison Berry session "[The command line is your friend](http://www.archive.org/details/TheCommandLineIsYourFriend)" from DrupalCon Copenhagen 2010.

I have something of a passion/obsession with removing annoying obstacles in my every day tasks. I want good tools that are adapted to the way I like to work. Here follow my best tips for making the command line a pleasant place to get work done.

I'm using Debian GNU/Linux 5 Lenny and Mac OS X 10.6 Snow Leopard. If there are any differences between them I will mark it out. Ubuntu users, and most other Linux distributions, should have no problems using the tips. Windows users could try with [Cygwin](http://www.cygwin.com/) but it's a lot easier to just get with the time and switch OS.


### 1. The Bash command line history at your service

Nothing saves me time and frustration like a properly configured Bash command line history.

The most common use is to scroll back through your command history via the up/down arrows. By default only the last 500 commands are in the history and you search it with "ctrl+R". This is to little and to cumbersome. There is a simple way to make the history search function also work via the up/down arrows.

The result is that pressing the up arrow will work just as normal unless you have start typing something. Say you type "drush", if you then hit the up arrow you will automatically search the history for commands starting with "drush". Neat indeed!

Then lets extend the history to something like the last 50000 commands, make it ignore duplicated and some common short aliases/commands and lastly make it work with multiple shells. Now you have a truly useful Bash command line history at your service.

Add the following to your `~/.bashrc` file to make the magic happen:

~~~~
# Settings for history function
export HISTFILESIZE=50000
export HISTSIZE=50000
export HISTCONTROL=ignoreboth:erasedups
export HISTIGNORE='\&:e:c:l:ca:cd:cd -'

# Make history work well with multiple shells
# append to the history file, don't overwrite it
shopt -s histappend

# Bind up/down arrow to history search
bind '"\e[A":history-search-backward'
bind '"\e[B":history-search-forward'
~~~~


### 2. Let Keychain handle your SSH keys - easy and secure

SSH keys is a convenient and secure way to log in to a remote server. I routinely disable password authentication and only allow SSH keys on my own server. Many instructions for SSH keys recommend giving the private key an empty password, as this one from an O'Reilly book [Quick Logins with ssh Client Keys](http://oreilly.com/pub/h/66).

An empty password is convenient, you can log in without any password, use ssh commands in scripts that runs unattended etc. I am not comfortable with this solution! It's to easy to loos ones laptop/USB stick, or what you keep your private key on, and with no SSH key password there is an open road to all your servers.

For me strong passwords are a must on SSH keys, like everywhere else. Luckily there are a number of SSH key management solutions (front ends to ssh-agent) that combines security with convenience. The one I have used for many years is [Keychain](http://www.funtoo.org/en/security/keychain/intro/). The link goes to the "Introduction to Keychain" page where have everything you need to get it up and running. (Don't confuse it with the built in Keychain feature in Mac OS X.)

Keychain asks me for my SSH key password when I start my Terminal and then stores it until I reboot the machine. Everything that is executed on the command line, including scripts, will not need the SSH key password to run SSH commands.

On Mac OS X the "Keychain Access.app" has support for ssh-agent and you can keep your SSH key passwords in it. I however prefer the way Keychain works. One problem with Keychain on Mac OS X is that GUI apps will not automatically be able to make use of it. I solve it by launching BBEdit, Sequel Pro and other apps that make use of SSH via the shell.

~~~~
open ~/Applications/Sequel\ Pro.app
~~~~

I wrap that up as a "Sequel Pro Start.app" that I can launch as any other app.


### 3. A bunch of useful Bash aliases

Fewer keystrokes makes for a happy developer and with Bash aliases you can save many keystrokes.

With aliases you take a long/complicated command and alias it to something short and easy to type and remember. Below is the command that list files the way I like. Long format, human readable file sizes, show dot files, append indicator, colour and control chars.

~~~~
ls -lhaF --color=auto --show-control-chars
~~~~

Thanks to an alias I only need to type "l" to get the list I want. Here follow how you set it up. There are many places that you can put your aliases. Debian and Ubuntu recommend a separate file `~/.bash_aliases` and that is what I use.

Uncomment or add the following somewhere in your `~/.bashrc` file.

~~~~
if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi
~~~~

Then create (or open) the `~/.bash_aliases` file and put all your aliases there. Remember that you need to source it for changes to take effect.

~~~~
source ~/.bash_aliases
~~~~

We start off with some simple stuff. Making moving around and finding out where you are easier. Make rm, cp and mv interactive to avoid stupid mistakes. When I log in to a server for the first time I immediately install my `~/.bash_aliases` file, without it I'm lost.

~~~~
alias .='pwd'
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias .....='cd ../../../..'
alias .....='cd ../../../../..'
alias cd..='cd ..'
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
alias l='ls -lhaFG'
alias ll='ls -lhaF | less'
alias lt='ls -lhatFG'
alias llt='ls -lhatF | less'
alias c='clear'
alias e='exit'
alias tx='/usr/bin/gnutar -xvzf'
alias tc='/usr/bin/gnutar -cvzf'
~~~~

On Debian and Ubuntu listing files in colours with some extra information is a little different, see below, from Mac OS X (or more precisely *BSD), see above.

~~~~
alias l='ls -lhaF --color=auto --show-control-chars'
alias lt='ls -lhatF --color=auto --show-control-chars'
~~~~

SSH login aliases are really convenient, especially when combined with the SSH key tips above. Here I have added the clear command before and after the SSH login itself. This will clear the terminal window giving me a fresh start. A small thing but the small things add up during long workdays.

~~~~
alias sshc1='clear; ssh user@customer1.com; clear'
alias sshc2='clear; ssh user@customer2.com; clear'
alias sshc3='clear; ssh user@customer3.com; clear'
~~~~

Here are some of my most used aliases for Bazaar. The Bazaar command is "bzr", three characters I would have to type many times every day. Not good, with the first alias I just have to type "b" instead. The last three pipes the output to my text editor BBEdit. Typing, and remembering, all that is cumbersome, with a few aliases it becomes easy and quick.

~~~~
alias b='bzr'
alias bci='bzr ci -m'
alias bst='bzr status'
alias bde='bzr diff | bbedit --clean --view-top --pipe-title Diff.patch'
alias bse='bzr status | bbedit --clean --view-top --pipe-title Status'
alias blo='bzr log | bbedit --clean --view-top --pipe-title Log'
~~~~

(Git and Bazaar users, don't miss the alias feature in `~/.gitconfig` and `~/.bazaar/bazaar.conf`.)

Finally I have an alias to edit the alias file. It opens my text editor BBEdit, tells it to wait for the file to be closed and when it is closed source the file to activate any changes it in.

~~~~
alias realias='bbedit --wait ~/.bash_aliases; source ~/.bash_aliases'
~~~~



### 4. Send remote commands via SSH

Via site aliases Drush can send remote commends to other servers. Here is how you can do it yourself with any command.

The principal is easy:

~~~~
ssh user@host 'command that you want to send'
~~~~

Here I have made an alias of the command to update a Bazaar checkout of a web root on a server. Notice that the format for this alias is a bit different, it defines a shell function. Use it for more complicated aliases and when you need to pass in arguments. Put it in `~/.bash_aliases` with all the other aliases.

~~~~
bus1 () {
  ssh user@customer1.com 'bzr update /var/www/site1'
}
~~~~

Do this for all the common commands that you need to run on your servers. When combined with the SSH key tips above it makes running commands on your server a breeze.

There you have them, my four power tips for the command line.

