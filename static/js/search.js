/**
 * @file
 * A JavaScript file for lunr search.
 */



(function ($) {

  'use strict';

  var $resultsWrapper = $('.search-results-wrapper');
  var $results = $('.search-results');
  var searchData;
  var lunrIndex;
  var searchStore = [];

  // Initialise the search when search field get focus, this avoids loading index on every page.
  $('.search-text').one('focus', function () {
    // Delay a tiny bit to make the input field feel more responsive.
    setTimeout(initIndex, 50);
  });

  // Do the search on keyup in the search field.
  $('.search-text').on('keyup', function () {
    $results.empty();

    // Only trigger a search when 2 chars at least have been provided.
    var query = $(this).val();
    if (query.length < 2) {
      $resultsWrapper.addClass('hidden');
      return;
    }

    var results = lunrIndex.search(query + '*');

    renderResults(results);
    $resultsWrapper.removeClass('hidden');
  });

  // Clear when clicking the x in HTML5 search fields.
  $('.search-text').one('search', function () {
    $resultsWrapper.addClass('hidden');
  });

  // Initialise the search index.
  function initIndex() {
    searchData = $.getJSON('/lunrsearchindex.json');
    searchData.done(function () {
      lunrIndex = lunr.Index.load(searchData.responseJSON)
    });
  }

  // Render the search result.
  function renderResults(results) {
    if (results.length > 0) {
      // Only show the x first results.
      results.slice(0, 50).forEach(function (result) {
        var reference = result.ref.split('@@');
        var $result = $('<li>');
        $result.append($('<a>', {
          href: reference[0],
          text: reference[1]
        }));
        $results.append($result);
      });
    }
    else {
      var $result = $('<li>No results found for this search.</li>');
      $results.append($result);
    }
  }

})(jQuery);
