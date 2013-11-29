(function($) {
// Keymap from jQuery.keyCode to jTerm keyCode
// No KP Supported

/* import meta */
var _meta = require('./_keymap_meta');
var global = require('../global');

/* Class: KeyMap
 * All the Control keys are defined in keymap.json
 */
var KeyMap;
exports.KeyMap = KeyMap = function() {
  // Import Control Keys' Ids
  var obj = this;
  for(var key in _meta.ctrlId) {
    obj[key] = _meta.ctrlId[key];
  }
};

KeyMap.prototype.convert = function(jkey, shifted) {
  /* For alpahbet and numbers, we use keypress to handle now
   *  support can found in jcurses
  // alphabet
  if(jkey >= 65 && jkey <= 90) {
    if(flag) {
      return String.fromCharCode(jkey);
    } else {
      return String.fromCharCode(jkey).toLowerCase();
    }
  }

  // number
  if(jkey >= 48 && jkey <= 57 && !shifted) {
    return String.fromCharCode(jkey);
  }
  */

  if(shifted) {
    if(_meta.shiftTb[jkey] !== undefined) {
      return _meta.shiftTb[jkey];
    }
  }

  return {
    8: this.KEY_BACKSPACE,
    9: this.KEY_TAB,
    13: this.KEY_ENTER,
    16: this.KEY_SHIFT,
    17: this.KEY_CONTROL,
    18: this.KEY_ALT,
    27: this.KEY_ESCAPE,
    33: this.KEY_PAGEUP,
    34: this.KEY_PAGEDOWN,
    35: this.KEY_END,
    36: this.KEY_HOME,
    37: this.KEY_LEFT,
    38: this.KEY_UP,
    39: this.KEY_RIGHT,
    40: this.KEY_DOWN,
    45: this.KEY_INSERT,
    46: this.KEY_DELETE,
    112: this.KEY_F1,
    113: this.KEY_F2,
    114: this.KEY_F3,
    115: this.KEY_F4,
    116: this.KEY_F5,
    117: this.KEY_F6,
    118: this.KEY_F7,
    119: this.KEY_F8,
    120: this.KEY_F9,
    121: this.KEY_F10,
    122: this.KEY_F11,
    123: this.KEY_F12,

    32: ' ',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: '\\',
    221: ']',
    222: "'",
  }[jkey];
};

KeyMap.prototype.filter = function(ch) {
  if(typeof ch !== 'string') {
    return;
  }

  ch = ch.charCodeAt(0);
  if(ch >= 65 && ch <= 90) {
    return true;
  }
  if(ch >= 97 && ch <= 122) {
    return true;
  }
  if(ch >= 48 && ch <= 57) {
    return true;
  }

  return _meta.printable[String.fromCharCode(ch)];
};

/* Singleton */
var _instance = null;
exports.getKeyMap = function() {
  if(_instance === null) {
    _instance = new KeyMap();
  }
  return _instance;
};

}) (jQuery);

