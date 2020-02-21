---
title: "Make images into a background-image so Firefox -moz-border-radius will work"
slug: "make-images-into-a-background-image-so-firefox-moz-border-radius-will-work"
date: 2010-12-14T16:28:54+01:00
lastmod: 2010-12-14T16:28:54+01:00
author: "Fredrik Jonsson"
tags: ["css","drupal","firefox","jquery","development"]
aliases:
  - /node/1441/
draft: true

---



Firefox -moz-border-radius doesn't work on images unfortunately. Using -webkit-border-radius however works well on images in Safari and Chrome etc.

A recent customer wanted images on there site to have rounded corners. They where ok with it not working in Internet Explorer 8 and older but really wanted a fix for Firefox. Here follows one solution with jQuery I hacked together. It seems to work ok.

The site runs Drupal and the images are displayed in a views block. A simplified version of the HTML looks like this.

~~~~
<div id="block-views-example-block_1" class="block block-views">
  <div class="content">
    <img src="http://example.com/sites/default/files/imagecache/example_preset/example.jpg" class="imagecache" width="200" height="200">
  </div>
</div>
~~~~

I started out with adding the following CSS rules.

~~~~
#block-views-example-block_1 img {
  border-radius: 7px;
  -webkit-border-radius: 7px;
  -moz-border-radius: 7px;
}
~~~~

This made the corners round and nice in Safari but not in Firefox.

I found out that -moz-border-radius will work on CSS background images. My solution is therefor to move the image from the img tag to a background image on the parent div and setting the width and height of the div to the image size. Below is the jQuery script I came up with.

~~~~
(function ($) {

// Make border radius work on images in Firefox.
Drupal.behaviors.initFirefoxBackgroundImage = function (context) {
  if ($.browser.mozilla) {
    $('#block-views-example-block_1 img', context).filter(':not(.initFirefoxBackgroundImage-processed)').addClass('initFirefoxBackgroundImage-processed').each(function () {
      var imageUrl = $(this).attr('src');
      var imageWidth = $(this).attr('width');
      var imageHeight = $(this).attr('height');
      $(this).parent().addClass('firefox-radius').css({'background-image' : 'url(' + imageUrl + ')', 'width' : imageWidth, 'height' : imageHeight});
      $(this).hide();
    });
  }
}

})(jQuery);
~~~~

As a last step I added the new "firefox-radius" class to the CSS rules.

~~~~
#block-views-example-block_1 img,
.firefox-radius {
  border-radius: 7px;
  -webkit-border-radius: 7px;
  -moz-border-radius: 7px;
}
~~~~

Not the prettiest solution but it works, it doesn't mess up things for other browsers and it made the customer happy.

