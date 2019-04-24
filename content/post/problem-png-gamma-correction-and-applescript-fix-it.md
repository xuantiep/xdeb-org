---
title: "The problem with PNG gamma correction, and a AppleScript to fix it"
date: 2006-09-29T14:52:15+02:00
lastmod: 2011-09-16T09:24:44+02:00
author: "Fredrik Jonsson"
tags: ["applescript","css","macOS","web","technology"]
aliases: ["node/678"]

---



The [PNG](http://en.wikipedia.org/wiki/PNG) format (Portable Network Graphics) was created to be a replacement for the GIF format. It is patent free open standard with a number of advantages over GIF.

One of the few problems with PNG images is that it's difficult, not to say impossible, to match colors in CSS and GIF images with does in a PNG image. This is a major headache for web designers and according to information I have found on the web the reason is the PNG gamma correction function.

Read more about PNG and the gamma correction problem on [The Sad Story of PNG Gamma “Correction”](http://hsivonen.iki.fi/png-gamma/).

Now on to how to fix the gamma correction problem.

First you need to get [pngcrush](http://pmt.sourceforge.net/pngcrush/). The easiest way to get it for Mac OS X users is to install it via [MacPorts](http://www.macports.org/) or [Homebrew](http://mxcl.github.com/homebrew/).

The gamma information and other fancier color space information can be removed using this pngcrush command:

~~~~
pngcrush -rem gAMA -rem cHRM -rem iCCP -rem sRGB infile.png outfile.png
~~~~

To avoid typing that long command in the terminal we can wrap it up in a shell script like this.

~~~~
#!/bin/sh

infile=$1
/bin/mv ${infile} ${infile}~
/opt/local/bin/pngcrush -rem gAMA -rem cHRM -rem iCCP -rem sRGB \
  ${infile}~ ${infile}
~~~~

A still easier way if you are a Mac user is to wrap the command in a AppleScript like the one below.

~~~~
property pngcrush_cmd : "/usr/local/bin/pngcrush" -- Homebrew

try
	tell application "Finder"
		copy selection as alias to thePath
		set thePath to quoted form of POSIX path of thePath
		do shell script "/bin/mv " & thePath & " " & thePath & "~"
		do shell script pngcrush_cmd & " -q -rem gAMA -rem cHRM -rem iCCP -rem sRGB " & thePath & "~ " & thePath
	end tell
end try
~~~~

Place the AppleScript in the Script menu. Then you simply select the PNG image in the Finder and run the AppleScript from the Script menu. The original file is keept and renamed with a ~ on the end.

The PNG image should now display with the same colours in all browsers regardless of plattform. As an extra bonus it will will also have a smaller file size.

