---
title: "Run your own mail server with Postfix and Dovecot"
slug: "run-your-own-mail-server-with-postfix-and-dovecot"
date: 2018-02-07T14:58:54+01:00
lastmod: 2018-05-18T14:46:11+02:00
author: "Fredrik Jonsson"
tags: ["email","ansible","server","spam","popular"]

---

Ansible role with commentary for setting up your own mail server with Postfix and Dovecot.

This could be considered a part two of [Mail relay, MX backup and spam filtering with Postfix](/post/2017/12/20/mail-relay-mx-backup-and-spam-filtering-with-postfix/). Many postfix configurations are identical between these setups.

**Updated 2018-05-18:** Added more configuration files and instructions how to use the Ansible role.


## Why

Anyone can set up their own mail server and start exchanging e-mail with every other Internet user in the world. I think this is amazing.

So many things on the Internet today is controlled by a handful of tech giants. E-mail is something you can and should control yourself. It's a bit complex to setup but done right it's stable and low maintenance.

I have run my own mail servers for well over a decade. The setup I describe below has with minor changes been running in production since 2013. I recently upgraded them to Debian 9 Stretch and in early 2016 I started using Letsencrypt certs.

I host domains for my company and my family so mail between us are reasonably privat since all traffic uses TLS. E-mail is not a secure way to communicate but with your own server your mail is at least not used to target you for ads and what not.


## To get started

Don't be [a cargo cult sysadmin](http://blog.lastinfirstout.net/2009/11/cargo-cult-system-administration.html), read the documentation.

