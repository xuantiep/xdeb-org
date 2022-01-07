---
title: "Setting up a server firewall with nftables that support WireGuard VPN"
slug: "setting-up-a-server-firewall-with-nftables-that-support-wireguard-vpn"
date: 2019-09-26T14:24:30+02:00
lastmod: 2020-12-21T05:49:39+01:00
author: "Fredrik Jonsson"
tags: ["nftables","server","ansible","security","wireguard","popular"]

---

With Debian 10 (buster) the default firewall is nftables so it's time to convert my iptables rules.

Since Debian stable is never first with anything I was surprised to see how relative few articles and blogs there are about nftables compered to iptables. The official documentation is dense and hard to interpret when you not are a network protocol expert.

At the bottom you find links to the resources I found most useful. With this post I will explain the things I learnt and show the configuration now running on my Debian 10 servers.

After understanding how nftables works I like it better than iptables. Cleaner rules, support for ipv6 natively and the performance is reported to be improved as well. The last bit I will likely not notice much since my servers all have relative low traffic.

(See my iptables set up in [My first 2 minutes on a server - letting Ansible do the work](/post/2016/06/23/my-first-2-minutes-on-a-server-letting-ansible-do-the-work/))

*Update 2020-07-27*: A kind reader noticed that IPv6 ping was not working correctly. Needed to explicitly allow it in the outgoing rules. Setting "policy accept" on the outgoing chain also fixed the issue.

*Update 2020-12-20*: A reader wrote in and kindly offered a tips on how to allow VPN clients to communicate with each other. Might be useful when the VPN server is only used by friends and family. For a public VPN it's not recommended. See the last rule in the incoming chain below.

*Update 2020-12-21*: Updated rules to include use of hook ingress to filter bad packages early. See link at bottom to Samuel Forestier blog post where I learned this.


## Important things I learnt

1. You can name tables, chains etc whatever you like and you can have multiple sets of them. Specific settings on them control what they do and in what order they are run.
2. Whenever you have a need to specify a group of IP addresses, ports, interfaces and what not, use sets. They make rules non repetitive, easy to read and write and allow the system to optimise performance.
3. Rules with "limit" need to be put before rules accepting "established" connections.
4. If you do not have "policy accept" on your outgoing chain you need to explicitly allow IPv6 ICMP.
5. The hook order is good to know, ingress -> prerouting -> input/output/forward -> postrouting

## My nftable config script

This is the rules I run on my servers, the ports will vary depending on services. The WireGuard VPN part I only run on my VPN server.

I have added comments in the script below explaining most parts.

On Debian the nftables configuration file is: `/etc/nftables.conf`

~~~~ shell
#!/usr/sbin/nft -f

# Hook order is: ingress -> prerouting -> input/output/forward -> postrouting

# Start by flushing all the rules.
flush ruleset

# Defining variables is easy in nftables scripts.
define wan = enp3s0
define vpn = wg0
define vpn_net = 10.10.10.0/24

