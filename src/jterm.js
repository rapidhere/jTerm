(function($) { 
define(function(require, exports, module) {

terminalManager = require("./core/terminal_man").getTerminalManager();
Terminal = require("./core/terminal").Terminal;

// Run a terminal on a block
$.fn.runTerm = function(termName, config) {
    if($(this).length > 1) {
        throw "Can only apply one block a time!"
    }

    var target = $(this)[0];

    var term = new Terminal(termName, config);
    terminalManager.add(termName, term);
    term.attachTo(target);
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
$.createSurface = function(termName, /*unused*/ surfaceType) {
    //return BaseSurface(Terminal.get(termName));
};

});
}) (jQuery);
