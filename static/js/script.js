/**
 * @file
 * A JavaScript file for the theme.
 */

(function ($) {

  'use strict';

  // Add a js class to the html-tag when JavsScript is active.
  $('html').addClass('js');

  // Activate the SlickNav menu for small screens.
  if (window.matchMedia && $.isFunction($.fn.slicknav)) {
    var mq = window.matchMedia('(max-width: 666px)');
    if (mq.matches) {
      $('.main-menu').hide().find('.navbar').filter(':first').slicknav();
    }
  }

  // Add button to pre > code to copy the code to the clipboard.
  if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
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
      $('body').append($textarea);
      $textarea.select();
      document.execCommand('copy');
      $textarea.remove();
    });
  }

})(jQuery);
