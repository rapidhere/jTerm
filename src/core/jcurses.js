(function($) {

'use strict';

var terminalMananger = require('./terminal_man').getTerminalManager();
var fontSize = require('../utils').fontSize;
var timeout = require('../utils') .timeout;
var timeloop = require('../utils').timeloop;
var keyMap = require('./keymap').getKeyMap();
var escapeString = require('../utils').escapeString;

/* Class: BufUnit
 */
var BufUnit;
exports.BufUnit = BufUnit = function(fg, bg, ct) {
  this.set(fg, bg, ct);
};

BufUnit.prototype.set = function(fg, bg, ct) {
  this.setFG(fg);
  this.setBG(bg);
  this.setCT(ct);
};

BufUnit.prototype.setFG = function(fg) {
  this.fg = fg || null;
};

BufUnit.prototype.setBG = function(bg) {
  this.bg = bg || null;
};

BufUnit.prototype.setCT = function(ct) {
  this.ct = ct || null;
};

BufUnit.prototype.getFG = function() {
  return this.fg;
};

BufUnit.prototype.getBG = function() {
  return this.bg;
};

BufUnit.prototype.getCT = function() {
  if(this.ct === null) {
    return ' ';
  }
  return this.ct;
};

BufUnit.prototype.getRawCT = function() {
  return this.ct;
};

/* Class: JCurses
 * A curses/ncuses like lib used to draw on the Terminal
 */
var JCurses;
exports.JCurses = JCurses = function(terminal) {
  this._terminal = terminal;

  // Set up body
  terminal.getBody().css({
    'width': terminal.getConfig('width'),
    'height': terminal.getConfig('height'),
    'font-family': terminal.getConfig('font-family'),
    'font-size': terminal.getConfig('font-size'),
    'background-color': terminal.getConfig('bgcolor'),
  });
 
  terminal.getBody().attr('tabindex', terminalMananger.size() + 1);

  // Add cursor
  var cursor = $('<span class="jterm-cursor"></span>');
  cursor.attr('id', this._getCursorId());

  var cstyle = terminal.getConfig('cursor-style');
  var crgba = terminal.getConfig('cursor-color');
  crgba = 'rgba(' + crgba[0] + ',' + crgba[1] + ',' + crgba[2] + ',' + crgba[3] + ')';

  if(cstyle === 'block') {
    cursor.html('&nbsp;');
    cursor.css('background-color', crgba);
  } else if(cstyle === 'underline') {
    cursor.html('_');
    cursor.css('color', crgba);
  } else if(cstyle === 'none') {
    cursor.html('&nbsp;');
    cursor.css('color', crgba);
  }

  terminal.getBody().prepend(cursor);

  // Variables
  this._cursorX = 0;
  this._cursorY = 0;
  this._buffer = [];
  this._screenWidth = 0;
  this._screenHeight = 0;
  this._fontWidth = 0;
  this._fontHeight = 0;
  this._drawCursorHandle = null;
  
  // Handle keyboard
  this._keyPressCallBackList = {};
  this._nKeyPressCallBack = 0;
  this._lastDownKey = null;
};

JCurses.prototype._createNewBufUnit = function() {
  return new BufUnit(
    this._terminal.getConfig('font-color'), 
    this._terminal.getConfig('bgcolor'),
    null
  );

};

JCurses.prototype.init = function() {
  var body = this._terminal.getBody();

  // Set up Size
  var fs = fontSize(body.css('font'));
  this._screenHeight = Math.floor(body.height() / fs.height);
  this._screenWidth = Math.floor(body.width() / fs.width);

  this._fontWidth = fs.width;
  this._fontHeight = fs.height;

  // Init buffer
  this._buffer = [];
  for(var i = 0;i < this.getHeight();i ++) {
    this._buffer[i] = [];

    for(var j = 0;j < this.getWidth();j ++) {
      this._buffer[i][j] = this._createNewBufUnit();
    }
    body.append($('<div class="jterm-line">'));
  }

  // Set up <pre> elements in body
  body.find('div.jterm-line').css({
    'height': fs.height + 'px',
    'top': -fs.height + 'px',
  });

  // Start draw cursor
  this._cursorX = this._cursorY = 0;
  if(this._drawCursorHandle !== null) { // Clear last loop
    clearInterval(this._drawCursorHandle);
  }

  this._drawCursorHandle =
    timeloop({cursor: $('#' + this._getCursorId())}, 1000, function() {
    this.cursor.css('visibility', 'hidden');
    timeout(this, 500, function() {
      this.cursor.css('visibility', 'visible');
    });
  });

  // Refresh the screen
  this.refresh();

  // Listen to keyboard
  this._terminal.getBody().unbind("keydown");

  var obj = this;
  // for special keys, we use key down
  this._terminal.getBody().keydown(function(e) {
    obj._keyDown(e);
  });
  // for letters and numberswe use key press
  this._terminal.getBody().keypress(function(e) {
    obj._keyPress(e);
  });
};

JCurses.prototype._getCursorId = function() {
  return this._terminal.getBody().attr('id') + '-cursor';
};

JCurses.prototype.destroy = function() {
  // Clear Loop
  clearInterval(this._drawCursorHandle);
  this._drawCursorHandle = null;

  // Clear the handler on keyboard
  this._terminal.getBody().unbind('keydown');
};

JCurses.prototype.move = function(x, y) {
  if(typeof x !== 'number' || typeof y !== 'number') {
    throw 'Require numbers!';
  }

  x = Math.floor(x);
  y = Math.floor(y);

  if(x >= 0 && x < this.getHeight()) {
    this. _cursorX = x;
  }

  if(y >= 0 && y < this.getWidth()) {
    this._cursorY = y;
  }
};

JCurses.prototype.getX = function() {
  return this._cursorX;
};

JCurses.prototype.getY = function() {
  return this._cursorY;
};

JCurses.prototype.getWidth = function() {
  return this._screenWidth;
};

JCurses.prototype.getHeight = function() {
  return this._screenHeight;
};

JCurses.prototype.put = function(ch, fg, bg) {
  if(! keyMap.filter(ch)) {
    ch = null;
  }

  this._buffer[this.getX()][this.getY()].set(
    fg || this._terminal.getConfig('font-color'),
    bg || this._terminal.getConfig('bgcolor'),
    ch
  );
};

JCurses.prototype.get = function() {
  return this._buffer[this.getX()][this.getY()];
};

JCurses.prototype.erase = function() {
  this._buffer[this.getX()][this.getY()].set();
};

JCurses.prototype.clear = function() {
  for(var i = 0;i < this.getHeight();i ++) {
    for(var j = 0;j < this.getWidth();j ++) {
      this._buffer[i][j].set();
    }
  }
};

JCurses.prototype.refresh = function() {
  // Put cursor
  var cursor = $('#' + this._getCursorId());
  cursor.css({
    'top': this.getX() * this._fontHeight,
    'left': this.getY() * this._fontWidth,
  });

  // refresh buffer
  var lines = this._terminal.getBody().find('div.jterm-line');
  for(var i = 0;i < lines.length;i ++) {
    var cdiv = $(lines[i]);
    cdiv.empty();
    for(var p = 0, q = 1;q < this.getWidth();q ++) {
      if(this._buffer[i][q].getFG() !== this._buffer[i][p].getFG() ||
         this._buffer[i][q].getBG() !== this._buffer[i][p].getBG()) {
        cdiv.append(this._buildSection(i, p, q));
      p = q;
      }
    }
    cdiv.append(this._buildSection(i, p, q));
  }
};

JCurses.prototype._buildSection = function(i, p, q) {
  var ret = $('<span class="jterm-span"></span>');
  var fg = this._buffer[i][p].getFG();
  var bg = this._buffer[i][p].getBG();
  ret.css('color', fg);
  ret.css('background-color', bg);

  var buf = '';
  for(var j = p;j < q;j ++) {
    var ch = this._buffer[i][j].getCT();
    if(ch === ' ') {
      ch = '&nbsp;';
    }
    buf += ch;
  }
  ret.html(buf);

  return ret;
};

JCurses.prototype.addCallback = function(callback) {
  this._keyPressCallBackList[this._nKeyPressCallBack] = callback;
  this._nKeyPressCallBack ++;
};

JCurses.prototype.removeCallback = function(id) {
  delete this._keyPressCallBackList[id];
};

JCurses.prototype._keyDown = function(e) {
  // don't handle letters and numbers
  if(e.keyCode >= 65 && e.keyCode <= 90) {
    return ;
  }
  if(e.keyCode >= 48 && e.keyCode <= 57 && !e.shiftKey) {
    return ;
  }

  for(var id in this._keyPressCallBackList) {
    var func = this._keyPressCallBackList[id];
    func(keyMap.convert(e.keyCode, e.shiftKey), e.ctrlKey, e.shiftKey, e.altKey);
  }
};

JCurses.prototype._keyPress = function(e) {
  // Only handle letters and numbers;
  var ch = String.fromCharCode(e.which);
  if(/[\w\d]/.test(ch) && ch !== '_') {
    for(var id in this._keyPressCallBackList) {
      var func = this._keyPressCallBackList[id];
      func(ch, e.ctrlKey, e.shiftKey, e.altKey);
    }
  }
};

}) (jQuery);
