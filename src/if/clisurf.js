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
  this.historyLimit = 100;

  this.colorSchema = {
  };

  this.shortCutSchema = {
  };

  this._inited = false;
  this._listener = null;
  this._cprompt = '$ ';
  this._buff = '';
};
inherits(CLISurface, BaseSurface);

CLISurface.prototype.lineEditor = function(key, ctrl, shift, alt) {
};

CLISurface.prototype.setHistoryLimit = function(n) {
  this.historyLimit = n;
};

CLISurface.prototype.setShortCut = function(schema, fn) {
  var t;
  if(typeof schema === 'string') {
    t = schema;
    schema = {};
    schema[t] = fn;
  }

  for(t in schema) {
    this.shortCutSchema[t] = schema[t];
  }
};

CLISurface.prototype.setGreeting = function(gr) {
  this.greeting = gr;
};

CLISurface.prototype.setPrompt = function(fn) {
  this.prompt = fn;
};

CLISurface.prototype.setParser = function(fn) {
  this.parser = fn;
};

CLISurface.prototype.setColorSchema = function(schema, fg, bg) {
  var t;
  if(typeof schema === 'string') {
    t = schema;
    schema = {};
    schema[t] = [fg, bg];
  }

  for(t in schema) {
    this.colorSchema[t] = schema[t];
  }
};

CLISurface.prototype._moveUpScreen = function(line) {
  if(line > this.getHeight()) {
    this.clear();
    return ;
  }

  var _buffer = this.getJCurses()._buffer;
  var i, j;
  for(i = 0; i + line < this.getHeight();i ++) {
    for(j = 0;j < this.getWidth();j ++) {
      _buffer[i][j] = _buffer[i + line][j];
    }
  }

  for(;i < this.getHeight();i ++) {
    for(j = 0;j < this.getWidth();j ++) {
      _buffer[i][j] = this.getJCurses()._createNewBufUnit();
    }
  }
};

CLISurface.prototype.putString = function(str) {

};

CLISurface.prototype.getPrompt = function() {
  if(typeof this.prompt === 'string') {
    return this.prompt;
  } else if(typeof this.prompt === 'function') {
    return this.prompt();
  }
  return '$ ';
};

CLISurface.prototype.initCLI = function() {
  if(this._inited) {
    return ;
  }

  this._inited = true;

  this._buff = '';
  this._cprompt = this.getPrompt();
  var ret;

  this._listener = this.addCallBack(function(key, ctrl, shift, alt) {
    var flag = this.lineEditor(key, ctrl, shift, alt);
    if(flag === false) {
      continue;
    } else if(this._parser) {
      if(this.getx() === this.getHeight() - 1) {
        this._moveUpScreen(1);
      }
      this.putString(this._parser(_buff));
    }

    refresh();
  });
};

CLISurface.prototype.stop = function() {
  if(this._listener !== null) {
    this.removeCallBack(this._listener);
  }
  this._listener = null;
  this._inited = false;
};

CLISurface.prototype.attach = function(o) {
  this.stop();
  return this.super_.attach(o);
};

CLISurface.prototype.detach = function() {
  this.stop();
  return this.super_.detach();
};

})(jQuery);
