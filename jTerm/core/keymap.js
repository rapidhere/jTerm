// Keymap from jQuery.keyCode to jTerm keyCode
// No KP Supported

KeyMap = NewClass();

KeyMap.addStatic({
    "KEY_BACKSPACE"     : -1,
    "KEY_TAB"           : -2,
    "KEY_ENTER"         : -3,
    "KEY_SHIFT"         : -4,
    "KEY_CONTROL"       : -5,
    "KEY_ALT"           : -6,
    "KEY_ESCAPE"        : -7,
    "KEY_PAGEUP"        : -9,
    "KEY_PAGEDOWN"      : -10,
    "KEY_END"           : -11,
    "KEY_HOME"          : -12,
    "KEY_LEFT"          : -13,
    "KEY_UP"            : -14,
    "KEY_RIGHT"         : -15,
    "KEY_DOWN"          : -16,
    "KEY_INSERT"        : -17,
    "KEY_DELETE"        : -18,
    "KEY_F1"            : -19,
    "KEY_F2"            : -20,
    "KEY_F3"            : -21,
    "KEY_F4"            : -22,
    "KEY_F5"            : -23,
    "KEY_F6"            : -24,
    "KEY_F7"            : -25,
    "KEY_F8"            : -26,
    "KEY_F9"            : -27,
    "KEY_F10"           : -28,
    "KEY_F11"           : -29,
    "KEY_F12"           : -30,

    "convert": function(jkey, shifted) {
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
            t = {
                48  : '(',
                49  : '!',
                50  : '@',
                51  : '#',
                52  : '$',
                53  : '%',
                54  : '^',
                55  : '&',
                56  : '*',
                57  : ')',
                186 : ':',
                187 : '+',
                188 : '<',
                189 : '_',
                190 : '>',
                191 : '?',
                192 : '~',
                219 : '{',
                220 : '|',
                221 : '}',
                222 : '"',
            }[jkey];
            if(t != undefined)
                return t;
        }

        return {
            8   : KeyMap.KEY_BACKSPACE,
            9   : KeyMap.KEY_TAB,
            13  : KeyMap.KEY_ENTER,
            16  : KeyMap.KEY_SHIFT,
            17  : KeyMap.KEY_CONTROL,
            18  : KeyMap.KEY_ALT,
            27  : KeyMap.KEY_ESCAPE,
            33  : KeyMap.KEY_PAGEUP,
            34  : KeyMap.KEY_PAGEDOWN,
            35  : KeyMap.KEY_END,
            36  : KeyMap.KEY_HOME,
            37  : KeyMap.KEY_LEFT,
            38  : KeyMap.KEY_UP,
            39  : KeyMap.KEY_RIGHT,
            40  : KeyMap.KEY_DOWN,
            45  : KeyMap.KEY_INSERT,
            46  : KeyMap.KEY_DELETE,
            112 : KeyMap.KEY_F1,
            113 : KeyMap.KEY_F2,
            114 : KeyMap.KEY_F3,
            115 : KeyMap.KEY_F4,
            116 : KeyMap.KEY_F5,
            117 : KeyMap.KEY_F6,
            118 : KeyMap.KEY_F7,
            119 : KeyMap.KEY_F8,
            120 : KeyMap.KEY_F9,
            121 : KeyMap.KEY_F10,
            122 : KeyMap.KEY_F11,
            123 : KeyMap.KEY_F12,
            
            186 : ';',
            187 : '=',
            188 : ',',
            189 : '-',
            190 : '.',
            191 : '/',
            192 : '`',
            219 : '[',
            220 : '\\',
            221 : ']',
            222 : "'",
        }[jkey];
    },
});

KeyMap = KeyMap.getClass();
