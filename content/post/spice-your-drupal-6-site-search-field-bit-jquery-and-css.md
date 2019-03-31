---
title: "Spice up your Drupal 6 site search field with a bit of jQuery and CSS"
date: 2010-06-02T19:27:33+02:00
lastmod: 2013-04-22T09:37:39+02:00
author: "Fredrik Jonsson"
tags: ["css","drupal","firefox","javascript","jquery","safari","search","development"]
aliases: ["node/1359"]

---

{{< figure src="/images/safari_search_field_2.png" width="184" class="right" alt="safari search field 2" >}}
{{< figure src="/images/firefox_search_field_2.png" width="184" class="right" alt="firefox search field 2" >}}

The search field is an important part of almost any web site today and it deserve some attention. Especially if you have implemented some really good search like Apache Solr (see [How to set up Apache Solr search for Drupal 6 on a Debian GNU/Linux server](/node/1213)).

This is an update to [an older post](/node/908) on the same subject but for Drupal 5. This new version is for Drupal 6 and adds jQuery 1.3+ compatibility plus some nice CSS for Firefox.

If you use Safari, or any other Webkit browser, the spiced up search field looks like a standard Mac OS X search field:

![Safari search field example](/sites/default/files/upload/safari_search_field_2.png "Safari search field example")

With the help of some CSS I made the spiced up Firefox search field look somewhat similar:

![Firefox search field example](/sites/default/files/upload/firefox_search_field_2.png "Firefox search field example")

All this is done with JavaScript and CSS on the original Drupal search form ensuring graceful degradation. If you turn of JavaScript all that happens is that you get the standard search field and button.

Here follows the code I use to implement this here on xdeb.org.

I almost always have a site specific module that I name "[sitename]\_addon" where I put all the custom bit and pices of code that the site needs. The search field is usally on every page so I use hook\_init() to add the JavaScript and CSS file. Here I also insert the text string that I want to appear in the search field as a placeholder/hint. Doing it this way makes it possible to use the Drupal locale module to translate it.

**In all the code below you should replace "example" with something that suits you, the site name for example.**

~~~~
/**
 * Implementation of hook_init().
 */
function example_addons_init() {
  global $base_url;
  $parts = parse_url($base_url);
  $host = array_reverse(explode('.', $parts['host']));

  $path = drupal_get_path('module', 'example_addons');
  drupal_add_css($path .'/example_addons.css', 'theme');
  drupal_add_js($path .'/example_addons.js');
  drupal_add_js(array('example' => array(
    'search_hint' => t('Search on @site', array('@site' => variable_get('site_name', 'Drupal')))),
    'search_domain' => $host[0] .'.'. $host[1] .'.search',
  ), 'setting');
}
~~~~

Here is the CSS file.

~~~~
/* $Id: $ */

/* Text hints in search fields */
.texthint {
  color: #999;
}

/* Safari style search field for Firefox */
#search .safaristyle,
#search-block-form .safaristyle {
  -moz-border-radius: 1em;
  -moz-box-shadow: 0 0 2px #ccc inset;
  border: 1px solid #999;
  padding: 2px 0.5em;
}

/* Stop search label and button to flicker before js is loaded. */
.js #search label,
.js #block-search-0 label,
.js #search #edit-submit,
.js #search #edit-submit-1,
.js #block-search-0 #edit-submit,
.js #block-search-0 #edit-submit-1 {
  display: none;
}
~~~~


Here is the jQuery JavaScript file.

**In all the code below you should replace "example" with something that suits you, the site name for example.**

~~~~
// $Id: $
(function ($) {

$.fn.texthint = function (title) {
  return this.each(function () {
    // Get jQuery version of 'this'.
    var t = $(this);
    // Only apply logic if the element has the attribute.
    if (title) {
      t.addClass('texthint').attr('size', '20');
      if ($.browser.mozilla) {
        t.addClass('safaristyle');
      }
      // On blur, set value to title attr if text is blank.
      t.blur(function () {
        if (t.val() == '') {
          t.addClass('texthint').val(title);
        }
      });
      // On focus, set value to blank if current value
      // matches title attr.
      t.focus(function () {
        if (t.val() == title) {
          t.removeClass('texthint').val('');
        }
      });

      // Clear the pre-defined text when form is submitted.
      t.parents('form:first').submit(function () {
        if (t.val() == title) {
          t.removeClass('texthint').val('');
        }
      });

      // Now change all inputs to title.
      t.blur();
    }
  });
}

Drupal.behaviors.initSearchTexthint = function (context) {
  $('input#edit-search-theme-form-1, input#edit-search-block-form-1', context).each(function () {
    var input = $(this);
    var settings = Drupal.settings.example;
    if ($.browser.safari) {
      // jQuery 1.2 does no longer allow changing the type property.
      input.get(0).type = 'search';
      input.attr({
        autosave: settings.search_domain,
        results: '9',
        placeholder: settings.search_hint,
        size: '20'
      });
    }
    else {
      input.texthint(settings.search_hint);
    }
  });
}

})(jQuery);
~~~~

