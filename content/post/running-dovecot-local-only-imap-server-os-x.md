---
title: "Running dovecot as a local only IMAP server on OS X"
date: 2014-03-07T10:30:22+01:00
lastmod: 2018-07-01T14:56:17+02:00
author: "Fredrik Jonsson"
tags: ["email","dovecot","macOS","technology"]
aliases: ["node/1607"]

---

I prefer to store (archive) my mail locally. After moving my mail between mail clients a couple of time to many I decided to set up a local IMAP server. This will give me a mail client independent local storage that is in a standard format and future proof.

(*Update 2018-03-29*: When you update a existing setup to Dovecot 2.3.1 or later it will break with the error message "Fatal: service(stats) Group doesn't exist: dovecot …". On macOS the primary group for the "dovecot" user is "mail" so you need to set "default_internal_group = mail" in your "local.conf" file.)

I run dovecot on my mail server so that's what I want to run locally as well. Easiest way to install dovecot is via Homebrew. ([Homebrew is a package manager for macOS](https://brew.sh/).)

~~~~
brew install dovecot
~~~~

Homebrew will give you instruction for the LaunchDaemons script needed to start and stop dovecot. Next step is to copy over some default configuration files.

~~~~
cp -pr /usr/local/Cellar/dovecot/2.3.2/share/doc/dovecot/example-config/ /usr/local/etc/dovecot/
~~~~

I opted for adding a "local.conf" file with all my own settings, "dovecot.conf" will include that file if it exist.

Here follow my settings for a local only IMAP server with a static password that can be used with an arbitrary username.

File: `/usr/local/etc/dovecot/local.conf`

Make sure to replace all instances of CHANGE_THIS with your own information.

~~~~
# A comma separated list of IPs or hosts where to listen in for connections. 
# "*" listens in all IPv4 interfaces, "::" listens in all IPv6 interfaces.
# If you want to specify non-default ports or anything more complex,
# edit conf.d/master.conf.
listen = 127.0.0.1

# Protocols we want to be serving.
protocols = imap


# Static passdb.

# This can be used for situations where Dovecot doesn't need to verify the
# username or the password, or if there is a single password for all users:
passdb {
  driver = static
  args = password=CHANGE_THIS_to_whatever_password_you_like
}

# Location for users' mailboxes. The default is empty, which means that Dovecot
# tries to find the mailboxes automatically. This won't work if the user
# doesn't yet have any mail, so you should explicitly tell Dovecot the full
# location.
#
# If you're using mbox, giving a path to the INBOX file (eg. /var/mail/%u)
# isn't enough. You'll also need to tell Dovecot where the other mailboxes are
# kept. This is called the "root mail directory", and it must be the first
# path given in the mail_location setting.
#
# There are a few special variables you can use, eg.:
#
#   %u - username
#   %n - user part in user@domain, same as %u if there's no domain
#   %d - domain part in user@domain, empty if there's no domain
#   %h - home directory
#
# See doc/wiki/Variables.txt for full list. Some examples:
#
#   mail_location = maildir:~/Maildir
#   mail_location = mbox:~/mail:INBOX=/var/mail/%u
#   mail_location = mbox:/var/mail/%d/%1n/%n:INDEX=/var/indexes/%d/%1n/%n
#
# <doc/wiki/MailLocation.txt>
#
mail_location = maildir:/CHANGE_THIS_to_the_path_where_you_want_to_store_the_mail/%n


# System user and group used to access mails. If you use multiple, userdb
# can override these by returning uid or gid fields. You can use either numbers
# or names. <doc/wiki/UserIds.txt>
mail_uid = CHANGE_THIS_to_your_short_user_name_or_uid
mail_gid = admin

# SSL/TLS support: yes, no, required. <doc/wiki/SSL.txt>
ssl = no

# Login user is internally used by login processes. This is the most untrusted
# user in Dovecot system. It shouldn't have access to anything at all.
default_login_user = _dovenull

# Internal user is used by unprivileged processes. It should be separate from
# login user, so that login processes can't disturb other processes.
default_internal_user = _dovecot
# Internal group is expected to be the primary group of the default_internal_user.
default_internal_group = mail

# Setting limits.
default_process_limit = 10
default_client_limit = 50
~~~~

There are two changes needed to the default conf files as well.

File: `/usr/local/etc/dovecot/conf.d/10-auth.conf`

Comment out the line that includes the default auth settings like this:

~~~~
#!include auth-system.conf.ext
~~~~

File: `/usr/local/etc/dovecot/conf.d/10-ssl.conf`

Comment out the lines that tries to read the non existent SSL cert and key:

~~~~
#ssl_cert = </etc/ssl/certs/dovecot.pem
#ssl_key = </etc/ssl/private/dovecot.pem
~~~~

Now the server should start without any errors:

~~~~
sudo launchctl load /Library/LaunchDaemons/homebrew.mxcl.dovecot.plist
~~~~

If you need to stop it run:

~~~~
sudo launchctl unload /Library/LaunchDaemons/homebrew.mxcl.dovecot.plist
~~~~

By default dovecot logs will show up in `/var/log/mail.log`.

Now all that remains is to configure your mail client. Set up an new IMAP account with:

1. Incoming mail server: localhost or 127.0.0.1
2. Account ID: Whatever username you like
3. Password: The password you set in local.conf

All other fields can have dummy information.

You can set up as many accounts as you like but most likely only one is needed.


