---
title: "Running Drupal on Debian 8 with Apache 2.4, event MPM and PHP-FPM (via socks and proxy)"
slug: "running-drupal-on-debian-8-with-apache-2-4-event-mpm-and-php-fpm-via-socks-and-proxy"
date: 2016-01-21T02:02:48+01:00
lastmod: 2017-11-10T10:10:57+01:00
author: "Fredrik Jonsson"
tags: ["apache","php","server","drupal","debian","development"]
aliases:
  - /node/1613/

---

Updated version of this article: [Running Drupal on Debian 9 with Apache 2.4, HTTP/2, event MPM and PHP-FPM (via socks and proxy)](/post/2017/11/09/running-drupal-on-debian-9-with-apache-2-4-http2-event-mpm-and-php-fpm-via-socks-and-proxy/)

I'm building a new Ansible playbook for setting up web servers with Debian 8. I have always used mod_php before and it has been very stable but have some well known drawbacks. Since Debian 8 comes with Apache 2.4 and PHP 5.6 I wanted to implement php-fpm that seems very promising.

With mod_php every Apache process will need to load php and therefor use a lot more memory than needed, even for just serving static content like images and css. I have been running [Lighttpd as a static file server](/node/1259) to mitigate this problem.

With event mpm + php-fpm a plain Apache processes will deal with all static content and hand of php request to separate php-fpm processes. This will allow a server to handle more visitors with the same amount of memory and I can skip Lighttpd.

I found surprisingly little information on how to get this working well for serving things like Drupal. So here are what I have found out from manuals, post on the Internet as well as my own testing.

This setup has not been tested in production yet! When it has I will try to remember to update this article. In local testing on a VirtualBox image with Debian 8 and 512 MB RAM it seems to work fine. I also run the same setup locally on OS X with good results.

**Update 2016-03-31**: This is now running in production, this blog e.g., and it seems to work really well. Page load time has improved and memory usage is lower.

Here are some performance test done with ab. These doesn't say much more than that it seems to work and most likely can handle some load.

~~~~
ab -k -l -n 1000 -c 10 -H "Accept-Encoding: gzip,deflate" http://xdeb.dev/

