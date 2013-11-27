// Keymap from jQuery.keyCode to jTerm keyCode
// No KP Supported

(function($) {
define(function(require, exports, module) {

/* import meta */
var _meta = require('./_keymap_meta');

/* Class: KeyMap
 * All the Control keys are defined in keymap.json
 */
var KeyMap;
exports.KeyMap = KeyMap = function() {
  // Import Control Keys' Ids
  obj = this;
  for(key in _meta.ctrlId) {
    obj[key] = _meta.ctrlId[key];
  }
};

KeyMap.property.convert = function(jkey, shifted) {
  // aplhabet
  if(jkey >= 65 && jkey <= 90) {
    if(shifted)
      return String.fromCharCode(jkey);
    else
      return String.fromCharCode(jkey).toLowerCase();
  }

  // number
  if(jkey >= 48 && jkey <= 57 && !shifted) {
    return String.fromCharCode(jkey);
  }

  if(shifted) {
    if(_meta.shift_tb[jkey] != undefined)
      return _meta.shift_tb[jkey];
  }

  return {
    8: KeyMap.KEY_BACKSPACE,
    9: KeyMap.KEY_TAB,
    13: KeyMap.KEY_ENTER,
    16: KeyMap.KEY_SHIFT,
    17: KeyMap.KEY_CONTROL,
    18: KeyMap.KEY_ALT,
    27: KeyMap.KEY_ESCAPE,
    33: KeyMap.KEY_PAGEUP,
    34: KeyMap.KEY_PAGEDOWN,
    35: KeyMap.KEY_END,
    36: KeyMap.KEY_HOME,
    37: KeyMap.KEY_LEFT,
    38: KeyMap.KEY_UP,
    39: KeyMap.KEY_RIGHT,
    40: KeyMap.KEY_DOWN,
    45: KeyMap.KEY_INSERT,
    46: KeyMap.KEY_DELETE,
    112: KeyMap.KEY_F1,
    113: KeyMap.KEY_F2,
    114: KeyMap.KEY_F3,
    115: KeyMap.KEY_F4,
    116: KeyMap.KEY_F5,
    117: KeyMap.KEY_F6,
    118: KeyMap.KEY_F7,
    119: KeyMap.KEY_F8,
    120: KeyMap.KEY_F9,
    121: KeyMap.KEY_F10,
    122: KeyMap.KEY_F11,
    123: KeyMap.KEY_F12,

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

KeyMap.property.filter = function(ch) {
  if(typeof ch != 'string')
    return;

  ch = ch.charCodeAt(0);
  if(ch >= 65 && ch <= 90)
    return true;
  if(ch >= 97 && ch <= 122)
    return true;
  if(ch >= 48 && ch <= 57)
    return true;

  return _meta.printable[String.fromCharCode(ch)];
};

/* Singleton */
_instance = null;
exports.getKeyMap = function() {
  if(_instance == null) {
    _instance = new KeyMap();
  }
  return _instance;
};

});
}) (jQuery);

