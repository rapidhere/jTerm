(function($) {

'use strict';

var keyMap = require("../core/keymap").getKeyMap();
var Terminal = require("../core/terminal").Terminal;

/* Class : BaseSurface
 */
var BaseSurface;
exports.BaseSurface = BaseSurface = function(terminal) {
  this._term = null;
  this._jc = null;  // jcurses
  this._lastX = 0;
  this._lastY = 0;

  this.setTerminal(terminal);
};

BaseSurface.prototype.getKeyMap = function() {
  return keyMap;
};

BaseSurface.prototype.setTerminal = function(term) {
  if(! term instanceof Terminal) {
    throw new Error('Require a terminal object!');
  }

  this._term = term;
  this._jc = term.getJCurses();
};

BaseSurface.prototype.putChar = function(ch, fg, bg) {
  this._jc.put(ch, fg, bg);
};

BaseSurface.prototype.mvPutChar = function(x, y, ch, fg, bg) {
  this.moveTo(x, y);
  this.putChar(ch, fg, bg);
};

BaseSurface.prototype.putString = function(str, fg, bg) {
  if(typeof str !== "string") {
    return ;
  }

  var jc = this._jc;
  for(var i = 0;i < str.length;i ++) {
    jc.put(str[i], fg, bg);

    if(jc.getY() === jc.getWidth() - 1) {
      if(jc.getX() === jc.getHeight() - 1) {
        break;
      }
      this.move(1, -1000000);
    } else {
      this.move(0, 1);
    }
  }
};

BaseSurface.prototype.mvPutString = function(x, y, str, fg, bg) {
  this.moveTo(x, y);
  this.putString(str, fg, bg);
};

BaseSurface.prototype.move = function(dx, dy) {
  this.moveTo(dx + this._jc.getX(), dy + this._jc.getY());
};

BaseSurface.prototype.moveTo = function(x, y) {
  if(x < 0) {
    x = 0;
  }

  if(x >= this._jc.getHeight()) {
    x = this._jc.getHeight() - 1;
  }

  if(y < 0) {
    y = 0;
  }

  if(y >= this._jc.getWidth()) {
    y = this._jc.getWidth() - 1;
  }

  this._jc.move(x, y);
};

BaseSurface.prototype.refresh = function() {
  this._jc.refresh();
};

BaseSurface.prototype.clear = function() {
  this._jc.clear();
};

BaseSurface.prototype.erase = function() {
  this._jc.erase();
};

BaseSurface.prototype.mvErase = function(x, y) {
  this.moveTo(x, y);
  this.erase();
};

BaseSurface.prototype.eraseLine = function(line, start) {
  this.storeCursor();
  start = start || 0;
  for(var i = start;i < this.getWidth();i ++) {
    this.mvErase(line, i);
  }
  this.backCursor();
};

BaseSurface.prototype.storeCursor = function() {
  this._lastX = this.getX();
  this._lastY = this.getY();
};

BaseSurface.prototype.backCursor = function() {
  this.moveTo(this._lastX, this._lastY);
};

BaseSurface.prototype.get = function() {
  return this._jc.get().getRawCT();
};

BaseSurface.prototype.getBG = function() {
  return this._jc.get().getBG();
};

BaseSurface.prototype.getFG = function() {
  return this._jc.get().getFG();
};

BaseSurface.prototype.mvGet = function(x, y) {
  this.moveTo(x, y);
  return this.get();
};

BaseSurface.prototype.mvGetBG = function(x, y) {
  this.moveTo(x, y);
  return this.getBG();
};

BaseSurface.prototype.mvGetFG = function(x, y) {
  this.moveTo(x, y);
  return this.getFG();
};
BaseSurface.prototype.getX = function() {
  return this._jc.getX();
};

BaseSurface.prototype.getY = function() {
  return this._jc.getY();
};

BaseSurface.prototype.getHeight = function() {
  return this._jc.getHeight();
};

BaseSurface.prototype.getWidth = function() {
  return this._jc.getWidth();
};

BaseSurface.prototype.addCallback = function(callback) {
  this._jc.addCallback(callback);
};

BaseSurface.prototype.removeCallBack = function(id) {
  this._jc.removeCallback(id);
};

BaseSurface.prototype.attach = function(o) {
  this._term.attach(o);
};

BaseSurface.prototype.detach = function() {
  this._term.detach();
};

BaseSurface.prototype.getName = function() {
  return this._term.getName();
};

BaseSurface.prototype.getTerminal = function() {
  return this._term;
};

BaseSurface.prototype.getJCurses = function() {
  return this._jc;
};

}) (jQuery);
