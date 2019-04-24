---
title: "Amazon CloudFront as a CDN for Drupal "
date: 2011-08-10T09:30:21+02:00
lastmod: 2011-10-16T11:35:06+02:00
author: "Fredrik Jonsson"
tags: ["cdn","drupal","development"]
aliases: ["node/1523"]

---

{{< figure src="/images/aws_cloudfront_1.png" width="400" class="right" alt="Setting up Amazon CloudFront Distribution 1." >}}
{{< figure src="/images/aws_cloudfront_2.png" width="400" class="right" alt="Setting up Amazon CloudFront Distribution 2." >}}

When I access xdeb.org from Sweden the site feels reasonable quick and responsive. From other parts of the world it feels less so, even when the Internet connection is good.

The reason is of course that my server is located in Sweden and that location matter on the Internet. Latency and capacity gets worse, in most cases, the bigger the distance is. Ping time to a server close by can be something like 10-20 ms. With a server on the other side of the world the ping time is most likely 300+ ms.

The solution is to move the content closer to the visitors and that can be done with a [Content delivery/distribution network](http://en.wikipedia.org/wiki/Content_delivery_network), CDN.

Really big players like Google and Facebook build there own systems. They simply build a bunch of data centers all over the world. Big players use CDN services from companies like [Akamai](http://www.akamai.com/) and [Limelight](http://www.limelight.com/).

Both options is a bit over my budget for xdeb.org.

There are a number of cheaper CDN providers that I here people mention from time to time but none of them has struck my fancy. Not that low cost or not that easy to set up or weak coverage etc.

Then there is [Amazon CloudFront](http://aws.amazon.com/cloudfront/). Easy to set up and you pay only for what you use, that goes for all Amazon Web Services.

I'm already using other [Amazon Web Services](http://aws.amazon.com/) with good result and earlier this year they expanded their presences in Asia so now they cover North America, Europe and Asia very well.

Amazon CloudFront for xdeb.org will cost something like €2 (Euro) per month. That is a reasonable cost to make xdeb.org more quick and responsive for users outside Sweden.

## Set up Amazon CloudFront as a CDN for Drupal

The goal is to make CloudFront serve all static files like images, js and css.

When you create a CloudFront Distribution you can either set one of your S3 buckets as origin or set a custom origin. I selected custom and simply entered "xdeb.org". "Origin" tells Amazon from where it should download the static files from.

CloudFront will cache the files for at least 24 hours, or longer if you set it up that way. If you use Apache and have mod_expires activated Drupals default htaccess file set the cache time to "2 weeks after access" for static files. It looks to me like CloudFront respects this value.

With CloudFront set up what remains is to make Drupal change the url of all static files to the URL of your CloudFront distribution.

I had already set up Drupal to serve static files via Lighttpd, see [Running Lighttpd as a static file server for Drupal 6 on a Debian GNU/Linux server](/node/1221). After setting up a CloudFront I just needed to change the static url in my settings.php file and I was done.

The easiest and best way for most sites is to use the excellent [CDN module](http://drupal.org/project/cdn) for Drupal. The CDN module can do a lot of other things as well, like push files to Amazon S3. It is used by some of the biggest Drupal sites out there.

I'm pleasantly surprised by how easy it is to set up CloudFront and how well it works. It's easy and cheep enough for any small site that has readers from all around the world.

## Invalidate (clear/purge) files on Amazon CloudFront

There is one problem with this setup. If you upload a new version of a file without changing the name CloudFront will serve the old version until it expires from its cache.

I noticed this when I changed an image style and flushed the old images. The result was not pretty, the updated style was a bit larger so the images on CloudFront was to small and got "stretched".

One solution is to change the Expires settings from "2 weeks after access" to lets say "1 day after access". Then you just wait for one day and CloudFront will be updated.

It's also possible to invalidate files via CloudFront API calls. I which Amazon Console could have some simple interface for this but there seem to be none for some reason.

Luckily Aleksandar Kolundzija has put up [CloudFront-PHP-Invalidator](https://github.com/subchild/CloudFront-PHP-Invalidator) on GitHub. It's a PHP Class for invalidating objects stored on Amazon CloudFront service. I wrote my own basic web interface for it so I can paste in a bunch of file path and hit a button to invalidate them.

This should be made it to a Drupal module that would automatically invalidate the images on CloudFront when you change a image style. I leave that for another day.

