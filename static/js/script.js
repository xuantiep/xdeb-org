/**
 * @file
 * A JavaScript file for the theme.
 */

(function ($) {

  'use strict';

  // Add a js class to the html-tag when JavsScript is active.
  $('html').addClass('js');

  // Activate the mobil menu for small screens.
  if (window.matchMedia) {
    var mq = window.matchMedia('(max-width: 666px)');
    if (mq.matches) {
      // Show mobile menu.
      $('.mobile-nav-wrapper').removeClass('hidden');

      // Populate the mobile nav sheet.
      $('.main-menu').addClass('hidden').clone().removeClass('main-menu layout__navigation layout__full hidden hidden').addClass('js-main-menu').appendTo('.mobile-nav-sheet').find('.navbar').removeClass('navbar').addClass('js-navbar');
      $('.header__region').addClass('hidden').clone().removeClass('header__region region hidden').addClass('js-region').appendTo('.mobile-nav-sheet');

      // Toggle the mobile nav sheet.
      $('.mobile-nav-cover, .mobile-nav-toggle').on('click toushstart', function (e) {
        e.preventDefault();
        $('body').scrollTop(0).toggleClass('js-nav-open');
      });

    }
  }

  // Display CSS grid layout warning to old browsers.
  if (!window.CSS || !window.CSS.supports || !window.CSS.supports('display', 'grid')) {
    $('.header').after('<div class="layout__grid-notice" role="complementary">Your browsers does not support modern grid layout so this page will not look or behave as it should. Resent versions of Chrome, Firefox and Safari all works so please update. Support is coming in Microsoft Edge as well, until then use another browser. <a href="https://www.whatbrowser.org/">What Browser?</a></div>');
  }

  // Add button to pre > code to copy the code to the clipboard.
  if (window.matchMedia && document.queryCommandSupported && document.queryCommandSupported('copy')) {
    var mq = window.matchMedia('(min-device-width: 1111px)');
    if (mq.matches) {
      $('.content').find('pre').each(function (i) {
        var codeitem = 'js-code-item-' + i;
        var $button = $('<button data-codeitem="' + codeitem + '"/>').text('Copy code').addClass('js-clipboard-button');
        $(this).addClass(codeitem).after($button);
      });

      $('.js-clipboard-button').on('click touchstart MSPointerDown', function (e) {
        e.preventDefault();
        var codeitem = '.' + $(this).data('codeitem');
        var codesnippet = $(codeitem).find('code').html();
        var $textarea = $('<textarea>').html(codesnippet).addClass('visually-hidden');
        $textarea.appendTo('body');
        $textarea.select();
        document.execCommand('copy');
        $textarea.remove();
      });
    }
  }

})(jQuery);
