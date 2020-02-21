---
title: "Migrating xdeb.org from Drupal to Hugo"
slug: "migrating-xdeb-org-from-drupal-to-hugo"
date: 2017-05-22T08:59:19+02:00
lastmod: 2017-05-28T10:15:16+02:00
author: "Fredrik Jonsson"
tags: ["hugo","drupal","web","development"]

---

xdeb.org is now generated with Hugo, the static site generator that I wrote about in my last post [Using Hugo for a simple web site and porting the Drupal Zen theme]({{< relref "using-hugo-simple-web-site-and-porting-drupal-zen-theme.md" >}}).

One less Drupal site to keep updated. Now it's "only" the content I need to add and update here.

I'm using the Zen theme [frjo/hugo-theme-zen](https://github.com/frjo/hugo-theme-zen) that I ported from Drupal to Hugo. I have also moved over the custom css I used for xdeb.org so the site look a lot like before. All importen urls should be the same or have redirects.

The site now has a [JSON Feed](https://jsonfeed.org/), would be nice if that got some traction. The JSON feed is part of the Zen theme.

Here is the script I used to migrate the content. This script is far from generic with hardcoded field names, image width etc. But there might be some interesting solutions for others doing the same thing.

~~~~
<?php

module_load_include('inc', 'pathauto');

$types = array('blog', 'story', 'page');
$base_path = getcwd();

foreach ($types as $type) {
  $query = new EntityFieldQuery();
  $query->entityCondition('entity_type', 'node')
        ->entityCondition('bundle', $type);
  $result = $query->execute();
  $nodes = node_load_multiple(array_keys($result['node']));

  foreach ($nodes as $node) {
    $title = addslashes($node->title);
    $filename = pathauto_cleanstring($node->title);
    $oldurl = 'node/' . $node->nid;
    $author = format_username(user_load($node->uid));
    $date = format_date($node->created, 'custom', 'Y-m-d\TH:i:sP');
    $modified = format_date($node->changed, 'custom', 'Y-m-d\TH:i:sP');
    $status = $node->status ? 'published' : 'unpublished';
    $text = $node->body[LANGUAGE_NONE][0]['value'];
    $text = str_replace(array("\r\n", "\n\r"), "\n", $text);
    $text = str_replace('<!--break-->', '', $text);
    $text = preg_replace('/<\/?code>/', '~~~~', $text);
    $text = preg_replace('/ ?\[inline:[^\]]+\]/', '', $text);
    $text = preg_replace('/ ?\[inline_nolink:[^\]]+\]/', '', $text);

    @mkdir("hugo/$author/$type/$status/images", 0777, TRUE);
    @mkdir("hugo/$author/$type/$status/files", 0777, TRUE);

    $tag_array = array();
    $tids = db_query('SELECT tid FROM {taxonomy_index} WHERE nid = :nid', array(':nid' => $node->nid))->fetchCol();
    if (!empty($tids)) {
      $terms = taxonomy_term_load_multiple($tids);
      foreach ($terms as $term) {
        $tag_array[] = '"' . drupal_strtolower($term->name) . '"';
      }
    }

    $image_array = array();
    $file_array = array();
    $media_fields = array('field_file_upload', 'field_blog_image_slideshow', 'field_blog_image_gallery_1', 'field_blog_image_gallery_2', 'field_page_image');
    foreach ($media_fields as $field_name) {
      if (isset($node->{$field_name}[$node->language]) && !empty($node->{$field_name}[$node->language])) {
        foreach ($node->{$field_name}[$node->language] as $file) {
          $medianame = $file['filename'];
          $filepath = file_uri_target($file['uri']);
          $source = drupal_realpath(file_uri_scheme($file['uri']) . '://') . '/' . $filepath;
          if (strpos($file['filemime'], 'image/') === 0) {
            if (isset($file['description'])) {
              $image_info = image_get_info($file['uri']);
              $width = $image_info['width'];
              $alt = !empty($file['description']) ? $file['description'] : $medianame;
            }
            else {
              $width = $file['width'];
              $alt = $file['alt'];
            }

            $width = $width > 400 ? 400 : $width;
            $alt = str_replace(array('-', '_', '.png', '.jpg' , '.gif'), array(' ', ' ', '', '', ''), $alt);

            $dest = $base_path . "/hugo/$author/$type/$status/images/" . $medianame;
            $image_array[] = '{ {< figure src="/images/' . $medianame . '" width="' . $width . '" class="right" alt="' . $alt . '" >} }';
          }
          else {
            $dest = $base_path . "/hugo/$author/$type/$status/files/" . $medianame;
            $alt = !empty($file['description']) ? $file['description'] : $medianame;
            $size = format_size($file['filesize']);
            $file_array[] = "[$alt](/files/$medianame) ($size)";
          }
          copy($source, $dest);
        }
      }
    }

    $tags = implode(',', $tag_array);
    $images = implode("\n", $image_array);
    $files = implode("\n", $file_array);

    $content = <<<EOF
---
title: "$title"
date: $date
lastmod: $modified
author: "$author"
tags: [$tags]
aliases: ["$oldurl"]

---

$images

$text

$files
EOF;

    file_put_contents("hugo/$author/$type/$status/$filename" . '.md', $content);
  }
}
~~~~

Here is the Hugo config.yml for xdeb.org.

~~~~
---
title: "xdeb.org"
baseURL: "https://xdeb.org/"
theme: "zen"
languageCode: "en-GB"
defaultContentLanguage: "en"
metaDataFormat: "yaml"
pluralizelisttitles: false
removePathAccents: true
paginate: 10
paginatePath: "page"
rssLimit: 20
author:
  name: "Fredrik Jonsson"
  url: "https://xdeb.org/fredrik"
  avatar: "site/fredrik.jpg"

permalinks:
  post: "/post/:year/:month/:day/:slug"

outputs:
  home: ["HTML","RSS", "JSON"]
  section: ["HTML","RSS", "JSON"]

params:
  cacheBustCSS: true
  cacheBustJS: false
  contact: "info@xdeb.org"
  copyright: "<!--Creative Commons License-->This site is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).<!--/Creative Commons License-->"
  dateformat: "2 January, 2006"
  favicon: "icon-64.png"
  feedlinks: true
  footer: "Powered by [Hugo](https://gohugo.io/). A [xdeb.net](https://xdeb.net/) production."
  frontposts: 3
  icon: "apple-touch-icon-180.png"
  imageMaxWidth: 400
  jquery: true
  logo: false
  poweredby: false
  search: false
  searchSize: 20
  sidebar: false
  slicknav: true
  submitted: true

menu:
  main:
      - Name: "Home"
        weight: -10
        URL: "/"
      - Name: "Posts"
        weight: -9
        URL: "/post/"
      - Name: "About"
        weight: 9
        URL: "/fredrik/"
      - Name: "Ragnvald"
        weight: 10
        URL: "/ragnvald/"
~~~~
