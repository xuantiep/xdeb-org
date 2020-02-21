---
title: "Getting a server you can touch"
slug: "getting-a-server-you-can-touch"
date: 2019-01-17T13:44:55+01:00
lastmod: 2019-01-17T13:44:55+01:00
author: "Fredrik Jonsson"
tags: ["debian","server","ansible","technology"]
draft: true

---

I decided one day that it would be nice to have a server I could touch again. Hardware has come down in cost, I have gigbit fiber connection to my house and my ISP can arrange a static IP address for an extra 4€ per month. So lets get a server!

The Intel NUC computers gets good reviews and seem perfect for what I need. Small, quiet and very reasonable priced. I picked up a [Intel NUC Kit NUC6CAYH](https://www.intel.com/content/www/us/en/products/boards-kits/nuc/kits/nuc6cayh.html) for 120€ plus 8 GB of RAM for 70€. This model takes 2,5" drives and I have a 180 GB Intel SSD laying around so the total price for my server is 190€.

Assembling the server took about five minutes. Intel has done a good job here, especially considering the price.


## Setup

I downloaded the Debian installer to a USB stick and installed a base system. Made sure the SSH server was running and mounted the server on the wall in my "network" wardrobe. The remaining setup I could do from my own computer via Ansible and SSH.

In the Ansible playbook for this server I added the needed roles to make it a web server, to begin with. The only new role was "mailserverlite", a postfix install that forward mail via port 557 (my ISP blocks port 25) to my main mail server.

If you are interested in Ansible please take a look at my post [My first 2 minutes on a server - letting Ansible do the work](/post/2016/06/23/my-first-2-minutes-on-a-server-letting-ansible-do-the-work/).

The only configuration I did manually was to set up the static IP address, gateway etc. The server is connected directly to one of the ports on the fiber media converter. This way it's completely separate from my home network.


## Web server

The first task for the server is to host a number of web sites. Most are simple static sites and a couple are Drupal sites. Apache, PHP and Maria DB takes care of that.

All the sites are low traffic so the server will hardly notice it. This site is now hosted on it.


## Wireguard VPN

I wrote about Wireguard in [Using Ansible to setup a WireGuard VPN server on Debian 9 – xdeb.org](https://xdeb.org/post/2019/01/24/using-ansible-to-setup-a-wireguard-vpn-server-on-debian-9/). That setup is running on the server.


## Future

It will be interesting to see for how long the server will run with out issues. I'm making backups of the DBs and uploaded files to S3 every night. So when the server do break down I can get a new one and have it set up quickly without losing any data.

