---
title: "Cover my house with UniFi Wi-Fi"
date: 2018-10-12T08:17:52+02:00
lastmod: 2018-10-12T08:17:52+02:00
author: "Fredrik Jonsson"
tags: ["wi-fi","network"]

---

{{< figure src="/images/unifi-ap-ac-lite-features-sleek-compact.jpg" width="250" class="right" alt="UniFi AC" >}}

Apples AirPort have given my household good and stable Wi-Fi for many years. They cost a bit more but just work and are easy to set up, a very Apple product. Apple discontinued its AirPort products this year, and last updated them in 2013. This has prompted me to seriously investigate my options.

I have had two issues with my Wi-Fi. The signal strength could have been better in places and to make my computers always use the 5 GHz band a separate 5 GHz SSID was necessary. I want a new system to fix these issues.

I first looked at some of the popular mesh systems but decided to test the more professional UniFi system from [Ubiquiti Networks](https://www.ubnt.com/). UniFi is a professional system that demands more work but, from what I read, the end result is really good. Let's see how it works out for me.


## Hardware

I bought two [UniFi AP-AC-Lite](https://www.ubnt.com/unifi/unifi-ap-ac-lite/), one for each floor. I considered going with the higher performance [UniFi AP-AC-Pro](https://www.ubnt.com/unifi/unifi-ap-ac-pro/) but the lite model included PoE adapters in the price and seamed like a good start. I will let the existing Airport act as a router, DHCP-server and firewall with Wi-Fi turned off.

The AP-AC-Lite is at the low end of the UniFi line. Their UAP‑HD e.g. support 500+ users per access point, that is a bit more than I need at my house. That said, I have eight wireless clients connected at the moment. In a few years time it will not be less.

Since the PoE adapters was included I did not need any other hardware to get it working. To build a "complete" system you could get a UniFi PoE switch and a UniFi Security Gateway as well.

If the AirPort one day gives up I will most likely replace it with a UniFi Security Gateway. Sooner or later I will get a UniFi PoE switch to make the installation more neat and for features like VLAN.


## Installation

Unlike with mesh systems each UniFi AP needs a network cable. Thanks to PoE (power over ethernet) the cable deliver both data and power to each access point.

~~~~
                     / – PoE adapter – AP-AC-Lite -- clients
Internet – AirPort –
                     \ – PoE adapter – AP-AC-Lite -- clients
                                     ¦
                             UniFi controller
                             on Raspberry Pi

–  wire
-- wireless
~~~~

I already have some cable installed in the house and in an afternoon I had installed the missing bits. Most work was spent on making the cables invisible. I crimp my own cables according to [TIA/EIA-568B](https://en.wikipedia.org/wiki/TIA/EIA-568#T568A_and_T568B_termination) (orange goes first), never use anything else. It's a bit more work but you only need to drill small 6 mm holes.

I mounted the UniFi access points in the ceiling and they are very discreet once you turn off the status LED lights. The down stairs access point is almost only used by myself since my office is there. Even when the family is at home I have an access point all to myself.


## Configurations

It's possible to set up a UniFi AC as standalone devices via the iPhone app. To get all the benefits and convenience of the system you really should set up a UniFi controller. I run mine on an Raspberry Pi I had laying around. Take a look at my [Ansible role](https://github.com/frjo/ansible-roles) for setting it up.

After you have started up the UniFi controller and adopted the access points there are a lot of options to consider. Below you find my choices.

**Setup of site:**

* Check "Enable advanced features" (it's mainly band steering I want)
* Check "Automatically upgrade AP firmware"
* Uncheck "Enable status LED"

**Setup of wireless network:**

* Security "WPA Personal"
* WPA Mode "WPA2 Only", Encryption "AES/CCMP Only"
* Check "Enable Unscheduled Automatic Power Save Delivery"
* Check "Enable multicast enhancement (IGMPv3)"

If needed, also set up a separate guest network, UniFi have nice options for that.

**Setup of access points:**

* 2.4 GHz band
    1. Channel width HT20
    2. Fixed channel (1, 6 or 11)
    3. Transmit power medium
* 5 GHz band
    1. Channel width VHT40
    2. Fixed channel (36, 44, …)
    3. Transmit power auto
* Band steering
    * Prefer 5G
* Wireless uplinks (if present)
    * Uncheck "Allow meshing to another access point"

The rest is the default settings.

You can configure up to eight SSID but most people will at most need two, a main one for the family and one for guests.

If you have IOT (internet of things) devices you should consider getting a UniFi switch so you can set up separate VLAN for them. They are notorious for bad security and if I ever get any they will never be put on the same network as my computer.

Having feature like this available is one of the many benefits with professional gear like UniFi.


## Conclusion

After a bit more than a week everything seems to work really well. I get a good signal everywhere in the house. My devices almost always pick 5G when inside the house. So my two main issues are solved.

I have had zero issues so far and I hope it stays that way for years to come.

So everything I read about UniFi seems to be true, more work to set up but the end result is really good.

**Good resources:**

* [UniFi - Ubiquiti Networks Community](https://community.ubnt.com/unifi)
* [How To: Deploying a Ubiquiti UniFi Home Network including Multiple WiFi Access Points (Part 2)](https://freetime.mikeconnelly.com/archives/6373)