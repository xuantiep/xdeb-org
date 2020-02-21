---
title: "Mail relay, MX backup and spam filtering with Postfix"
slug: "mail-relay-mx-backup-and-spam-filtering-with-postfix"
date: 2017-12-20T13:55:52+01:00
lastmod: 2017-12-20T13:55:57+01:00
author: "Fredrik Jonsson"
tags: ["email","ansible","server","spam","popular"]

---

If you run your own mail server it is a good idea to have a MX backup in place. When your mail server goes down or you need to upgrade it, the MX backup will step in and store all mail until the mail server is back up.

A pure MX backup server is bit of a waste so I set mine up to act as a mail relay with spam filtering. Having two of them in separate locations seems like a good idea.

The setup I describe below has with minor changes been running in production since 2014. I recently upgraded them to Debian 9 Stretch and in early 2016 I started using Letsencrypt certs.

The servers handle mail for my own domains, for our company and for a number of customers. In total they deliver a bit over a thousand mail and discarded tens of thousands of spam  per day. They do this with very little server resources.


## Ansible mailrelay role

Complete configurations can be found in my mailrelay role at [frjo/ansible-roles](https://github.com/frjo/ansible-roles) on Github. This is what I use to set up my own servers.

The common role that set up a firewall and other essentials on all my servers and the letsencrypt role for free certs are also on GitHub. If you use them plus the mailrelay role on a Debian 9 Stretch host you will get servers identical to mine.


## Postfix

I have been using [Postfix](http://www.postfix.org/) for more than ten years. It might not be the easiest software to set up but mail in general is a bit complex. Postfix has proven to be extremely stable and reliable, actively maintained, well documented and with a good set of features.

The only separate software used in this setup is [pypolicyd-spf](https://launchpad.net/pypolicyd-spf), a Postfix policy engine for [SPF](http://www.openspf.org/). I have used it for years and it is as stable and good as Postfix itself.

Two external DNSBL services are used as well.

This makes this setup plain and simple, and very stable. Besides upgrading packages when needed they require almost no maintenance.


## Relaying Mail and MX backup

First make sure the server is not an open relay, it would allow anyone sending mail through the server.

~~~~
smtpd_relay_restrictions =
  permit_mynetworks,
  reject_unauth_destination
~~~~

The "reject_unauth_destination" is the vital part.

The following tells postfix what mail to relay and where.

~~~~
relay_domains = hash:/etc/postfix/transport
transport_maps = hash:/etc/postfix/transport
relay_recipient_maps = hash:/etc/postfix/relay_recipients
~~~~

In the "transport" file set up each domain and where it should be relayed. This file is also used for the "relay_domains" parameter that will only read the first column.

~~~~
# /etc/postfix/transport
# run  "postmap  /etc/postfix/transport"  after each edit

example.com    smtp:mail.example.com:25
~~~~

List all recipients that should be relayed in the "relay_recipients" file. Easiest is to simply list a domain and accept all addresses for it.

By instead specifying each real address the mail relay server can discard mail to non existing users directly. Then the list will however need to be updated when you add/remove addresses/mailboxes on your mail server.

~~~~
# /etc/postfix/relay_recipients
# run  "postmap  /etc/postfix/relay_recipients"  after each edit

@example.com        OK

info@example.com    OK
joe@example.com     OK
~~~~

Some other good settings include the maximum message size that I set to 25 MB, same as Gmail. The queue lifetime decides how long the server will keep trying to send mail. I set this to 10 days, this gives ample time to get a mail server up and running again.

~~~~
message_size_limit = 25600000
maximal_queue_lifetime = 10d
~~~~

See [Postfix Configuration Parameters](http://www.postfix.org/postconf.5.html) for a detailed explanation of all the parameters.


## Spam filtering

With some basic spam filtering techniques around 98 percent of incoming mail are discarded with near zero false positives.

My biggest problem is with Swedish spam. For some inexplicable reason it is legal for a business to spam another business in Sweden. Mail services sending out what I consider spam is also sending out legit news letters etc. so one can not outright block them. It is a mess.

By just checking good DNSBL (DNS-based Blackhole List) 95 percent of incoming traffic can be discarded. I use [Spamhaus ZEN](https://www.spamhaus.org/zen/) and [BarracudaCentral](http://barracudacentral.org/rbl), they work really well and are solid services. Good DNSBL are by far the most important part of any spam filtering system.

Since I have paying customers on my servers I use the paid version of Spamhaus ZEN from [Spamhaus Technology](https://www.spamhaustech.com/protecting-mail-streams/ip-reputation-for-email/sbl/). Minimum cost is 250 USD for up to 355 mail users, a small cost for all the spam it stops.


### Postscreen

Postscreen is a fast and light weight process included in Postfix 2.8 and later. It can filter out spam with the help of DNSBL before handing the rest over to the smtp server process. I highly recommend using it, it will keep server loads to a minimal.

~~~~
# Postscreen
postscreen_greet_action = enforce
postscreen_dnsbl_action = enforce
postscreen_blacklist_action = enforce
postscreen_access_list = permit_mynetworks, cidr:/etc/postfix/client_access.cidr
postscreen_dnsbl_sites = zen.spamhaus.org, b.barracudacentral.org
postscreen_cache_map = proxy:btree:$data_directory/postscreen_cache
~~~~

The client_access.cidr file can be used to whitelist (or blacklist) IP addresses. On my mail server I use it to whitelist the IP addresses of the mail relay servers.


### Filter bad attachments

With Postfix mime_header_checks you can easily reject mail with known bad file types. I e.g. block mails with bat|com|exe|jar|pif|scr|swf extensions, this is mostly to protect users with older versions of Windows.

~~~~
# Filter on content in mime headers
mime_header_checks = pcre:/etc/postfix/mime_header_checks
~~~~


### Smtpd recipient restrictions

Most of the remaining spam gets discarded here. The two important parts are the [SPF](http://www.openspf.org/) check and `reject_unknown_reverse_client_hostname`. Some guides suggest `reject_unknown_client_hostname` but I get to many false positive with that. There are a surprising number of mail operators that miss to set up proper [PTR records](https://en.wikipedia.org/wiki/Reverse_DNS_lookup). Do not make the same mistake for your own servers!

~~~~
# Requirement for the recipient address.
smtpd_recipient_restrictions =
  reject_unauth_pipelining,
  reject_non_fqdn_recipient,
  reject_unknown_recipient_domain,
  permit_mynetworks,
  check_client_access cidr:/etc/postfix/client_access.cidr,
  reject_unknown_reverse_client_hostname,
  reject_rbl_client zen.spamhaus.org=127.0.0.10,
  reject_rbl_client zen.spamhaus.org=127.0.0.11,
  reject_rbl_client zen.spamhaus.org,
  reject_rbl_client b.barracudacentral.org,
  reject_unlisted_recipient,
  check_policy_service unix:private/policyd-spf,
  permit
~~~~

See [Postfix Configuration Parameters](http://www.postfix.org/postconf.5.html) for a detailed explanation of all the parameters.


### Bayesian filtering and other text filtering systems

I do not do this on any of my servers.

It complicates things and make false positives more likely. Better to do this on the client side and most mail clients today have good built in support for this. If you are on macOS I highly recommend [SpamSieve](https://c-command.com/spamsieve/).


## MX records

With the servers up and running you need to reconfigure the DNS and make MX records for the new servers.

With this MX setup in the DNS:

~~~~
example.com.  MX  10  mx1.example.com.
example.com.  MX  20  mx2.example.com.
~~~~

Incoming mail flows like this:

~~~~
                    mx1.example.com ->
Incoming mail ->                        mail.example.com
                    mx2.example.com ->
~~~~


## Paid mail relay services

If you are in Sweden and do not want to run your own mail relay and mx backup servers please have a look at my service [Mail relay, MX backup och skräppostfilter](https://xdeb.net/mailrelay). All the servers are in Sweden, one of the reasons I set them up to begin with.

A big commercial service that seems to have good reputation is [Mail route](https://www.mailroute.net/). I have not used them myself. They have more advanced filtering and a web interface to handle settings, false positives etc.
