---
title: "Display a more visibel \"Read more\" link with Drupal"
date: 2007-08-18T11:25:57+02:00
lastmod: 2008-10-01T21:36:14+02:00
author: "Fredrik Jonsson"
tags: ["drupal","drupal5","development"]
aliases: ["node/801"]

---



Drupals "Read more" link is by default displayed together with other links like "Add new comment" at the bottom of the teaser display. Readers not used to blogs and other moderns web sites can easily miss that there is more to read.

Luckily Drupals [hook_nodeapi](http://api.drupal.org/api/function/hook_nodeapi/5) makes its easy to add content to the node display. Here is the function I have just added to this site to display "Read the rest of this posting." right after the teaser content.

~~~~
/**
 * Implementation of hook_nodeapi().
 */
function xdeb_addons_nodeapi(&$node, $op, $teaser = NULL, $page = NULL) { 
  switch ($op) {
    case 'view':
      if ($teaser && $node->readmore) {
        //$node->readmore = FALSE;
        $node->content['xdeb_read_more'] = array(
          '#value' => '<div class="read-more">'. l(t('Read the rest of this posting.'), 
            "node/$node->nid", NULL, NULL, NULL, TRUE) .'</div>',
          '#weight' => 10,
        );
      }
      break;
  }
}
~~~~

Uncomment the line "$node->readmore = FALSE" if you don't want the default "Read more" link to display.

For most of my sites I have a module where I put the custom functions that don't belong in the themes template.php. I name this module "[site\_name]\_addons", so for this site it's "xdeb\_addons".

There is a [Read More Tweak](http://drupal.org/project/ed_readmore) module that can do this and have a lot of options. It can also fix "read more" links in RSS-feeds. A lot more stuff than I need.

This is for Drupal 5.

