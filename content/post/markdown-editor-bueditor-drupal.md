---
title: "Markdown editor for BUEditor on Drupal"
slug: "markdown-editor-for-bueditor-on-drupal"
date: 2012-11-12T13:36:46+01:00
lastmod: 2012-11-12T13:39:01+01:00
author: "Fredrik Jonsson"
tags: ["drupal","markdown","development"]
aliases:
  - /node/1580/

---

{{< figure src="/images/markdowneditor.png" width="400" class="right" alt="Markdown editor for Drupal" >}}

The [Markdown editor for BUEditor](http://drupal.org/project/markdowneditor) now has a stable 1.0 release for Drupal 7. I was recently made co-maintainer and are now preparing a 1.1 release. Please help by testing [7.x-1.x-dev](http://drupal.org/node/1403968). My goal with Markdown editor, besides making it even better, is to make it 10 to 100 times more popular.

If you want to see Markdown editor 7.x-1.x-dev in action I have posted an screencast [Introduction to Markdown editor for BUEditor](http://vimeo.com/53318556) on Vimeo.

I install the Markdown editor by default on all new Drupal sites I build. After some convincing about trying it out most customers are happy using it. When it comes down to it very little markup is needed in content on a well built web site.

Reasons for using Markdown and Markdown editor:

* Always creates valid HTML output.
* Avoid hardcoding HTML markup in content.
* Markdown can easily be converted to multiple formats included some future HTML 10 standard.
* Markdown is easy, even good, to read in raw format.
* The Markdown editor is lightweight and fast loading.
* The Markdown editor doesn't hijack the textareas, only add some buttons to them.

The Markdown editor is a plugin for [BUEditor](http://drupal.org/project/bueditor) so you will need that module as well. BUEditor is used on Drupal.org for simple HTML markup in issues and other places.

For nice previews the [Ajax markup](http://drupal.org/project/ajax_markup) module is highly recommended. If you install in before activating the Markdown editor you will automatically get a preconfigured preview button in your Markdown editor. To render the Markdown markup in to HTML you need an text format with the [Markdown filter](http://drupal.org/project/markdown).

If you have not used Markdown before checkout John Grubers original [Markdown Syntax](http://daringfireball.net/projects/markdown/syntax) and the [PHP Markdown Extra](http://michelf.ca/projects/php-markdown/extra/) extensions.

