---
title: "Setting up a server firewall with nftables that support WireGuard VPN"
date: 2019-09-26T14:24:30+02:00
lastmod: 2019-10-14T10:50:27+02:00
author: "Fredrik Jonsson"
tags: ["nftables","server","ansible","security","wireguard"]

---

With Debian 10 (buster) the default firewall is nftables so it's time to convert ny iptables rules.

Since Debian stable is never first with anything I was surprised to see how relative few articles and blogs there are about nftables compered to iptables. The official documentation is dense and hard to interpret when you not are a network protocol expert.

At the bottom you find links to the resources I found most useful. With this post I will explain the things I learnt and show the configuration now running on my Debian 10 servers.

After understanding how nftables works I like it better than iptables. Cleaner rules, support for ipv6 natively and the performance is reported to be improved as well. The last bit I will likely not notice much since my servers all have relative low traffic.

(See my iptables set up in [My first 2 minutes on a server - letting Ansible do the work](/post/2016/06/23/my-first-2-minutes-on-a-server-letting-ansible-do-the-work/))


## My nftable config script

This is the rules I run on my servers, the ports will vary depending on services. The WireGuard VPN part I only run on my VPN server.

I have added comments in the script below explaining most parts.

On Debian the nftables configuration file is: `/etc/nftables.conf`

~~~~ shell
#!/usr/sbin/nft -f

# Start by flushing all the rules.
flush ruleset

# Defining variables is easy in nftables scripts.
define wan = enp3s0

# Setting up a table, simple firewalls will only need one table but there can be multiple.
# The "init" say that this table will handle both ipv4 (ip) and ipv6 (ip6).
# The name is "firewall" you can name it anything you like.
table inet firewall {
  # Sets are dictionaries and maps of ports, addresses etc.
  # These can then easily be used in the rules.
  # Sets can be named whatever you like.
  # TCP ports to allow, here we add ssh, http and https.
  set tcp_accepted {
    # The "inet_service" are for tcp/udp ports and "flags interval" allows to set intervals, see the mosh ports below.
    type inet_service; flags interval;
    elements = {
      22,80,443
    }
  }
  # UDP ports to allow, here we add a port for WireGuard and mosh.
  set udp_accepted {
    type inet_service; flags interval;
    elements = {
      58172, 60000-60100
    }
  }
  # List of ipv4 addresses to blacklist.
  set blacklist_v4 {
    # The "ipv4_addr" are for ipv4 addresses and "flags interval" allows to set intervals.
    type ipv4_addr; flags interval;
    elements = {
      172.16.254.1,172.16.254.2
    }
  }

  # The first chain, can be named anything you like.
  chain incoming {
    # This line set what traffic the chain will handle, the priority and default policy.
    # The priority comes in when you in another table have a chain set to "hook input" and want to specify in what order they should run.
    # Use a semicolon to separate multiple commands on one row.
    type filter hook input priority 0; policy drop;

    # Limit ping requests.
    ip protocol icmp icmp type echo-request limit rate over 1/second burst 5 packets drop
    ip6 nexthdr icmpv6 icmpv6 type echo-request limit rate over 1/second burst 5 packets drop

    # OBS! Rules with "limit" need to be put before rules accepting "established" connections.
    ct state established,related accept
    ct state invalid drop

    # Allow loopback.
    # Interfaces can by set with "iif" or "iifname" (oif/oifname). If the interface can come and go use "iifname", otherwise use "iif" since it performs better.
    iif lo accept

    # Blacklist bad addresses.
    # This is how sets are used in rules, a "@" and the name of the set.
    # In nftable you need to add a counter statement to have the rule count matches.
    # Only add counter if you need it, it has a small performance hit. I add it to
    # rules I'm unsure how useful/accurate they are.
    ip saddr @blacklist_v4 counter drop

    # Drop all fragments
    ip frag-off & 0x1fff != 0 counter drop

    # Force SYN checks
    tcp flags & (fin|syn|rst|ack) != syn ct state new counter drop

    # Drop XMAS packets
    tcp flags & (fin|syn|rst|psh|ack|urg) == fin|syn|rst|psh|ack|urg counter drop

    # Drop NULL packets
    tcp flags & (fin|syn|rst|psh|ack|urg) == 0x0 counter drop

    # Allow certain inbound ICMP types (ping, traceroute).
    # With these allowed you are a good network citizen.
    ip protocol icmp icmp type { destination-unreachable, echo-reply, echo-request, source-quench, time-exceeded } accept
    # Without the nd-* ones ipv6 will not work.
    ip6 nexthdr icmpv6 icmpv6 type { destination-unreachable, echo-reply, echo-request, nd-neighbor-solicit,  nd-router-advert, nd-neighbor-advert, packet-too-big, parameter-problem, time-exceeded } accept

    # Allow needed tcp and udp ports.
    iifname $wan tcp dport @tcp_accepted ct state new accept
    iifname $wan udp dport @udp_accepted ct state new accept

    # Allow WireGuard clients to access DNS and services.
    iifname wg0 udp dport 53 ct state new accept
    iifname wg0 tcp dport @tcp_accepted ct state new accept
    iifname wg0 udp dport @udp_accepted ct state new accept
  }

  chain forwarding {
    type filter hook forward priority 0; policy drop;

    ct state established,related accept
    ct state invalid drop

    # Forward WireGuard traffic.
    iifname wg0 oifname $wan ct state new accept
  }

  chain outgoing {
    type filter hook output priority 0; policy drop;

    ct state new,established,related accept
    ct state invalid drop
  }
}

table ip router {
    chain prerouting {
        type nat hook prerouting priority 0;
    }
    chain postrouting {
        type nat hook postrouting priority 100;

        # Masquerade WireGuard traffic.
        oifname $wan ip saddr 10.10.10.0/24 masquerade
    }
}
~~~~

I generate the above from [an Ansible template](https://github.com/frjo/ansible-roles/blob/master/common/templates/etc/nftables.conf.j2) in my "common" role that I deploy to all my servers. See [frjo/ansible-roles](https://github.com/frjo/ansible-roles) for more information.


## Monitor nftables

To see all active rules:

~~~~
$ nft list ruleset
~~~~

To see a specific table:

~~~~
$ nft list table inet firewall
~~~~

Flush all the rules. This will leave the server completely open.

~~~~
$ nft flush ruleset
~~~~


## Useful resources

* [nftables wiki](https://wiki.nftables.org/)
* [Explaining My Configs: nftables · stosb](https://stosb.com/blog/explaining-my-configs-nftables/)
* [[SOLVED] NFTABLES ICMP limit rate not working correctly. / Networking, Server, and Protection / Arch Linux Forums](https://bbs.archlinux.org/viewtopic.php?id=238422)