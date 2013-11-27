(function($) {

// Function: deepcopy
exports.deepCopy = function(obj) {
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

// Function: FontSize
exports.fontSize = function(font) {
    text = "wwwww";
    var currentObj = $('<pre>').hide().appendTo(document.body);
    $(currentObj).html(text).css('font', font);

    var width = currentObj.width();
    var height = currentObj.height();

    currentObj.remove();

    return {
        "width": width / text.length,
        "height": height
    }
}

exports.timeout = function(obj, interval, callback) {
    return setTimeout($.proxy(callback, obj), interval);
}

exports.timeloop = function(obj, interval, callback) {
    return setInterval($.proxy(callback, obj), interval);
}

}) (jQuery);
