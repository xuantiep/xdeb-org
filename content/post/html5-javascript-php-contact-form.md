---
title: "A HTML5+PHP+JavaScript contact form with spam protection"
date: 2017-06-24T07:55:21+02:00
lastmod: 2017-06-24T07:55:21+02:00
author: "Fredrik Jonsson"
tags: ["php", "jquery", "javascript", "development"]
draft: true

---

Setting out to create a simple contact form turned out to involve more work than I anticipated. I need this for one of my new static sites. The examples I found was to old, lacking spam protection and/or relied on multiple/large libraries.

A modern option would be to use one of the many cloud services for forms of different kinds but I prefer to run things on my own server. I even run my own mail-server since well over a decade.

These are the features I wanted for my contact form:

* Local and small in code size.
* HTML5 form with placeholders, required field indicators and validation.
* Some decent spam protection, but no captcha.
* Status messages informing the user of success as well as error on sending the messages.
* Use the PHP mail() command for sending since that is built in to most servers, including my own.
* Make the PHP script reasonable secure.
* Set Sender and Return-Path so SPF checks do not complain.

I started by looking how the core Drupal 7 contact module handle this. That is what I use on all the Drupal sites I build and I got a lot of the PHP code from there.

For spam protection I looked at the Drupal modules [Honeypot](https://www.drupal.org/project/honeypot) and especially [Antibot](https://www.drupal.org/project/antibot). Honeypot uses a common fake hidden input field among other things and I have added that to my solution as well. Antibot has a really neat JavaScript antispam solution. It simply changes the action path until the user have moved the mouse or pressed the tab or enter key. This makes the contact form depend on JavaScript but that is well worth it I believe.

The JavaScript also takes care of displaying the status messages as well as hiding the "You must have Javascript…" message that is shown if the browser has it turned off. It also adds a "js-submitted" class to the form on submit.

A few lines of CSS makes the HTML5 form show when fields are valid or invalid after the user has started typing in a field or has tried to submit the form with invalid fields.

<p data-height="500" data-theme-id="0" data-slug-hash="pwWoEd" data-default-tab="result" data-user="frjo" data-embed-version="2" data-pen-title="Contact form" class="codepen">See the Pen <a href="https://codepen.io/frjo/pen/pwWoEd/">Contact form</a> by Fredrik Jonsson (<a href="https://codepen.io/frjo">@frjo</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

In the Codepen above you find the HTML/JS/CSS code and below is the PHP script that sends the messages.

You need to replace "info@example.com" with a real address but otherwise it should work on most Unix based servers. I run it on Debian GNU/Linux.

<script src="https://gist.github.com/frjo/23e45ec5e690d90f6bfcaca06873fd73.js"></script>
