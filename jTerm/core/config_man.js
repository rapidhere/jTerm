// Configure Manager

// Define the Configure Manager
ConfigMan = NewClass();

ConfigMan.addStatic({
    "default_config": {
        "bgcolor"   : "black",
        "font"      : "consolas",
        "width"     : "expand",
        "height"    : "expand",
    }, // default_config
});

ConfigMan.addNonStatic({
    "_config": {},
    "getConfig": function(conf_name) {
        if(! conf_name || typeof conf_name != "string")
            return ;

        if(this._config[conf_name] != undefined)
            return this._config[conf_name];

        if(GLOBAL_CONFIG[conf_name] != undefined)
            return GLOBAL_CONFIG[conf_name];
        
        return ConfigMan.default_config[conf_name];
    }, // getConfig
    "setConfig": function(conf_name, conf_val) {
        if(! conf_name || typeof conf_name != "string")
            return ;

        if(! conf_val || typeof conf_val != "string")
            return ;
        
        this._config[conf_name] = conf_val;
    }, // setConfig
});

ConfigMan = ConfigMan.getClass();
