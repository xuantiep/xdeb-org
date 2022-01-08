/**
 * @file
 * A JavaScript file for the theme.
 */

(function ($) {

  'use strict';

  // Strip html tags from text.
  function strip(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  // Add button to pre > code to copy the code to the clipboard.
  if (window.matchMedia && document.queryCommandSupported && document.queryCommandSupported('copy')) {
    var mq2 = window.matchMedia('(min-device-width: 1111px)');
    if (mq2.matches) {

      setTimeout(function() {
        $('.content').find('pre').each(function (e, i) {
          var codeitem = 'js-code-item-' + i;
          var $button = $('<button data-codeitem="' + codeitem + '"/>').text('Copy code').addClass('button--small js-clipboard-button');
          $(e).addClass('js-code-item').addClass(codeitem).after($button);
        });

        $('.js-clipboard-button').handle('click', function () {
          var codeitem = '.' + $(this).data('codeitem');
          var codesnippet = $(codeitem).find('code').html();
          var $textarea = $('<textarea>').html(strip(codesnippet)).addClass('visually-hidden');
          $('body').append($textarea);
          $textarea.first().focus();
          $textarea.first().select();
          $(codeitem).addClass('flash-item');
          document.execCommand('copy');
          $textarea.remove();
          setTimeout(function() {
            $(codeitem).removeClass('flash-item');
          }, 700);
        });
      }, 10);
    }
  }

})(u);
