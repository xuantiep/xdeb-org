/**
 * @file
 * A node.js script to build a lunr search index.
 */

'use strict';

var lunr = require('lunr');
var fs = require('fs');
var lunrIndex;
var searchData;

searchData = JSON.parse(fs.readFileSync('../../public/searchindex.json', 'utf8'));

lunrIndex = lunr(function () {
  this.ref('reference');
  this.field('title');
  this.field('tags');
  this.field('section');
  this.field('content');
  this.field('year');

  searchData.forEach(function (item) {
    this.add(item);
  }, this);
});

fs.writeFileSync('../../static/lunrsearchindex.json', JSON.stringify(lunrIndex), 'utf8')
