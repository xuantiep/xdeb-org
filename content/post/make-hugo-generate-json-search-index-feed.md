---
title: "Make Hugo generate a JSON search index and JSON Feed"
date: 2017-06-11T10:12:44+02:00
lastmod: 2017-06-11T10:12:44+02:00
author: "Fredrik Jonsson"
tags: ["hugo", "json", "development", "search", "rss"]

---

[Hugo](http://gohugo.io/) introduced custom output formats in version 0.20 and here I will be using it to generate two different [JSON](http://json.org/) outputs for my site.

First a search index that can be used with various search solutions. Second a [JSON Feed](https://jsonfeed.org/), a new alternative for RSS feeds.


## JSON search index

Specify a new output format named "SearchIndex" and set options for it. The "notAlternative" option is very useful since it excludes this format from ".AlternativeOutputFormats".

File: `config.yaml`

~~~~
outputFormats:
  SearchIndex:
    mediaType: "application/json"
    baseName: "searchindex"
    isPlainText: true
    notAlternative: true

outputs:
  home: ["HTML","RSS", "SearchIndex"]
~~~~

Add "SearchIndex" to "outputs/home" to make it active.

A template is then needed to specify how the search index should look and what should be included. Here is one example that I'm testing for this site.

File: `layouts/_default/list.searchindex.json`

~~~~
{{- $.Scratch.Add "searchindex" slice -}}
{{- range $index, $element := (where .Site.Pages "Kind" "page") -}}
    {{- $.Scratch.Add "searchindex" (dict "id" $index "title" $element.Title "uri" $element.Permalink "tags" $element.Params.tags "section" $element.Section "content" $element.Plain "summary" $element.Summary "year" ($element.Date.Format "2006")) -}}
{{- end -}}
{{- $.Scratch.Get "searchindex" | jsonify -}}
~~~~

Building up the structure in an array first and then convert it to JSON is by far the easiest way. You automatically get valid JSON with all the commas etc. in the right place.

I'm experimenting with using this search index and JavaScript search engine [Lunr](https://lunrjs.com/) as well as [Elasticlunr.js](http://elasticlunr.com/) but that is for a later post.

## JSON Feed

Hugo has one built in JSON output format and here I use that for the JSON Feed. If needed this could also be a custom output format.

File: `config.yaml`

~~~~
outputs:
  home: ["HTML","RSS", "JSON"]
  section: ["HTML","RSS", "JSON"]
~~~~

This will generate JSON (and HTML plus RSS) for home as well as for each section.

Then a template to generate the feed according to the [JSON Feed specifications](https://jsonfeed.org/version/1).

File: `layouts/_default/list.json.json`

~~~~
{{ $list := .Pages -}}
{{ $length := (len $list) -}}
{
    "version" : "https://jsonfeed.org/version/1",
    "title" : "{{ if eq  .Title  .Site.Title }}{{ .Site.Title }}{{ else }}{{ with .Title }}{{.}} on {{ end }}{{ .Site.Title }}{{ end }}",
    "description": "Recent content {{ if ne  .Title  .Site.Title }}{{ with .Title }}in {{.}} {{ end }}{{ end }}on {{ .Site.Title }}",
    "home_page_url" : "{{ .Site.BaseURL }}",
    {{ with .OutputFormats.Get "JSON" -}}
    "feed_url" : "{{ .Permalink }}",
    {{ end -}}
    {{ with $.Param "icon" -}}
    "icon" : "{{ . | absURL }}",
    {{ end -}}
    {{ with $.Param "favicon" -}}
    "favicon" : "{{ . | absURL }}",
    {{ end -}}
    {{ with .Site.Author.name -}}
    "author" : {
        "name" : "{{ . }}"{{ with $.Site.Author.url }},
        "url": "{{ . }}"{{ end }}{{ with $.Site.Author.avatar }},
        "avatar": "{{ . | absURL }}"{{ end }}
    },
    {{ end -}}
    "items" : [
    {{ range $index, $element := $list -}}
    {
        "title" : {{ .Title | jsonify }},
        "date_published" : "{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}",
        {{ if .Lastmod -}}
        "date_modified" : "{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}",
        {{ else -}}
        "date_modified" : "{{ .LastMod.Format "2006-01-02T15:04:05Z07:00" }}",
        {{ end -}}
        "id" : "{{ .Permalink }}",
        "url" : "{{ .Permalink }}",
        {{ with .Params.author -}}
        "author" : {
          "name" : "{{ . }}"
        },
        {{ end -}}
        "content_html" : {{ .Content | jsonify }}
    }{{ if ne (add $index 1) $length }},{{ end }}
    {{ end -}}
    ]
}
~~~~

This template is in use here on xdeb.org, see footer for feed links. It's also part of my [frjo/hugo-theme-zen](https://github.com/frjo/hugo-theme-zen).
