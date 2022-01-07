---
title: "Make a HTML list in to a simple news ticker/scroller with jQuery"
slug: "make-a-html-list-in-to-a-simple-news-ticker-scroller-with-jquery"
date: 2011-01-14T16:32:49+01:00
lastmod: 2011-12-27T12:38:34+01:00
author: "Fredrik Jonsson"
tags: ["css","drupal","javascript","jquery","development"]
aliases:
  - /node/1459/

---



The same customer that featured in my last blog wanted a aggregator block turned in to a vertical news ticker/scroller. The block contained a total of 20 items of which three should show. I wanted something lightweight and simpel that I could add to the theme.

I found a [good solution](http://woork.blogspot.com/2009/05/how-to-implement-news-ticker-with.html) on the web that I simplified a bit and wrapped up for use with Drupal. There is two parts to this ticker/scroller. First part is a jQuery script that removes the first list item and add it to the bottom with some nice animations. After that we have some CSS to limit the height so only the top list items shows and hides the rest with overflow hidden.

The selector used below "#block-views-example-block_1 ul" is an example, you will need to change it to the selector of your HTML list.

~~~~
(function ($) {

// Make a block in to a news ticker/scroller
Drupal.behaviors.initScrollBlock = function (context) {
  // The HTML list selector
  var list = '#block-views-example-block_1 ul';
  // Animation speed
  var speed = 700;
  // Ticker speed
  var pause = 3500;

  function removeFirst() {
    $(list + ' li:first', context)
      .animate({height: 0, opacity: 0}, speed, function() {
        $(this).remove();
        addLast($(this));
      });
  }
  
  function addLast(first) {
    $(list, context).append(first.removeAttr('style'));
  }

  setInterval(removeFirst, pause);
}

})(jQuery);
~~~~

Specifying the height of the list and setting overflow to hidden is necessary to make only the first items show. Adjust the height to show as many items as you want. The rest of the CSS is simply some suggestion to make it look nicer.

~~~~
#block-views-example-block_1 .item-list ul {
  overflow: hidden;
  height: 5em;
  list-style-type: none;
  list-style-image: none;
  padding: 0;
  margin: 0;
}
~~~~

Demo video of the news ticker/scroller:

<video id="html5-video" width="596" height="112" preload="meta" controls>
<source src="/files/jquery_news_ticker.mp4" />
<source src="/files/jquery_news_ticker.ogv" />
<a href="/files/jquery_news_ticker.mp4">Download movie</a>
</video>
