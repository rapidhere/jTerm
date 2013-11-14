// Base Surface

BaseSurface = NewClass();

BaseSurface.setConstructor(function(terminal) {
    this.setTerminal(terminal)
})

BaseSurface.addNonStatic({
    "_term" : null,
    "_tc"   : null,

    "setTerminal" : function(term) {
        this._term = term;
        this._tc = term.getCurses();
    },

    "putch" : function(ch) {
        return this._tc.put(ch);
    },

    "puts" : function(str) {
        if(typeof str != "string")
            return ;
        
        tc = this._tc;
        for(i = 0;i < str.length;i ++) {
            if(tc.getY() == tc.getWidth()) {
                this.move(1, -1000000);
            }

            if(tc.getX() == tc.getHeight()) {
                break;
            }
            tc.put(str[i]);
            this.move(0, 1);
        }
    },

    "move" : function(dx, dy) {
        this.moveTo(dx + this._tc.getX(), dy + this._tc.getY());
    },

    "moveTo" : function(x, y) {
        if(x < 0)
            x = 0;
        if(x >= this._tc.getHeight())
            x = this._tc.getHeight() - 1;
        if(y < 0)
            y = 0;
        if(y >= this._tc.getWidth())
            y = this._tc.getWidth() - 1;

        this._tc.move(x, y);
    },

    "refresh" : function() {
        this._tc.refresh();
    },

    "clear" : function() {
        this._tc.clear();
    },

    "erase" : function() {
        this._tc.earse();
    },
    
    "get" : function() {
        return this._tc.get();
    },

    "getX" : function() {
        return this._tc.getX();
    },

    "getY" : function() {
        return this._tc.getY();
    },

    "getHeight" : function() {
        return this._tc.getHeight();
    },

    "getWidth" : function() {
        return this._tc.getWidth();
    },

    "addcb" : function(cb) {
        this._tc.addCallback(cb);
    },

    "rmcb" : function(id) {
        this._tc.removeCallback(id);
    },

    "attach" : function(o) {
        this._term.attachTo(o);
    },

    "detach" : function() {
        this._term.detach();
    },

    "getName" : function() {
        return this._term.getTermName();
    },

    "getTerm" : function() {
        return this._term;
    },

    "getTC" : function() {
        return this._tc;
    }
});

BaseSurface = BaseSurface.getClass();
