---
title: "Setup guest and IOT VLAN with UniFi and a Edgerouter"
slug: "unifi-edgerouter-guest-iot-vlan"
date: 2020-02-12T12:59:53+01:00
lastmod: 2020-02-12T12:59:53+01:00
author: "Fredrik Jonsson"
tags: ["wi-fi","network"]
draft: true

---

Setting up VLAN with an Edge router and UniFi switch and access points takes a few extra step. My goal is to have separate wireless networks for guest and IOT, each on there own VLAN. In this post I describe how I got it working.

A year and a half ago I posted [Cover my house with UniFi Wi-Fi]({{< relref "post/cover-my-house-with-unifi-wifi.md" >}}). The system has been running well since then. Recently I replaced the old AirPort router with an Edgerouter X.

The [EdgeRouter X](https://www.ui.com/edgemax/edgerouter-x/) is small, cheep and surprisingly capable. I'm not to fond of the EdgeOS admin interface, but it gets the job done.

Getting the UniFi Security Gateway is an option but it's less flexible, more expensive and can not route 1 Gbit/s. It's easier to set up since everything can be done in the UniFi interface.


## Initial setup of Edgerouter

I recommend to use the wizard to get a good start, I picked the "Basic setup". For WAN I used eth4 and then checked "Only use one LAN" so eth0, eth1, eth2 and eth3 becomes a LAN switch. The group of ports is named "switch0" by the system.

In the "LAN ports" section I entered the IP address space I wanted to use on the LAN and  made sure the DHCP server was activated.

If you have not already created a new user, make sure to do so at the bottom of the wizard. Never run with the default user and password in production.

After clicking "Apply" I then had a working router and could connect to the Internet.

For basic usages you are done by this point.


## Make the Edgerouter X route 1 Gbit/s

The Edgerouter X can by default only route around 300 Mbit/s. If you don't need QoS you can enable [hardware offloading](https://help.ubnt.com/hc/en-us/articles/115006567467-EdgeRouter-Hardware-Offloading) and get it to route 1 Gbit/s.

This need to be done on the command line. You can use the "CLI" button in the top right on the EdgeOS admin interface or login to the router via SSH.

~~~~
$ configure
$ set system offload hwnat enable
$ commit; save
$ exit
~~~~


## Move guests and IOT devices to separate VLAN

With virtual LAN (VLAN) you can have multiple separate networks over one set of cables. Perfect for separating guests and IOT stuff from you personal devices (computers, phones etc.)

The two VLAN will need to be set up on both the Edgerouter and in UniFi, make sure you use the same VLAN ID in both places.


### Set up your VLAN on the Edgerouter

On the main dashboard there is a "Add interface" button. Use this to create the needed VLAN.

1. Pick VLAN ID, anything from 2-4094 (I believe "1" is the main LAN).
2. For interface select "switch0".
3. For address select "Manually define IP address". Enter the IP address you want for the interface, something like "10.10.10.1/24" or "192.168.20.1/24". The router are always assigned the "1" address by custom.
4. Click "Save"

I like to use easily distinguishable addresses for each LAN/VLAN, then it's quick and easy to confirm where a device is connected.

### Create a DHCP server for each VLAN on the Edgerouter

Each VLAN now needs a DHCP server so devices on it can get IP addresses.

Go to the "Services" tab. Click the "Add DHCP Server" button.

1. A sensible name
2. Make sure the subnet matches the IP addresses you picked for each VLAN when you created them. Something like "10.10.10.0/24" or "192.168.20.0/24"
3. Rang start can be set to "2" and range stop to "254".
4. Set DNS 1 to the IP of the interface, e.g. "10.10.10.1" or "192.168.20.1" from above.
5. Click "Save"


### VLAN firewall rules on the Edgerouter

aaa


### Set up your VLAN in UniFI

aaa



### Create separate guest and IOT wireless networks in UniFi

aaa