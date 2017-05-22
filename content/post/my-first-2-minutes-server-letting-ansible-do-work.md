---
title: "My first 2 minutes on a server - letting Ansible do the work"
date: 2016-06-23T08:15:07+02:00
lastmod: 2017-05-07T07:55:10+02:00
author: "Fredrik Jonsson"
tags: ["debian","server","ansible","security","technology"]
aliases: ["node/1615"]

---



After reading articles like [My First 5 Minutes On A Server](https://plusbryan.com/my-first-5-minutes-on-a-server-or-essential-security-for-linux-servers) by Bryan Kennedy and [My First 10 Minutes On a Server](http://www.codelitt.com/blog/my-first-10-minutes-on-a-server-primer-for-securing-ubuntu/) by Cody Littlewood I was inspired to write up how I setup a new server.

There are no special tricks in the way I setup servers to make them secure.

I use stock Debian packages so they will be automatically updated with apt-get. I try to run only a few services per server. Normally opt for the tried and tested (or old and boring) solution instead of something new and fancy.

I use [Ansible](https://www.ansible.com/) to handle all the configurations of my servers and have two separate backups. First my hosting provider run backups of the complete disks, secondly I backup all content (web sites, databases, mail etc.) to Amazon S3 with a write only user (so a intruder on a server can't delete my backups).

I monitor the servers via logcheck, logwatch and debsums. (At some point I will most likely set up a logging server and send all logs there.)

The day I do get hacked I believe I have a good chance of noticing it within a day or so. I also will be able to recreate the servers quickly with at most one day of lost content. This is good enough for me.

I do not create that many new servers per year and are using Ansible a lot more for maintaining servers than creating new ones. Last year however saw the release of Debian GNU/Linux 8 Jessie so I had a reason to update my playbooks and recreate my servers.

It feels a lot longer but I have only used Ansible since 2014. Before that I used Puppet a bit but never to the extent that I now use Ansible. Settings up a server without Ansible today feels a bit like handling code without git. I of course version control my playbooks and roles with git.


## Step 0 - Create a new server

I create the server via the control panel of my hosting provider (I have used [GleSYS](https://www.glesys.com/) for years). There I also set the root password and set up the DNS entries for the server.

Now I have a server with a host name and a (very long and good) root password.

Then it is time for Ansible to configure the server. I have only tested my Ansible tasks with Debian 8 Jessie so if you use something else you will need to make the appropriate adjustments.

## Step 1 - Run first setup

Below are my "first setup" Ansible playbook that copy a public ssh key and change the ssh port to 2222. It will also do a dist upgrade of Debian. Using port 2222 does not add much for security but it does avoid a lot of log entries caused by failed login attempts.

File: `first_setup.yml`

~~~~
---
- name: First setup of new server
  gather_facts: no
  hosts:
     - "{{ target }}"
  remote_user: root
  port: 22
  tasks:
    - name: update the package list
      apt:
        update_cache: yes
        cache_valid_time: 3600
    - name: upgrade a server with apt-get
      apt:
        upgrade: dist
      register: upgrade
    - name: copy ssh id
      authorized_key:
        user: root
        key: "{{ item }}"
        manage_dir: no
      with_file:
        - "{{ ssh_key }}"
    - name: set ssh port to 2222
      replace:
        dest: /etc/ssh/sshd_config
        regexp: '^Port 22$'
        replace: 'Port 2222'
    - name: restart ssh
      service:
        name: ssh
        state: restarted
~~~~

I run this playbook with the following command:

~~~~
$ ansible-playbook --ask-pass first_setup.yml --extra-vars "ssh_key=/path/to/ssh-pub-key.pub target=new.example.com"
~~~~

With "ask-pass" Ansible will ask for the ssh password. This is the only time I use the root password for a server.


## Step 3 - Pick a playbook for the server

With the first setup done I run the appropriate playbook for the server. All my playbooks include the "common" role. Available at [github/frjo/ansible-roles](https://github.com/frjo/ansible-roles).

### Tasks in my common role

#### apt

Makes sure the sources list points to good mirrors and include the security and backport repositories.

#### apticron

Runs apt-get update and send a e-mail report when new packages are available.

#### debsums

A simple way to keep tabs on if any package files change on the server. I have another role called "monitoring" where I add things like munin (if needed), logwatch and logcheck and make debsums run on cron.daily.

#### dnsmasq

Sets up a local forwarding only cacheing DNS.

#### iptables-persistent

Set up a firewall with iptables for ipv4 and ipv6.

This is the template I use for ipv4. A "openports_list" variable set what ports should be open for this server. The udp part is only for mosh, see below. These rules will get loaded and then saved to a "rules.v4" file that iptables-persistent will load on startup.

By default everything is dropped. Then some common rules to allow loopback, drop bad traffic etc. I allow some ICMP traffic to be a good network citizen and the ports needed for the services the server will run.

~~~~
*filter
# Delete all rules and chains
-F
-X

# DROP all by default
-P INPUT DROP
-P FORWARD DROP
-P OUTPUT DROP

{% if blacklist_ip_list is defined %}
# Blacklist
-N BLACKLIST
{% for blacklist_ip in blacklist_ip_list %}
-A BLACKLIST -s {{ blacklist_ip }} -j DROP
{% endfor %}
-A INPUT -j BLACKLIST
{% endif %}

# Allow loopback
-A INPUT -i lo -j ACCEPT
-A OUTPUT -o lo -j ACCEPT

# Force SYN checks
-A INPUT -p tcp ! --syn -m conntrack --ctstate NEW -j DROP

# Drop all fragments
-A INPUT -f -j DROP

# Drop XMAS packets
-A INPUT -p tcp --tcp-flags ALL ALL -j DROP

# Drop NULL packets
-A INPUT -p tcp --tcp-flags ALL NONE -j DROP

# Drop all packets that are going to broadcast, multicast or anycast address.
-A INPUT -m addrtype --dst-type BROADCAST -j DROP
-A INPUT -m addrtype --dst-type MULTICAST -j DROP
-A INPUT -m addrtype --dst-type ANYCAST -j DROP
-A INPUT -d 224.0.0.0/4 -j DROP


# Allow only ESTABLISHED and RELATED incomming
-A INPUT -i {{ ansible_default_ipv4.interface }} -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Allow all outbound
-A OUTPUT -o {{ ansible_default_ipv4.interface }} -m conntrack --ctstate NEW,ESTABLISHED,RELATED -j ACCEPT

# Allow certain inbound ICMP types (ping, traceroute)
-A INPUT -i {{ ansible_default_ipv4.interface }} -p icmp --icmp-type destination-unreachable -m limit --limit 1/second -j ACCEPT
-A INPUT -i {{ ansible_default_ipv4.interface }} -p icmp --icmp-type echo-reply -m limit --limit 1/second -j ACCEPT
-A INPUT -i {{ ansible_default_ipv4.interface }} -p icmp --icmp-type echo-request -m limit --limit 1/second -j ACCEPT
-A INPUT -i {{ ansible_default_ipv4.interface }} -p icmp --icmp-type fragmentation-needed -m limit --limit 1/second -j ACCEPT
-A INPUT -i {{ ansible_default_ipv4.interface }} -p icmp --icmp-type source-quench -m limit --limit 1/second -j ACCEPT
-A INPUT -i {{ ansible_default_ipv4.interface }} -p icmp --icmp-type time-exceeded -m limit --limit 1/second -j ACCEPT

# Allow needed services from anywhere
-A INPUT -i {{ ansible_default_ipv4.interface }} -p tcp -m multiport --dport {{ openports_list|join(',') }} -m conntrack --ctstate NEW -j ACCEPT

{% if openports_udp_list is defined %}
{% for openports_udp in openports_udp_list %}
-A INPUT -i {{ ansible_default_ipv4.interface }} -p udp --dport {{ openports_udp }} -m conntrack --ctstate NEW -j ACCEPT
{% endfor %}
{% endif %}
COMMIT
~~~~

#### mosh

Mosh is a drop in replacement for SSH. It's more robust and responsive, especially over Wi-Fi, cellular, and long-distance links. It's really good! Read more at [Mosh: the mobile shell](https://mosh.mit.edu/).

#### needrestart

Needrestart checks which daemons need to be restarted after library upgrades.

#### ntp

Sets up a Network Time Protocol daemon to make sure the servers time is accurate.

#### ssh

Configure sshd to use port 2222, only allow ssh-key logins, adds a ssh_host_ed25519_key and remove hosts keys for dsa and ecdsa.

### The letsencrypt role

Letsencrypt has made using TLS everywhere a lot easier. Read more at [Let's Encrypt my servers with acme tiny](/node/1614).

Take a look at the role I use here [github/frjo/ansible-roles](https://github.com/frjo/ansible-roles).


## Step n+ - Keep the servers updated

Keeping the system, and the applications that runs on it, up to date is crucial for security.

This is the role I run when apticron reports that there are packages that needs updating. Needrestart checks which daemons need to be restarted after library upgrades. Deamons could be running old, possible insecure code, for some time otherwise.

~~~~
---
- name: Run apt-get update/upgrade on all servers
  gather_facts: no
  hosts: all
  remote_user: root
  port: 2222
  tasks:
    - name: update the package list
      apt:
        update_cache: yes
        cache_valid_time: 3600
    - name: upgrade a server with apt-get
      apt:
        upgrade: dist
      register: upgrade
    - name: run needrestart
      command: needrestart -r a
      when: upgrade.changed
~~~~