# Setting up a table, simple firewalls will only need one table but there can be multiple.
# The "inet" say that this table will handle both ipv4 (ip) and ipv6 (ip6).
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

  # UDP ports to allow, here we add ports for WireGuard and mosh.
  set udp_accepted {
    type inet_service; flags interval;
    elements = {
      58172, 60000-60100
    }
  }

  # The first chain, can be named anything you like.
  chain incoming {
    # This line set what traffic the chain will handle, the priority and default policy.
    # The priority comes in when you in another table have a chain set to "hook input" and want to specify in what order they should run.
    # Use a semicolon to separate multiple commands on one row.
    type filter hook input priority 0; policy drop;

    # Drop invalid packets.
    ct state invalid drop

    # Drop none SYN packets.
    tcp flags & (fin|syn|rst|ack) != syn ct state new counter drop

    # Limit ping requests.
    ip protocol icmp icmp type echo-request limit rate over 1/second burst 5 packets drop
    ip6 nexthdr icmpv6 icmpv6 type echo-request limit rate over 1/second burst 5 packets drop

    # OBS! Rules with "limit" need to be put before rules accepting "established" connections.
    # Allow all incmming established and related traffic.
    ct state established,related accept

    # Allow loopback.
    # Interfaces can by set with "iif" or "iifname" (oif/oifname). If the interface can come and go use "iifname", otherwise use "iif" since it performs better.
    iif lo accept

    # Allow certain inbound ICMP types (ping, traceroute).
    # With these allowed you are a good network citizen.
    ip protocol icmp icmp type { destination-unreachable, echo-reply, echo-request, source-quench, time-exceeded } accept
    # Without the nd-* ones ipv6 will not work.
    ip6 nexthdr icmpv6 icmpv6 type { destination-unreachable, echo-reply, echo-request, nd-neighbor-solicit,  nd-router-advert, nd-neighbor-advert, packet-too-big, parameter-problem, time-exceeded } accept

    # Allow needed tcp and udp ports.
    iifname $wan tcp dport @tcp_accepted ct state new accept
    iifname $wan udp dport @udp_accepted ct state new accept

    # Allow WireGuard clients to access DNS and services.
    iifname $vpn udp dport 53 ct state new accept
    iifname $vpn tcp dport @tcp_accepted ct state new accept
    iifname $vpn udp dport @udp_accepted ct state new accept
    
    # Allow VPN clients to communicate with each other.
    # iifname $vpn oifname $vpn ct state new accept
  }

  chain forwarding {
    type filter hook forward priority 0; policy drop;

    # Drop invalid packets.
    ct state invalid drop

    # Forward all established and related traffic.
    ct state established,related accept

    # Forward WireGuard traffic.
    # Allow WireGuard traffic to access the internet via wan.
    iifname $vpn oifname $wan ct state new accept
  }

  chain outgoing {
    type filter hook output priority 0; policy drop;

    # I believe settings "policy accept" would be the same but I prefer explicit rules.

    # Drop invalid packets.
    ct state invalid drop

    # Allow all other outgoing traffic.
    # For some reason ipv6 ICMP needs to be explicitly allowed here.
    ip6 nexthdr ipv6-icmp accept
    ct state new,established,related accept
  }
}

# Separate table for hook pre- and postrouting.
# If using kernel 5.2 or later you can replace "ip" with "inet" to also filter IPv6 traffic.
table ip router {
  # With kernel 4.17 or earlier both need to be set even when one is empty.
  chain prerouting {
    type nat hook prerouting priority -100;
  }

  chain postrouting {
    type nat hook postrouting priority 100;

    # Masquerade WireGuard traffic.
    # All WireGuard traffic will look like it comes from the servers IP address.
    oifname $wan ip saddr $vpn_net masquerade
  }
}

# Separate table for hook ingress to filter bad packets early.
table netdev filter {
  # List of ipv4 addresses to block.
  set blocklist_v4 {
    # The "ipv4_addr" are for ipv4 addresses and "flags interval" allows to set intervals.
    type ipv4_addr; flags interval;
    elements = {
      172.16.254.1,172.16.254.2
    }
  }

  chain ingress {
    # For some reason the interface must be hardcoded here, variable do not work.
    type filter hook ingress device enp3s0 priority -500;

    # Drop all fragments.
    ip frag-off & 0x1fff != 0 counter drop

    # Drop bad addresses.
    ip saddr @blocklist_v4 counter drop

    # Drop XMAS packets.
    tcp flags & (fin|syn|rst|psh|ack|urg) == fin|syn|rst|psh|ack|urg counter drop

    # Drop NULL packets.
    tcp flags & (fin|syn|rst|psh|ack|urg) == 0x0 counter drop

    # Drop uncommon MSS values.
    tcp flags syn tcp option maxseg size 1-535 counter drop
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

{{< sponsor >}}


## Useful resources

* [nftables wiki](https://wiki.nftables.org/)
* [Explaining My Configs: nftables · stosb](https://stosb.com/blog/explaining-my-configs-nftables/)
* [[SOLVED] NFTABLES ICMP limit rate not working correctly. / Networking, Server, and Protection / Arch Linux Forums](https://bbs.archlinux.org/viewtopic.php?id=238422)
* [nftables hardening rules and good practices | Samuel Forestier](https://blog.samuel.domains/blog/security/nftables-hardening-rules-and-good-practices)
