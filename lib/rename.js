'use strict';

var typeOf = require('kind-of');
var through = require('through2');
var merge = require('mixin-deep');
var path = require('path');

module.exports = function(config) {
  return function plugin(app) {
    if (this.isRegistered('rename-file')) return;
    if (!this.isApp && !this.isGenerator && !this.isViews) {
      return;
    }

    this.define('renameFile', function(val) {
      return through.obj(function(file, enc, cb) {
        var options = merge({}, config, app.options);
        var filepath, opts;

        if (options === '' || !val) {
          cb(null, file);
          return;
        }

        var type = typeOf(val);

        switch (type) {
          case 'string':
            filepath = val;
            break;
          case 'function':
            var res = val(file);
            if (res) file = res;

            opts = merge({}, config, options, getPaths(file));
            var name = opts.filename || opts.stem;
            filepath = path.resolve(opts.dirname, name + opts.extname);
            break;
          case 'object':
            opts = merge({filename: file.stem}, config, options, val);
            if ('stem' in opts) opts.filename = opts.stem;

            var dirname = 'dirname' in opts ? opts.dirname : file.dirname;
            var filename = 'filename' in opts ? opts.filename : file.stem;
            var extname = 'extname' in opts ? opts.extname : file.extname;

            var prefix = val.prefix || '';
            var suffix = val.suffix || '';

            filepath = path.resolve(dirname, prefix + filename + suffix + extname);
            break;
          default:
            cb(new Error('expected an object, string, or function'));
            return;
        }

        file.path = path.resolve(file.base, filepath);

        // Rename sourcemap if present
        if (file.sourceMap) {
          file.sourceMap.file = file.relative;
        }

        cb(null, file);
      });
    });

    return plugin;
  };
};

function getPaths(file) {
  return {
    dirname: file.dirname,
    basename: file.basename,
    filename: file.filename || file.stem,
    stem: file.filename || file.stem,
    extname: file.ext || file.extname,
    ext: file.ext || file.extname
  };
}
