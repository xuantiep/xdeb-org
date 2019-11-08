---
title: "Security camera with Raspberry Pi"
date: 2017-05-28T10:33:14+02:00
lastmod: 2017-05-28T10:33:14+02:00
author: "Fredrik Jonsson"
tags: ["raspberrypi", "security", "ansible", "technology"]

---

{{< figure src="/images/raspberry_pi_logo.png" width="250" class="right" alt="Raspberry Pi logo" >}}

Some tulips eating animals gave rise to the need of a security camera system.

One could have bought a ready made system but that's boring and as recent events show, their security is often abysmal. Much better to build my own system and I have been mening to play with the [Raspberry Pi](https://www.raspberrypi.org/) computers.

Ordered one Raspberry Pi 3 Model B and a couple of Zero W together with some Pi Camera v2. Both the standard version and Pi NoIR version. The official Zero case has one lid option for mounting the camera. SanDisk 16GB microSDHC SD cards and MicroUSB cables and I had all the hardware needed.

I have some spare Apple USB chargers so no need to buy new ones. The 2A iPad charger for the Modal 3 and the 1A iPhone charger for the Zero. Works really well.

Getting the Pi:s up and running was straight forward. Write the raspian image to the SD, add a empty file named "ssh" and a wifi conf file "wpa_supplicant.conf" to the boot volume to activate ssh and make the Pi connect to the WiFi directly on first boot.

File: `boot/wpa_supplicant.conf`

~~~~
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
    ssid="YourWiFiNetworkName"
    psk="YourWiFiNetworkPassword"
}
~~~~

After some research I settled on [Motion](https://motion-project.github.io/) for the software. The most time consuming part was understanding and adjusting the motion configurations to minimise false positives.

Motion can run commands on different events. I push notification to my iPhone with [Pushover](https://pushover.net/) (highly recommended) when motion is detected and upload new images and movies to a server.

It all works quite well. You find the Ansible roles, Common Pi and Security camera, at [frjo/ansible-roles](https://github.com/frjo/ansible-roles).

