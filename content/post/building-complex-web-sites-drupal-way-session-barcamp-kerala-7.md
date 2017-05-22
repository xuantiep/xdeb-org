---
title: "Building complex web sites the Drupal way - Session at BarCamp Kerala 7"
date: 2009-12-21T03:14:08+01:00
lastmod: 2010-09-21T09:31:10+02:00
author: "Fredrik Jonsson"
tags: ["barcamp","drupal","india","planetdrupal","development"]
aliases: ["node/1303"]

---

{{< figure src="/images/barcamp_kerala_2.png" width="400" class="right" alt="BarCamp Kerala" >}}
{{< figure src="/images/testing_blog_with_images.png" width="400" class="right" alt="Example blog post with image gallery." >}}

At [BarCamp Kerala](http://www.barcampkerala.org/) 7 in Kottayam I gave a [Drupal](http://drupal.org/) session about how to build complex web sites the Drupal way.

Below you find the slides as a PDF file and the blog system "feature" I demonstrated.

It was real pleasure to be a part of this BarCamp Kerala! There are some seriously smart people here, many interesting start ups and most of all, really nice and friendly fellow geeks.

Earlier BarCamps included some Drupal sessions so many knew about it already and a handful of the participants use Drupal for there own web sites.

After a short background on Drupal I described the Drupal way, less coding and more configuration. I mentioned some example web sites and talked about the advantages of building web sites this way.

* Quick development of complex web sites
* Easy to upgrade to new Drupal versions
* Easy to expand the web site
* Reusable solutions
* Secure solutions

As a live example I built a blog system where attached images was displayed as a mini gallery inside the blog post. The first image as a 200x200 pixel thumbnail and the rest as tiny 48x48 pixel thumbnail below the first image. Clicking on a image brought up a Thickbox showing a big version of it.

Modules used are [CCK](http://drupal.org/project/cck), [Views](http://drupal.org/project/views), [Views attach](http://drupal.org/project/views_attach), [Filefield](http://drupal.org/project/filefield), [Image field](http://drupal.org/project/imagefield), [Image cache](http://drupal.org/project/imagecache) and [Thickbox](http://drupal.org/project/thickbox). With the help of the [Features](http://drupal.org/project/features) module I wrapped it all up in the "blog_system.zip" file below.

Install all the modules above and unzip blog_system.zip in "sites/all/modules/custom/features". Go to "admin/build/features" and activate it and you should be all set to try it out.

Go to "node/add/blog", write a blog post, upload a few images and hit submit. The images should then display as a mini gallery inside the blog post.

The only thing missing are some CSS styles to make it look nice. I was using a plain [Zen](http://drupal.org/project/zen) subtheme for the demonstration and the [CSS Injector](http://drupal.org/project/css_injector) module to quickly add the following CSS.

~~~~
.views-field-field-images-fid {
  float: right;
  clear: right;
  margin: 0 0 10px 10px;
}
.views-field-field-images-fid-1 {
  float: right;
  clear: right;
  margin: -6px 0 10px 10px;
  width: 204px;
}
.views-field-field-images-fid-1 img {
  float: right;
  margin: 0 0 4px 3px;
}
~~~~

~~~~
.views-field-field-images-fid {
  float: right;
  clear: right;
  margin: 0 0 10px 10px;
}
.node {
  clear: right;
}
~~~~

~~~~
#primary a {
  display: block;
  font-size: 1.2em;
  font-weight: bold;
  background: #eee;
  padding: 5px 10px;
  border: 1px solid #ccc;
  text-decoration: none;
}
#primary a.active,
#primary a:hover {
  display: block;
  background: #333;
  color: #fff;
}
.node h2.title {
  margin-top: 1em;
}
~~~~

[/files/Building_complex_web_sites_the_Drupal_way.pdf](Building_complex_web_sites_the_Drupal_way.pdf) (5.27 MB)
[/files/blog_system.zip](blog_system.zip) (6.37 KB)