Requests per second:    526.01 [#/sec] (mean)
~~~~

This was the front page of a local version of xdeb.org running Drupal 7, with page cache of course. I also tested with plain Drupal 8 and got around 300 request/sec, more or less what one would expect.

A plain html page looks like this.

~~~~
ab -k -l -n 1000 -c 10 -H "Accept-Encoding: gzip,deflate" http://localhost/

Requests per second:    2466.39 [#/sec] (mean)
~~~~

## Installation

Start by installing needed packages.

~~~~
apt-get install apache2 apache2-dev php5-fpm mariadb-server
~~~~

You most likely want some more php extensions as well, here are the ones I normally install for running Drupal.

~~~~
apt-get install php5-cli php5-apcu php5-curl php5-dev php5-gd php5-imagick php5-json php5-mysql php5-mcrypt php5-twig php-pear graphicsmagick graphicsmagick-imagemagick-compat
~~~~

As suggested in [PHP-FPM - Httpd Wiki](https://wiki.apache.org/httpd/PHP-FPM) I will run php-fpm via mod\_proxy\_fcgi so lets activate that module.

~~~~
a2enmod proxy_fcgi
~~~~

This will automatically activate the proxy module as well since it is a dependency. I also activate auth_digest, expires, headers, rewrite and ssl on my servers. Rewrite is needed for Drupal to get clean URLs.

## Apache and PHP-FPM configurations

Debian by default sets up php-fpm to listen on a unix socket and since that should perform a bit better than a TCP socket I will use that. The most important setting is "max_children". With Drupal each php process will use something like 20-40 MB typically, can be a lot more for some sites so you simply need to test.

If your Drupal site use 30 MB per process setting "max_children" to 10 means that php will use up to about 10 * 30 MB = 300 MB of memory. A good resource for figuring out what is the best settings is this blog post [Adjusting child processes for PHP-FPM (Nginx) · MYSHELL.CO.UK](http://myshell.co.uk/blog/2012/07/adjusting-child-processes-for-php-fpm-nginx/)

~~~~
listen = /var/run/php5-fpm.sock
pm = dynamic
pm.max_children = 10
pm.start_servers = 4
pm.min_spare_servers = 2
pm.max_spare_servers = 6
pm.max_requests = 2000
~~~~

The default mpm for Apache 2.4 (at least on Debian) is event mpm and since that is the most modern and best performing mpm there is no reason not to use it. I use the default settings and that should work well for most small servers. If needed I may up the value on ThreadsPerChild but I don't think that will be needed on my servers.

~~~~
# event MPM
# ServerLimit: upper limit on configurable number of processes (default = 16)
# StartServers: initial number of server processes to start (default = 3)
# MinSpareThreads: minimum number of worker threads which are kept spare (default = 25)
# MaxSpareThreads: maximum number of worker threads which are kept spare (default = 75)
# ThreadLimit: upper limit on the configurable number of threads per child process (default = 64)
# ThreadsPerChild: constant number of worker threads in each server process (default = 25)
# MaxRequestWorkers: maximum number of worker threads (default = ServerLimit x ThreadsPerChild)
# MaxConnectionsPerChild: maximum number of requests a server process serves (default = 0)
<IfModule mpm_event_module>
  ServerLimit             16
  StartServers            3
  MinSpareThreads         25
  MaxSpareThreads         75
  ThreadLimit             64
  ThreadsPerChild         25
  MaxConnectionsPerChild  2000
</IfModule>
~~~~

## Apache vhost setup

Here we then come to the part that caused me the biggest problem. How to get php-fpm to only run the php files I wanted and not everything. The Apache wiki page above suggest using ProxyPassMatch but it turns out that will override any restrictions set in e.g. a Files/FilesMatch directive. For Drupal I want to block access to files like update.php and cron.php so another solution was needed.

I found the solution in a post from Mattias Geniar [Apache 2.4: ProxyPass (For PHP) Taking Precedence Over Files/FilesMatch In Htaccess](https://ma.ttias.be/apache-2-4-proxypass-for-php-taking-precedence-over-filesfilesmatch-in-htaccess/). His suggestion to use a SetHandle in a FileMatch directive seems to work very well.

This is how I set up a vhost for serving Drupal.

~~~~
<VirtualHost *:80>
  DocumentRoot /var/www/customers/example/web
  ServerName example.com
  ServerAlias www.example.com
  ErrorLog /var/www/customers/example/logs/error_log
  CustomLog /var/www/customers/example/logs/access_log combined
  <Directory "/var/www/customers/example/web">
    Options FollowSymLinks
    AllowOverride None
    Include /var/www/customers/example/web/.htaccess
    <IfModule mod_proxy_fcgi.c>
      # Run php-fpm via proxy_fcgi
      <FilesMatch \.php$>
        SetHandler "proxy:unix:/var/run/php5-fpm.sock|fcgi://localhost"
      </FilesMatch>
    </IfModule>
    # Only allow access to cron.php etc. from localhost
    <FilesMatch "^(cron|install|update|xmlrpc)\.php">
      Require local
    </FilesMatch>
  </Directory>
</VirtualHost>
~~~~

Notice that I include the .htaccess file. I have set "AllowOverride None" to prevent Apache from looking for and automatically include any .htaccess files it finds. This improves performance a bit but one needs to remember to reload Apache when changes are made to the .htaccess file.

## Extra security configurations in Apache for Drupal

Drupal put .htaccess in the files folder and  some other places for security reasons. The following is an example how to add the same security configurations directly in an  Apache conf file. The DirectoryMatch regex most likely needs adjustment for your directory structure.

First there are also some settings to deny access to version control folders and some Drupal core text files.

~~~~
# Prevent access to .bzr and .git directories and files.
<DirectoryMatch "/\.(bzr|git)">
  Require all denied
</DirectoryMatch>

# Prevent access do some Drupal txt files.
<FilesMatch "^(CHANGELOG|COPYRIGHT|INSTALL|INSTALL\.mysql|INSTALL\.pgsql|INSTALL\.sqlite|LICENSE|MAINTAINERS|UPGRADE|README)\.txt">
  Require all denied
</FilesMatch>

# Security setting for files folder in Drupal.
<DirectoryMatch "^/var/www/.*/sites/.*/(files|tmp)">
  # Turn off all options we don't need.
  Options -Indexes -ExecCGI -Includes -MultiViews

  # Set the catch-all handler to prevent scripts from being executed.
  SetHandler Drupal_Security_Do_Not_Remove_See_SA_2006_006
  <Files *>
    # Override the handler again if we're run later in the evaluation list.
    SetHandler Drupal_Security_Do_Not_Remove_See_SA_2013_003
  </Files>

  # If we know how to do it safely, disable the PHP engine entirely.
  <IfModule mod_php5.c>
    php_flag engine off
  </IfModule>
</DirectoryMatch>

# Security setting for config folder in Drupal.
<DirectoryMatch "^/var/www/.*/sites/.*/(private|config|sync|translations|twig)">
  <IfModule mod_authz_core.c>
    Require all denied
  </IfModule>

  # Deny all requests from Apache 2.0-2.2.
  <IfModule !mod_authz_core.c>
    Deny from all
  </IfModule>
  # Turn off all options we don't need.
  Options -Indexes -ExecCGI -Includes -MultiViews

  # Set the catch-all handler to prevent scripts from being executed.
  SetHandler Drupal_Security_Do_Not_Remove_See_SA_2006_006
  <Files *>
    # Override the handler again if we're run later in the evaluation list.
    SetHandler Drupal_Security_Do_Not_Remove_See_SA_2013_003
  </Files>

  # If we know how to do it safely, disable the PHP engine entirely.
  <IfModule mod_php5.c>
    php_flag engine off
  </IfModule>
</DirectoryMatch>
~~~~

## MariaDB instead of MySQL

I have completely switched from MySQL to MariaDB for all new deployments. Version 10.0.x of MariaDB is a noticeable performance improvement and has better defaults values for various settings. MariaDB is run by the people who originally created MySQL, before is was bought by Sun and then swallowed up by Oracle.

Below are what I put in /etc/mysql/conf.d/local.cnf. You will need to adjust at least the innodb_buffer_pool_size depending upon how much memory the server have and the size of InnoDB data and indexes. This answer on stack exchange has a lot of interesting information about this [How large should be mysql innodb_buffer_pool_size?](http://dba.stackexchange.com/questions/27328/how-large-should-be-mysql-innodb-buffer-pool-size#answer-27341).

~~~~
[mysqld]
# Set character set and collation to utf8mb4.
character_set_server = utf8mb4
collation_server = utf8mb4_unicode_ci

# Common Configuration
skip_name_resolve = 1
connect_timeout = 10
interactive_timeout = 25
wait_timeout = 60
max_allowed_packet = 64M
table_open_cache = 2000
table_definition_cache =  2000
thread_handling = pool-of-threads

# Query Cache Configuration
query_cache_limit = 2M
query_cache_size = 64M
query_cache_type = 1
query_cache_min_res_unit = 2K

# Slow Log Configuration
slow_query_log = 1
slow_query_log_file = /var/log/mysql/mysql_slow_query.log
long_query_time = 5
#log_queries_not_using_indexes = 1

# InnoDB Configuration
#default_storage_engine = innodb
innodb_buffer_pool_size = 256M
innodb_flush_method = O_DIRECT
innodb_file_per_table = 1
innodb_flush_log_at_trx_commit = 2
innodb_large_prefix = 1
innodb_file_format = barracuda
~~~~

