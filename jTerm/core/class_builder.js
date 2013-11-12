/* Class Builder is a general util to build 
 * a javascript class in factory method
 *
 * Note : 
 *  - there is no public, private or protected modifier
 *  - the class is not inheritable
 *  - the Static methods and variable can only call in classname.name type
 *  - the Constructor will wrap your constructor provided in setConstructor,
 *    your Constructor should apply two paraments
 *    the first is object object
 *    the second is paramenters of you constructor
 *  - you can not 
*/

function _addStaticVariable(var_name, init_val) {
    if(! var_name || typeof var_name != "string")
        return;

    this[var_name] = init_val;

    this.static_list[this.static_list.length] = var_name;
};

function _addStaticMethod(func_name, func) {
    if(! func_name || typeof func_name != "string")
        return ;

    if(! func || typeof func != "function")
        return ;

    this[func_name] = func;
    this.static_list[this.static_list.length] = func_name;
};

function _addObjectVariable(var_name, init_val) {
    if(! var_name || typeof var_name != "string")
        return ;

    this.var_list[var_name] = init_val;
};

function _addObjectMethod(func_name, func) {
    if(! func_name || typeof func_name != "string")
        return ;

    if(! func || typeof func != "function")
        return ;
    
    this.var_list[func_name] = func;
};

function _setConstructor(func) {
    if(! func || typeof func != "function")
        return ;

    this.constructor = func;
}

function _getClass() {
    var cls = this;

    var cons = function() {
        var obj = new Object;

        /* add non-static */
        for ( name in cls.var_list ) {
            obj[name] = deepcopy(cls.var_list[name]);
        }

        if(cls.constructor)
            cls.constructor(obj, arguments);

        return obj;
    };
    
    /* add statics */
    for(var i = 0;i < cls.static_list.length;i ++) {
        var name = cls.static_list[i];

        cons[name] = cls[name];
    }

    return cons;
}

function _addStatic(o) {
    for(name in o) {
        if(typeof o[name] == 'function')
            this.addStaticMethod(name, o[name]);
        else
            this.addStaticVariable(name, o[name]);
    }
}

function _addNonStatic(o) {
    for(name in o) {
        if(typeof o[name] == 'function')
            this.addObjectMethod(name, o[name]);
        else
            this.addObjectVariable(name, o[name]);
    }
}

var NewClass = function() {
    var nc = new Object;
    
    nc.var_list = {};
    nc.static_list = [];
    nc.constructor = null;

    nc.addStaticVariable = _addStaticVariable;
    nc.addObjectVariable = _addObjectVariable;
    nc.addStaticMethod = _addStaticMethod;
    nc.addObjectMethod = _addObjectMethod;

    nc.setConstructor = _setConstructor;
    nc.addStatic = _addStatic;
    nc.addNonStatic = _addNonStatic;

    nc.getClass = _getClass;

    return nc;
}
