---
title: "Upgrade from Drupal 6 to Drupal 7 with Migrate 2"
date: 2011-11-08T14:55:04+01:00
lastmod: 2012-07-30T14:05:10+02:00
author: "Fredrik Jonsson"
tags: ["drupal","planetdrupal","migrate","drupal7","drupal6","development"]
aliases: ["node/1539"]

---

{{< figure src="/images/druplicon_migrate_6-7.png" width="400" class="right" alt="Drupal 6 to 7 upgrade." >}}

When I planed the upgrade to Drupal 7 for xdeb.org I decided to rebuild the site from scratch and use the [Migrate module](http://drupal.org/project/migrate) to migrate over content, users, terms etc.

Rebuilding the site made it easy to get rid of some old junk and get a cleaner and more modern structure for xdeb.org. It also gave me a reason to try out the relative new Migrate 2 module. Migrate modules main use is to migrate content from other systems in to Drupal. It works equally well for migrating Drupal to Drupal.

Migrate 2 is a pleasure to work with even if the documentation is lacking. I have used Migrate 1 earlier with success but version 2 is leaps better. You need however to write the migration classes yourself in version 2. The Migrate 2 web interface allows you to run/stop/rollback the migration classes and gives you error handling etc.

One very useful feature in the Migrate module is the support for continuous migration. If new content is added to the old site Migrate module can continuously migrate that over to the new. In the case of xdeb.org it meant that my wife could continue to write blogs uninterrupted. When the new site was ready I did a final migration run and flipped the switch.

It took me a couple of days to figure out how the migrate classes works. The best resource for using Migrate 2 that I found was was the example modules that come with Migrate and a blog post with example code by Ashok Modi (BTMash), [Migrating content by using the migrate module](http://btmash.com/article/2011-02-25/migrating-content-using-migrate-module).

I believe it was days well spent. I will use Migrate 2 to update a number of customer sites to Drupal 7. The most simple ones can be upgraded the normal way but the bigger and more complex ones will fall on Migrate 2.

You find the code that I used in my sandbox on drupal.org, [xdeb migration](http://drupal.org/sandbox/frjo/1332996). Don't expect to use this code to migrate your own site! This is just another example to help you get going.

The xdeb_migration migrated the following items on xdeb.org from Drupal 6 to 7:

* Users, preserving uid.
* Terms from story vocabulary.
* Terms from blog vocabulary.
* Terms from tags vocabulary.
* Content of type page with terms, images and uploads, preserving nid.
* Content of type story with terms, images and uploads, preserving nid.
* Content of type blog with terms, images and uploads, preserving nid.
* Comments.
* URL aliases.
* The node_counter table.
* The contact table.

The most interesting bits are found in the prepareRow function in each class. It's here that you can massage your content in to shape. The supporting functions are found in the module file.

Using Migrate 2 allowed me to:

* Change location of the files folder.
* Rename fields.
* Move one content type to another site.
* Build the blog with context/views etc instead of the old blog module.
* Rename and reorganise the text formats.

These things can be done in other ways but with Migrate 2 they are easy, for a developer, to do.

If your Drupal 6 site is stuck with old style modules like event or image Migrate 2 is a way to get rid of them while preserving the content in modern date and image fields.

There are a lot of Drupal 6 (and 5) site out there that needs upgrading. Learn Migrate 2 and upgrade them to modern and maintainable Drupal sites.

