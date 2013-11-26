(function($) {
define(function(require, exports, modules) {

keyMap = require("../core/keymap").getKeyMap();
Terminal = require("../core/terminal").Terminal;

/* Class : BaseSurface
 */
var BaseSurface;
exports.BaseSurface = BaseSurface = function(terminal) {
  this._term = null;
  this._jc = null;  // jcurses

  this.setTerminal(terminal)
};

BaseSurface.prototype.getKeyMap = function() {
  return keyMap;
};

BaseSurface.prototype.setTerminal = function(term) {
  if(! term instanceof Terminal) {
    throw "Require a terminal object!";
  }

  this._term = term;
  this._jc = term.getCurses();
};

BaseSurface.prototype.putChar = function(ch) {
  this._jc.put(ch);
};

BaseSurface.prototype.mvPutChar = function(x, y, ch) {
  this.moveTo(x, y);
  this.putChar(ch);
};

BaseSurface.prototype.putString = function(str) {
  if(typeof str != "string")
    return ;

  jc = this._jc;
  for(i = 0;i < str.length;i ++) {
    jc.put(str[i]);

    if(jc.getY() == jc.getWidth() - 1) {
      if(jc.getX() == jc.getHeight() - 1)
        break;
      this.move(1, -1000000);
    } else {
      this.move(0, 1);
    }
  }
};

BaseSurface.prototype.mvPutString(x, y, str) = function() {
  this.moveTo(x, y);
  this.putString(str);
};

BaseSurface.prototype.move = function(dx, dy) {
  this.moveTo(dx + this._jc.getX(), dy + this._jc.getY());
};

BaseSurface.prototype.moveTo = function(x, y) {
  if(x < 0)
    x = 0;
  if(x >= this._jc.getHeight())
    x = this._jc.getHeight() - 1;
  if(y < 0)
    y = 0;
  if(y >= this._jc.getWidth())
    y = this._jc.getWidth() - 1;

  this._jc.move(x, y);
};

BaseSurface.prototype.refresh = function() {
  this._jc.refresh();
};

BaseSurface.prototype.clear = function() {
  this._jc.clear();
};

BaseSurface.prototype.erase = function() {
  this._jc.earse();
};

BaseSurface.prototype.mvErase = function(x, y) {
  this.moveTo(x, y);
  this.erase();
};

BaseSurface.prototype.get = function() {
  return this._jc.get();
};

BaseSurface.prototype.mvGet = function(x, y) {
  this.moveTo(x, y);
  return this.get();
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
  this._term.attachTo(o);
};

BaseSurface.prototype.detach = function() {
  this._term.detach();
};

BaseSurface.prototype.getName = function() {
  return this._term.getTermName();
};

BaseSurface.prototype.getTerminal = function() [
  return this._term;
};

BaseSurface.prototype.getJCurses = function() {
  return this._tc;
};

});
}) (jQuery);
