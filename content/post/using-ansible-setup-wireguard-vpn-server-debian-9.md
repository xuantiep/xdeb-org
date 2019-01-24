---
title: "Using Ansible to setup a WireGuard VPN server on Debian 9"
date: 2019-01-24T13:19:21+01:00
lastmod: 2019-01-24T13:19:21+01:00
author: "Fredrik Jonsson"
tags: ["security","vpn","wireguard","ansible","technology"]

---

I have been watching the [WireGuard project](https://www.wireguard.com/) with interest for a couple of years. I like how WireGuard is constructed. A small code base that focus on the core functionality. The use of standard Linux networking tools. The use of simple public/private keys like SSH.

They recently released an iOS client and there are a go version that works on macOS as well. As I recently setup a small home server it was a good time to try it out.

The WireGuard project clearly states that it is under development and should be considered experimental. That said it seems to work well and several VPN providers have added support for it. There is also plans to include it directly in to the Linux kernel.


## Setting up WireGuard as a VPN server on Debian 9 with Ansible

You find my WireGuard Ansible role at [frjo/ansible-roles](https://github.com/frjo/ansible-roles). This will set up WireGuard as a VPN server allowing clients to connect and access the internet. I got a lot of help from [iamckn/wireguard_ansible](https://github.com/iamckn/wireguard_ansible) when I created my role.

The iOS client support configuration via QR codes so I added that to my setup. The last step in the role will download the client configurations files and QR codes as PNG images to your local machine.

What took the longest was creating the needed iptables rules. Many of the guides assumed that the install was happening on a brand new system without and firewall setup. I was installing on server that does a few other things and has my standard firewall setup, see the "common" role in the repo above.

While I have years of experience setting up firewalls for servers I have never dealt with nat or forwarding before. But I think I have found a good set of rules, it at least works. The goal is to allow VPN clients full access to the internet but no local access on the server. Would be happy to get some feedback if they can be improved.

Below are the rules. The WireGuard interface is "wg0" and "en0" is the WAN connected to the internet.

~~~~
iptables -A INPUT -i wg0 -m conntrack --ctstate NEW -j ACCEPT
iptables -A OUTPUT -o wg0 -m conntrack --ctstate NEW,ESTABLISHED,RELATED -j ACCEPT
iptables -A FORWARD -i wg0 -o en0 -j ACCEPT
iptables -A FORWARD -i en0 -o wg0 -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -t nat -A POSTROUTING -o en0 -s 10.100.100.0/24 -j MASQUERADE
~~~~

If you set up your clients to use the local DNS server remember to make sure it allows request from the WireGuard interface. Took me some time to figure out that.


## Setting WireGuard up on iOS as a VPN client

This is s simple as it gets. Download the client from the App store. Add a tunnel and pick the "Create from QR code" option. Hold the camera up to the downloaded QR code and you are done.


## Setting WireGuard up on macOS as a VPN client

Install via Homebrew.

~~~~
brew install wireguard-tools
~~~~

Copy the client configuration file you want to use to a good location. I like to use the "~/.config" dir so I put mine in "~/.config/wireguard/wg0.conf". You then use the "wg-quick" command to bring the tunnel up and down like this.

~~~~
wg-quick up ~/.config/wireguard/wg0.conf
wg-quick down ~/.config/wireguard/wg0.conf
~~~~


## Conclusion

Compared to other VPN solutions WireGuard is a breeze to install. Setting up clients is easy as well, especially iOS.

With two connected VPN clients watching YouTube the load barely register on my server, a small Intel NUC. That is very promising.

On the server I can run "wg show" (or just wg) and I get stats for all connected clients. Nice, useful and simple.

It might not be production ready yet but for my use case it works well. I have installed it on all our devices so we can (more) safely connect via out home connection when we are out and about.