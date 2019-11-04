---
title: "Bash script to make development settings on local Drupal database"
date: 2010-05-19T17:00:07+02:00
lastmod: 2011-04-20T11:36:05+02:00
author: "Fredrik Jonsson"
tags: ["drupal","drush","development"]
aliases:
  - /node/1353/

---



A common thing you do in Drupal web site development is to take a database dump from production/staging/testing and use it to update your local development environment.

In your local development environment you want other settings for things like error reporting and cache, enable/disable modules etc.

I recently upgrade my script for this to make use of Drush 3 and thought I would share it.

With Drush 3 I use the wonderful sql-sync command with site alias to update the database. I used to have a rather complicated Bash scripts to handle this, Drush is wicked cool!

~~~~
drush sql-sync @example.com @example.dev
~~~~

I then run this script and I'm all set up for development work. Make sure you replace all instances of "/path/to/" with proper values and of course add/remove stuff to suit your needs.

~~~~
#!/usr/bin/env bash
# Script to make development settings on local Drupal database

drcmd='/path/to/drush' # Path to drush

# Optional site alias
if [ "$1" != "" ]; then
  if [ "${1:0:1}" = "@" ]; then
    sitealias=$1
  else
    sitealias="@"$1
  fi
fi

echo "Start"

# Set variables
${drcmd} ${sitealias} variable-set --yes image_imagemagick_convert '/path/to/convert'
${drcmd} ${sitealias} variable-set --yes imageapi_imagemagick_convert '/path/to/convert'
${drcmd} ${sitealias} variable-set --yes cache 0
${drcmd} ${sitealias} variable-set --yes block_cache 0
${drcmd} ${sitealias} variable-set --yes page_compression 0
${drcmd} ${sitealias} variable-set --yes preprocess_css 0
${drcmd} ${sitealias} variable-set --yes preprocess_js 0
${drcmd} ${sitealias} variable-set --yes devel_api_url 'api.dev'
${drcmd} ${sitealias} variable-set --yes devel_error_handler 2
${drcmd} ${sitealias} variable-set --yes dev_timer 1
${drcmd} ${sitealias} variable-set --yes dev_query 1
${drcmd} ${sitealias} variable-set --yes dev_mem 1
${drcmd} ${sitealias} variable-set --yes error_level 1
${drcmd} ${sitealias} variable-set --yes securepages_enable 0
${drcmd} ${sitealias} variable-set --yes dummyimages_generate 2

# Enable development only modules
${drcmd} ${sitealias} pm-enable --yes devel coder reroute_email ie_css_optimizer drupalforfirebug dummyimage

# Disable production only modules
${drcmd} ${sitealias} pm-disable --yes xmlsitemap_engines apachesolr_search googleanalytics mollom twitter twitter_actions

# Clear the cache
${drcmd} ${sitealias} cache-clear all

echo "Done!"
~~~~

