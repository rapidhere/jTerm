'use strict';

(function($) {

var inherits = require('../utils').inherits;
var BaseSurface = require('./basesurf.js').BaseSurface;

// Inherit from BaseSurface
var CLISurface;
exports.CLISurface = CLISurface = function(term) {
  BaseSurface.call(this, term);

  this.greeting = '';
  this.parser =  null;
  this.prompt = '$ ';
};
inherits(CLISurface, BaseSurface);

})(jQuery);
