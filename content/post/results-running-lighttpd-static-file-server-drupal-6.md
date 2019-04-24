---
title: "Results of running Lighttpd as a static file server for Drupal 6"
date: 2009-10-14T11:29:08+02:00
lastmod: 2009-10-14T11:29:08+02:00
author: "Fredrik Jonsson"
tags: ["drupal","google","lighttpd","server","development"]
aliases: ["node/1259"]

---

{{< figure src="/images/google-webmastertools-timeperpage.png" width="400" class="right" alt="Google webmaster tools   Time spent downloading a page (in milliseconds)" >}}

In my blog post [Running Lighttpd as a static file server for Drupal 6 on a Debian GNU/Linux server](/node/1221) I describe how I set up a static file server here on xdeb.org. I mentioned there that I have not done any benchmarking on the improvements. I still haven't, but I found some interesting information on Google webmaster tools.

I use Google webmaster tools to submit my sitemaps. One or two times a year I go there to see if everything is in order. They have done some updates since I was there last and this time I found "Crawl stats" under "Diagnostics" (they may very well have been there for a long time but i found them now).

The image show the chart for "Time spent downloading a page (in milliseconds)". Notice the big drop in late July. That’s when I implemented Lighttpd as static file server.

The average time Google spent on downloading a page went from well over 1000 ms to around 600 ms. I'm very pleased with that result.

When talking about performance and web sites there is really two separate issues. The first is how many requests a site can handle (backend performance), the other is page loading speed (front-end performance).

For a small site like xdeb.org the first is normally not a problem. The page loading speed on the other hand is as important for a personal blog as for a big site. 

A static file server will help with both aspects of performance but the big win is page loading speed as shown with the Google webmaster tools example above.

If you want to handle some serious number of requests you have memcache and varnish. If you want to improve page loading speed on a small server or VPS with limited amount of RAM etc. a static file server is a good option.

