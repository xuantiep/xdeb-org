---
title: "Set upp SSH account that only allows Bazaar server commands via key authentication"
slug: "set-upp-ssh-account-that-only-allows-bazaar-server-commands-via-key-authentication"
date: 2010-11-25T10:35:17+01:00
lastmod: 2010-11-29T14:35:28+01:00
author: "Fredrik Jonsson"
tags: ["bash","bazaar","cli","security","ssh","terminal","development"]
aliases:
  - /node/1429/

---



Here follows a solution for a convenient and secure way of allowing other machines to connect to the Bazaar repository on my server via SSH and key authentication. I only want to allow Bazaar commands and not any other.

This setup should be easy to adapt for Git and Mercurial (hg) or any other application that sends command via SSH.

My setup includes:

* Linux server, Debian GNU/Linux 5 Lenny.
* Bazaar 2.x running in smart server mode, i.e. using bzr+ssh://…
* Server only allows SSH key logins, passwords are so last century.

## Remote machine

On the remote machine(s) generate a SSH key pair with the [ssh-keygen](http://www.openbsd.org/cgi-bin/man.cgi?query=ssh-keygen) command.

~~~~
ssh-keygen -t rsa
~~~~

Accept the default name and location of the keys. If you want you can skip the password to get a key with no password. Can be good when automating things but is of course less secure.

Copy the public key, ~~~~~/.ssh/id_rsa.pub~~~~ if you followed the example above, to your server. See below what to do with it. The private key remains on the remote machine and need to be kept secure.

## The server

First we need a way to validate Bazaar smart server commands. I found a script to validate rsync commands and adopted it for Bazaar. This script will send back "Rejected" for all commands that does not start with "bzr serve", the command that Bazaar smart server uses.

Put the script below in e.g. "/usr/local/bin/validate-bzr.sh".

~~~~
#!/bin/sh
# A validate-bzr script.

case "$SSH_ORIGINAL_COMMAND" in
*\&*)
echo "Rejected"
;;
*\(*)
echo "Rejected"
;;
*\{*)
echo "Rejected"
;;
*\;*)
echo "Rejected"
;;
*\<*)
echo "Rejected"
;;
*\`*)
echo "Rejected"
;;
bzr\ serve*)
$SSH_ORIGINAL_COMMAND
;;
*)
echo "Rejected"
;;
esac
~~~~

Set up a new user on your server, I named the user "bazaar". In my case that user will only need read access to the repository. The Bazaar smart server use the normal unix permissions so this is easy to set up.

Add the public key to "/home/bazaar/.ssh/authorized_keys2" on the server. The attributes in front of the key in the example below will limit sessions set up via the key. The "command" part is the most important, it tells SSH to validate the command with the "validate-bzr.sh" script.

~~~~
no-port-forwarding,no-X11-forwarding,no-agent-forwarding,command="/usr/local/bin/validate-bzr.sh" ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAoWTp0PxoUyaFDb74zAIJvyDBZQHm1zQ9BmeIoQp2OZvsfV8qU2569Eaoy18LynrcgLbkkpnZ60r7/q8q1Mul3BDpEVfmzKJ0aReXX9zADE7RWddyi35kSgugSfQUDDxhmHn0Sm1PYM06x8e1ZhQSnjSdMPLc6ezAw0b7C0wKn6xXKE6PM3jMHNqnr/5NfRz70iRZGdSgphb+kap5fQsXaRoy04Lwrvz8CtIj2w3GNtFoUOOZGIYT1w+9k1GprOmuQdPv/Kp/mEFiNsONxBcm8xx2nDyVK6QeuMtTL44ziv5RJWFcVHe132mrgZMSZsegVkFewN33ZXYlcGdYo9PZiQ== user@example
~~~~

This is it.

## Try it out

On the remote machine try to login normally.

~~~~
ssh bazaar@example.com
~~~~

You should get "Rejected" as the only answer.

A Bazaar command like the following example should however work.

~~~~
bzr checkout bzr+ssh://bazaar@example.com/var/repos/drupal/trunk drupal
~~~~

