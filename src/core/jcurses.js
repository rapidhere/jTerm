(function($) {

'use strict';

var terminalMananger = require('./terminal_man').getTerminalManager();
var fontSize = require("../utils").fontSize;
var timeout = require("../utils") .timeout;
var timeloop = require("../utils").timeloop;
var keyMap = require("./keymap").getKeyMap();

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
    'color': terminal.getConfig('font-color'),
    'overflow': 'hidden',

    'tab-index': terminalMananger.size(),
  });

  // Add cursor
  var cursor = $('<span></span>');
  cursor.attr('id', this._genCursorId());

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
  
  cursor.css({
    "position": "relative",
    "font": "inherit",
  });

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
  
  // Control the refresh mode of buffer
  this._resetAllFlag = false;
  this._changePositionList = [];

  // Handle keyboard
  this._keyPressCallBackList = {};
  this._nKeyPressCallBack = 0;
  this._lastDownKey = null;
};

JCurses.prototype._changeQueueMaxSize = 100;

JCurses.prototype._genCursorId = function() {
    return this._terminal.getBody().attr('id') + '-cursor';
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

    var p = $('<pre>');
    for(var j = 0;j < this.getWidth();j ++) {
      this._buffer[i][j] = null;
      p.append(' ');
    }
    body.append(p);
  }

  // Set up <pre> elements in body
  body.find('pre').css({
    'margin': '0px',
    'padding': '0px',
    'font': 'inherit',
    'height': fs.height + 'px',
    'position': 'relative',
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
  this._resetAllFlag = true;
  this._changePositionList = [];
  this.refresh();

  // Listen to keyboard
  this._terminal.getBody().unbind("keydown");

  var obj = this;
  this._terminal.getBody().keydown(function(e) {
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

JCurses.prototype.put = function(ch) {
  if(! keyMap.filter(ch)) {
    ch = null;
  }

  this._appendChangePosition(this.getX(), this.getY());
  this._buffer[this.getX()][this.getY()] = ch;
};

JCurses.prototype.get = function() {
   return this._buffer[this.getX()][this.getY()];
};

JCurses.prototype.erase = function() {
  this._appendChangePosition(this.getX(), this.getY());
  this._buffer[this.getX()][this.getY()] = null;
};

JCurses.prototype.clear = function() {
  this._setResetAll();
  for(var i = 0;i < this.getHeight();i ++) {
    for(var j = 0;j < this.getWidth();j ++) {
      this._buffer[i][j] = null;
    }
  }
};

JCurses.prototype.refresh = function() {
  var targets = this._terminal.getBody().find('pre');
  var i, j, target, buf, ch;
  if(this._resetAllFlag) {
      for(i = 0;i < this.getHeight();i ++) {
        target = $(targets[i]);
        target.empty();
        for(j = 0;j < this.getWidth();j ++) {
          ch = this._buffer[i][j];
            if(ch === null) {
              ch = ' ';
            }
            target.append(ch);
        }
      }
  } else {
    for(i = 0;i < this._changePositionList.length;i ++) {
      var x = this._changePositionList[i][0],
          y = this._changePositionList[i][1];

      target = $(targets[x]);
      buf = target.text();
      ch = this._buffer[x][y];
      if(ch === null) {
          ch = ' ';
      }
      buf = buf.substr(0, y) + ch + buf.substr(y + 1);
      target.text(buf);
    }
  }

  this._resetAllFlag = false;
  this._changePositionList = [];

  // Put cursor
  var cursor = $('#' + this._genCursorId());
  cursor.css({
    'top': this.getX() * this._fontHeight,
    'left': this.getY() * this._fontWidth,
  });
};

JCurses.prototype.addCallback = function(callback) {
  this._keyPressCallBackList[this._nKeyPressCallBack] = callback;
  this._nKeyPressCallBack ++;
};

JCurses.prototype.removeCallback = function(id) {
  delete this._keyPressCallBackList[id];
};

JCurses.prototype._keyPress = function(e) {
  for(var id in this._keyPressCallBackList) {
    var func = this._keyPressCallBackList[id];
    func(keyMap.convert(e.keyCode, e.shiftKey), e.ctrlKey, e.shiftKey, e.altKey);
  }
};

JCurses.prototype._setResetAll = function() {
  this._resetAllFlag = true;
  this._changePositionList = [];
};

JCurses.prototype._appendChangePosition = function(x, y) {
  if(this._resetAllFlag) {
    return ;
  }

  if(typeof x !== 'number' || typeof y !== 'number') {
    return;
  }
  x = Math.floor(x);
  y = Math.floor(y);

  if(x < 0 || x >= this.getHeight() || y < 0 || y >= this.getWidth()) {
    return ;
  }

  if(this._changePositionList.length >= this._changeQueueMaxSize) {
    this._setResetAll();
    return ;
  }

  var i;
  for(i = 0;i < this._changePositionList.length;i ++) {
    var c = this._changePositionList[i];
    if(x === c[0] && y === c[1]) {
      return ;
    }
  }

  this._changePositionList[i] = [x, y];
};

}) (jQuery);
