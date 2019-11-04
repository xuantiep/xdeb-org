---
title: "ImageMagick with Drupal 5 for nicer image scaling"
date: 2008-05-05T08:16:43+02:00
lastmod: 2008-07-20T15:11:04+02:00
author: "Fredrik Jonsson"
tags: ["drupal","images","development"]
aliases:
  - /node/998/

---



To put images on Drupal sites I mainly use [ImageField](http://drupal.org/project/imagefield) or my hacked version of the [inline module](http://cvs.drupal.org/viewcvs/drupal/contributions/sandbox/frjo/inline5/) together with [ImageCache](http://drupal.org/project/imagecache) and [Thickbox](http://drupal.org/project/thickbox)

Imagecache can scale and crop images on the fly according to the presets you set up, a very nice module. All the small images on this blog is done this way. It will use the image toolkit from the Drupal settings on your site. This will most likely be GD2 toolkit since it comes with almost all installs of PHP and Drupal supports it out of the box.

GD2 works well but I was not satisfied with the quality of the scaled images. I know the [Image](http://drupal.org/project/image) module does it better with the help of the ImageMagick toolkit but I don't want to use it for all my image needs.

The other day I stumbled on this post by zoo33 [Now available: better control over ImageMagick operations](http://groups.drupal.org/node/6699). As of version 5.x-1.6 the Image module comes with "ImageMagick Advanced Options". This new module can be activated separately from the rest of the packages and are used on all image operations in Drupal.

It's now active here on xdeb.org and the scaled images looks a lot better. I use JPEG quality 80% and sharpening filter with settings 90/0,9.

Since all scaled images was automatically done with Imagecache I just told it to fluch all old images and they are rebuilt with the help of the newly activated ImageMagick toolkit. Did I say the Imagecache is a really nice module!

