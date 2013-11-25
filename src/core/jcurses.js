// curses like lib

TermCurses = NewClass();

TermCurses.addStatic({
    "_change_pos_max_size": 100,
});

TermCurses.setConstructor(function(terminal) {
    this._terminal = terminal;

    // Set up body
    terminal.getBody().css({
            "width"     : terminal.getConfig("width"),
            "height"    : terminal.getConfig("height"),
            "font-family": terminal.getConfig("font-family"),
            "font-size" : terminal.getConfig("font-size"),
            "background-color": terminal.getConfig("bgcolor"),
            "color"     : terminal.getConfig("font-color"),
            "overflow"  : "hidden",
    });

    // Add cursor span to body
    cursor = $("<span></span>");
    cursor.attr("id", this._genCursorId());
    
    var cstyle = terminal.getConfig("cursor-style");
    crgba = terminal.getConfig("cursor-color");
    crgba = "rgba(" + crgba[0] + "," + crgba[1] + "," + crgba[2] + "," + crgba[3] + ")";

    if(cstyle == "block") {
        cursor.html("&nbsp;");
        cursor.css("background-color", crgba);
    } else if(cstyle == "underline") {
        cursor.html("_");
        cursor.css("color", crgba);
    } else if(cstyle == "none") {
        cursor.html("&nbsp;");
        cursor.css("color", crgba);
    }

    cursor.css({
        "position": "relative",
        "font": "inherit",
    });

    terminal.getBody().prepend(cursor);
});

TermCurses.addNonStatic({
    "_cursor_x"     : 0,
    "_cursor_y"     : 0,
    "_buffer"       : [],
    "_screen_width" : 0,
    "_screen_height": 0,
    "_font_width"   : 0,
    "_font_height"  : 0,
    "_draw_cursor_handle": null,
    "_terminal"     : null,
    
    "_reset_all_flag": false,
    "_change_pos_list": [],

    "_key_press_cb_list": {},
    "_n_key_press_cb_id": 0,

    "_last_down_key": null,
    
    "init": function() {
        var body = this._terminal.getBody();
        
        // Set up size
        var fs = fontSize(body.css("font"));
        this._screen_height = Math.floor(body.height() / fs.height);
        this._screen_width = Math.floor(body.width() / fs.width);

        this._font_width = fs.width;
        this._font_height = fs.height;
        
        // Init buffer
        this._buffer[i] = [];
        for(var i = 0;i < this.getHeight();i ++) {
            this._buffer[i] = [];

            var p = $("<pre>");
            for(var j = 0;j < this.getWidth();j ++) {
                this._buffer[i][j] = null;
                p.append(" ");
            }
            body.append(p);
        }
        // Set up pre
        body.find("pre").css({
            "margin": "0px",
            "padding": "0px",
            "font": "inherit",
            "height": fs.height,
            "position": "relative",
            "top": -fs.height,
        });

        // Start draw cursor
        this._cursor_x = this._cursor_y = 0;
        if(this._draw_cursor_handle) {
            clearInterval(this._draw_cursor_handle);
        }

        this._draw_cursor_handle = 
        timeloop({cursor: $("#" + this._genCursorId())}, 1000, function() {
            this.cursor.css("visibility", "hidden");
            timeout(this, 500, function() {
                this.cursor.css("visibility", "visible");
            });
        })
        
        // Refresh the screen
        this._reset_all_flag = true;
        this._change_pos_list = [];
        this.refresh();
        
        // Listen to keyboad
        obj = this;
        this._terminal.getBody().keydown(function(e) {
            obj._key_press(e);
        });
    }, // init

    "_genCursorId": function() {
        return this._terminal.getBody().attr("id") + "-cursor";
    },

    "destroy": function() {
        clearInterval(this._draw_cursor_handle);
    },

    "move": function(x, y) {
        if(typeof x != "number")
            return ;

        if(typeof y != "number")
            return;

        x = Math.floor(x);
        y = Math.floor(y);

        if(x >= 0 && x < this.getHeight())
           this. _cursor_x = x;

        if(y >= 0 && y < this.getWidth())
           this._cursor_y = y;
    }, // move

    "getX": function() {
        return this._cursor_x;
    }, // getX

    "getY": function() {
        return this._cursor_y;
    }, // getY

    "getWidth": function() {
        return this._screen_width;
    }, // getWidth

    "getHeight": function() {
        return this._screen_height;
    }, // getHeight

    "put": function(ch) {
        if(! KeyMap.filter(ch))
            ch = null;

        this._append_change_pos(this.getX(), this.getY());
        this._buffer[this.getX()][this.getY()] = ch;
    }, // put

    "get": function() {
        return this._buffer[this.getX()][this.getY()];
    }, // get

    "erase": function() {
        this._append_change_pos(this.getX(), this.getY());
        this._buffer[this.getX()][this.getY()] = null;
    }, // erase

    "clear": function() {
        this._set_reset_all();
        for(var i = 0;i < this.getHeight();i ++) {
            for(var j = 0;j < this.getWidth();j ++)
                this._buffer[i][j] = null;
        }

    }, // clear

    "refresh": function() {
        var targets = this._terminal.getBody().find("pre");
        if(this._reset_all_flag) {
            for(var i = 0;i < this.getHeight();i ++) {
                var target = $(targets[i]);
                target.empty();
                for(var j = 0;j < this.getWidth();j ++) {
                    var ch = this._buffer[i][j];
                    if(ch == null)
                        ch = ' ';
                    target.append(ch);
                }
            }
        } else {
            for(var i = 0;i < this._change_pos_list.length;i ++) {
                var x = this._change_pos_list[i][0],
                    y = this._change_pos_list[i][1];

                var target = $(targets[x]);
                var buf = target.text();
                var ch = this._buffer[x][y];
                if(ch == null)
                    ch = ' ';
                buf = buf.substr(0, y) + ch + buf.substr(y + 1);
                target.text(buf);
            }
        }

        this._reset_all_flag = false;
        this._change_pos_list = [];

        // Put cursor
        var cursor = $("#" + this._genCursorId());
        cursor.css({
            "top"   : this.getX() * this._font_height,
            "left"  : this.getY() * this._font_width,
        })
    },

    "addCallback": function(callback) {
        this._key_press_cb_list[this._n_key_press_cb_id] = callback;
        this._n_key_press_cb_id ++;
    },

    "removeCallback": function(id) {
        delete this._key_press_cb_list[id];
    },

    "_key_press": function(e) {
        for(id in this._key_press_cb_list) {
            func = this._key_press_cb_list[id];
            func(KeyMap.convert(e.keyCode, e.shiftKey), e.ctrlKey, e.shiftKey, e.altKey);
        }
    },

    "_set_reset_all": function() {
        this._reset_all_flag = true;
        this._change_pos_list = [];
    },

    "_append_change_pos": function(x, y) {
        if(this._reset_all_flag)
            return ;

        if(typeof x != "number" || typeof y != "number")
            return;
        x = Math.floor(x);
        y = Math.floor(y);

        if(x < 0 || x >= this.getHeight() || y < 0 || y >= this.getWidth())
            return ;

        if(this._change_pos_list.length >= Terminal._change_pos_max_size) {
            this._set_reset_all();
            return ;
        }
        
        var i;
        for(i = 0;i < this._change_pos_list.length;i ++) {
            var c = this._change_pos_list[i];
            if(x == c[0] && y == c[1])
                return ;
        }

        this._change_pos_list[i] = [x, y];
    }
});

TermCurses = TermCurses.getClass();
