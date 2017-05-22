---
title: "HDtracks – I\'m buying music again, and life is better at 24 bit"
date: 2012-07-20T16:40:02+02:00
lastmod: 2012-07-23T13:15:26+02:00
author: "Fredrik Jonsson"
tags: ["audio hi-fi music","life"]
aliases: ["node/1573"]

---

{{< figure src="/images/hdtracks_2012-07-20.png" width="400" class="right" alt="HDTracks" >}}
{{< figure src="/images/max_formats.png" width="400" class="right" alt="Max formats" >}}
{{< figure src="/images/audio_midi_setup.png" width="400" class="right" alt="Audio Midi Setup" >}}

Just now I'm downloading another four albums I bought from [HDtracks](https://www.HDtracks.com/). It has been *many* years since I bought new music like I have done since I discovered HDtracks some month ago.

Once upon a time I bought a lot of music, mostly on LP and later also on CD. Then came DRM, Loudness War and lossy compression (MP3 etc.) and I almost stopped buying music.

After Apple iTunes Store removed DRM and made 256 kbit/s AAC the default I have bought some music there. It mostly sounds ok, or even decent and they have some interesting projects like "Mastered for iTunes". Still, paying good money for lossy compression feels wrong.

Enter HDtracks. Not as convenient as iTunes but, and this is a *big* but, the sound quality is better than anything I have ever listened to before. It's digital sound the way it should be. The music at HDtracks comes straight from the master tapes and are made in to 24 bit audio files (flac) that you can play.

Compare this to a CD where the master tapes are converted in to 44.1 kHz 16 bit. This is then pressed in to discs of plastic and aluminium. You insert the discs in to a player where a laser does it best to read back the information and put it together again. That is a lot of steps where errors can happen.

HDtracks mostly offer sampling rates of either 96 or 192 kHz but some music comes in 44.1 or 48 kHz as well. The bit rate is always 24. The 192 kHz versions are huge files and you must make sure your DAC can handle them, mine can not. I normally pick the 96 kHz versions, they are around 80 MB files (flac). I suspect that the fact that they take the music directly from the master tapes means more for the sound quality than the sampling rate.

Albums on HDtracks cost only a little more than on iTunes. The selection is of course far greater on iTunes but there is quantity and then there is quality.

### DAC - digital-to-analog converter

To be able to enjoy the quality of the music from HDtracks you need a decent DAC that supports at least 96khz and 24bit. Most, if not all, newer Macs have a optical digital output making it easy to connect a DAC. There are a number of DAC with USB also and they should work on more or less any computer.

If I was looking to buy something today I would take a good look at [Music Streamer](http://highresolutiontechnologies.com/) from HRT. You find reviews of many more options in Stereophiles [Computer Audio Reviews](http://www.stereophile.com/category/computer-audio-reviews/).

### How to play HDtracks flac files on a Mac OS X

The files from HDTracs are in flac format, a common lossless compressions format. There are a number of ways to play flac on a Mac but I prefer to convert them to Apple Lossless format and play them in iTunes. Since we are converting from one lossless format to another there is zero degradation in quality.

I use [Max](http://sbooth.org/Max/) from sbooth.org for the conversion. Just set the format to "Apple MPEG-4 Audio (Apple Lossless)". Max also allows you to change the meta data if needed. Add the Apple Lossless files to iTunes and you are almost ready to go.

For some reason iTunes can not change the Mac audio system bit rate and sampling rate on the fly, Apple should really fix this annoying bug. The workaround is however simple and you need only do in once.

Quit iTunes, this is important, and start "Audio Midi Setup" that you find in Applications -> Utilities. Set the output format to the maximum sampling rate/bit rate you use. In my case 96000 HZ and 24bit. Quit "Audio Midi Setup" and start iTunes again, now you are ready to play your new hi-res files.

When you play standard 44.1 kHz 16 bit files they will be upsampled with no ill effect. (This may not be true on older versions of Mac OS X so make sure you have 10.6 Snow Leopard or later.)

Now hit play, sit back and enjoy the music!

