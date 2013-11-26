(function($) {
define(function(require, exports, module) {

GLOBAL_CONFIG = require("../gconfig");

/* Class: ConfigMan */
var ConfigMan = function() {
  this._config = {};
};

ConfigMan.prototype.defaultConfig = {
  "bgcolor": "black",
  "font-family": "consolas",
  "font-size": "14px",
  "font-color": "#e7e7e7",
  "width": "100%",
  "height": "100%",
  "cursor-color": [200, 200, 200, 0.8],
  "cursor-style": "block",
};

ConfigMan.prototype.get = function(configName) {
  if(typeof configName != "string")
    return ;

  if(this._config[configName] != undefined)
    return this._config[configName];

  if(GLOBAL_CONFIG[configName] != undefined)
    return GLOBAL_CONFIG[configName];

  return this.defaultConfig[configName];
};

ConfigMan.prototype.set = function(configName, configValue) {
  if(typeof configName != "string")
    return;

  if(typeof configValue != "string")
    return ;

  if(ConfigMan.defaultConfig[configName] == undefined) {
    throw "No such Config " + configName;
  }

  this._config[configName] = configValue;
};

exports.ConfigMan = ConfigMan;

});
}) (jQuery);
