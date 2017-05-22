---
title: "Let\'s Encrypt my servers with acme tiny"
date: 2016-02-09T07:52:04+01:00
lastmod: 2017-05-07T08:08:09+02:00
author: "Fredrik Jonsson"
tags: ["apache","security","ssl","letsencrypt","ansible","technology"]
aliases: ["node/1614"]

---



[Let's Encrypt](https://letsencrypt.org/) is a project that offer free domain validated SSL/TLS certificates. The organisations and companies behind it includes [EFF](https://www.eff.org/), [Mozilla](https://www.mozilla.org/), [Akamai](https://www.akamai.com/) and [Cisco](http://www.cisco.com/) as well as many other.

EFF has long been working for [HTTPS Everywhere](https://www.eff.org/https-everywhere) and Let's Encrypt is a big step in this direction. Let's Encrypt is actually an implementation of [Automatic Certificate Management Environment (ACME)](https://tools.ietf.org/html/draft-ietf-acme-acme-01) which will allow other providers of free certs in the future.

The easiest way to get started is to use the official Let's Encrypt ACME client [Certbot](https://github.com/certbot/certbot). If you want use it read more at [How It Works](https://letsencrypt.org/howitworks/).

The official client is a rather large Python cli app with a lot of dependencies. I was looking for something small and simple that gave me full control.

Luckily there are already a large number of other [client implementations](https://letsencrypt.org/docs/client-options/) and another list of [client implementations](https://community.letsencrypt.org/t/list-of-client-implementations/2103). I opted for [acme-tiny](https://github.com/diafygi/acme-tiny) by Daniel Roesler. It's less that 200 lines of code so easy to review and understand. It also seems to work really well.

I have incorporated it in an [Ansible](https://www.ansible.com/) [playbook](https://github.com/frjo/ansible-roles) so I can deploy it easily on my servers. They all now run with Let's Encrypt certs. The certs are only valid for three month so it's highly recommended to automate the certificate renewal process. See below for my solution.

## First setup

Generate a account.key if you don't already have one for Let's Encrypt.

~~~~
openssl genpkey -algorithm rsa -pkeyopt rsa_keygen_bits:4096 -out /etc/ssl/letsencrypt/account.key
~~~~

Generate a domain.key. I'm using 2048 bits since that what Let's Encrypt certs are using, anything larger would be pointless.

~~~~
openssl genpkey -algorithm rsa -pkeyopt rsa_keygen_bits:2048 -out /etc/ssl/letsencrypt/domain.key
~~~~

Make sure to set as restrictive permissions as possible on the keys.

Create a certificate signing request (CSR) for your domains.

~~~~
openssl req -new -sha256 -key /etc/ssl/letsencrypt/domain.key -subj "/C=US/O=Acme/CN=example.com" -reqexts SAN -config <(cat /etc/ssl/openssl.cnf <(printf "[SAN]\nsubjectAltName=DNS:www.example.com,DNS:static.example.com")) -out /etc/ssl/letsencrypt/example.com/domain.csr
~~~~

Set up the challenge directory so it works for both Apache and when starting a temporary python SimpleHTTPServer.

~~~~
mkdir -p /var/www/challenges/.well-known
ln -s /var/www/challenges /var/www/challenges/.well-known/acme-challenge
~~~~

Put this in a Apache conf file so all your sites use the same challenge directory.

~~~~
# Letsencrypt/acme challenges directory
Alias /.well-known/acme-challenge /var/www/challenges
~~~~

Get the certificate from Let's Encrypt.

~~~~
python acme_tiny.py --account-key /etc/ssl/letsencrypt/account.key --csr /etc/ssl/letsencrypt/domain.csr --acme-dir /var/www/challenges > /etc/ssl/letsencrypt/example.com/signed.crt
~~~~

As you see in my cron script below I have set up a acme user for running the acme tiny script. The acme user only have access to exactly what it needs.

Download Let's Encrypt intermediate cert and create a fullchain file with it and the signed cert.

~~~~
wget -O - https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem > /etc/ssl/letsencrypt/chain.pem
cat /etc/ssl/letsencrypt/example.com/signed.crt /etc/ssl/letsencrypt/chain.pem > fullchain.pem
~~~~

## Set up Apache

General SSL configurations, see [Generate Mozilla Security Recommended Web Server Configuration Files](https://mozilla.github.io/server-side-tls/ssl-config-generator/).

~~~~
<IfModule mod_ssl.c>
  SSLProtocol all -SSLv3 -TLSv1
  SSLCipherSuite ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK
  SSLHonorCipherOrder on
  SSLCompression off
  SSLUseStapling on
  SSLStaplingResponderTimeout 5
  SSLStaplingReturnResponderErrors off
  SSLStaplingCache shmcb:${APACHE_RUN_DIR}/ocsp_scache(128000)
</IfModule>
~~~~

Apache vhost settings.

~~~~
<IfModule mod_ssl.c>
  SSLEngine on
  SSLCertificateFile /etc/ssl/letsencrypt/example.com/signed.crt
  SSLCertificateKeyFile /etc/ssl/letsencrypt/domain.key
  SSLCertificateChainFile /etc/ssl/letsencrypt/chain.pem
  <IfModule mod_headers.c>
    Header always set Strict-Transport-Security: "max-age=15768000"
  </IfModule>
</IfModule>
~~~~

## Works equally well for postfix and dovecot

This is for postfix:

~~~~
smtpd_tls_cert_file=/etc/ssl/letsencrypt/example.com/signed.crt
smtpd_tls_key_file=/etc/ssl/letsencrypt/domain.key
smtpd_tls_CAfile=/etc/ssl/letsencrypt/chain.pem
~~~~

This is for dovecot:

~~~~
ssl_cert = </etc/ssl/letsencrypt/example.com/fullchain.pem
ssl_key = </etc/ssl/letsencrypt/domain.key
~~~~

## Automatic renewal

I have built a cron script that handles this on my systems and set it to run every month. Got some good ideas from [neurobin/letsacme: A tiny script to issue and renew TLS/SSL certs from Let's Encrypt](https://github.com/neurobin/letsacme) (interesting fork of acme-tiny).

Here is an example version of the cron script that I place in /etc/cron.monthly. It starts of by looking if there are something running on port 80, i.e. a web server, and if nothing is there it starts up a temporary python SimpleHTTPServer and temporary open up port 80. This is so I can use the same script on my web and my mail servers e.g.

~~~~
#!/bin/sh
# Script to update letsencrypt cert every month.

# Check if we have a web server running.
PORT80=$(lsof -ti :80 | wc -l)

# If no web server then start one and open port 80.
if [ $PORT80 = 0 ]; then
  cd /var/www/challenges
  nohup python -m SimpleHTTPServer 80 > /dev/null 2>&1 &
  iptables -A INPUT -i eth0 -p tcp --dport 80 -m conntrack --ctstate NEW -j ACCEPT
fi

# Get a updated certificate.
while true; do
  if sudo -u acme /usr/bin/python /usr/local/bin/acme_tiny.py --account-key /etc/ssl/letsencrypt/account.key \
       --csr /etc/ssl/letsencrypt/example.com/domain.csr \
       --acme-dir /var/www/challenges \
       > /etc/ssl/letsencrypt/example.com/signed_new.crt \
       2>> /var/log/acme_tiny.log
  then
    wget -O - https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem > /etc/ssl/letsencrypt/chain_new.pem
    # Check that the cert is valid.
    if openssl verify -CAfile /etc/ssl/letsencrypt/chain_new.pem \
        /etc/ssl/letsencrypt/example.com/signed_new.crt
    then
      mv -f /etc/ssl/letsencrypt/chain_new.pem /etc/ssl/letsencrypt/chain.pem
      mv -f /etc/ssl/letsencrypt/example.com/signed_new.crt /etc/ssl/letsencrypt/example.com/signed.crt
      cat /etc/ssl/letsencrypt/example.com/signed.crt /etc/ssl/letsencrypt/chain.pem > /etc/ssl/letsencrypt/example.com/fullchain.pem
      echo "Acme tiny successfully renewed certificate."

      systemctl restart apache2

    else
      echo "Acme tiny have problems."
    fi
    break
  else
    # Sleep for max 9999 seconds, then try again.
    sleep `tr -cd 0-9 < /dev/urandom | head -c 4`
    echo "Acme tiny retry triggered."
  fi
done

# Stop temp web server and close port 80 if needed.
if [ $PORT80 = 0 ]; then
  iptables -D INPUT -i eth0 -p tcp --dport 80 -m conntrack --ctstate NEW -j ACCEPT
  pkill -f SimpleHTTPServer
fi
~~~~

In my playbook it's a template file that look like this:

~~~~
#!/bin/sh
# Script to update letsencrypt cert every month.

# Check if we have a web server running.
PORT80=$(lsof -ti :80 | wc -l)

# If no web server then start one and open port 80.
if [ $PORT80 = 0 ]; then
  cd {{ acme_challenge_dir }}
  nohup python -m SimpleHTTPServer 80 > /dev/null 2>&1 &
  iptables -A INPUT -i {{ ansible_default_ipv4.interface }} -p tcp --dport 80 -m conntrack --ctstate NEW -j ACCEPT
fi

# Get a updated certificate.
while true; do
  if sudo -u acme /usr/bin/python /usr/local/bin/acme_tiny.py --account-key {{ acme_certs_dir }}/account.key \
       --csr {{ acme_certs_dir }}/{{ acme_domains[0] }}/domain.csr \
       --acme-dir {{ acme_challenge_dir }} \
       > {{ acme_certs_dir }}/{{ acme_domains[0] }}/signed_new.crt \
       2>> /var/log/acme_tiny.log
  then
    wget -O - https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem > {{ acme_certs_dir }}/chain_new.pem
    # Check that the cert is valid.
    if openssl verify -CAfile {{ acme_certs_dir }}/chain_new.pem \
        {{ acme_certs_dir }}/{{ acme_domains[0] }}/signed_new.crt
    then
      mv -f {{ acme_certs_dir }}/chain_new.pem {{ acme_certs_dir }}/chain.pem
      mv -f {{ acme_certs_dir }}/{{ acme_domains[0] }}/signed_new.crt {{ acme_certs_dir }}/{{ acme_domains[0] }}/signed.crt
      cat {{ acme_certs_dir }}/{{ acme_domains[0] }}/signed.crt {{ acme_certs_dir }}/chain.pem > {{ acme_certs_dir }}/{{ acme_domains[0] }}/fullchain.pem
      echo "Acme tiny successfully renewed certificate."

{% for acme_service in acme_services %}
      systemctl restart {{ acme_service }}
{% endfor %}

    else
      echo "Acme tiny have problems."
    fi
    break
  else
    # Sleep for max 9999 seconds, then try again.
    sleep `tr -cd 0-9 < /dev/urandom | head -c 4`
    echo "Acme tiny retry triggered."
  fi
done

# Stop temp web server and close port 80 if needed.
if [ $PORT80 = 0 ]; then
  iptables -D INPUT -i {{ ansible_default_ipv4.interface }} -p tcp --dport 80 -m conntrack --ctstate NEW -j ACCEPT
  pkill -f SimpleHTTPServer
fi
~~~~

