// Terminal Manager

// Here goes defines
Terminal = NewClass();

Terminal.addStatic({
    "_term_list": {},
    "_change_pos_max_size": 100,

    "get": function(term_name) {
        return Terminal._term_list[term_name];
    }, //get

    "add": function(term_name, term) {
        if(Terminal._term_list[term_name] != undefined) {
            throw term_name + "is already registerd!";
        }
        
        Terminal._term_list[term_name] = term;
    }, //add

    "remove": function(term_name) {
        if(Terminal._term_list[term_name] != undefined) {
            delete Terminal._term_list[term_name];
        } else {
            throw "No such termianl " + term_name;
        }
    }, //remove
});

// par : (term_name, config)
Terminal.setConstructor(function(obj, pars) {
    term_name = pars[0];
    config = pars[1];

    obj._config = ConfigMan();
    for(name in config) {
        obj._config.setConfig(name, config[name]);
    }

    obj._term_name = term_name;
    obj._buildBody();

    Terminal.add(term_name, obj);
});

Terminal.addNonStatic({
    "_term_name"    : null,
    "_config"       : null,
    "_attach"       : null,
    "_body"         : null,

    "_reset_all_flag": false,
    "_change_pos_list": [],

    "_genId": function() {
        return "jterm-inner-" + this._term_name;
    }, // _genId;

    "_buildBody": function() {
        this._body = $(
            "<div>" + 
            "</div>"
        );
        
        this._body.attr("id", this._genId());

        this._body.css({
            "width"     : this._config.getConfig("width"),
            "height"    : this._config.getConfig("height"),
            "font-family": this._config.getConfig("font-family"),
            "font-size" : this._config.getConfig("font-size"),
            "background-color": this._config.getConfig("bgcolor"),
            "color"     : this._config.getConfig("font-color"),
        });
    }, // _buildBody

    "attachTo": function(o) {
        o = $(o);
        if(this._attach != null) {
            this._attach.remove("#" + this._genId());
        }

        this._attach = o;
        this._attach.prepend(this._body);

        this.init();
    }, // attachTo

    "getTermName": function() {
        return this.term_name;
    }, // getTermName
    

    // Terminal drawing goes here
    "_cursor_x"     : 0,
    "_cursor_y"     : 0,
    "_buffer"       : [],
    "_screen_width" : 0,
    "_screen_height": 0,
    "_font_width"   : 0,
    "_font_height"  : 0,
    
    "init": function() {
        var fs = fontSize(this._body.css("font"));
        this._screen_height = Math.floor(this._body.height() / fs.height);
        this._screen_width = Math.floor(this._body.width() / fs.width);

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
            this._body.append(p);
        }

        // Create cursor
        this._cursor_x = this._cursor_y = 0;
        var c = $("<span>&nbsp;</span>");

        var cstyle = this._config.getConfig("cursor-style");
        crgba = this._config.getConfig("cursor-color");
        crgba = "rgba(" + crgba[0] + "," + crgba[1] + "," + crgba[2] + "," + crgba[3] + ")";

        if(cstyle == "block") {
            c.html("&nbsp;");
            c.css("background-color", crgba);
        } else if(cstyle == "underline") {
            c.html("_");
            c.css("color", crgba)
        }

        c.attr("id", this._genCursorId());

        c.css({
            "position": "relative",
            "font": "inherit",
        });
        this._body.prepend(c);

        // Set up pre
        this._body.find("pre").css({
            "margin": "0px",
            "padding": "0px",
            "font": "inherit",
            "height": fs.height,
            "position": "relative",
            "top": -fs.height,
        });

        this._reset_all_flag = true;
        this._change_pos_list = [];
        this.refresh();
    }, // init

    "_genCursorId": function() {
        return this._genId() + "-cursor";
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
        var targets = this._body.find("pre");
        if(this._reset_all_flag) {
            for(var i = 0;i < this.getHeight();i ++) {
                var target = $(targets[i]);
                target.empty();
                for(var j = 0;j < this.getWidth();j ++) {
                    var ch = (this._buffer[i][j] == null ? ' ' : this._buffer[i][j]);
                    target.append(ch);
                }
            }
        } else {
            for(var i = 0;i < this._change_pos_list.length;i ++) {
                var x = this._change_pos_list[i][0],
                    y = this._change_pos_list[i][1];

                var target = $(targets[x]);
                var buf = target.html();
                buf = buf.substr(0, y) + this._buffer[x][y] + buf.substr(y + 1);
                target.html(buf);
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

Terminal = Terminal.getClass();
