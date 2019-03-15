---
title: "Using Hugo pipes to process sass and cache-bust css and js files"
date: 2019-03-10T03:42:06+01:00
lastmod: 2019-03-10T03:42:06+01:00
author: "Fredrik Jonsson"
tags: ["hugo","sass","web","development"]

---

[Hugo Pipes](https://gohugo.io/hugo-pipes/introduction/) was added in version 0.46 and give Hugo the possibility to process sass and postcss files as well as fingerprint, minify and concat asset files.

My own [Zen theme for Hugo](https://github.com/frjo/hugo-theme-zen) have used [Gulp](https://gulpjs.com/) to process sass and js but now I have updated it to make use of pipes. It's a huge improvement to the development workflow.

With Hugo Pipes you can move only the theme sass files you want to edit/override to the root assets/sass directory. Hugo will find all the sass files in both the theme and the root assets folder and do the right thing. This is exactly how it works for layouts and archetypes. Since there is no need to edit any of the theme files it becomes hassle free to update it.

Gulp now only handles linting of sass and js. This makes installing npm optional when developing with the zen theme.

Below is how I have implemented Hugo Pipes in the partials for styles in my Zen theme. It might look overly complex but it has a some neat features. By default the sass files are built for production, compressed with fingerprint. By setting the Hugo enviroment variable to "dev" they will instead be nested with sourcemaps.

I set targetPath so the css files gets added to "public/css/" and not "public/sass/". By default Hugo reuse the directory structure inside the "assets" directory. I want sass files inside a "sass" directory and css files inside a "css" directory.

The includePaths allows the use of sass plugins. Normally they would be installed with npm and placed inside "node_modules". But then it would not be possible to build a site with the Zen theme without first running "npm install". Since I only use a single sass plugin, typey, I decided to include its stylesheets in the Zen theme.

The fingerprint is a sha256 hash (options for md5 and sha512) that gets inserted into the file name. This is perfect for cache busting and allows you to set a long cache max time on assets files.

I only use minify on script files, for sass the "compressed" styles is more efficient. Hugo Pipes can concat files as well but with HTTP/2 there is much less need for that.

~~~~
{{ $main_options := (dict "targetPath" "css/styles.css" "outputStyle" "compressed" "includePaths" (slice "assets/lib/typey/stylesheets")) -}}
{{ $print_options := (dict "targetPath" "css/print.css" "outputStyle" "compressed" "includePaths" (slice "assets/lib/typey/stylesheets")) -}}
{{ $main_style := resources.Get "sass/styles.scss" | toCSS $main_options | fingerprint -}}
{{ $print_style := resources.Get "sass/print.scss" | toCSS $print_options | fingerprint -}}
{{ if eq .Hugo.Environment "dev" -}}
{{ $main_options = (dict "targetPath" "css/styles.css" "outputStyle" "nested" "enableSourceMap" true "includePaths" (slice "assets/lib/typey/stylesheets")) -}}
{{ $print_options = (dict "targetPath" "css/print.css" "outputStyle" "nested" "enableSourceMap" true "includePaths" (slice "assets/lib/typey/stylesheets")) -}}
{{ $main_style = resources.Get "sass/styles.scss" | toCSS $main_options -}}
{{ $print_style = resources.Get "sass/print.scss" | toCSS $print_options -}}
{{ end -}}
<link rel="stylesheet" href="{{ $main_style.RelPermalink }}">
<link rel="stylesheet" href="{{ $print_style.RelPermalink }}" media="print">
~~~~

(This makes use of variable overwrite, introduced in Hugo 0.48/Go 1.11.)

The scripts partial looks like this.

~~~~
{{ $jquery := resources.Get "js/jquery.slim.min.js" | fingerprint -}}
<script src="{{ $jquery.RelPermalink }}"></script>
{{ $script := resources.Get "js/script.js" | minify | fingerprint -}}
<script src="{{ $script.RelPermalink }}"></script>
~~~~

Updating a site that uses the Zen theme is done by first moving all the sass and js files that have been modified to a root "assets" directory. Then just replace the old zen theme with an updated version. Also delete any cacheBustJS and cacheBustCSS parmas from the config file, they are now obsolete.

Since Hugo Pipes, just as gulp, uses libsass to process sass the css output will be identical.

I can now use this simplified script to update the Zen theme on all my Hugo sites.

~~~~
#!/usr/bin/env bash
set -euo pipefail

# Script to update all instances of the hugo zen theme.

HUGO_SITES=( "site1" "site2" "site3" "site4" "site5" "site6" "site7" "site8" )

EXCLUDE_FILES=( ".DS_Store" ".git" "node_modules" )

SITES_FOLDER="${HOME}/Sites/"
ZEN_FOLDER="${HOME}/src/hugo-theme-zen/"
EXCLUDES=""

for FILE in ${EXCLUDE_FILES[@]}
do
  EXCLUDES="${EXCLUDES} --exclude ${FILE}"
done

CMD="rsync --verbose --archive --delete ${EXCLUDES}"

for SITE in ${HUGO_SITES[@]}
do
  echo "Updating zen theme on ${SITE}:"
  ${CMD} ${ZEN_FOLDER} ${SITES_FOLDER}${SITE}"/themes/zen/"
done
~~~~
