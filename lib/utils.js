'use strict';

var path = require('path');
var debug = require('debug')('generate:node');
var templates = path.resolve.bind(path, __dirname, 'templates');
var utils = module.exports = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Plugins
 */

require('base-fs-rename', 'rename');
require('common-questions', 'questions');
require('data-store', 'DataStore');
require('extend-shallow', 'extend');
require('is-valid-app', 'isValid');
require('match-file', 'match');
require('task-prompts', 'prompts');
require('through2', 'through');
require = fn;

utils.renameKey = function(prop) {
  return function(key, file) {
    return file ? file[prop] : path[prop](key);
  };
};

utils.create = function(app, name, pattern, options) {
  var opts = utils.extend({ dot: true, ignore: ['.DS_Store'] }, options);
  opts.cwd = path.resolve(__dirname, '../templates', opts.base || name);
  opts.renameKey = utils.renameKey('basename');
  app.create(name, opts);
  app[name].loadViews(pattern, opts);

  var views = app[name].views;
  for (var key in views) {
    var view = views[key];
    console.log(view.key);
  }
};

/**
 * Filter files to be rendered
 */

utils.filter = function(pattern, options) {
  var isMatch = utils.match.matcher(pattern, options);
  return utils.through.obj(function(file, enc, next) {
    if (file.isNull()) {
      next();
      return;
    }
    if (typeof pattern === 'undefined' || isMatch(file)) {
      next(null, file);
    } else {
      next();
    }
  });
};
