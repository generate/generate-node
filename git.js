/*!
 * generate-node <https://github.com/jonschlinkert/generate-node>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('glob');
var success = require('success-symbol');
var green = require('ansi-green');
var gitignore = require('parse-gitignore');
var Emitter = require('component-emitter');
var gitty = require('gitty');

function git(cwd, options) {
  options = options || {};

  var repo = gitty(cwd);
  var utils = Emitter({});
  var msgs = options.msgs || {
    init: ['already exists.', 'initialized.']
  };

  utils.init = function(cb) {
    var fp = path.resolve(cwd, '.git');

    fs.exists(fp, function (exists) {
      if (exists) {
        utils.emit('init', msgs.init[0]);
        return cb(null, true);
      }

      repo.init(function(err) {
        if (err) return cb(err);

        utils.emit('init', msgs.init[1]);
        cb(null, false);
      });
    });
  };

  utils.commit = function(msg, cb) {
    files(cwd, function(err, files) {
      if (err) return cb(err);

      repo.add(files, function(err) {
        if (err) return cb(err);

        utils.emit('add', files);
        repo.commit(msg, function (err) {
          if (err) return cb(err);

          utils.emit('commit', msg);
          cb();
        });
      });
    });
  };

  utils.quickstart = function(msg, cb) {
    if (typeof msg === 'function') {
      cb = msg;
      msg = 'first commit.';
    }

    utils.init(function(err, status) {
      if (err) {
        cb(err);
        return;
      }

      if (status === true) {
        return cb();
      }

      if (status === false) {
        utils.commit(msg, function(err) {
          if (err) return cb(err);
          cb();
        });
        return;
      }
      cb();
    });
  };

  return utils;
}

function format(files) {
  return '\n - ' + files.join('\n - ');
}

function files(dir, cb) {
  var ignore = gitignore(path.join(dir, '.gitignore'));
  ignore.push('.DS_Store');
  var opts = { cwd: dir, ignore: ignore, dot: true };
  glob('*', opts, function(err, files) {
    if (err) {
      cb(err);
      return;
    }
    cb(null, files);
  });
}

/**
 * Expose git
 */

module.exports = git;

function ok(msg) {
  var args = [].slice.call(arguments);
  args.unshift(green(success));
  return console.log.apply(console, args);
}

var run = git('.');

run.on('init', function(msg) {
  ok('git repository', msg);
});

run.on('add', function(files) {
  ok('added', format(files));
});

run.on('commit', function(data) {
  ok('commit message:', data);
});

run.quickstart(function(err, exists) {
  if (err) return console.log(err);
  if (exists) {
    ok('already exists.');
  } else {
    ok('done!');
  }
});
