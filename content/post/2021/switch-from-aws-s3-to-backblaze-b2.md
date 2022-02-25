---
title: "Switching from AWS S3 to Backblaze B2"
slug: "switch-from-aws-s3-to-backblaze-b2"
date: 2021-07-09T11:18:09+02:00
lastmod: 2021-07-09T11:18:09+02:00
author: "Fredrik Jonsson"
tags: ["server","backup"]

---

I started using Amazons AWS S3 back in 2008. As everyone know the service works very well. With time I have become less and less entusiastisk about giving Amazon money. The AWS console is also not the most fun to work with.

I have used AWS S3 for:

* Storing backups from my personal computers via the excellent [Arq backup](https://www.arqbackup.com/)
* Storing backups from my servers via cron scripts and aws cli.

There are nowadays a multitude of services that offer S3-compatible storage services. Both Arq and the aws cli will support any of them. Arq also support a [number of other options](https://www.arqbackup.com/#arqbackup-benefit-list-2).

[Backblaze](https://www.backblaze.com/) is a service I have recommended to family and friends for years. For 6 USD you get unlimited personal cloud backup and a nice Windows/macOS app that mostly is install and forget.

Last year Backblaze B2 Cloud storage was made S3-compatible. In the beginning of this year I switch all my AWS S3 usages to B2 Cloud. It was a quick and painless switch.

In my Backblaze account I created the needed buckets and access keys. The interface is clean and nice to work with. This alone is worth the switch in my opinion.

In Arq I created a new location for B2 Cloud and started to backup the same files I was already backing up to AWS S3.

In my Ansible playbooks I changed the cron script to backup to B2 Cloud using the same aws cli as I used for AWS S3. I needed to set "--endpoint-url" instead of specifying "region" but otherwise the commands are unchanged.

I paused all backups to AWS S3 but did not delete them. It has now gone almost 6 month since the switch and I plan to start deleting all my S3 backup buckets.

For my use case AWS S3 was never a cost I thought about but B2 Cloud is silly cheap. Backblaze have been around for many years so they must be making enough money somehow.

Amazon has many more datacenters than Backblaze so performance may be an issue depending on your location. For me the performance difference between AWS "eu-north-1" and B2 "eu-central" was barely noticeable.

Less money to Amazon, a nicer interface, solid service and a even lower cost for me.

Let's see if I can convince some of my customers to switch as well.