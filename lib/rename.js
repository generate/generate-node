'use strict';

var path = require('path');
var utils = require('./utils');

module.exports = function(config) {
  return function plugin(app) {
    if (!utils.isValid(app, 'rename-file', ['generator', 'views'])) {
      return;
    }

    this.define('renameFile', function(dest) {
      var options = utils.merge({}, config, app.options);
      dest = dest || options.dest || options.cwd || app.cwd || process.cwd();

      var rename;
      if (typeof dest === 'function') {
        rename = dest;
      } else {
        rename = app.rename(dest);
      }

      return utils.through.obj(function(file, enc, cb) {
        rename(file);
        cb(null, file);
      });
    });

    return plugin;
  };
};
