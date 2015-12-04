'use strict';

var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var utils = require('./utils');

module.exports = function(app, base, env) {
  var dest = argv.dest || process.cwd();
  var questions = utils.questions(argv);

  /**
   * Add `year` to the context
   */

  this.data({year: new Date().getFullYear()});

  /**
   * Questions (answers are used to populate templates)
   */

  questions
    .setDefault('author.name', 'Author\'s name?')
    .setDefault('author.url', 'Author\'s URL?')
    .setDefault('author.username', 'Author\'s GitHub username?');

  questions
    .set('name', 'What is the project name?', {
      default: utils.projectName(process.cwd()),
      force: argv.init
    })
    .set('description', 'Project description?', {
      default: 'My amazing node.js project.',
      force: argv.init
    });

  /**
   * Tasks
   */

  app.task('files', function(cb) {
    intro(argv);

    questions.ask(function(err, answers) {
      if (err) return cb(err);
      answers.varname = utils.namify(answers.name);

      app.toStream('templates')
        .pipe(getAnswers(dest, answers))
        .on('error', cb)
        .pipe(app.renderFile('text'))
        .on('error', cb)
        .pipe(app.dest(rename({
          dest: dest
        })))
        .on('error', cb)
        .on('finish', cb);
    });
  });

  app.task('default', ['files']);
};

/**
 * Pass answers to templates as context
 */

function getAnswers(dest, answers) {
  answers = expandProps(answers);

  return utils.through.obj(function(file, enc, next) {
    file.base = dest;
    file.path = path.join(dest, file.basename);
    file.data = utils.extend({}, file.data, answers);
    next(null, file);
  });
}

/**
 * Rename template files
 */

function rename(options) {
  options = options || {};
  return function(file) {
    file.basename = file.basename.replace(/^_/, '.');
    file.basename = file.basename.replace(/^\$/, '');
    return options.dest;
  };
}

/**
 * Expand dot-notation in object paths.
 *
 * @param {Object} obj
 * @return {Object}
 */

function expandProps(obj) {
  var data = {};
  for (var key in obj) {
    utils.set(data, key, obj[key]);
  }
  return data;
}

function intro() {
  console.log();
  console.log(utils.chalk.bold('  Hi there!'));
  console.log();
  console.log(utils.wrap('Looks like your first time running the "node" generator. '));
  console.log();
  console.log(utils.wrap('This generator saves time by offering to re-use answers from the previous run. If something is incorrect, no worries! Just provide a new value!'));
  console.log();
}
