'use strict';

var path = require('path');
var through = require('through2');
var extend = require('extend-shallow');
var Questions = require('question-store');
var argv = require('minimist')(process.argv.slice(2));
var wrap = require('word-wrap');
var set = require('set-value');
var chalk = require('chalk');

module.exports = function(app, base, env) {
  var questions = new Questions();
  var dest = argv.dest || process.cwd();

  questions
    .set('name', 'What is the project name?')
    .set('author.name', 'Author name?')
    .set('author.url', 'Author URL?')
    .set('username', 'Author username?')
    .set('description', 'What is the project description?')
    .set('varname', 'varname')
    .set('year', 'What year is it?')

  app.task('copy', function(cb) {
    questions.ask(function(err, answers) {
      answers = toObject(answers);

      app.toStream('templates')
        .pipe(through.obj(function(file, enc, next) {
          file.base = dest;
          file.path = path.join(dest, file.basename);
          file.data = extend({}, file.data, answers);
          next(null, file);
        }))
        .pipe(app.renderFile('text'))
        .pipe(app.dest(rename({dest: dest})))
        .on('error', cb)
        .on('finish', cb);
    });
  });

  app.task('git', function(cb) {
    base.generate('git', function(err) {
      if (err) return cb(err);
      cb();
    });
  });

  app.task('default', ['copy', 'git']);
};

function rename(options) {
  options = options || {};
  return function(file) {
    file.basename = file.basename.replace(/^_/, '.');
    file.basename = file.basename.replace(/^\$/, '');
    return options.dest;
  };
}

function toObject(obj) {
  var data = {};
  for (var key in obj) {
    var val = obj[key];
    set(data, key, val);
  }
  return data;
}

function intro() {
  console.log(chalk.bold('  Head\'s up!'));
  console.log();
  console.log(chalk.gray(wrap('This generator saves time by offering to re-use answers from the previous run. If something is incorrect, no worries! Just provide a new value!')));
  console.log();
}
