---
title: "Layout with CSS grid and flex, it's really nice"
date: 2017-07-28T11:16:03+02:00
lastmod: 2017-07-28T11:16:03+02:00
author: "Fredrik Jonsson"
tags: ["css","web","development"]
draft: true

---

This site is now using [CSS grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) and it's a real pleasure to work with.

[Support for CSS grid](http://caniuse.com/#search=grid) are in resent versions of Chrome, Firefox and Safari. Support is coming [in Microsoft Edge](https://developer.microsoft.com/en-us/microsoft-edge/platform/status/gridupdate/?q=grid%20update) as well, until then use another browser.

I will not start using CSS grid for all layout on customers site until Microsoft Edge support is solid. Hopefully this will happen next year and we can remove all the extra wrappers, floats and clearfixes from the web.

Some good resources to get started:

* [Grid by Example](https://gridbyexample.com/) (by Rachel Andrew)
* [CSS Grid Layout - Rachel Andrew | February 2017 - YouTube](https://www.youtube.com/watch?v=N5Lt1SLqBmQ)
* [Flexbox Cheatsheet](https://yoksel.github.io/flex-cheatsheet/)
* [11 things I learned reading the flexbox spec – Hacker Noon](https://hackernoon.com/11-things-i-learned-reading-the-flexbox-spec-5f0c799c776b)


Here follows the CSS (SCSS) I use for the layout of this page, with support for optional sidebars.

~~~~ css
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

    &__content {
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
