/**
 * @file
 * A JavaScript file for the theme.
 */

(function () {

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
        const codeitems = document.querySelectorAll('.content pre');
        codeitems.forEach(function (codeitem) {
          const button = document.createElement('button');
          button.classList.add('button--small', 'js-clipboard-button');
          button.innerHTML = 'Copy code';
          codeitem.after(button);
        });

        const buttons = document.querySelectorAll('.js-clipboard-button');
        buttons.forEach(function (button) {
          button.addEventListener('click', function (e) {
            e.preventDefault();
            const codeitem = e.target.previousElementSibling;
            const codesnippet = strip(codeitem.querySelector('code').innerHTML);
            const textarea = document.createElement('textarea');
            codeitem.classList.add('flash-item');
            document.querySelector('body').appendChild(textarea);
            textarea.value = codesnippet;
            textarea.focus();
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
            setTimeout(function() {
              codeitem.classList.remove('flash-item');
            }, 700);
          });
        });
      }, 10);
    }
  }

})();
