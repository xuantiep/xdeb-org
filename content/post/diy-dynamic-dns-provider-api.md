---
title: "DIY dynamic DNS with your providers DNS API"
slug: "diy-dynamic-dns-provider-api"
date: 2021-03-08T19:53:05+01:00
lastmod: 2021-03-08T19:53:05+01:00
author: "Fredrik Jonsson"
tags: ["dns","network","server"]

---

Got a notice from my ISP that in a few weeks time I will no longer have a static IP address. Not the ISP fault however, they would be happy to provide the service. It is the company that manages the city fiber network that blames a system upgrade for the coming inability to provide static IP addresses.

The municipality should never have sold off the optic fiber network to a private company. Important things like roads, hospitals, schools, the police and city fiber networks should be public and nothing else.

Unwilling to give up my home server I started looking for a solution.


## Dynamic DNS


### Why not use one of many dynamic DNS providers?

I do not mind paying for stuff but I want to use as few services as possible.

My first instinct is to self host. When that is not a good option I use a few trusted services, e.g. [GleSYS](https://glesys.com/).

Doing it yourself is also a lot more fun.


### Find a good server hosting company with an API

Luckily my favourite hosting company here in Sweden, [GleSYS](https://glesys.com/), has an [excellent API](https://github.com/GleSYS/API/wiki/Api-Introduction).

They allow a minimum TTL of 60s, perfekt for a dynamic DNS setup. After some questions on their [community Slack](https://glesys.se/community) I was ready to start experimenting.

Other hosting companies that has API for this includes [Linode](https://www.linode.com/docs/api/domains) and [DigitalOcean](https://developers.digitalocean.com/documentation/) as well as all the big cloud providers I assume.


### For a server with private IP address behind a router


#### Use a cron script that runs on reboot and every 5 minuts

This is a bit crud but gets the job done.

File: `/etc/cron.d/dynamicdns`

~~~~ shell
@reboot root if [ -x /usr/local/bin/dynamicdns.sh ]; then /usr/local/bin/dynamicdns.sh; fi
*/5 * * * * root if [ -x /usr/local/bin/dynamicdns.sh ]; then /usr/local/bin/dynamicdns.sh; fi
~~~~

File: `/usr/local/bin/dynamicdns.sh`

~~~~ shell
#!/usr/bin/env bash

# shell script hardening
set -euo pipefail

IP=$(curl --silent https://ipinfo.io/ip)
/usr/local/bin/dynamicdns.py "${IP}"
~~~~

I leave it up to the reader to combine `dynamicdns.sh` and `dynamicdns.py` in to a single script if running via cron.


### For a server with a public IP address

This is my own use case.


#### Use DHCP client script hooks to detect when there is a new IP address

First job was to find out how to detect when the IP address changes and run a script to update the DNS. Turns out there is [DHCP client script enter and exit hooks](https://manpages.debian.org/buster/isc-dhcp-client/dhclient-script.8.en.html) that can take care of this.

On Debian you place your exit script in `/etc/dhcp/dhclient-exit-hooks.d/`.

File: `/etc/dhcp/dhclient-exit-hooks.d/dynamicdns`

Replace "enp3s0" with your WAN interface.

~~~~ shell
if [ "${interface}" = "enp3s0" ]; then
    case ${reason}" in BOUND|REBIND|RENEW)
        /usr/local/bin/dynamicdns.py "${new_ip_address}"
        ;;
    esac
fi
~~~~

This will run the `dynamicdns.py` script when changes are detected on the main WAN interface and there is a new IP address. See documentation for what reasons BOUND|REBIND|RENEW stands for. The interface, reason and new_ip_address variables are provided by the DHCP client.


### Now on to the script that actually update the DNS entries.

I opted to write it in Python. It needs to take the `new_ip_address` as an argument, remember the last IP address, do some sanity checking and talk to the API. Logging is always a good idea as well.

File: `/usr/local/bin/dynamicdns.py`

OBS! You will need to set the variables and adapt `updatedns()` for your providers API. The way you specify `dns_records` might need adapting as well.

~~~~ python
#!/usr/bin/env python3
"""
Script to update DNS entries for a list of domains via GlySYS API.
"""

import argparse
import ipaddress
import logging
import os
import requests

from logging.handlers import RotatingFileHandler


# Set variables.
apikey = 'CHANGE_THIS_to_your_api_key'
apiurl = 'https://api.glesys.com/domain/updaterecord/'
apiuser = 'CHANGE_THIS_to_your_api_user'
current_ip_file = '/var/spool/dynamicdns/current_ip.txt'
dns_records = {
    '12345': 'example.org',
    '23456': 'vpn.example.org',
    '34567': 'server.example.org',
}


def logger():
    logfile = '/var/log/dynamicdns.log'
    log_format = ('%(asctime)s %(levelname)-8s %(message)s')
    logging.basicConfig(
        level=logging.INFO,
        format=log_format,
        handlers=[
            RotatingFileHandler(logfile, maxBytes=50000)
        ],
    )
    return logging.getLogger(__name__)


logger = logger()


def updatedns(recordid, new_ip_address):
    r = requests.post(apiurl, auth=(apiuser, apikey), headers={'accept': 'application/json'}, data={'recordid': recordid, 'data': new_ip_address})
    output = r.json()
    response_code = output['response']['status']['code']
    response_text = output['response']['status']['text']
    response_ip = output['response']['record']['data']
    if response_code == 200:
        logger.info(f'{dns_records[recordid]} has been updated to IP {response_ip}')
    else:
        logger.error(f'{dns_records[recordid]} could not be updated Error code: {response_code} {response_text}')


def get_current_ip():
    current_ip = None
    try:
        with open(current_ip_file, 'r') as f:
            current_ip = f.read()
    except FileNotFoundError:
        pass
    return current_ip


def set_current_ip(new_ip_address):
    os.makedirs(os.path.dirname(current_ip_file), exist_ok=True)
    with open(current_ip_file, 'w') as f:
        f.write(new_ip_address)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('new_ip_address', type=str, help='The new IP address.')
    args = parser.parse_args()
    new_ip_address = args.new_ip_address

    try:
        ipaddress.ip_address(new_ip_address)
    except ValueError:
        logger.warning(f'Not a valid new IP: {new_ip_address}')
    else:
        if new_ip_address != get_current_ip():
            set_current_ip(new_ip_address)
            [updatedns(recordid, new_ip_address) for recordid in dns_records]


if __name__ == '__main__':
    main()
~~~~


## Conclusion

With this in place the DNS entries for my home server should update within 60s of an IP address change. This is ok for the services I run. Not as good as a real static IP address but it will do for now.

The most useful function for my home server is as a VPN with Wireguard. Later this year, when we hopefully can start traveling again, it will see some traffic after many month of rest.

{{< sponsor >}}