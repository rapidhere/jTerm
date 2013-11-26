(function($) {
define(require, exports, module) {

GLOBAL_CONFIG = require("../gconfig");
JCurses = require("./jcurses").JCurses;

JCurses = jcurses.JCurses;

/* Class: Terminal
 * The very low layer
 */
var Terminal = function(terminalName, config) {
  // Set up configurations
  this._config = new ConfigMan();

  if(typeof config != "object")
    config = {};

  for(name in config) {
    this._config.setConfig(name, config[name]);
  }

  this._terminalName = terminalName;

  this._body = $("<div></div>");
  this._body.attr("id", this._genId());

  this._termName = null;
  this._attach = null;
  this._jcurses = new JCurses();
};

Terminal.addNonStatic({
    "attachTo": function(o) {
        o = $(o);
        if(this._attach != null) {
            $("#" + this._genId()).remove();
        }

        this._attach = o;
        this._attach.prepend(this._body);

        if(! this._jcurses)
            this._jcurses = new JCurses()
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

});
}) (jQuery);
