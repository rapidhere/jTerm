(function($) {

var GLOBAL_CONFIG = require('./config_man').GLOBAL_CONFIG;

/* Class: Terminal
 * The very low layer
 */
var Terminal;
exports.Terminal = Terminal = function(terminalName, config) {
  // Set up configurations
  this._config = new ConfigMan();

  if(typeof config != 'object')
    config = {};

  for(name in config) {
    this._config.setConfig(name, config[name]);
  }

  this._terminalName = terminalName;

  this._body = $('<div></div>');
  this._body.attr('id', this._genId());

  this._termName = null;
  this._attach = null;

  var JCurses = require('./jcurses').JCurses;
  this._jcurses = new JCurses();
};

Terminal.prototype.attach = function(o) {
  o = $(o);
  if(this._attach != null) {
    this.detach();
  }

  this._attach = o;
  this._attach.append(this._body);
  this._jcurses.init();
};

Terminal.prototype.detach = function() {
  if(this._attach != null) {
    $('#' + this._genId()).remove();
  }

  this._attach = null;
};

Terminal.prototype.getName = function() {
  return this._termName;
};

Terminal.prototype.getBody = function() {
  return this._body;
};
  
Terminal.prototype.getConfig = function(confName) {
  return this._config.get(confName);
};

Terminal.prototype.getJCurses = function()  {
  return this._jcurses;
};

}) (jQuery);
