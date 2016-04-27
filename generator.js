'use strict';

var path = require('path');
var utils = require('./lib/utils');

module.exports = function plugin(app, base) {
  if (utils.isRegistered(app, 'node')) return;

  /**
   * Options (merge `base` instance options onto our
   * generator's options)
   */

  app.option(base.options);
  app.option({delims: ['<%', '%>']});

  /**
   * Instance plugins
   */

  app.use(require('generate-collections'));
  app.use(require('generate-defaults'));
  app.use(require('generate-license'));
  app.use(utils.conflicts());
  app.use(utils.questions());
  app.use(utils.rename());
  app.use(utils.files());
  app.use(utils.npm());

  /**
   * Task-prompt
   */

  var prompt = utils.prompts(app);

  /**
   * Pre-load templates (needs to be done after collections are created)
   */

  app.task('templates', { silent: true }, ['mit'], function(cb) {
    app.debug('loading templates');
    app.templates('*', {
      cwd: path.resolve(__dirname, 'templates'),
      renameKey: function(key, file) {
        return file ? file.basename : path.basename(key);
      }
    });
    app.debug('loaded templates');
    cb();
  });

  /**
   * Write files to the user's cwd or chosen directory
   */

  app.task('node', ['templates', 'dest'], function() {
    app.debug('generating files from templates');
    var dest = app.options.dest || app.cwd;

    return app.toStream('templates', filter(app.options))
      .pipe(app.renderFile('*', getAlias(app)))
      .pipe(app.conflicts(dest))
      .pipe(app.dest(dest));
  });

  /**
   * Runs the `default` task from [generate-git][] to initialize a git repository.
   * Also `git add`s and does first commit.
   *
   * ```sh
   * $ gen node:git
   * ```
   * @name git
   * @api public
   */

  app.task('git', function(cb) {
    app.generate('generate-git', cb);
  });

  /**
   * Generate a mocha unit test file.
   *
   * ```sh
   * $ gen node:mocha
   * ```
   * @name mocha
   * @api public
   */

  app.task('mocha', function(cb) {
    app.generate('generate-mocha', cb);
  });

  /**
   * Install the latest `devDependencies` in package.json.
   *
   * ```sh
   * $ gen node:npm
   * ```
   * @name npm
   * @api public
   */

  app.task('npm', function(cb) {
    app.npm.latest(cb);
  });

  /**
   * Prompt the user and use answers as context in templates
   *
   * ```sh
   * $ gen node:ask
   * ```
   * @name ask
   * @api public
   */

  app.task('ask', function(cb) {
    app.ask(function(err, answers) {
      if (err) return cb(err);
      app.data(answers);
      cb();
    });
  });

  /**
   * Prompt the user to choose which tasks to run.
   *
   * ```sh
   * $ gen node:tasks
   * ```
   * @name tasks
   * @api public
   */

  app.task('tasks', prompt.chooseTasks('Choose tasks to run:'));

  /**
   * Prompt the user to choose which files to write to disk.
   *
   * ```sh
   * $ gen node:files
   * ```
   * @name files
   * @api public
   */

  app.task('files', ['templates', 'dest'], function(cb) {
    app.chooseFiles(app.options, cb);
  });

  /**
   * Prompts the user for the `dest` to use. This is called by the `default` task.
   *
   * ```sh
   * $ gen node:dest
   * ```
   * @name dest
   * @api public
   */

  app.task('dest', { silent: true }, function(cb) {
    app.question('dest', 'Destination directory?', {default: '.'});
    app.ask('dest', {save: false}, function(err, answers) {
      if (err) return cb(err);
      app.option('dest', answers.dest);
      cb();
    });
  });

  /**
   * Prompt to generate mocha unit tests. Runs the `default` task from [generate-mocha][].
   *
   * ```sh
   * $ gen node:prompt-mocha
   * ```
   * @name prompt-mocha
   * @api public
   */

  app.confirm('mocha', 'Want to add mocha unit tests?');
  app.task('prompt-mocha', prompt.confirm('mocha', ['generate-mocha']));

  /**
   * Prompt to initialize a git repository (also does git add and first commit).
   * Runs the `ask` task from [generate-git][].
   *
   * ```sh
   * $ gen node:prompt-git
   * ```
   * @name prompt-git
   * @api public
   */

  app.confirm('git', 'Want initialize a git repository?');
  app.task('prompt-git', prompt.confirm('git', ['generate-git:ask']));

  /**
   * Prompt to install the latest `devDependencies` in package.json.
   *
   * ```sh
   * $ gen node:prompt-npm
   * ```
   * @name prompt-npm
   * @api public
   */

  app.task('prompt-npm', function(cb) {
    app.confirm('npm', 'Want to install npm dependencies now?');
    app.ask('npm', {save: false}, function(err, answers) {
      if (err) return cb(err);
      if (answers.npm === true) {
        app.npm.latest(cb);
      } else {
        cb();
      }
    });
  });

  /**
   * Runs the `default` task to generate complete a node.js project, with
   * all of the necessary files included. Runs the [prompt-mocha](), [prompt-npm](), and
   * [prompt-git]() tasks as task-dependencies.
   *
   * ```sh
   * $ gen node
   * ```
   * @name default
   * @api public
   */

  app.task('default', ['node', 'prompt-mocha', 'prompt-npm', 'prompt-git']);
  return plugin;
};

/**
 * Filter files to be rendered
 */

function filter(opts) {
  if (Array.isArray(opts.files)) {
    return opts.files;
  }
  if (typeof opts.filter === 'function') {
    return opts.filter;
  }
  return function() {
    return true;
  };
}

function getAlias(app) {
  if (app.cache.data.alias) {
    return {alias: app.cache.data.alias};
  }
  return {alias: app.cache.data.name};
}
