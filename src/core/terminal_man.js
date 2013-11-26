(function($) {
define(function(require, exports, module) {

terminal = require("./terminal");

Terminal = terminal.Terminal;

/* Class: Terminal Manager
 * Manage the low layer Terminals
 */
var TerminalManager = function() {
  this._termList = {};
  this._size = 0;
};

TerminalManager.prototype.get = function(termName) {
  return this._termList[termName];
};

TerminalManager.prototype.add = function(termName, term) {
  if(this._termList[termName] != undefined) {
    throw termName + " is already registerd!";
  }
  
  if(term instanceof Terminal) {
    this._termList[termName] = term;
    this._size ++;
  } else {
    throw "term must be a Terminal Object!";
  }
};

TerminalManager.prototype.remove = function(termName) {
  if(this._termList[termName] != undefined) {
    var term = this._termList[termName];
    term.destroy();
    delete this._termList[termName];
    this._size --;
  } else {
    throw "No such terminal " + termName;
  }
};

TerminalManager.prototype.size = function() {
  return _size;
};

exports.TerminalManager = TerminalManager;

/* Singleton */
TerminalManager.prototype._instance = null;
exports.getTerminalManager = function() {
  if(TerminalManager.prototype._instance == null) {
    TerminalManager.prototype._instance = new TerminalManager();
  }
  return TerminalManager.prototype._instance;
};

});
}) (jQuery);