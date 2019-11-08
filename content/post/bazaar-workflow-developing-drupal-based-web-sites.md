---
title: "Bazaar workflow for developing Drupal based web sites"
date: 2009-09-04T16:56:37+02:00
lastmod: 2011-03-21T16:14:22+01:00
author: "Fredrik Jonsson"
tags: ["bazaar","drupal","drush","vcs","development"]
aliases:
  - /node/1249/

---

{{< figure src="/images/bazaar_logo.png" width="400" class="right" alt="Bazaar version control system" >}}

[Go to an updated version from 2011 of this blog post](/node/1487).

During the summer I have worked out a [Bazaar](http://bazaar-vcs.org/) based workflow for Drupal sites that I think will work well for me. I have moved most of my sites in to this workflow and worked on them for some weeks and it feels good.

I will also mention [Drush](http://drupal.org/project/drush), the Drupal shell, in this blog. I use it to update modules and database as well as dump and load sql files. If you are not yet using Drush it time to start now. It's very nice indeed!

This workflow is for when you have a number of small/medium sites that you need to maintain on a continues basis. Big sites with many developers have different needs.

I will assumes that you are familiar with version control systems and at home on the command line.

## Things to like with Bazaar

* Python
* Sponsor Canonical (Ubuntu)
* bzr co, bzr ci, bzr diff, bzr status (same as CVS/Subversion)
* Easy to move and delete files
* Directories and symlinks can be versioned
* Just one .bzr directory instead of CVS/.svn everywhere

Python runs well on many plattforms including Windows (some customers persists). It is used and sponsored by Canonical so the future looks good. The basic commands are the same as in CVS and Subversion making it easy to switch between them.

Bazaar has some really good functionality and I have found it straight forward to use and very stable. I recommend you to check out things like shelve/unshelve and upload.

The Bazaar upload plugin makes it possible  to upload files via SFTP to a server that doesn't have Bazaar installed and it only uploads new and changed files.

## Other version control systems

I have used both CVS and Subversion before. CVS mainly with cvs.drupal.org and Subversion for customers who had it as a requirement. I never moved my own site development to either system. Renaming and moving files and directories is a hassel in them. They litter every directory with CVS/.svn directories. If you are reading this you are most likely well aware of all the shortcomings.

Nowadays we have at least three new version control systems that tries to solve the problems with CVS and Subversion and add a bunch of new features. The three are [Bazaar](http://bazaar-vcs.org/), [Git](http://git-scm.com/) and [Mercurial](http://mercurial.selenic.com/).

I believe that they are all good systems. Which one you choose comes down to taste and what your project/friends use. I started to look at Git but I ended up choosing Bazaar for the reasons above.


## Bazaar repository structure for Drupal

I gave a lot of thought to what structure to use before I settled on the setup I describe below. It is a bit complicated but has a number of benefits for the way I like to work.

Here follows the structure I use:

- [local web root]
    - drupal-6-core – pure Drupal core
    - drupal-6-all – sites/all/modules and themes
    - drupal-6-custom – custom code and patched versions of modules
    - project 1
    - project 2
    - project 3
    - …

The "drupal-6-core" is a branch from bzr://vcs.fourkitchens.com/drupal/6 (Thanks Four Kitchens!). When new version of Drupal 6 is released "bzr pull" will update "drupal-6-core".

The "drupal-6-all" is a branch of "drupal-6-core". The "drupal-6-custom" is a branch of "drupal-6-all". All the site projects are then branches of "drupal-6-custom". Using "bzr merge" will update the code in them.

The sites/default directory it not in version control in either "drupal-6-all" or "drupal-6-custom".

The "drupal-6-all" is set up as a working web site with the installed contrib modules activated so that update status can keep tabs on updates for them.

With this system I only need to update core in one place and it will trickle down via bzr merge to all others. The same goes for the modules that is part of every site like CCK, Views etc.

It also makes it easy to maintain the few minor core hacks I use (static file server support etc.), patches for contrib modules and downloaded libraries.

When Drush updates a module it first deletes all the files and directories for that module. This includes the jquery_ui library in the jQuery UI module, the SolrPhpClient in the Apache Solr framework module etc. I now update with Drush in drupal-6-all and keep all the modifications in drupal-6-custom. The bzr merge command will then take care of it all.

I have to keep in mind to update Drupal core in one place, common contrib modules in another and project specific modules in each site. As I mentioned earlier it's a bit complicated but the benefits more than makes up for it in my case.

It would probably be a good idea to use one shared repository for all Drupal 6 sites. I need to learn more about Bazaars shared repositories before I set that up.


## Starting development of a new site example

If the server don't have Bazaar installed and for small sites.

~~~~
$ cd [local web root]
$ bzr branch drupal-6-custom example.dev
$ cp -pr drupal-6-core/sites/default \ example.dev/sites/default
$ cd example.dev
$ …
$ bzr upload sftp://user@host/path/to/http
$ …
$ bzr upload
~~~~

One problem with bzr upload plugin is that is doesn't handle symlinks. It will throw up a bunch of not very helpful errors when it encounters one.

For projects where Bazaar is installed on the server. First on the local machine.

~~~~
$ cd [local web root]
$ bzr branch drupal-6-custom example.dev
$ cp -pr drupal-6-core/sites/default \ example.dev/sites/default
$ cd example.dev
$ …
$ bzr push sftp://user@host/path/to/repos/trunk
$ …
$ bzr push
~~~~

Using bzr push to a remote repository doesn't update remote working trees because of difficulties with handling conflicts. This make it necessary to make a local checkout on the remote server and keep it updated.

~~~~
$ cd /path/to/http
$ bzr checkout --lightweight /path/to/repos/trunk
$ …
$ bzr update
~~~~

If you use the bind command the remote repository will automatically be up to date on each commit. It's quick and easy to bind/unbind a repository, good when you e.g. are working off line.

~~~~
$ bzr bind sftp://user@host/path/to/repos/trunk
$ …
$ bzr unbind
$ …
$ bzr bind
~~~~

The upload/push/pull/bind commands will remember the adress so the next time there is no need to declare it. To change the remembered adress you add the --remember flag and declare the new address.

Tips: You can use ssh to run commands directly on a remote server.

~~~~
$ ssh user@host 'bzr update /path/to/http'
~~~~


## Tell Bazaar to ignore some files

An important part of setting up your Bazaar repository is to tell it what files to ignore. Typically you want to ignore things like the settings.php file and the files directory. On Mac OS X you want to ignore all the .DS_Store files etc.

I never revision settings.php for several important reasons. Security wise I don't think it's a good idea to keep password in the repository. Databas names and passords usually differ between the production/test/development environments. The settings.php file is a good place to keep environment specific settings.

This is what I typically have in the local ignore file for a Drupal site.

File .bzrignore:

~~~~
CVS
files
settings.php
./backup
~~~~


This is what I have in my global ignore file.

File ~/.bazaar/ignore:

~~~~
*.a
*.o
*.py[co]
*.so
*.sw[nop]
*.tmp
*~
.#*
[#]*#
.DS_Store
~~~~


## Protect the .bzr directory on the web server

When you deploy a site with Bazaar checkout there will be an .bzr directory in the web root. I prefer to make this not public accessible. With Apache you can use the following settings.

~~~~
#
# The following lines prevent .bzr directories from being
# viewed by web clients.
#
<DirectoryMatch \.bzr>
   Order deny,allow
   deny from all
</DirectoryMatch>
~~~~


## Use shell alias for less typing

This is a general tips that I assume most of you already make heavy use of.

The command "bzr" is not long but you will type it a lot, and I often mistype the "z". I have made an alias b='bzr', dr='drush' etc. etc. Everything I type often I make into an alias.

Long commands like "ssh user@host 'bzr update /path/to/http'" is also perfect for aliasing. I use bru[xx] with different [xx] for each site I'm working on for this command.


## Some good links for more reading

* [Documentation - Bazaar Version Control](http://bazaar-vcs.org/Documentation)
* [BazaarForWebDevs - Bazaar Version Control](http://bazaar-vcs.org/BazaarForWebDevs)
* [BazaarUploadForWebDev - Bazaar Version Control](http://bazaar-vcs.org/BazaarUploadForWebDev)
* [Drupal/tips - Bazaar Version Control](http://bazaar-vcs.org/Drupal/tips)
* [Bazaar (a non-CVS version control system) | drupal.org](http://drupal.org/node/45368)
* [Using Bazaar to Manage Your Multi-site Drupal Environment | Josiah Ritchie](http://josiahritchie.com/blog/using-bazaar-manage-your-multi-site-drupal-environment)

