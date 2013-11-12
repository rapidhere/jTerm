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

    "_genId": function() {
        return "jterm-inner-" + this._term_name;
    }, // _genId;

    "_buildBody": function() {
        this._body = $(
            "<div>" + 
            "<pre></pre>" + 
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

        // Set up pre
        this._body.find("pre").css({
            "margin": "0px",
            "padding": "0px",
            "font-family": "inherit",
        });
    }, // _buildBody

    "attachTo": function(o) {
        o = $(o);
        if(this._attach != null) {
            this._attach.remove("#" + this._genId());
        }

        this._attach = o;
        this._attach.prepend(this._body);
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
    
    "init": function() {
        var fs = fontSize(this._body.css("font"));
        this._screen_height = Math.floor(this._body.height() / fs.height);
        this._screen_width = Math.floor(this._body.width() / fs.width);

        this._buffer[i] = [];
        for(var i = 0;i < this.getHeight();i ++) {
            this._buffer[i] = [];
            for(var j = 0;j < this.getWidth();j ++) {
                this._buffer[i][j] = null;
            }
        }

        this._cursor_x = this._cursor_y = 0;

        this.refresh();
    }, // init

    "move": function(x, y) {
        if(typeof x == "number")
            x = Math.floor(x);

        if(typeof y == "number")
            y = Math.floor(y);

        if(x && x >= 0 && x < this.getHeight())
           this. _cursor_x = x;

        if(y && y >= 0 && y < this.getWidth())
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
        this._buffer[this.getX()][this.getY()] = ch;
    }, // put

    "get": function() {
        return this._buffer[this.getX()][this.getY()];
    }, // get

    "erase": function() {
        this._buffer[this.getX()][this.getY()] = null;
    }, // erase

    "clear": function() {
        for(var i = 0;i < this.getHeight();i ++) {
            for(var j = 0;j < this.getWidth();j ++)
                this._buffer[i][j] = null;
        }

    }, // clear

    "refresh": function() {
        var target = this._body.find("pre");
        target.empty();

        for(var i = 0;i < this.getHeight();i ++) {
            for(var j = 0;j < this.getWidth();j ++) {
                var ch = (this._buffer[i][j] == null ? ' ' : this._buffer[i][j]);
                target.append(ch);
            }
            target.append("\n");
        }
    },
});

Terminal = Terminal.getClass();
