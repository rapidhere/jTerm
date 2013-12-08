'use strict';

(function($) {

var inherits = require('../utils').inherits;
var BaseSurface = require('./basesurf.js').BaseSurface;

// Inherit from BaseSurface
var CLISurface;
exports.CLISurface = CLISurface = function(term) {
  BaseSurface.call(this, term);

  this.greeting = '';
  this.parser = null;
  this.prompt = '$ ';
  this.historyLimit = 100;
  this.historyPool = [];

  this.colorSchema = {
    'Error': ['#df1010', null],
    'Warning': ['#dfdf10', null],
    'Info': ['#1010df', null],
  };

  this.shortCutSchema = {
  };

  this._inited = false;
  this._listener = null;
  this._buffx = 0;
  this._buffy = 0;
  this._buff = '';
  this._insPos = 0;
  this._hisPos = 0;
};
inherits(CLISurface, BaseSurface);

CLISurface.prototype.lineEditorInit = function() {
  this._buff = '';
  this._insPos = 0;
  this._buffx = this.getX();
  this._buffy = this.getY();
  this.addHistory(this._buff);
  this._hisPos = this.historyPool.length - 1;
};

CLISurface.prototype.lineEditor = function(key, ctrl, shift, alt) {
  var km = this.getKeyMap();
  var doneFlag = false;
  var setHistoryFlag = true;

  if(typeof key === 'number' && key < 0) {
    switch(key) {
      case km.KEY_BACKSPACE:
        if(this._insPos > 0) {
          this._buff = this._buff.substr(0, this._insPos - 1) + this._buff.substr(this._insPos);
          this._insPos --;
        }
        break;
      case km.KEY_DELETE:
        if(this._insPos !== this._buff.length) {
          this._buff = this._buff.substr(0, this._insPos) + this._buff.substr(this._insPos + 1);
        }
        break;
      case km.KEY_ENTER:
        this._insPos = this._buff.length;
        doneFlag = true;
        break;
      case km.KEY_END:
        this._insPos = this._buff.length;
        break;
      case km.KEY_HOME:
        this._insPos = 0;
        break;
      case km.KEY_LEFT:
        if(this._insPos > 0) {
          this._insPos --;
        }
        break;
      case km.KEY_RIGHT:
        if(this._insPos !== this._buff.length) {
          this._insPos ++;
        }
        break;
      case km.KEY_UP:
        if(this._hisPos > 0) {
          this._hisPos --;
        }
        this._buff = this.historyPool[this._hisPos];
        this._insPos = this._buff.length;
        setHistoryFlag = false;
        break;
      case km.KEY_DOWN:
        if(this._hisPos < this.historyPool.length - 1) {
          this._hisPos ++;
        }
        this._buff = this.historyPool[this._hisPos];
        this._insPos = this._buff.length;
        setHistoryFlag = false;
        break;
    }
  } else {
    this._buff = this._buff.substr(0, this._insPos) + key + this._buff.substr(this._insPos);
    this._insPos ++;
  }
  
  this.moveTo(this._buffx, this._buffy);
  this.putString(this._buff);
  this.moveTo(this._buffx + (this._buffy + this._insPos) / this.getWidth(), (this._buffy + this._insPos) % this.getWidth());

  if(setHistoryFlag) {
    this.historyPool[this.historyPool.length - 1] = this._buff;
  }

  if(doneFlag) {
    this.putString("\n");
    return true;
  } else {
    return false;
  }
};

CLISurface.prototype.setHistoryLimit = function(n) {
  this.historyLimit = n;
};

/* Unsupported yet */
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

CLISurface.prototype.putString = function(str, fg, bg) {
  this.eraseLine(this.getX(), this.getY());
  for(var i = 0;i < str.length;i ++) {
    var x = this.getX(), y = this.getY();
    var ch = str[i];

    if(ch === "\n") {
      x ++;
      if(x !== this.getHeight()) {
        this.eraseLine(x);
      }
      y = 0;
    } else {
      this.putChar(ch, fg, bg);
      y ++;
      if(y === this.getWidth()) {
        x ++;
        if(x !== this.getHeight()) {
          this.eraseLine(x);
        }
        y = 0;
      }
    }

    if(x === this.getHeight()) {
      this._moveUpScreen(1);
      x = this.getHeight() - 1;
    }

    this.moveTo(x, y);
  }
};

CLISurface.prototype.putNormal = function(str) {
  this.putString(str, null, null);
};

CLISurface.prototype.putWarning = function(str) {
  this.putString(str, this.colorSchema.Warning[0], this.colorSchema.Warning[1]);
};

CLISurface.prototype.putError = function(str) {
  this.putString(str, this.colorSchema['Error'][0], this.colorSchema['Error'][1]);
};

CLISurface.prototype.putInfo = function(str) {
  this.putString(str, this.colorSchema.Info[0], this.colorSchema.Info[1]);
};

CLISurface.prototype.getPrompt = function() {
  if(typeof this.prompt === 'string') {
    return this.prompt;
  } else if(typeof this.prompt === 'function') {
    return this.prompt();
  }
  return '$ ';
};


CLISurface.prototype.addHistory = function(buff) {
  this.historyPool.push(buff);
  if(this.historyPool.length > this.historyLimit) {
    this.historyPool = this.historyPool.slice(1);
  }
};

CLISurface.prototype.initCLI = function() {
  if(this._inited) {
    return ;
  }

  this._inited = true;

  this.putString(this.greeting);
  this.historyPool = [];

  this.putString(this.getPrompt());
  this.lineEditorInit();
  this.refresh();
  
  
  var cli = this;
  this._listener = this.addCallback(function(key, ctrl, shift, alt) {
    try {
      var flag = cli.lineEditor(key, ctrl, shift, alt);
      if(flag && cli.parser) {
        cli.parser(cli, cli._buff);
        
        cli.putString(cli.getPrompt());
        cli.lineEditorInit();
      }
    } catch(err) {
      cli.putError('jTerm inner Error: ' + err + "\n");
    }
    cli.refresh();
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

}) (jQuery);
