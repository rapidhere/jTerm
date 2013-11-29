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
  this._nextId = 1;
};

TerminalManager.prototype.get = function(termName) {
  var term = this._termList[termName];
  if(term !== undefined) {
    return term.term;
  }
  return undefined;
};

TerminalManager.prototype.add = function(termName, term) {
  if(this._termList[termName] !== undefined) {
    throw termName + ' is already registerd!';
  }
  
  if(term instanceof Terminal) {
    this._termList[termName] = {};
    this._termList[termName].term = term;
    this._termList[termName].id = this._nextId;
    this._size ++;
    this._nextId ++;
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

TerminalManager.prototype.index = function(termName) {
    console.log(termName);
    var term = this._termList[termName];
    if(term !== undefined) {
        return term.id;
    }
    return undefined;
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
