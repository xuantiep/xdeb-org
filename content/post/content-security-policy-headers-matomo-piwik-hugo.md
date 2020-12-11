---
title: "Content security policy headers when using Matomo or Google analytics"
slug: "content-security-policy-headers-when-using-matomo-or-google-analytics"
date: 2020-01-14T09:41:58+01:00
lastmod: 2020-12-11T10:25:39+01:00
author: "Fredrik Jonsson"
tags: ["security","apache","server","hugo"]

---

I recently added a Content Security Policy header to my web servers. I found a number of issues around getting analytics and embedded videos and maps working. Other sites will have more issues but I suspects these are among the most common.

In this post I explain how I solved the issues and now have a reasonable strict Content Security Policy in place.

Adding [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) to your web server helps with Cross Site Scripting (XSS) and data injection attacks. They tell the server from where it's ok to load things like scripts, images and iframe content.


## Testing Content Security Policy on your web server

When testing this out I recommend using "Content-Security-Policy-Report-Only" header in place of "Content-Security-Policy". That way the browser will report in the console but not actually block anything.

I added this to my Apache configuration:

~~~~ shell
Header set Content-Security-Policy-Report-Only "default-src 'self'"
~~~~

If you use Nginx the same configuration looks like this:

~~~~ shell
add_header Content-Security-Policy-Report-Only "default-src 'self'";
~~~~

This will report any resources that are not loaded from 'self', i.e. your own server. Inline and eval code is considered unsafe and will also be blocked unless specifically allowed.

When testing a few sites I found a number of things that would stop working with the above Content Security Policy.

* Matomo analytics (formerly Piwik)
* Google analytics
* Google embedded maps
* Youtube and other embedded videos
* My self hosted Matomo installation


## Moving analytics code from inline to files

For me the only inline code was from analytics code.

### Matomo analytics

All my own sites use Matomo and they have a [Content Security Policy FAQ](https://matomo.org/faq/general/faq_20904/).

Create a `tracking.js` file and place this content it to it. 

~~~~ js
var idSite = 1;  // Use your own value!
var matomoTrackingApiUrl = 'https://matomo.example.org/matomo/matomo.php';  // Use your own value!

var _paq = window._paq || [];
_paq.push(['setTrackerUrl', matomoTrackingApiUrl]);
_paq.push(['setSiteId', idSite]);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
~~~~

Then add these script tags in the head of your html pages.

~~~~ html
<script src="/js/tracking.js"></script>
<script defer src="https://matomo.example.org/matomo/matomo.js"></script>
~~~~

### Google analytics

Almost identical for Google as for Matomo.

Create a `tracking.js` file and place this content it to it. 

~~~~ js
var googleAnalytics = 'UA-1234567-8';  // Use your own value!

var _gaq = _gaq || [];
_gaq.push(['_setAccount', googleAnalytics]);
_gaq.push(['_trackPageview']);
~~~~

Then add these script tags in the head of your html pages.

~~~~ html
<script src="/js/tracking.js"></script>
<script defer src="https://ssl.google-analytics.com/ga.js"></script>
~~~~


### Hugo template versions

I use Hugo to build most of my own sites so have implemented this in my [frjo/hugo-theme-zen](https://github.com/frjo/hugo-theme-zen).

I add the `tracking.js` as an asset so Hugo can process it.

~~~~ js
var idSite = {{ .Site.Params.piwikSiteID }};
var matomoTrackingApiUrl = 'https://{{ .Site.Params.piwikTrackerUrl }}/matomo.php';

var _paq = window._paq || [];
_paq.push(['setTrackerUrl', matomoTrackingApiUrl]);
_paq.push(['setSiteId', idSite]);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
~~~~

In the partial that pull in the `tracking.js` I use "ExecuteAsTemplate" so Hugo can replace the variables with the configured values.

~~~~ go-html-template
{{ if and .Site.Params.piwikTrackerUrl .Site.Params.piwikSiteID -}}
{{ $script := resources.Get "js/tracking.js" | resources.ExecuteAsTemplate "js/tracking.js" . | minify | fingerprint -}}
<script src="{{ $script.RelPermalink }}"></script>
<script defer src="https://{{ .Site.Params.piwikTrackerUrl }}/matomo.js"></script>
{{ end -}}
~~~~

## Getting video and maps working

No code changes was needed for this, only finding the correct Content Security Policy settings.

All that is needed for embedding videos is to add the host to the "frame-src" directive. Same for Google maps but there I also needed to add "unsafe-inline" to the "style-src" directive. Styles is luckily less of a security problem than scripts.

## The Content Security Policy I now use

### Global Content Security Policy

**Update 2020-03-12**: Discovered that Google analytic needed "connect-src" as well to function.

**Update 2020-12-11**: With Matomo 4 you need "connect-src" for it to function.

~~~~ shell
Header set Content-Security-Policy "default-src 'self'; \
  connect-src 'self' https://matomo.example.org https://ssl.google-analytics.com; \
  frame-src 'self' https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://embed.ted.com; \
  img-src 'self' https: data:; \
  media-src 'self' https:; \
  object-src 'none'; \
  script-src 'self' https://matomo.example.org https://ssl.google-analytics.com; \
  style-src 'self' 'unsafe-inline' https:"
~~~~

1. Default policy is to only allow resources from self.
2. Allow connects from self, our own Matomo site and from the Google analytic site.
3. Allow loading iframes from Google, Youtube, Vimeo and Ted. This allows for videos and maps from these sites.
4. Allow images from self, any https source and data schema.
5. Allow media from self and any https source.
6. Do not allow any objects, highly advisable.
7. Allow scripts from self, our own Matomo site and from the Google analytic site.
8. Allow styles from self and inline. The last is needed for Google maps.

Allowing loading images and media from everywhere is convenient but others will make another choice. The unsafe-inline option for styles could be limited to only the sites that use Google maps and other services that need it.


### Content Security Policy for self hosted Matomo

For my self hosted Matomo site I needed a custom Content Security Policy. It needs both inline and eval for scripts, inline for styles and load images from an external site. But better to have that on one site then on all of them as before.

~~~~ shell
Header set Content-Security-Policy "default-src 'self'; img-src 'self' https://plugins.matomo.org; object-src 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
~~~~



## Good resources

[Analyse your HTTP response headers](https://securityheaders.com/) and find out which one is implemented on your server. Beside Content Security Policy the recommended headers are  X-Frame-Options, Feature-Policy, Strict-Transport-Security,  X-Content-Type-Options and Referrer-Policy.

[CSP Evaluator](https://csp-evaluator.withgoogle.com/) is a tool from Google for testing your Content Security Policy headers.

