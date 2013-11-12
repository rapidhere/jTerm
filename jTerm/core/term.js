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
            "</div>"
        );
        
        this._body.attr("id", this._genId());
        this._body.css("width", this._config.getConfig("width"));
        this._body.css("height", this._config.getConfig("height"));
        this._body.css("font-family", this._config.getConfig("font"));
        this._body.css("background-color", this._config.getConfig("bgcolor"));
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
});

Terminal = Terminal.getClass();
