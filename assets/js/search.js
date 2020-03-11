/**
 * @file
 * A JavaScript file for flexsearch.
 */

(function () {

  'use strict';

  const flexSearch = new FlexSearch({
    doc: {
      id: 'id',
      field: ['title','tags','content','date'],
      store: ['title','summary','date','permalink']
    }
  });

  function showResults(items) {
    const template = document.getElementById('post').content;
    const fragment = document.createDocumentFragment();

    const results = document.getElementById('results');
    results.textContent = '';

    for (const item of items) {
      const result = template.cloneNode(true);
      const a = result.querySelector('a');
      const time = result.querySelector('time');
      const content = result.querySelector('.content');
      a.innerHTML = item.title;
      a.href = item.permalink;
      time.innerText = item.date;
      content.innerHTML = item.summary;
      fragment.appendChild(result);
    }
    results.appendChild(fragment);
  }

  function doSearch () {
    const query = document.getElementById('query').value.trim();
    const results = flexSearch.search({
      query: query,
      limit: 20
    });
    showResults(results);
  }

  function enableUI () {
    const searchform = document.getElementById('searchform');
    searchform.addEventListener('submit', function (e) {
      e.preventDefault();
      doSearch();
    })
    searchform.addEventListener('keyup', function () {
      doSearch();
    })
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('input').classList.remove('hidden');
    document.getElementById('query').focus();
  }

  function buildIndex () {
    document.getElementById('loading').classList.remove('hidden');
    fetch('/searchindex.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        flexSearch.add(data);
      });
  }

  buildIndex();
  enableUI();
})();
