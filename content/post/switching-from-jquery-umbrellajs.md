---
title: "Switching from jQuery to Umbrella JS"
date: 2019-03-20T08:12:45+01:00
lastmod: 2019-03-20T08:12:48+01:00
author: "Fredrik Jonsson"
tags: ["javascript","jquery","umbrella"]

---

In an attempt to make this site load even faster I have switched from jQuery to [Umbrella JS](https://umbrellajs.com/). Umbrella is really tiny, 2.5kB when gzipped, and strongly influenced by jQuery so the switch is easy for simple scripts. Good information in [Porting from jQuery](https://github.com/franciscop/umbrella/blob/master/jquery.md).

The front page of this site is now down to 64 kB from 85 kB with jQuery. It's not a huge saving but one needs a hobby. The site loads in 250 ms, add to that any ping time you have from your location to my server.

I have my self hosted [Matomo analytics](https://matomo.org/) active on this site. Fun to see what the users are up to. That script is 22 kB when gzipped, does is really need to be that large? Seems a bit silly that it's a third of the site size.

Umbrella includes an impressive amount of jQuery compatible methods for it's tiny size. One advantage of Umbrella over jQuery is how easy it's to use native methods. When Umbrella lacks a method you simple use the native one instead. Just remember to precede it with `.first()`, `.last()` or `.nodes`. Read more in the [Umbrella documentation](https://umbrellajs.com/documentation).

As an exempel I have added both the jQuery and the Umbrella version of my script that adds a "Copy code" button to all code snippets.

First comes the jQuery version:

~~~~
 1 (function ($) {
 2 
 3   'use strict';
 4 
 5   $('.content').find('pre').each(function (i) {
 6     var codeitem = 'js-code-item-' + i;
 7     var $button = $('<button data-codeitem="' + codeitem + '"/>').text('Copy code').addClass('js-clipboard-button');
 8     $(this).addClass(codeitem).after($button);
 9   });
10 
11   $('.js-clipboard-button').click(function (e) {
12     e.preventDefault();
13     var codeitem = '.' + $(this).data('codeitem');
14     var codesnippet = $(codeitem).find('code').html();
15     var $textarea = $('<textarea>').html(codesnippet).addClass('visually-hidden');
16     $textarea.appendTo('body');
17     $textarea.select();
18     document.execCommand('copy');
19     $textarea.remove();
20   });
21 
22 })(jQuery);
~~~~

And here we have the new Umbrella version.

~~~~
 1 (function ($) {
 2 
 3   'use strict';
 4 
 5   $('.content').find('pre').each(function (e, i) {
 6     var codeitem = 'js-code-item-' + i;
 7     var $button = $('<button data-codeitem="' + codeitem + '"/>').text('Copy code').addClass('js-clipboard-button');
 8     $(e).addClass(codeitem).after($button);
 9   });
10 
11   $('.js-clipboard-button').handle('click', function () {
12     var codeitem = '.' + $(this).data('codeitem');
13     var codesnippet = $(codeitem).find('code').html();
14     var $textarea = $('<textarea>').html(codesnippet).addClass('visually-hidden');
15     $('body').append($textarea);
16     $textarea.first().focus();
17     $textarea.first().select();
18     document.execCommand('copy');
19     $textarea.remove();
20   });
21 
22 })(u);
~~~~

As you can see they are very similar. I go through the code line by line.

1. [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE), Immediately Invoked Function Expression. This is how Drupal coding standard recommend doing it and I worked with Drupal for many years. It seems to works well but there may be better ways of doing it.
2. –
3. Always use strict
4. –
5. Umbrella doesn't change the scope of `this` so in a each loop `$(this)` need to be changed to `$(e)` (or whatever name you pick for it).
6. –
7. –
8. See above.
9. –
10. –
11. Umbrella has a neat `handle` method that automatically sets `e.preventDefault()`. Shortcuts like `.click()` is not supported only full methods like `.on('click')`.
12. –
13. –
14. –
15. The method `.appendTo()` doesn't exist so switch to `.append()`
16. The method `.select()` doesn't exist so use native `.focus()` and `.select()` instead.
17. Notice the use of the `.first()` method before the native method.
18. –
19. –
20. –
21. –
22. By replacing `jQuery` with `u` the script switches from jQuery to Umbrella.

I have added Umbrella to my [frjo/hugo-theme-zen](https://github.com/frjo/hugo-theme-zen) and converted the included scripts.
