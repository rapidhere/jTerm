(function($) { 

'use strict';

var terminalManager = require('./core/terminal_man').getTerminalManager();
var Terminal = require('./core/terminal').Terminal;
var BaseSurface = require('./if/basesurf').BaseSurface;
var CLISurface = require('./if/clisurf').CLISurface;

// Run a terminal on a block
$.fn.runTerm = function(termName, config) {
    if($(this).length > 1) {
        throw new Error('Can only apply one block a time!');
    }

    var target = $(this)[0];

    var term = new Terminal(termName, config);
    terminalManager.add(termName, term);
    term.attach(target);
};

// Get a Terminal
$.getTerm = function(termName) {
    return terminalManager.get(termName);
};

// Remove a Terminal
$.removeTerm = function(termName) {
    return terminalManager.remove(termName);
};

// create a TerminalSurface
$.createSurface = function(termName, surfaceType) {
  surfaceType = surfaceType || 'cli';

  if(surfaceType === 'base') {
    return new BaseSurface(terminalManager.get(termName));
  } else if(surfaceType === 'cli') {
    return new CLISurface(terminalManager.get(termName));
  } else {
    throw new Error('Illegal surfaceType ' + surfaceType);
  }
};

}) (jQuery);
