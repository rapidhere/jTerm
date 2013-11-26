(function($) {
define(function(require, exports, module) {

/* meta data of configs */
var _meta = require('./config_meta.json');

var setConfig = require('./_config_base').setConfig;
var removeConfig = require('./config_base').removeConfig;

var GLOBAL_CONFIG;
exports.GLOBAL_CONFIG = GLOBAL_CONFIG = {};

/* reigster configs into pool */
var configRegister = require("./config_base").register;
for(cname in _meta.configMeta) {
  configRegister(cname, _meta.configMeta[cname]);
}

/* Class: ConfigMan 
 * the Configuration Manager
 */
var ConfigMan;
exports.ConfigMan = ConfigMan = function() {
  this._config = {};
};

ConfigMan.prototype.defaultConfig = _meta.defaultConfig;

ConfigMan.prototype.get = function(configName) {
  if(typeof configName != 'string')
    return ;

  if(this._config[configName] != undefined)
    return this._config[configName];

  if(GLOBAL_CONFIG[configName] != undefined)
    return GLOBAL_CONFIG[configName];

  return this.defaultConfig[configName];
};

ConfigMan.prototype.set = function(configName, configValue) {
  setConfig(this._config, configName, configValue);
};

ConfigMan.prototype.remove = function(configName) {
  remove(this._config, configName);
};

});
}) (jQuery);
