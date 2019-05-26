---
title: "Hugo beginner tutorial static site with zen theme"
date: 2019-05-25T20:21:18+02:00
lastmod: 2019-05-25T20:21:18+02:00
author: "Fredrik Jonsson"
tags: ["hugo","web","development"]
draft: true

---

In this tutorial I will show how set up a simple blog site with the static site generator [Hugo](https://gohugo.io/) and my own [Zen theme for Hugo](https://github.com/frjo/hugo-theme-zen). I will assume you are using a Unix based system like macOS, a Linux distro or a BSD variant. In Windows you can use the Windows Subsystem for Linux (WSL).


## What you will need

### A Terminal

Hugo is a command line application so you need to run commands in a Terminal. Unix based systems have a Terminal built in.

For Windows you can install the Windows Subsystem for Linux (WSL), [Install Windows Subsystem for Linux (WSL) on on Windows 10](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

If you are new to the command line start with [Introduction to command line · Django Girls Tutorial](https://tutorial.djangogirls.org/en/intro_to_command_line/).


### Hugo installed on your computer

Instructions at [Install Hugo](https://gohugo.io/getting-started/installing).

Make sure you get the extended version that has sass support. For most plattforms that is the default option.

Make sure Hugo is installed and working by running this command.

~~~~
hugo version
~~~~

The response should show you the version installed, confirm that it is the extended. version.


## Where to install your site

All files you work on should be in your home directory. In most cases a new Terminal window will open up in the logged in users home directory. To make sure you can do a change directory command (cd) without any options. It will always move you to your home directory.

~~~~
cd
~~~~

To check what directory you are in, issue the print working directory command (pwd).

~~~~
pwd
~~~~

It will return `/home/yourusername` on Linux and `/Users/yourusername` on macOS to give two examples.

To see what is inside your home directory you issue the list command (ls).

~~~~
ls
~~~~

In your home directory you create all the directories you need for your files. For this tutorial I suggest putting all your web sites inside a "Sites" directory.

On macOS this already exists by default, on Linux it's easy to crate with the make directory command (mkdir).

~~~~
mkdir Sites
~~~~

Move in to the Sites directory with the change directory command (cd).

~~~~
cd Sites
~~~~

Issue the print working directory command (pwd).

~~~~
pwd
~~~~

It should return `/home/yourusername/Sites` on Linux and `/Users/yourusername/Sites` on macOS.

You are now ready to create your first Hugo site.


## Setting up a new site

While in the "Sites" directory run the hugo new site command and give the name of the site you want to create. I suggest you for this tutorial uses "zentutorial".

~~~~
hugo new site zentutorial
~~~~

Move in to the newly create site with.

~~~~
cd zentutorial
~~~~

List the content with.

~~~~
ls
~~~~

It will show the following.

~~~~
archetypes
content
data
layouts
static
themes
config.toml
~~~~

You now have a Hugo site, but no content.

## Add your first content




## Build the site and take a look at it.




## Installing a theme




## Configure Hugo




## Adding some real content




## Adding images and videos




## Setting up an audio podcast




## Upload your site to a web server





~~~~
hugo --minify && rsync -e 'ssh -ax -p 22'  --archive --delete --verbose --compress --human-readable --exclude '.DS_Store' public/ host.example.com:/var/www/
~~~~
