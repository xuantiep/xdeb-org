---
title: "Running Lighttpd as a static file server for Drupal 6 on a Debian GNU/Linux server"
slug: "running-lighttpd-as-a-static-file-server-for-drupal-6-on-a-debian-gnu-linux-server"
date: 2009-06-27T18:17:33+02:00
lastmod: 2010-08-10T20:44:33+02:00
author: "Fredrik Jonsson"
tags: ["drupal","lighttpd","server","development"]
aliases:
  - /node/1221/

---

{{< figure src="/images/lighttpd_logo.png" width="170" class="right" alt="lighttpd logo" >}}

I found Robert Douglass article [Using Lighttpd as a static file server for Drupal](http://www.lullabot.com/articles/using-lighttpd-static-file-server) and thought it would be interesting to try out. Check also out the [Lighttpd home page](http://www.lighttpd.net/) (pron. lighty).

There are two main reasons for using a separate server for static files. The first is to offload the main server, e.g. Apache with mod_php, letting it only handle the dynamic requests. The second is to allow browsers to download files in parallel and without the overhead of cookies etc.

After I implemented the static file server [Yslow](http://developer.yahoo.com/yslow/) gives xdeb.org Grade A with a score of 94.

## New sub domain

Begin with setting up a new subdomain for the static file server. Something like static.exampl.com.


## Installing Lighttpd on Debian GNU/Linux

The installation is quickly done with aptitude. By default on Debian 4 etch lighttpd autoinstalls php4-cgi. If php5-cgi is installed lighttpd will use that instead.

~~~~
aptitude install php5-cgi
aptitude install lighttpd
~~~~

Since we want to use compression (gzip) with Lighttpd we need to create a directory for the compressed files. The permissons must be set so the web server can write to the directory.

**Update 2010-05-14**: This part is not needed on Debian GNU/Linux 5 Lenny, it's done by the install script.

~~~~
mkdir -p /var/tmp/lighttpd/cache/compress
chgrp -R www-data /var/tmp/lighttpd/cache
chmod -R g+w /var/tmp/lighttpd/cache
~~~~

The installaion is done.


## Setting up Lighttpd as a static file server with Drupal 6

Here follows the settings in lighttpd.conf that I  have made some changes to.

* In server.modules I activated mod_compress and mod_expire.
* The server.document-root needs to be set to your Drupal root, the same you have pointed Apache to.
* By emptying index-file.names and disable server.dir-listing we make sure no directory listnings will occur.
* The url.access-deny stops lighttpd from serving none static files. (In version 1.5 you can use access.deny-all instead to allow the extensions you want.)
* Set the server.port to something else than 80 if you run Apache on the same server. Remember to open up your firewall for this port.
* Add javascript and css files to compress.filetype so they will be compressed.
* With expire.url we set a two week expire on all static files, the same as Drupal sets by default.

(This is not a complete lighttpd.conf.)

~~~~
server.modules              = (
            "mod_access",
            "mod_alias",
            "mod_accesslog",
            "mod_compress",
#           "mod_rewrite",
#           "mod_redirect",
#           "mod_evhost",
#           "mod_usertrack",
#           "mod_rrdtool",
#           "mod_webdav",
           "mod_expire",
#           "mod_flv_streaming",
#           "mod_evasive"
)

server.document-root = "/path/to/your/drupal/root/"

index-file.names     = ( )

$HTTP["url"] =~ "/\.ht" {
    url.access-deny = ( "" )
}

$HTTP["url"] =~ "^/\.bzr/.*" {
    url.access-deny = ( "" )
}

$HTTP["url"] =~ "^/\.git/.*" {
    url.access-deny = ( "" )
}

url.access-deny      = ( "~", ".engine", ".inc", ".info", ".install", ".module", ".profile", ".test", ".po", ".sh", ".sql", ".theme", ".php", ".xtmpl", ".pl", ".view", ".page" )

server.port          = 81

server.dir-listing   = "disable"

compress.filetype    = ("text/plain", "text/html", "text/css", "text/xml", "text/javascript", "application/javascript", "application/x-javascript")

expire.url = ("/" => "access plus 14 days" )
~~~~

With this Lighttpd is configured and ready to go. Do a restart so all the new settings take effect.

~~~~
invoke-rc.d lighttpd restart
~~~~


## Setting up Drupal 6 to use a static file server

The final part is to make Drupal serve static files via our new static file server.

**Update 2010-08-10**: Instead of doing it manually as I have done below I recommend you checkout the [Parallel module](http://drupal.org/project/parallel).

In settings.php it's possibel to set variabels so we add the variable "static_url".

~~~~
$conf = array(
  'static_url' => 'http://static.example.com:81'  // NO trailing slash!
);
~~~~

Adding the "static_url" variable in your themes template.php under example_preprocess_page() makes it available on all page template files.

~~~~
  // Add static url variable.
  $vars['static_url'] = variable_get('static_url', '');
~~~~

This can be used to direct e.g. the logo via the static file server.

~~~~
<?php if ($logo): ?>
- <a href="<?php print $base_path ?>" title="<?php print t('Home') ?>"><img id="logo" src="<?php print $logo ?>" alt="Logo" /></a>
+ <a href="<?php print $base_path ?>" title="<?php print t('Home') ?>"><img id="logo" src="<?php print $static_url . $logo ?>" alt="Logo" /></a>
<?php endif; ?>
~~~~

Most modern Drupal sites make use of the imagecache module to handle images. By overriding the theme_imagecache() funktion and building a custom imagecache_create_url() function we can direct all generated imagecache images via the static file server.

~~~~
<?php
function example_imagecache($presetname, $path, $alt = '', $title = '', $attributes = NULL, $getsize = TRUE) {
  // Check is_null() so people can intentionally pass an empty array of
  // to override the defaults completely.
  if (is_null($attributes)) {
    $attributes['class'] = 'imagecache imagecache-'. $presetname;
  }
  if ($getsize && ($image = image_get_info(imagecache_create_path($presetname, $path)))) {
    $attributes['width'] = $image['width'];
    $attributes['height'] = $image['height'];
  }

  $attributes = drupal_attributes($attributes);
  $imagecache_url = example_imagecache_create_url($presetname, $path);
  return '<img src="'. $imagecache_url .'" alt="'. check_plain($alt) .'" title="'. check_plain($title) .'" '. $attributes .' />';
}
?>
~~~~

~~~~
<?php
function example_imagecache_create_url($presetname, $filepath, $bypass_browser_cache = FALSE) {
  $path = _imagecache_strip_file_directory($filepath);
  if (module_exists('transliteration')) {
    $path = transliteration_get($path);
  }

  $args = array('absolute' => TRUE, 'query' => $bypass_browser_cache ? time() : $bypass_browser_cache);
  switch (variable_get('file_downloads', FILE_DOWNLOADS_PUBLIC)) {
    case FILE_DOWNLOADS_PUBLIC:
      $imagecache_path = file_directory_path() .'/imagecache/'. $presetname .'/'. $path;
      // We only use the static server if imagecache has generated the image.
      $host = file_exists($imagecache_path) ? variable_get('static_url', $GLOBALS['base_url']) : $GLOBALS['base_url'];
      return url($host . '/' . $imagecache_path, $args);
    case FILE_DOWNLOADS_PRIVATE:
      return url('system/files/imagecache/'. $presetname .'/'. $path, $args);
  }
}
?>
~~~~

Drupal 6 can aggregate all css and all js files so the browser typically only needs to download two files instead of dozens. To direct these aggregated files via the static file server we need to hack core a little bit.

Not something you should do lightly but here I believe it's worth it.

* The css + js files can be quite big on a modern site.
* When the css file is served from the static file server all css images will be served from there also.

~~~~
<?php
  if ($is_writable && $preprocess_css) {
    $filename = md5(serialize($types) . $query_string) .'.css';
    $preprocess_file = drupal_build_css_cache($types, $filename);
 -  $output .= '<link type="text/css" rel="stylesheet" media="'. $media .'" href="'. base_path() . $preprocess_file .'" />'."\n";
 +  $output .= '<link type="text/css" rel="stylesheet" media="'. $media .'" href="'. variable_get('static_url', '') . base_path() . $preprocess_file .'" />'."\n";
  }
?>
~~~~

~~~~
<?php
  if ($is_writable && $preprocess_js && count($files) > 0) {
    $filename = md5(serialize($files) . $query_string) .'.js';
    $preprocess_file = drupal_build_js_cache($files, $filename);
 -  $preprocessed .= '<script type="text/javascript" src="'. base_path() . $preprocess_file .'"></script>'."\n";
 +  $preprocessed .= '<script type="text/javascript" src="'. variable_get('static_url', '') . base_path() . $preprocess_file .'"></script>'."\n";
  }
?>
~~~~


## Conclusion

I should do some benchmarking on the improvements but xdeb.org certainly feels snappier with the static file server. It's mainly due to parallel downloads of images I belive. As I mentioned Yslow now gives the site Grade A.

This feels like a relatively simpel way to improve the performance of smaller sites that runs on a single VPS or dedicated server.

