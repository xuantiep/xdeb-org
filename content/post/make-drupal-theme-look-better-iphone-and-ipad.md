---
title: "Make a Drupal theme look better on the iPhone and the iPad"
date: 2011-01-15T09:26:38+01:00
lastmod: 2011-01-15T09:26:38+01:00
author: "Fredrik Jonsson"
tags: ["css","drupal","iphone","development"]
aliases:
  - /node/1460/

---

{{< figure src="/images/xdeb_on_iphone4.png" width="400" class="right" alt="xdeb.org on the iPhone 4" >}}

When I got my first iPhone two years back I adapted the theme here on xdeb.org to work better with it. I documented it in my post [Make a Drupal theme look better on the iPhone](/node/1185).

During the holidays I got to try out the iPad for a few days and found ways to make the xdeb.org theme work better for it as well.

I have two simple goals for the iPhone and the iPad (and all other mobile devices):

* Avoid the need to zoom in and scroll sideways, making the text readable directly.
* Make the navigation and the search function touch friendly with larger buttons/fields and more spacing.

Please visit xdeb.org with your iPhone and/or iPad and I think you will agree that it's a marked improvement in usability. There is of course a lot more that can be done. My point is that you can get this nice improvement with such a small investment and I'm surprised that not more web sites does this.

I believe this works on all webkit mobile based browser so Android users etc. will benefit from it as well. If someone can test xdeb.org on an Android device and report back in an comment to this post or via the contact form I would be very glad.

To the xdeb.org theme I have added three CSS files and one meta header tag. The CSS files is "iphone.css", "ipad_portrait.css" and "ipad_landscape.css". The media attribut "max/min-device-width" in the link tag makes it possible to control which device loads the CSS-files. See example below.

~~~~
<!-- Start iPhone/iPad stuff -->
<link rel="stylesheet" type="text/css" media="only screen and (max-device-width: 480px)" href="<?php $base_path . $directory .'/iphone.css'; ?>" />
<link rel="stylesheet" type="text/css" media="only screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation: portrait)" href="<?php $base_path . $directory .'/ipad_portrait.css'; ?>" />
<link rel="stylesheet" type="text/css" media="only screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation: landscape)" href="<?php $base_path . $directory .'/ipad_landscape.css'; ?>" />
<meta name="viewport" content="width=device-width" />
<!-- End iPhone/iPad stuff -->
~~~~

All three CSS files increase the size and spacing of the navigation links and the search field. The iPhone CSS file makes the layout single column. The iPad portrait CSS file makes the layout two column.

With the viewport meta tag set to "width=device-width" the browser is instructed to use the width of the device as the width of the viewport, instead of the default 980 pixels. The web page will then exactly fill the screen.

I did some testing with a Zen 2 STARTERKIT theme and come up with the example code below. For a production site it needs a lot of work but I think it’s a good start.

Put this in the info file of your Zen 2 subtheme.

~~~~
stylesheets[only screen and (max-device-width: 480px)][] = css/iphone.css
stylesheets[only screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation: portrait)][] = css/ipad_portrait.css
stylesheets[only screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation: landscape)][] = css/ipad_landscape.css
~~~~

Put this in "css/iphone.css".

~~~~
/* $Id: iphone.css,v 1.1 2011/01/15 08:58:05 frjo Exp $ */

#page {
  margin: 10px;
  font-size: 28px;
}

/*
 * Content
 */
#content {
  float: none;
}

.sidebar-first #content .section {
  padding-left: 0;
}

.sidebar-second #content .section {
  padding-right: 0;
}

.two-sidebars #content .section {
  padding-left: 0;
  padding-right: 0;
}

/*
 * Navigation
 */
#navigation {
  position: absolute;
  top: -170px;
  left: 0;
  float: none;
  margin-right: 0;
  height: 170px;
}

.with-navigation #content {
  margin-top: 170px;
}
.with-navigation .region-sidebar-first,
.with-navigation .region-sidebar-second {
  margin-top: 0;
}

#navigation li {
  margin: 0 30px 30px 0;
}

#navigation li a {
  display: block;
  font-size: 45px;
  padding: 10px;
  border: 1px solid #000;
  text-decoration: none;
}

/*
 * First sidebar
 */
.region-sidebar-first {
  float: none;
  width: 100%;
  margin-right: 0;
}

.region-sidebar-first .section {
  margin: 0;
}

/*
 * Second sidebar
 */
.region-sidebar-second {
  float: none;
  width: 100%;
  margin-left: 0;
}

.region-sidebar-second .section {
  margin: 0;
}

#search-box {
  margin: 20px 0;
}
#search-box input {
  font-size: 40px;
}
~~~~

Put this in "css/ipad_portrait.css".

~~~~
/* $Id: ipad_portrait.css,v 1.1 2011/01/15 08:58:05 frjo Exp $ */

/*
 * Content
 */
.sidebar-second #content .section {
  padding-right: 0;
}

.two-sidebars #content .section {
  padding-right: 0;
}

/*
 * Navigation
 */
#navigation {
  height: 170px;
}

.with-navigation #content,
.with-navigation .region-sidebar-first {
  margin-top: 170px;
}
.with-navigation .region-sidebar-second {
  margin-top: 0;
}

#navigation li {
  margin: 0 30px 30px 0;
}

#navigation li a {
  display: block;
  font-size: 45px;
  padding: 10px;
  border: 1px solid #000;
  text-decoration: none;
}

/*
 * Second sidebar
 */
.region-sidebar-second {
  float: none;
  margin-left: 0;
  clear: both;
}

.region-sidebar-second .section {
  margin: 0;
}

#search-box {
  margin: 20px 0;
}
#search-box input {
  font-size: 40px;
}
~~~~

Put this in "css/ipad_landscape.css".

~~~~
/* $Id: ipad_landscape.css,v 1.1 2011/01/15 08:58:05 frjo Exp $ */

/*
 * Navigation
 */
#navigation li {
  margin: 0 30px 30px 0;
}

#navigation li a {
  display: block;
  font-size: 45px;
  padding: 10px;
  border: 1px solid #000;
  text-decoration: none;
}

#search-box {
  margin: 20px 0;
}
#search-box input {
  font-size: 40px;
}
~~~~

