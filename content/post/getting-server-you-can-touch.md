---
title: "Getting a server you can touch"
date: 2019-01-17T13:44:55+01:00
lastmod: 2019-01-17T13:44:55+01:00
author: "Fredrik Jonsson"
tags: ["debian","server","ansible","technology"]
draft: true

---

I decided one day that it would be nice to have a server I could touch again. Hardware has come down in cost, I have gigbit fiber connection to my house and my ISP can arrange a static IP address for an extra 4€ per month. So lets get a server!

The Intel NUC computers gets good reviews and seem perfect for what I need. Small, quiet and very reasonable priced. I picked up a [Intel NUC Kit NUC6CAYH](https://www.intel.com/content/www/us/en/products/boards-kits/nuc/kits/nuc6cayh.html) for 120€ plus 8 GB of RAM for 70€. This model takes 2,5" drives and I have a 180 GB Intel SSD laying around so the total price for my server is 190€.

Assembling the server together took about five minutes. Intel has done a good job here, especially considering the price. 


## Setup

I downloaded the Debian installer to a USB stick and installed a base system. Made sure the SSH server was running and mounted the server on the wall in my "network" wardrobe. The remaining setup I could do from my own computer via Ansible and SSH.

In the Ansible playbook for this server I added the needed roles to make it a web server, to begin with. The only new role was "mailserverlite", a postfix install that forward mail via port 557 (my ISP blocks port 25) to my main mail server.

If you are interested in Ansible please take a look at my post [My first 2 minutes on a server - letting Ansible do the work](/post/2016/06/23/my-first-2-minutes-on-a-server-letting-ansible-do-the-work/).

The only configuration I did manually was to set up the static IP address, gateway etc. The server is connected directly to one of the ports on the fiber media converter. This way it's completely separate from my home network.


## Web server

The first task for the server is to host a number of web sites. Most are simple static sites and a couple are Drupal sites. Apache, PHP and Maria DB takes care of that.

All the sites are low traffic so the server will hardly notice it. This site is now hosted on it.


## Minecraft server

This turned out to be a lot more complicated than I could have guessed. There are two very different version of Minecraft. The Java version for computers and the Minecraft Pocket Edition for iOS etc.

The official Java version of the server only work for Java clients playing on computers. There also exist a "Bedrock" server, in Alpha version, that only runs on Windows and Ubuntu and its future seems uncertain. On this version everyone can play. Could not get it to run on Debian, to old version of libc6 (to start with).

Then there are unofficial servers that work with the Pocket Edition. A great number of them, some abandon, all with quirks and limitations. It's a bit of a mess and I spent to many hours testing different possibilities. In the end I have no working Minecraft server.


## Future

It will be interesting to see for how long the server will run with out issues. I'm making backups of the DBs and uploaded files to S3 every night. So when the server do break down I can get a new one and have it set up quickly without losing any data.

