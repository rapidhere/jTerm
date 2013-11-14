// Terminal Manager

// Here goes defines
Terminal = NewClass();

Terminal.addStatic({
    "_term_list": {},

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
            term = Terminal._term_list[term_name]
            term.detach();
            term.getCurses().destroy();
            delete Terminal._term_list[term_name];
        } else {
            throw "No such termianl " + term_name;
        }
    }, //remove

    "size": function() {
        var cnt = 0;
        for(n in Terminal._term_list) {
            cnt ++;
        }

        return cnt;
    },
});

Terminal.setConstructor(function(term_name, config) {
    this._config = ConfigMan();
    for(name in config) {
        this._config.setConfig(name, config[name]);
    }

    this._term_name = term_name;
    this._buildBody();

    Terminal.add(term_name, this);
});

Terminal.addNonStatic({
    "_term_name"    : null,
    "_config"       : null,
    "_attach"       : null,
    "_body"         : null,
    "_jcurses"      : null,


    "_genId": function() {
        return "jterm-inner-" + this._term_name;
    }, // _genId;

    "_buildBody": function() {
        this._body = $(
            "<div>" + 
            "</div>"
        );
        
        this._body.attr("id", this._genId());
        this._body.attr("tabindex", Terminal.size());
        this._body.css("outline", "none");
    }, // _buildBody

    "attachTo": function(o) {
        o = $(o);
        if(this._attach != null) {
            $("#" + this._genId()).remove();
        }

        this._attach = o;
        this._attach.prepend(this._body);

        if(! this._jcurses)
            this._jcurses = TermCurses(this);
        this._jcurses.init();
    }, // attachTo

    "detach": function() {
        if(this._attach != null) {
            $("#" + this._genId()).remove();
        }

        this._attach = null;
    },

    "getTermName": function() {
        return this.term_name;
    }, // getTermName

    "getBody": function() {
        return this._body;
    },
    
    "getConfig": function(conf_name) {
        return this._config.getConfig(conf_name);
    },

    "getCurses": function() {
        return this._jcurses;
    }
});

Terminal = Terminal.getClass();
