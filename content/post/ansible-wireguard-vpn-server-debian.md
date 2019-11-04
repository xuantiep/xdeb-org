---
title: "Using Ansible to setup a WireGuard VPN server on Debian"
date: 2019-01-24T13:19:21+01:00
lastmod: 2019-11-04T14:05:56+01:00
author: "Fredrik Jonsson"
tags: ["security","vpn","wireguard","ansible"]
aliases:
    - /post/2019/01/24/using-ansible-to-setup-a-wireguard-vpn-server-on-debian-9/

---

I have been watching the [WireGuard project](https://www.wireguard.com/) with interest for a couple of years. I like how WireGuard is constructed. A small code base that focus on the core functionality. The use of standard Linux networking tools and simple public/private keys.

They recently released iOS and macOS clients. A good time to try it out on my small home server.

The WireGuard project clearly states that it is under development and should be considered experimental. That said it seems to work well and several VPN providers have added support for it. There is also plans to include it directly in to the Linux kernel.

*Update 2019-11-04*: I have been running this Wireguard setup for ten month now and it just works. Mainly use it when connecting from public Wi-Fi in hotels and airports. I once forgot to turn it off for a whole day without noticing it.

(*Update 2019-11-04, part 2*: The old Debian 9 version of this article redirects here since they are nearly identical. The main difference is iptables vs nftables for the firewall. With nftables I implement the VPN rules in the main nftables configuration and not in WireGuard PostUp/PostDown.)

## Setting up WireGuard as a VPN server on Debian with Ansible

You find my WireGuard Ansible role at [frjo/ansible-roles](https://github.com/frjo/ansible-roles). This will set up WireGuard as a VPN server allowing clients to connect and access the internet. I got a lot of help from [iamckn/wireguard_ansible](https://github.com/iamckn/wireguard_ansible) when I created my role.

The iOS client support configuration via QR codes so I added that to my setup. The last step in the role will download the client configurations files and QR codes as PNG images to your local machine.

The Debian 10 version of the WireGuard role do not include any PostUp/PostDown iptables rules to set up the firewall. If you want them look at this [old version](https://github.com/frjo/ansible-roles/blob/f9ff3fc4c6b5bbe422a12e76e9d071b2865af10b/wireguard/templates/etc/wireguard/wg0.conf.j2) of the wg0 conf file.

With nftables in Debian 10 I opted to add the VPN rules directly to the nftables configuration file. Read more about nftables in [Setting up a server firewall with nftables that support WireGuard VPN](/post/2019/09/26/setting-up-a-server-firewall-with-nftables-that-support-wireguard-vpn/).

The rules allow VPN clients to access the internet, the DNS on the server and all active services on the server (web, mail or what you have running). 

The relevant parts are repeated here.

~~~~ shell
table inet firewall {
  # A lot of stuff here.
  …
  
  chain incoming {
    # A lot of stuff here.
    …

    # Allow WireGuard clients to access DNS and services.
    iifname $vpn udp dport 53 ct state new accept
    iifname $vpn tcp dport @tcp_accepted ct state new accept
    iifname $vpn udp dport @udp_accepted ct state new accept
  }

  chain forwarding {
    type filter hook forward priority 0; policy drop;

    # Forward all established and related traffic. Drop invalid traffic.
    ct state established,related accept
    ct state invalid drop

    # Forward WireGuard traffic.
    # Allow WireGuard traffic to access the internet via wan.
    iifname $vpn oifname $wan ct state new accept
  }

  chain outgoing {
    type filter hook output priority 0; policy drop;

    # Allow all outgoing traffic. Drop invalid traffic.
    # I believe settings "policy accept" would be the same but I prefer explicit rules.
    ct state new,established,related accept
    ct state invalid drop
  }
}

table ip router {
    # Both need to be set even when one is empty.
    chain prerouting {
        type nat hook prerouting priority 0;
    }
    chain postrouting {
        type nat hook postrouting priority 100;

        # Masquerade WireGuard traffic.
        # All WireGuard traffic will look like it comes from the servers IP address.
        oifname $wan ip saddr $vpn_net masquerade
    }
}
~~~~

## Setting WireGuard up on iOS as a VPN client

This is as simple as it gets. Download the client from the App store. Add a tunnel and pick the "Create from QR code" option. Hold the camera up to the downloaded QR code and you are done.


## Setting WireGuard up on macOS as a VPN client

Update 2019-03-31: There is now a Wireguard client in the [macOS App store](https://itunes.apple.com/se/app/wireguard/id1451685025?mt=12). This makes the macOS setup even easier. Install the client, import the configuration file and you are up and running.

The go command line version is also available and works equally well.

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

Compared to other VPN solutions WireGuard is a breeze to install. Setting up clients is easy as well, especially on iOS.

With two connected VPN clients watching YouTube videos, the load barely register on my server. That is very promising.

On the server I can run "wg show" (or just wg) and I get stats for all the connected clients. Nice, useful and simple.

It might not be production ready yet but for my use case it works well. I have installed it on all our devices so we can (more) safely connect via our home connection when we are out and about.