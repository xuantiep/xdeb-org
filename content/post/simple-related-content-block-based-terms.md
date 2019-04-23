---
title: "A simple related content block based on terms"
date: 2007-08-22T09:49:43+02:00
lastmod: 2014-05-06T11:15:03+02:00
author: "Fredrik Jonsson"
tags: ["drupal","drupal5","development"]
aliases: ["node/802"]
draft: true

---

I recently put up a related content block on this site and here is how I did it.

There are a number of Drupal modules, at least four, for this but a simple block PHP snippet  suited me best.

This PHP snippet makes sure we are viewing a node. Gets the terms for that node. Search for other nodes with the same terms and displays the five latest it can find as a node title list.

~~~~
<?php
if (arg(0) == 'node' && is_numeric(arg(1)) && is_null(arg(2))) {
  $nid = (int)arg(1);
  if ($terms = taxonomy_node_get_terms($nid)) {
    $tids = array();
    foreach ($terms as $term) {
      $tids[] = $term->tid;
    }
    $sql = db_rewrite_sql("SELECT DISTINCT n.nid, n.title, n.created 
      FROM {node} n INNER JOIN {term_node} tn ON n.nid = tn.nid 
      WHERE tn.tid IN (%s) AND n.status = 1 AND n.nid != %d 
      ORDER BY n.created DESC");
    $result = db_query_range($sql, implode(',', $tids), $nid, 0, 5);
    if (db_num_rows($result)) {
      return node_title_list($result);
    }
  }
}
~~~~

This is for Drupal 5.
