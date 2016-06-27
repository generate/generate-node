'use strict';

var path = require('path');
var utils = require('./lib/utils');

module.exports = function plugin(app, base, env, options) {
  if (!utils.isValid(app, 'generate-node')) return;
  var argv = base.get('cache.argv');

  /**
   * Config store for user-defined, generator-specific defaults
   */

  var store = new utils.DataStore('generate-node');

  /**
   * Add task-prompts
   */

  var prompt = utils.prompts(app);

  /**
   * Options (ensure delimiters are what we need)
   */

  app.option({delims: ['<%', '%>']});

  /**
   * Instance plugins
   */

  app.use(require('generate-collections'));
  app.use(require('generate-defaults'));
  app.use(utils.questions());
  app.use(utils.rename());

  /**
   * Register sub-generators
   */

  app.register('mocha', require('generate-mocha'));
  app.register('license', require('generate-license'));
  app.register('git', require('generate-git'));

  /**
   * Middleware for renaming files from templates to their actual destination names.
   */

  app.preWrite(/./, function(file, next) {
    file.basename = file.basename.replace(/^_/, '.').replace(/^\$/, '');
    next();
  });

  /**
   * Listeners
   */

  app.on('ask', function(answerVal, answerKey, question) {
    if (typeof answerVal === 'undefined') {
      var segs = answerKey.split('author.');
      if (segs.length > 1) {
        app.questions.answers[answerKey] = app.common.get(segs.pop());
      }
    }
  });

  /**
   * Generate a `MIT` license file. Runs the `default` task from [generate-license][].
   *
   * ```sh
   * $ gen node:mit
   * ```
   * @name mit
   * @api public
   */

  app.task('license', function(cb) {
    app.generate('license', cb);
  });

  /**
   * Initialize a git repository, and add files and first commit.
   * Runs the `default` task from [generate-git][].
   *
   * ```sh
   * $ gen node:git
   * ```
   * @name git
   * @api public
   */

  app.task('first-commit', function(cb) {
    app.generate('git:first-commit', cb);
  });

  /**
   * Generate a mocha unit test file. Runs the `default` task from [generate-mocha][].
   *
   * ```sh
   * $ gen node:mocha
   * ```
   * @name mocha
   * @api public
   */

  app.task('mocha', function(cb) {
    app.generate('mocha:mocha', app.options, cb);
  });

  /**
   * Install the latest `dependencies` and `devDependencies` in package.json.
   *
   * ```sh
   * $ gen node:npm
   * ```
   * @name npm
   * @api public
   */

  app.task('npm', function(cb) {
    app.npm.devDependencies(function(err) {
      if (err) return cb(err);
      app.npm.dependencies(cb);
    });
  });

  /**
   * Asks you to choose which tasks to run.
   *
   * ```sh
   * $ gen node:tasks
   * ```
   * @name tasks
   * @api public
   */

  app.task('tasks', prompt.chooseTasks('Choose tasks to run:'));

  /**
   * Prompt the user and pass answers to rendering engine to use as context
   * in templates. Specify questions to ask with the `--ask` flag. See
   * [common-questions][] for the complete list of available built-in questions.
   *
   * ```sh
   * $ gen node:prompt
   * # ask all `author` questions
   * $ gen node:prompt --ask=author
   * # ask `author.name`
   * $ gen node:prompt --ask=author.name
   * ```
   * @name prompt
   * @api public
   */

  app.task('prompt-data', function(cb) {
    app.ask(argv.ask || ['load-project', 'author'], function(err, answers) {
      if (err) return cb(err);
      app.data(answers);
      cb();
    });
  });

  /**
   * Asks if you'd like to generate mocha unit tests. Runs the `default` task
   * from [generate-mocha][].
   *
   * ```sh
   * $ gen node:prompt-mocha
   * ```
   * @name prompt-mocha
   * @api public
   */

  app.question('mocha', 'Want to add mocha unit tests?', {type: 'confirm'});
  app.task('prompt-mocha', {silent: true}, prompt.confirm('mocha', ['mocha']));

  /**
   * Asks if you'd like to initialize a git repository (also does git `add` and
   * first commit). If true the [first-commit]() task is run.
   *
   * ```sh
   * $ gen node:prompt-git
   * ```
   * @name prompt-git
   * @api public
   */

  app.question('git', 'Want initialize a git repository?', {type: 'confirm'});
  app.task('prompt-git', {silent: true}, prompt.confirm('git', ['first-commit']));

  /**
   * Asks if you'd like install the latest `devDependencies` in package.json.
   * If true, the [npm](#npm) task is run.
   *
   * ```sh
   * $ gen node:prompt-npm
   * ```
   * @name prompt-npm
   * @api public
   */

  app.question('npm', 'Want to install npm dependencies now?', {type: 'confirm'});
  app.task('prompt-npm', {silent: true}, prompt.confirm('npm', ['npm']));

  /**
   * Asks if you want to save your choices from user prompts and automatically use
   * them without asking again the next time the generator is run. If you change your
   * mind, just run `gen node:choices` and you'll be prompted again.
   *
   * ```sh
   * $ gen node:choices
   * ```
   * @name choices
   * @api public
   */

  app.task('node-choices', {silent: true}, function(cb) {
    app.question('choices', 'Want to use these choices next time?', {type: 'confirm'});
    app.ask('choices', { save: false }, function(err, answers) {
      if (err) return cb(err);
      store.set(answers);
      cb();
    });
  });

  /**
   * Asks if you want to use the same "post-generate" choices next time this generator
   * is run. If you change your mind, just run `gen node:choices` and you'll be prompted
   * again.
   *
   * If `false`, the [prompt-mocha](), [prompt-npm](), and [prompt-git]() tasks will be
   * run after files are generated then next time the generator is run.
   *
   * If `true`, the [mocha](), [npm](), and [git]() tasks will be run (and you will not
   * be prompted) after files are generated then next time the generator is run.
   *
   * ```sh
   * $ gen node:post-generate
   * ```
   * @name post-generate
   * @api public
   */

  app.task('generate-project', {silent: true}, function(cb) {
    var choices = store.get('choices') || options.choices;

    // user wants to skip prompts
    if (choices === true) {
      app.build(['license', 'mocha', 'npm', 'first-commit'], cb);

    // user wants to be prompted (don't ask about choices again)
    } else if (choices === false) {
      app.build(['license', 'prompt-!(data)'], cb);

    // user hasn't been asked yet
    } else {
      app.build(['license', 'prompt-!(data)', 'node-choices'], cb);
    }
  });

  /**
   * Pre-load templates (needs to be done after collections are created)
   */

  app.task('templates', {silent: true}, function(cb) {
    app.templates('*', {
      cwd: path.resolve(__dirname, 'templates'),
      renameKey: function(key, file) {
        return file ? file.basename : path.basename(key);
      }
    });
    cb();
  });

  /**
   * Generate a complete a node.js project, with all of the necessary files included.
   *
   * _(Note that this task does not initialize a [git](#git) repository, generate [mocha]()
   * unit tests or install [npm]() dependencies. If you want these things you can either
   * run the [default task](#default), or run the tasks individually.)_
   *
   * ```sh
   * $ gen node:project
   * ```
   * @name project
   * @api public
   */

  app.task('load-project', ['templates'], function(cb) {
    var dest = app.options.dest || app.cwd;

    base.data(app.cache.data);

    app.toStream('templates', filter(app.options))
      .pipe(app.renderFile('*', app.cache.data))
      .pipe(app.dest(dest))
      .on('error', cb)
      .on('end', cb);
  });

  /**
   * Generate a complete node.js project, then optionally install npm dependecies,
   * mocha unit tests, and initialize a git repository.
   *
   * ```sh
   * $ gen node
   * # or
   * $ gen node:default
   * ```
   * @name default
   * @api public
   */

  app.task('default', {silent: true}, ['load-project', 'generate-project']);
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
