---
title: "Bazaar workflow for developing Drupal based web sites (2011 update)"
date: 2011-03-21T15:41:30+01:00
lastmod: 2011-05-22T21:34:35+02:00
author: "Fredrik Jonsson"
tags: ["bazaar","drupal","drush","git","vcs","development"]
aliases:
  - /node/1487/

---

{{< figure src="/images/bazaar_logo_0.png" width="400" class="right" alt="Bazaar version control system" >}}

I wrote the original [Bazaar workflow for developing Drupal based web sites](/node/1249) in 2009. I still use basically the same workflow and it serves me well. In this post I include the improvements and changes I have made. They include use of Bazaar shared repository, Bazaar smart server and Git since drupal.org has migrated from old CVS to Git.

The [Site builder guide](http://drupal.org/node/803746) on drupal.org describes a very similar workflow but using Git.

So why not simply use Git? It comes down to personal preference. I like Bazaar and while Git is a very good system I feel it's a bit over complicated. When working with people who are not used to version control systems  it's easier/quicker to teach them Bazaar than Git. If you set them up with a Bazaar checkout and bind it, less things can go wrong.

This workflow works well for when you have a number of small/medium web sites that you need to maintain on a continues basis. Big web sites with many developers have different needs, check out [A Rebase Workflow for Git](http://randyfay.com/node/91) by Randy Fay for some good insights. The same principles can be used with Bazaar as well.

I will mention [Drush](http://drupal.org/project/drush), the Drupal shell, in this blog. I use it to update modules and database, dump/load/sync sql files and many other things. If you are not yet using Drush it's high time to start now. The just released Drush 4 is more awesome than ever.

I will assumes that you are familiar with version control systems and at home on the command line.

Make sure you are using Bazaar version 2.x locally as well as on the server. There are many improvements including better performance and a more efficient repository format. If you are using Debian 5 Lenny you can find Bazaar 2.x in [Debian Backports](http://backports.debian.org/).

### Bazaar repository structure for Drupal

Start by setting up your [shared repositories](http://wiki.bazaar.canonical.com/SharedRepositoryTutorial). With shared repositories Bazaar can be smarter when storing many copies of identical files, like with multiple Drupal installs. It also makes branching very fast.

First the local one:

~~~~
cd /path/to/local/web
bzr init-repo .
~~~~

And then the remote one on your server:

~~~~
ssh user@host
cd /path/to/repos
bzr init-repo .
~~~~

I gave a lot of thought to what structure to use before I settled on the setup I describe below. It is a bit complicated but has a number of benefits for the way I like to work.

Here follows the structure I use:

- /path/to/local/web
    - drupal-7-core – pure Drupal core
    - drupal-7-all – sites/all/modules and sites/all/themes
    - drupal-7-custom – custom code and patched versions of modules
    - project 1
    - project 2
    - project 3
    - …

#### drupal-7-core

The "drupal-7-core" is a git clone from drupal.org. Here is how you get Drupal 7.0.

~~~~
cd /path/to/local/web
git clone --branch 7.x http://git.drupal.org/project/drupal.git drupal-7-core
cd drupal-7-core
git checkout 7.0
~~~~

Commit this to the Bazaar repository with the following commands.

~~~~
cd drupal-7-core
bzr init .
bzr ignore .git files settings.php
bzr add .
bzr commit -m "First commit of Drupal 7 core."
~~~~

We start off with telling Bazaar what files to ignore, more about that later on. Then we add all files and commit them.

When new version of Drupal 7, say 7.1, is released the following commands will update "drupal-7-core".

~~~~
cd drupal-7-core
git checkout 7.x
git pull
git checkout 7.1
~~~~

(I believe the above will work but I have not used Git that much yet so corrections/suggestions are welcome.)

Commit the update to Bazaar.

~~~~
bzr status
bzr add .
bzr commit -m "Updated to Drupal 7.1."
~~~~

It is always a good practice to run "bzr status" to see what files has been modified/removed/added. It will save you from mistakes.

If there are new files add them with "bzr add"

#### drupal-7-all

The "drupal-7-all" is a branch of "drupal-7-core" and set up as a working web site with the installed contrib modules activated. This way update status can keep tabs on updates for them and I can use Drush to keep all modules updated.

~~~~
$ bzr branch drupal-7-core drupal-7-all
~~~~

Here I install all the modules and base themes that, more or less, all web sites will need. Modules like context, ctools, devel, features, pathauto, token and views are prime candidates.

#### drupal-7-custom

The "drupal-7-custom" is a branch of "drupal-7-all". Here I add in libraries and frameworks that need to go in to module folders (more and more fortunately use sites/all/libraries instead), minor hacks and other custom stuff.

~~~~
$ bzr branch drupal-7-all drupal-7-custom
~~~~

When Drush updates a module it first deletes all the files and directories for that module. This e.g. includes the FirePHPCore in the devel module and the SolrPhpClient in the Apache Solr framework module. I now update with Drush in drupal-7-all and keep all the modifications in drupal-7-custom.

With the bzr merge command I merge new code step by step down to the actual project sites, drupal-7-core -> drupal-7-all -> drupal-7-custom -> project x.

With this system I only need to update core in one place and it will trickle down via bzr merge to all others. The same goes for the modules that is part of every site like Ctools, Views etc.

I have to keep in mind to update Drupal core in one place, common contrib modules in another and project specific modules in each site. As I mentioned earlier it's a bit complicated but the benefits more than makes up for it in my case.

Currently I maintain a dozen web sites with this workflow and it saves me a lot of time and hassle.

### Starting development of a new site example

~~~~
$ cd /path/to/local/web
$ bzr branch drupal-7-custom example
$ cd example
$ cp sites/default/default.settings.php sites/default/settings.php
$ … (install Drupal the normal way)
$ bzr push bzr+ssh://user@host/path/to/repos/example/trunk
$ … (add code/themes/modules and add/commit them)
$ bzr push
~~~~

By using the "bzr+ssh" protocol we utilise [Bazaar smart server](http://doc.bazaar.canonical.com/bzr.dev/en/user-guide/server.html). With a smart server you get significantly better performance. No special configuration on the server side is necessary, Bazaar just need to be installed.

To put the files in to the web root on the server I use a Bazaar lightweight checkout. This is a checkout without all the history, faster and saves space.

~~~~
$ cd /path/to/server/web/example
$ bzr checkout --lightweight /path/to/repos/example/trunk
$ …
$ bzr update
~~~~

Tips: You can use ssh to run commands directly on a remote server.

~~~~
$ ssh user@host 'bzr update /path/to/server/web/example'
~~~~


If you use the bind command the repository will automatically check that it's up to date on each commit and warn you to do a update otherwise. It's quick and easy to bind/unbind a repository, good when you e.g. are working off line.

~~~~
$ bzr bind bzr+ssh://user@host/path/to/repos/example/trunk
$ …
$ bzr unbind
$ …
$ bzr bind
~~~~

The push/pull/bind commands will remember the adress so the next time there is no need to declare it. To change the remembered adress you add the --remember flag and declare the new address.

### Updating an existing site example

After updating and merging drupal-7-core, drupal-7-all, drupal-7-custom this is how I update a project site.

~~~~
$ cd /path/to/local/web/example
$ bzr merge
$ bzr commit -m "Merge from drupal-7-custom."
$ drush updatedb (if necessary)
~~~~

Test the site locally to make sure it works ok and then.

~~~~
$ bzr push
$ ssh user@host 'bzr update /path/to/server/web/example'
$ drush @example updatedb (if necessery)
~~~~

One site updated and ready to move on to the next.

### Tell Bazaar to ignore some files

An important part of setting up your Bazaar repository is to tell it what files to ignore. Typically you want to ignore things like the "settings.php" file and the "files" directory. On Mac OS X you want to ignore all the .DS_Store files etc.

I never version control "settings.php" for several important reasons. Security wise I don't think it's a good idea to keep password in the repository. Databas names and passords usually differ between the production/test/development environments. The "settings.php" file is a good place to keep environment specific settings.

The "files" directory should be counted as content and it can also become huge so to put in under version control is a bad idea.

This is what I typically have in the local ignore file for a Drupal site.

File .bzrignore:

~~~~
files
settings.php
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
*.patch
*~
.#*
[#]*#
.DS_Store
CVS
.svn
.git
backup.bzr
~~~~


### Protect the .bzr directory on the web server

When you deploy a site with Bazaar checkout there will be an .bzr directory in the web root. I prefer to make this not public accessible. With Apache you can use the following settings.

~~~~
# The following lines prevent .bzr, .git and .svn directories
# from being viewed by web clients.
<DirectoryMatch "\.(bzr|git|svn)">
  Order Deny,Allow
  Deny from all
</DirectoryMatch>
~~~~


### Use Bash alias for less typing

This is a general tips that I assume most of you already make heavy use of.

The command "bzr" is not long but you will type it a lot, and I often mistype the "z". I therefor make Bash aliases like  b='bzr' and dr='drush'. Long commands like "ssh user@host 'bzr update /path/to/server/web'" is also perfect for aliasing. Read more about Bash aliases in my blog [Four power tips for the command line](/node/1390).