* [Postfix Configuration Parameters](http://www.postfix.org/postconf.5.html)
* [Dovecot Wiki](https://wiki2.dovecot.org/)
* [Postfixadmin install](https://github.com/postfixadmin/postfixadmin/blob/master/INSTALL.TXT)
* [Postfixadmin 3 manual](https://blog.cboltz.de/uploads/postfixadmin-30-english.pdf) (PDF)
* [Getting Started with Ansible](https://www.ansible.com/resources/get-started)


## Ansible mailserver role

Complete configurations can be found in my [Ansible](https://www.ansible.com/) mailserver role at [frjo/ansible-roles](https://github.com/frjo/ansible-roles) on Github. This is what I use to set up my own servers.

The common role that set up a firewall and other essentials on all my servers, the letsencrypt role for free certs and the dbserver role are also on GitHub. At the moment you will need to setup a web server with PHP support yourself, or take a look at [Running Drupal on Debian 9 with Apache 2.4, HTTP/2, event MPM and PHP-FPM (via socks and proxy)](/post/2017/11/09/running-drupal-on-debian-9-with-apache-2-4-http2-event-mpm-and-php-fpm-via-socks-and-proxy/).

More on how I use Ansible can be found in my post [My first 2 minutes on a server - letting Ansible do the work](/post/2016/06/23/my-first-2-minutes-on-a-server---letting-ansible-do-the-work/).

### What you will get

* Mail server with (almost) only standard Debian 9 packages so easy to keep updated via apt.
* Virtual domains, mailboxes and aliases stored in [MariaDB](https://mariadb.com/) (MySQL but better).
* Postfix for SMTP with opportunistic TLS, SPF and Postscreen configured.
* Dovecot for IMAP/POP with required TLS.
* [PostfixAdmin](https://github.com/postfixadmin/postfixadmin) - web based administration interface for Postfix mail servers. (the only non Debian package)
* Spam filtering with DNSBL [Spamhaus ZEN](https://www.spamhaus.org/zen/) and [BarracudaCentral](http://barracudacentral.org/rbl).
* Support for address extensions, `user+whatever@example.com` addresses.
* Striping of outgoing mail headers that reveal unneeded information like users IP address, mail client etc.

### What you will not get

* Webmail, see no use for that now that most people have a smartphone with a e-mail client built in.
* Bayesian filtering or other text filtering systems. I believe this belongs on the client side.
* DKIM/DMARK, I find them cumbersome and of no benefit.

### How to use the Ansible role

If you are not already using Ansible take a look at [Getting Started with Ansible](https://www.ansible.com/resources/get-started).

**Step 1:** Set up the directory structure and files needed.

~~~~
ansible-playbooks/:
    mail-server-playbook.yml
    host_vars/
        your.host.yml
    roles/
        common/
        dbserver/
        letsencrypt/
        mailserver/
    vars/
        passwords.yml
~~~~

**Step 2:** Set up a playbook, above I named it "mail-server-playbook.yml".

~~~~
---
- name: Apply configuration to mail server
  hosts:
    - your.host
  remote_user: root
  port: 2222
  roles:
    - common
    - dbserver
    - mailserver
  vars_files:
    - vars/passwords.yml
~~~~

**Step 3:** In "host_vars/your.host.yml" you add all the variables needed. The roles have sensible defaults (see "defaults/main.yml" in each role) but some things need to be set for each host.

~~~~
---
acme_certs_dir: "/etc/ssl/letsencrypt"
acme_domains:
  - your.host
  - www.your.host
  - other.your.host
acme_services:
  - apache2
  - dovecot
  - postfix
openports_list:
  - 25
  - 80
  - 443
  - 587
  - 993
  - 995
  - 2222
openports_udp_list:
  - "60000:60100"
~~~~

**Step 4:** The "vars/passwords.yml" file is a good place to keep all the passwords needed. I recommend using the  "ansible-vault" command to have it encrypted.

~~~~
---
ssl_key_passwd: a-good-password
db_root_passwd: a-good-password
db_backup_passwd: a-good-password
postfix_db_passwd: a-good-password
postfix_admin_db_passwd: a-good-password
acme_account_key_passwd: a-good-password
~~~~

**Step 5:** Run the playbook.

~~~~
$ ansible-playbook mail-server-playbook.yml
~~~~

## DNS - get this right and good things will follow

Make sure the servers IP address [is not blocklisted](https://mxtoolbox.com/blacklists.aspx). It need to be a static address in good standing or your mail will get marked as junk.

The DNS record should look something like this. Please do not forget to set a valid PTR (pointer) record. In best case it should be the reverse of the A record but it must exist and be a valid address for the server.

~~~~
mail.example.com.	3600	IN	A	123.4.5.6
6.5.4.123.in-addr.arpa.	3600	IN	PTR	mail.example.com.
~~~~

With the MX record you tell all other mail servers what server handle the mail for your domain.

~~~~
example.com.		3600	IN	MX	10 mail.example.com.
~~~~

If you set up some mail relay servers as I have done your MX record might look like this.

~~~~
example.com.		3600	IN	MX	10 mx1.example.com.
example.com.		3600	IN	MX	20 mx2.example.com.
~~~~

The SPF record tells other mail servers what servers are allowed to send mail for your domain.

The following is what I often use. It says that servers with a A or MX record for the domain is valid but none other. If you are using other external services to send mail from your domain you need to add them as well.

~~~~
example.com.		3600	IN	TXT	"v=spf1 mx a -all"
~~~~

If you run your web server on a separate host and have the MX records pointed at mail relays you can explicitly add the mail servers A record like this.

~~~~
example.com.		3600	IN	TXT	"v=spf1 a a:mail.example.com mx -all"
~~~~

If you like some of my customers use Mailgun (or other services) to send out mail remember to add them to your SPF record. For Mailgun it looks like this.

~~~~
example.com.		3600	IN	TXT	"v=spf1 a mx include:mailgun.org -all"
~~~~


## Dovecot

Postfix handles the sending and receiving of mail. Dovecot is what users, or rather their mail client of choice, connect to when they want to read the mail.

[Dovecot](https://www.dovecot.org/) is the most [standard compliant](https://imapwiki.org/ImapTest/ServerStatus) IMAP server and it just works. I used Courier for the first few years but never looked back after switching to Dovecot.

It supports the IDLE command so mail will arrive almost instantaneously on desktop mail clients that support it. Push support for iOS would be really nice to have and it's [possible to get working](https://github.com/st3fan/dovecot-xaps-daemon) but it's not straight forward.

Dovecot configuration consist mostly of making it talk with Postfix and MariaDB for user authentication. Postfix will handle all authentication via Dovecot.

~~~~
auth_cache_size = 1M
auth_cache_ttl = 1 hour
auth_cache_negative_ttl = 1 hour

disable_plaintext_auth = yes
auth_mechanisms = plain login

mail_uid = vmail
mail_gid = vmail

mail_location = maildir:/var/spool/vmail/%d/%n

default_process_limit = 150

ssl = required

ssl_protocols = !SSLv3

{% if acme_certs_dir_check.stat.isdir is defined %}
ssl_cert = <{{ acme_certs_dir }}/{{ acme_domains[0] }}/fullchain.pem
ssl_key = <{{ acme_certs_dir }}/domain.key
{% endif %}

protocol imap {
  mail_max_userip_connections = 30
}

namespace inbox {
  separator = .
  inbox = yes

  mailbox Drafts {
    special_use = \Drafts
  }
  mailbox Junk {
    special_use = \Junk
  }
  mailbox Sent {
    special_use = \Sent
  }
  mailbox "Sent Messages" {
    special_use = \Sent
  }
  mailbox Trash {
    special_use = \Trash
  }
}

passdb {
  driver = sql
  args = /etc/dovecot/local-sql.conf
}

userdb {
  driver = static
  args = uid=vmail gid=vmail home=/var/spool/vmail/%d/%n
}

service imap-login {
  # Number of processes to always keep waiting for more connections.
  process_min_avail = 2
}

service lmtp {
  unix_listener /var/spool/postfix/private/dovecot-lmtp {
    mode = 0666
    group = postfix
    user = postfix
  }

  user = vmail
}

service auth {
  unix_listener auth-userdb {
    mode = 0666
    user = vmail
    group = vmail
  }

  # Postfix smtp-auth
  unix_listener /var/spool/postfix/private/auth {
    mode = 0666
    user = postfix
    group = postfix
  }

  # Auth process is run as this user.
  user = $default_internal_user
}

service auth-worker {
  user = $default_internal_user
}
~~~~

~~~~
driver = mysql
connect = host=localhost dbname=postfix user=postfix password={{ postfix_db_passwd }}
default_pass_scheme = SHA512-CRYPT
password_query = SELECT username AS user, password FROM mailbox WHERE username = '%u' AND active = '1'
~~~~


## Postfix

A lot of the Postfix configuration is identical to the Mail Relay setup, see article link above. What follows is a quick overview of some Postfix configurations specific for the mail server.

The Ansible role will set up all this but it's good to understand what it does and why.

### Let Postfix in chroot jail access MariaDB sock

On Debian Postfix is by default set up to run in a chroot environment. This provides a significant barrier against intrusion. It also creates a stumbling block since it stops Postfix from accessing files outside the chroot jail.

By mounting `/var/run/mysqld` in `/var/spool/postfix/var/run/mysqld` we allow the postfix processes to access the MariaDB sock and all is well.


### Authenticate via Dovecot

This will make Postfix authenticate users via Dovecot. Users mail clients will connect directly to Postfix for sending mail and we need them to authenticate.

~~~~
# SASL settings
smtpd_sasl_auth_enable = yes
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_authenticated_header = yes
~~~~


### Virtual domains, mailboxes and aliases stored in MariaDB

This makes it possible to host multiple domains on one single mail server. Postfix will look up mailboxes and aliases in the database and deliver valid mail to dovecot or send onward if an alias point to an external address.

All local mail will be stored in the `/var/spool/vmail` directory belonging to the vmail user.

~~~~
virtual_minimum_uid = 5000
virtual_gid_maps = static:5000
virtual_uid_maps = static:5000
virtual_mailbox_base = /var/spool/vmail
virtual_alias_domains =
virtual_alias_maps = proxy:mysql:/etc/postfix/mysql_virtual_alias_maps.cf
virtual_mailbox_domains = proxy:mysql:/etc/postfix/mysql_virtual_domains_maps.cf
virtual_mailbox_maps = proxy:mysql:/etc/postfix/mysql_virtual_mailbox_maps.cf
virtual_transport = dovecot
dovecot_destination_recipient_limit = 1
default_destination_concurrency_limit = 5
relay_destination_concurrency_limit = 1
~~~~


### Administer with PostfixAdmin

PostfixAdmin is a web interface written in PHP. It's simple but works well for administering mailboxes and aliases for multiple domains.

The playbook is not using the latest version since I had trouble getting that to work. Since the older version works without issues I have not put a lot of time investigating the problem.

To be on the safe side I put it behind an Apache basic auth protection.

~~~~
<?php

$CONF['configured'] = true;
$CONF['database_type'] = 'mysqli';
$CONF['database_host'] = 'localhost';
$CONF['database_user'] = $_SERVER['DB_USER'];
$CONF['database_password'] = $_SERVER['DB_PASS'];
$CONF['database_name'] = 'postfix';
$CONF['admin_email'] = 'postmaster@{{ ansible_domain }}';
$CONF['encrypt'] = 'dovecot:SHA512-CRYPT';
$CONF['dovecotpw'] = "/usr/bin/doveadm pw";
$CONF['password_validation'] = array(
#    '/regular expression/' => '$PALANG key (optional: + parameter)',
    '/.{14}/'               => 'password_too_short 15',     # minimum length 14 characters
    '/([a-zA-Z].*){4}/'     => 'password_no_characters 4',  # must contain at least 4 characters
);
$CONF['generate_password'] = 'YES';
$CONF['page_size'] = '50';
$CONF['default_aliases'] = array (
    'abuse' => 'abuse@{{ ansible_domain }}',
    'hostmaster' => 'hostmaster@{{ ansible_domain }}',
    'postmaster' => 'postmaster@{{ ansible_domain }}',
    'webmaster' => 'webmaster@{{ ansible_domain }}'
);
$CONF['domain_path'] = 'YES';
$CONF['domain_in_mailbox'] = 'NO';
$CONF['aliases'] = '100';
$CONF['mailboxes'] = '100';
$CONF['maxquota'] = '1024';
$CONF['domain_quota_default'] = '10240';
$CONF['alias_domain'] = 'NO';
$CONF['fetchmail'] = 'NO';
$CONF['show_footer_text'] = 'NO';
$CONF['show_undeliverable']='NO';
$CONF['show_status']='NO';
$CONF['welcome_text'] = <<<EOM
Hi,

Welcome to your new account at {{ ansible_domain }}.
EOM;
~~~~


### Removing headers on outgoing mail for security reasons

With smtp_header_checks you can manipulate the headers of mail sent out from the server by users. I use it to remove some headers for security reasons.

I remove X-Originating-IP, information about the mail client and the received header. This way the e-mail will appear to originate from the mail server itself and not reveal unnecessary information about the sending device/user.

~~~~
# /etc/postfix/smtp_header_checks
#
# /^HEADER:.*content_to_act_on/ ACTION [MESSAGE]

/^Received:/                 IGNORE
/^User-Agent:/               IGNORE
/^X-Mailer:/                 IGNORE
/^X-Originating-IP:/         IGNORE
~~~~

{{< sponsor >}}

## Further reading

Ars Technica has a four part article series "Taking e-mail back" that has a lot of good information.

* [Taking e-mail back - part 1](https://arstechnica.com/information-technology/2014/02/how-to-run-your-own-e-mail-server-with-your-own-domain-part-1/)
* [Taking e-mail back - part 2](https://arstechnica.com/information-technology/2014/03/taking-e-mail-back-part-2-arming-your-server-with-postfix-dovecot/)
* [Taking e-mail back - part 3](https://arstechnica.com/information-technology/2014/03/taking-e-mail-back-part-3-fortifying-your-box-against-spammers/)
* [Taking e-mail back - part 4](https://arstechnica.com/information-technology/2014/04/taking-e-mail-back-part-4-the-finale-with-webmail-everything-after/)

Other good articles.

* [A Mailserver on Ubuntu 12.04: Postfix, Dovecot, MySQL – Ex Ratione](https://www.exratione.com/2012/05/a-mailserver-on-ubuntu-1204-postfix-dovecot-mysql/)
* [NSA-proof your e-mail in 2 hours | Sealed Abstract](http://sealedabstract.com/code/nsa-proof-your-e-mail-in-2-hours/)
* [How To Run Your Own Mail Server - c0ffee.net](https://www.c0ffee.net/blog/mail-server-guide)