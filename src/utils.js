(function($) {

// Function: deepcopy
var deepCopy;
exports.deepCopy = deepCopy = function(obj) {
    var ret;

    if($.isArray(obj)) {
        ret = [];
        for(var i = 0;i < obj.length;i ++) {
            ret[i] = deepCopy(obj[i]);
        }
    } else if ($.isPlainObject(obj)) {
        ret = {};
        for(var name in obj) {
            ret[name] = deepCopy(obj[name]);
        }
    } else {
        ret = obj;
    }

    return ret;
};

// Function: FontSize
var fontSize;
exports.fontSize = fontSize = function(font) {
    var text = "wwwww";
    var currentObj = $('<pre>').hide().appendTo(document.body);
    $(currentObj).html(text).css('font', font);

    var width = currentObj.width();
    var height = currentObj.height();

    currentObj.remove();

    return {
        "width": width / text.length,
        "height": height
    };
};

var timeout;
exports.timeout = timeout = function(obj, interval, callback) {
    return setTimeout($.proxy(callback, obj), interval);
};

var timeloop;
exports.timeloop = timeloop = function(obj, interval, callback) {
    return setInterval($.proxy(callback, obj), interval);
};


// Copy from nodejs util.inherits
var inherits;
exports.inherits = inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable:    false,
      writable: true,
      configurable: true
    }
  });
};


var escapeString;
exports.escapeString = escapeString = function(str) {
  return $('<div>').text(str).html();
};

}) (jQuery);
