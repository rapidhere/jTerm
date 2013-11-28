(function($) {

'use strict';

var Terminal = require('./terminal').Terminal;

/* Class: Terminal Manager
 * Manage the low layer Terminals
 */
var TerminalManager;
exports.TerminalManager = TerminalManager = function() {
  this._termList = {};
  this._size = 0;
};

TerminalManager.prototype.get = function(termName) {
  return this._termList[termName];
};

TerminalManager.prototype.add = function(termName, term) {
  if(this._termList[termName] !== undefined) {
    throw termName + ' is already registerd!';
  }
  
  if(term instanceof Terminal) {
    this._termList[termName] = term;
    this._size ++;
  } else {
    throw 'term must be a Terminal Object!';
  }
};

TerminalManager.prototype.remove = function(termName) {
  if(this._termList[termName] !== undefined) {
    var term = this._termList[termName];
    term.destroy();
    delete this._termList[termName];
    this._size --;
  } else {
    throw 'No such terminal ' + termName;
  }
};

TerminalManager.prototype.size = function() {
  return this._size;
};

/* Singleton */
var _instance = null;
exports.getTerminalManager = function() {
  if(_instance === null) {
    _instance = new TerminalManager();
  }
  return _instance;
};

}) (jQuery);
