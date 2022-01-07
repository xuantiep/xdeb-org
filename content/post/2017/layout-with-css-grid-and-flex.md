---
title: "Layout with CSS grid and flex, it's really nice"
slug: "layout-with-css-grid-and-flex-its-really-nice"
date: 2017-08-29T09:56:06+02:00
lastmod: 2017-08-29T09:56:06+02:00
author: "Fredrik Jonsson"
tags: ["css","web","development"]

---

This site is now using [CSS grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) and it's a real pleasure to work with. This is part of the Zen Hugo theme and you find the code at [frjo/hugo-theme-zen at grid](https://github.com/frjo/hugo-theme-zen/tree/grid).

[CSS grid is supported](http://caniuse.com/#search=grid) in resent versions of Chrome, Firefox and Safari. Support is also coming [in Microsoft Edge](https://developer.microsoft.com/en-us/microsoft-edge/platform/status/gridupdate/?q=grid%20update), until then use another browser.

I will not start using CSS grid for all layout on customers site until Microsoft Edge support is solid. Hopefully this will happen next year and we can remove all the extra wrappers, floats and clearfixes from the web.

Some good resources to get started:

* [Grid by Example](https://gridbyexample.com/) (by Rachel Andrew)
* [CSS Grid Layout - Rachel Andrew | February 2017 - YouTube](https://www.youtube.com/watch?v=N5Lt1SLqBmQ)
* [Flexbox Cheatsheet](https://yoksel.github.io/flex-cheatsheet/)
* [11 things I learned reading the flexbox spec – Hacker Noon](https://hackernoon.com/11-things-i-learned-reading-the-flexbox-spec-5f0c799c776b)

There are clear overlaps between grid and flex so when should one use them?

> When you want to control content in a row *or* a column use flex.  
> When you want to control content in rows *and* columns use grid.

I use flex to e.g make a two column box with a logo to the left and text to the right.

I use grid to layout the whole page, galleries and other things that spans rows and columns.

I still use float to float text around images in articles, but not much else.

## Some tips and tricks

On pages with only a small amount of content there can be empty space between the footer and the bottom of the window. Not nice, and with css grid it's quite easy to fix.

Setting one row to "1fr" and the others to "auto" will make the "1fr" row expand to take all the remaining space. As seen below I have in `grid-template-rows` set the "main" row, that contains the main content, to "1fr". The rows below it, including the footer, will then be pushed down. Then set min-height to 100vh and the footer will always show up at the bottom of the page/window.

One of the few real problems I encountered was that my code boxes (pre > code) was overflowing the max-width I have set for the pages. It turns out the the solution is to set `min-width: 0;` on the grid items. By default all grid and flex items get `min-width: auto;` unlike other display types that get `min-width: 0;`.

Learn how to use "grid-template-areas" and "grid-area". They are one of the coolest features of the css grid I think. Makes it really easy to reorder things in the layout.

## The code

It feels really liberating to use css grid and flex. Not only makes it the css cleaner and shorter it also makes it possible to simplify the html structure.

This is the basic html structure I'm using for this site. A single div wrapper for the page but otherwise very plain and simple.

~~~~ html
<!DOCTYPE html>
<html>
  <head>
    <title></title>
  </head>
  <body>
    <div class="page layout__page layout__sidebar-second">
      <header class="header layout__header" role="banner"></header>
      <nav class="main-menu layout__navigation" role="navigation"></nav>
      <main class="main layout__main" role="main"></main>
      <aside class="sidebar layout__second-sidebar" role="complementary"></aside>
      <footer class="footer layout__footer" role="contentinfo"></footer>
    </div>
  </body>
</html>
~~~~

This is the old html structure that was replaced. Not bad at all but two extra div wrapper just to be able to place things in the main layout. Articles, sidebars etc. also needed extra div wrappers so they multiply. With CSS grid and flex they are not needed anymore.

~~~~ html
<!DOCTYPE html>
<html>
  <head>
    <title></title>
  </head>
  <body class="one-sidebar sidebar-second">
    <div class="layout-center">
      <header class="header" role="banner"></header>
      <div class="layout-3col layout-swap">
        <main class="layout-3col__left-content" role="main"></main>
        <div class="layout-swap__top layout-3col__full">
          <nav class="main-menu" role="navigation"></nav>
        </div>
        <aside class="layout-3col__right-sidebar" role="complementary"></aside>
      </div>
      <footer class="footer" role="contentinfo"></footer>
    </div>
  </body>
</html>
~~~~

Here follows the CSS (SCSS) I now use for the layout of this page, with support for optional sidebars.

With css grid you can read the styles and quickly understand how the page work. It's so mush more clearer whats going on.

~~~~ css
.layout {
  &__page {
    max-width: $max-content-width;

    @include respond-to(s) {
      margin: 0 auto;
      min-height: 100vh;
    }
  }

  &__header,
  &__footer,
  &__main,
  &__navigation,
  &__first-sidebar,
  &__second-sidebar,
  &__page-top,
  &__page-bottom {
    padding: 0 $zen-gutters / 2;
    min-width: 0;  // With display grid defaults to auto, making <pre> overflow.

    @include respond-to(s) {
      padding: 0 $zen-gutters;
    }
  }
}

@supports (display: grid) {

  .layout {
    &__page {
      display: grid;
      grid-template-areas: 'head'
                           'nav'
                           'top'
                           'main'
                           'side1'
                           'side2'
                           'bottom'
                           'foot';
      grid-template-rows: auto
                          auto
                          auto
                          1fr
                          auto
                          auto
                          auto
                          auto;
      grid-template-columns: 1fr;
    }

    @include respond-to(xl) {
      &__page {
          grid-template-rows: auto
                              auto
                              auto
                              1fr
                              auto
                              auto;
      }

      &__sidebar-first {
          grid-template-areas: 'head head'
                               'nav nav'
                               'side1 top'
                               'side1 main'
                               'side1 bottom'
                               'foot foot';
          grid-template-columns: 1fr
                                 2fr;
      }

      &__sidebar-second {
          grid-template-areas: 'head head'
                               'nav nav'
                               'top side2'
                               'main side2'
                               'bottom side2'
                               'foot foot';
          grid-template-columns: 2fr
                                 1fr;
      }

      &__sidebar-two {
          grid-template-areas: 'head head head'
                               'nav nav nav'
                               'side1 top side2'
                               'side1 main side2'
                               'side1 bottom side2'
                               'foot foot foot';
          grid-template-columns: 1fr
                                 2fr
                                 1fr;
      }
    }

    &__header {
      grid-area: head;
    }

    &__navigation {
      grid-area: nav;
    }

    &__page-top {
      grid-area: top;
    }

    &__main {
      grid-area: main;
    }

    &__first-sidebar {
      grid-area: side1;
    }

    &__second-sidebar {
      grid-area: side2;
    }

    &__page-bottom {
      grid-area: bottom;
    }

    &__footer {
      grid-area: foot;
    }
  }

}
~~~~

This is the old layout css that was replaced. Again, this is not bad. But there is a lot more styles, and harder to read styles, than with CSS grid and flex.

~~~~ css
.layout-3col {
    margin-left: -10px;
    margin-right: -10px;
    padding-left: 0;
    padding-right: 0
}

.layout-3col:before {
    content: "";
    display: table
}

.layout-3col:after {
    content: "";
    display: table;
    clear: both
}

.layout-3col__col-1, .layout-3col__col-2, .layout-3col__col-3,
.layout-3col__col-4, .layout-3col__col-x, .layout-3col__first-left-sidebar,
.layout-3col__full, .layout-3col__left-content, .layout-3col__left-sidebar,
.layout-3col__right-content, .layout-3col__right-sidebar, .layout-3col__second-left-sidebar {
    clear: both;
    padding-left: 10px;
    padding-right: 10px;
    float: left;
    width: 100%;
    margin-left: 0;
    margin-right: -100%
}

@media (min-width:777px) {
    .layout-3col {
        margin-left: -20px;
        margin-right: -20px;
        padding-left: 0;
        padding-right: 0
    }

    .layout-3col:before {
        content: "";
        display: table
    }

    .layout-3col:after {
        content: "";
        display: table;
        clear: both
    }

    .layout-3col__full, .layout-3col__left-content, .layout-3col__left-sidebar,
    .layout-3col__right-content, .layout-3col__right-sidebar {
        float: left;
        width: 100%;
        margin-left: 0;
        margin-right: -100%;
        padding-left: 20px;
        padding-right: 20px
    }

    .layout-3col__col-1, .layout-3col__col-3, .layout-3col__col-x:nth-child(2n + 1),
    .layout-3col__first-left-sidebar {
        float: left;
        width: 50%;
        margin-left: 0;
        margin-right: -100%;
        padding-left: 20px;
        padding-right: 20px
    }

    .layout-3col__col-2, .layout-3col__col-4, .layout-3col__col-x:nth-child(2n),
    .layout-3col__second-left-sidebar {
        clear: none;
        float: left;
        width: 50%;
        margin-left: 50%;
        margin-right: -100%;
        padding-left: 20px;
        padding-right: 20px
    }
}

@media (min-width:999px) {
    .layout-3col__full {
        float: left;
        width: 100%;
        margin-left: 0;
        margin-right: -100%
    }

    .layout-3col__left-content {
        float: left;
        width: 66.66667%;
        margin-left: 0;
        margin-right: -100%
    }

    .layout-3col__right-content {
        float: left;
        width: 66.66667%;
        margin-left: 33.33333%;
        margin-right: -100%
    }

    .layout-3col__first-left-sidebar, .layout-3col__left-sidebar,
    .layout-3col__second-left-sidebar {
        clear: right;
        float: right;
        width: 33.33333%;
        margin-right: 66.66667%;
        margin-left: -100%
    }

    .layout-3col__right-sidebar {
        clear: right;
        float: right;
        width: 33.33333%;
        margin-right: 0;
        margin-left: -100%
    }

    .layout-3col__col-1, .layout-3col__col-x:nth-child(3n + 1) {
        clear: both;
        float: left;
        width: 33.33333%;
        margin-left: 0;
        margin-right: -100%
    }

    .layout-3col__col-2, .layout-3col__col-x:nth-child(3n + 2) {
        clear: none;
        float: left;
        width: 33.33333%;
        margin-left: 33.33333%;
        margin-right: -100%
    }

    .layout-3col__col-3, .layout-3col__col-x:nth-child(3n) {
        clear: none;
        float: left;
        width: 33.33333%;
        margin-left: 66.66667%;
        margin-right: -100%
    }

    .layout-3col__col-4 {
        display: none
    }
}

.layout-3col__grid-item-container {
    padding-left: 0;
    padding-right: 0
}

.layout-3col__grid-item-container:before {
    content: "";
    display: table
}

.layout-3col__grid-item-container:after {
    content: "";
    display: table;
    clear: both
}

.layout-center {
    padding-left: 10px;
    padding-right: 10px;
    margin: 0 auto;
    max-width: 1180px
}

.no-sidebars .layout-center {
    max-width: 780px
}

@media (min-width:777px) {
    .layout-center {
        padding-left: 20px;
        padding-right: 20px
    }
}

.layout-center--shared-grid, .layout-center.layout-3col {
    padding-left: 0;
    padding-right: 0
}

.layout-swap {
    position: relative
}

@media (min-width:666px) {
    .layout-swap {
        padding-top: 62px
    }
}

@media (min-width:666px) {
    .layout-swap__top {
        position: absolute;
        top: 0;
        height: 62px;
        width: 100%
    }
}

.clearfix::before, .header::before {
    content: '';
    display: table
}

.clearfix::after, .header::after {
    content: '';
    display: table;
    clear: both
}

~~~~
