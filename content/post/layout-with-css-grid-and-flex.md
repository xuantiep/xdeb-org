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
      grid-template-columns: [first-start] 1fr [last-end];
    }

    @include respond-to(s) {
      &__page {
        grid-template-rows: [head-start] auto
                            [nav-start] auto
                            [page-top-start] auto
                            [main-start] 1fr
                            [page-bottom-start] auto
                            [footer-start] auto;
      }

      &__sidebar-first {
        grid-template-columns: [first-start] 1fr
                               [last-start] 2fr [last-end];
      }

      &__sidebar-second {
        grid-template-columns: [first-start] 2fr
                               [last-start] 1fr [last-end];
      }

      &__sidebar-two {
        grid-template-columns: [first-start] 1fr
                               [middle-start] 2fr
                               [last-start] 1fr [last-end];
      }

      &__full {
        grid-column: first-start / last-end;
      }

      &__first-sidebar {
        grid-column: first-start;
      }

      &__header {
        grid-row: head-start;
      }

      &__navigation {
        grid-row: nav-start;
      }

      &__page-top {
        grid-row: page-top-start;
      }

      &__content,
      &__first-sidebar,
      &__second-sidebar {
        grid-row: main-start;
      }

      &__page-bottom {
        grid-row: page-bottom-start;
      }

      &__footer {
        grid-row: footer-start;
      }
    }
  }

}
~~~~
