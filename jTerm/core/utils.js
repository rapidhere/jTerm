// Function: deepcopy
function deepcopy(obj) {
    var ret;

    if($.isArray(obj)) {
        ret = [];
        for(var i = 0;i < obj.length;i ++) {
            ret[i] = deepcopy(obj[i]);
        }
    } else if ($.isPlainObject(obj)) {
        ret = {};
        for(var name in obj) {
            ret[name] = deepcopy(obj[name]);
        }
    } else {
        ret = obj;
    }

    return ret;
}

