/**
 * @file
 * A JavaScript file for the theme.
 */

(function ($) {

  'use strict';

  // Add a js class to the html-tag when JavsScript is active.
  $('html').removeClass('nojs').addClass('js');

  // Strip html tags from text.
  function strip(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  // Add button to pre > code to copy the code to the clipboard.
  if (window.matchMedia && document.queryCommandSupported && document.queryCommandSupported('copy')) {
    var mq2 = window.matchMedia('(min-device-width: 1111px)');
    if (mq2.matches) {

      $('.content').find('pre').each(function (e, i) {
        var codeitem = 'js-code-item-' + i;
        var $button = $('<button data-codeitem="' + codeitem + '"/>').text('Copy code').addClass('js-clipboard-button');
        $(e).addClass('js-code-item').addClass(codeitem).after($button);
      });

      $('.js-clipboard-button').handle('click', function () {
        var codeitem = '.' + $(this).data('codeitem');
        var codesnippet = $(codeitem).find('code').html();
        var $textarea = $('<textarea>').html(strip(codesnippet)).addClass('visually-hidden');
        $('body').append($textarea);
        $textarea.first().focus();
        $textarea.first().select();
        document.execCommand('copy');
        $textarea.remove();
      });
    }
  }

})(u);
