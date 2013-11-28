(function($) {

'use strict';

// TODO: support for register Config from JSON
var _meta = require('./_config_meta');

/* add a Config to dict */
exports.setConfig = function(confDict, confName, confValue) {
  if(typeof confDict !== 'object') {
    throw 'require confDict as a object!';
  }

  confDict[confName] = confValue;
};

/* remove config to dict */
exports.removeConfig = function(confDict, confName) {
  if(typeof confDict !== 'object') {
    throw 'require confDict as a object!';
  }

  if(confDict[confName] !== undefined) {
    delete confDict[confName];
  }
};

/* registerd pool */
var _regPool = {};

/* register config */
var register;
exports.register = register = function(confName, metaData) {
};

}) (jQuery);
