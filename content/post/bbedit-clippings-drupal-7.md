---
title: "BBEdit Clippings for Drupal 7"
slug: "bbedit-clippings-for-drupal-7"
date: 2011-07-22T03:02:22+02:00
lastmod: 2011-07-22T04:20:31+02:00
author: "Fredrik Jonsson"
tags: ["bbedit","drupal","drupal7","editor","macOS","development"]
aliases:
  - /node/1521/

---

{{< figure src="/images/bbedit_drupal.png" width="374" class="right" alt="BBEdit Clippings for Drupal 7" >}}

Rainy days, the just released [BBEdit 10](http://www.barebones.com/products/bbedit/) and the fact that all new sites I build now are Drupal 7 has inspired my to update and vastly improve my BBEdit clippings for Drupal.

My BBEdit Clippings for Drupal 7 includes:

* All hooks
* All drupal_* functions
* All devel module print/debug functions
* Common functions like t, l, url, check_*
* Control structures like for, if and switch 
* Snippets for doxygen and function
* Some theme functions for quick insert into template.php.

Download/clone/fork from [github.com/frjo/BBEdit-Clippings-for-Drupal](https://github.com/frjo/BBEdit-Clippings-for-Drupal)

## Tips about ctags

With ctags files you get autocompletion of functions, classes etc.

Run the following commands in the root of a Drupal install to
generate ctags files for PHP and JavaScript:

~~~~
/Applications/BBEdit.app/Contents/Helpers/ctags --langmap=php:.engine.inc.module.theme.php.test.install --php-kinds=cdfi --languages=php --excmd=number --tag-relative=no --fields=+a+m+n+S -f drupal_ctags_php.txt --recurse "$PWD"
/Applications/BBEdit.app/Contents/Helpers/ctags --languages=JavaScript --excmd=number --tag-relative=no --fields=+a+m+n+S -f drupal_ctags_js.txt --recurse "$PWD"
~~~~

Copy them to these folders to activate them:

~~~~
~/Library/Application Support/BBEdit/Completion Data/JavaScript
~/Library/Application Support/BBEdit/Completion Data/PHP
~~~~


P.S. If you do Drupal development with BBEdit you may be interested in these [jQuery Clippings](http://noumenal.co.uk/bbedit/jquery-clippings/) from noumenal.co.uk as well.

