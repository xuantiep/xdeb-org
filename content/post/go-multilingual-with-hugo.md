---
title: "Go multilingual with Hugo"
slug: "go-multilingual-with-hugo"
date: 2018-04-05T11:31:23+02:00
lastmod: 2019-05-19T10:31:22+02:00
author: "Fredrik Jonsson"
tags: ["hugo","multilingual","web","development"]

---

{{< figure src="/images/language-icon-big.png" width="200" class="right" alt="Language icon." >}}

I have made my small [company site](https://combonet.se/) multilingual, in Swedish and in English. It's a static site built with [Hugo](https://gohugo.io/) and my own [Zen theme for Hugo](https://github.com/frjo/hugo-theme-zen).

Hugo has good [multilingual support](https://gohugo.io/content-management/multilingual/#readout). What took the most time was building a language selector that works both when content is translated and when it is not.

Update 2019-05-19: languageName does not need to be a custom parameter, it is a supported language setting.

## Configure the languages

In the "config.yml" file I have Swedish set as the default language and configure the two languages I want, "sv" and "en". The "LanguageName" setting is used in the language selector.

~~~~
defaultContentLanguage: "sv"

languages:
  sv:
    weight: 1
    languageName: "Svenska"
  en:
    weight: 2
    languageName: "English"
~~~~


## Translate the content

Duplicate each page you want to translate and add the language code to the file name. The "about.md" page gets a English version with "about.en.md". All the content with ".en." in the name will get generated in a "en" subdirectory inside "public".

Simple and straight forward solution by Hugo I think.

## Theme i18n files

My zen theme already has i18n files for Swedish and English, if you need another language add it to the sites "i18n" directory. These files has translations for terms in the themes templates.


## Language selector

I wanted a language selector that would switch to the translated version of the current page if it existed and to the front page of the language if not.

I solve this by checking if ".IsTranslated" is set. If it is, the code iterate over all the available translations and link to them. If not, it iterate over all the available site languages and link to the front page for that language.

~~~~
<h2 class="visually-hidden">{{ i18n "lang_select_title" }}</h2>
<nav class="language-selector layout__language-selector">
<ul class="navbar">
{{ if .IsTranslated -}}
{{ range .Translations }}
<li><a rel="alternate" href="{{ .RelPermalink }}" hreflang="{{ .Lang }}" lang="{{ .Lang }}">{{ .Language.LanguageName }}</a></li>
{{ end -}}
{{ else -}}
{{ range .Site.Languages -}}
{{ if ne $.Site.Language.Lang .Lang }}
<li><a rel="alternate" href="{{ .Lang | relURL }}" hreflang="{{ .Lang }}" lang="{{ .Lang }}">{{ .LanguageName }}</a></li>
{{ end -}}
{{ end -}}
{{ end -}}
</ul>
</nav>
~~~~

It's common to use country flags for a language selector but language is not the same thing as country so I went looking for a better icon.

I found the [Language Icon](http://www.languageicon.org/) and it works well I think, looks nice and I believe a lot of people can guess what it's for. I also output the language names in their own language. Do not demand that everyone know English just to switch to their language of choice.

This language selector is part of the [Zen theme for Hugo](https://github.com/frjo/hugo-theme-zen).


## The result

Take a look at my [company site](https://combonet.se/) for the result.

That site only has two languages but it works equally well with as many languages as you need.