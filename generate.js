'use strict';

var through = require('through2');
var extend = require('extend-shallow');
var git = require('gitty');

module.exports = function(app, base, env) {
  var destPath = app.argv('dest') || process.cwd();
  var srcOpts = extend({ cwd: __dirname + '/templates', followSymlinks: true });
  var destOpts = extend({ cwd: destPath, overwrite: true });
  app.data({
    author: {
      name: 'Brian Woodward',
      url: 'https://github.com/doowb'
    },
    username: 'doowb',
    varname: 'myApp'
  });

  app.question('git', {
    type: 'confirm',
    message: 'Want to initialize a git repository?',
    default: false
  });

  app.task('init', function(cb) {
    app.src('lodash/*', srcOpts)
      .on('error', console.log)
      // .pipe(app.renderFile('txt'))
      .pipe(through.obj(function(file, enc, next) {
        // console.log(file)
        next(null, file);
      }))
      .on('finish', function() {
        app.ask('git', {force: true}, function(err, init) {

        });
      })
      // .pipe(app.dest(function(file) {
      //   file.basename = file.basename.replace(/^_/, '.');
      //   file.basename = file.basename.replace(/^\$/, '');
      //   return 'foo';
      // }))
  });

  app.task('default', ['init']);
};
