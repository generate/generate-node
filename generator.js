'use strict';

var utils = require('./lib/utils');
var path = require('path');

module.exports = function plugin(app, base) {
  if (!app.isApp && !app.isGenerator) {
    return;
  }
  if (app.isRegistered('generate-node')) {
    return;
  }

  app.debug('initializing generate-node');

  /**
   * Options (merge `base` instance options onto our
   * generator's options)
   */

  app.option(base.options);
  app.option({delims: ['<%', '%>']});

  /**
   * Instance plugins
   */

  // app.use(require('generate-ask'));
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
   * Prompt the user for the `dest` to use
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
   * Initiate a prompt session that asks the user
   * which files to write to disk.
   */

  app.task('choose', ['templates', 'dest'], function(cb) {
    app.chooseFiles(app.options, cb);
  });

  /**
   * Prompt for data to be used as context in templates
   */

  app.task('questions', function(cb) {
    app.ask(function(err, answers) {
      if (err) return cb(err);
      app.data(answers);
      cb();
    });
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
   * Task prompts
   */

  app.task('tasks', prompt.chooseTasks('Choose tasks to run:'));

  app.confirm('git', 'Want initialize a git repository?');
  app.task('git', prompt.confirm('git', ['generate-git:ask']));

  app.confirm('mocha', 'Want to add mocha unit tests?');
  app.task('mocha', prompt.confirm('mocha', ['generate-mocha']));

  /**
   * Ask the user if they want to install deps
   */

  app.task('npm', function(cb) {
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
   * Default question
   */

  app.task('default', ['node', 'mocha', 'npm', 'git']);
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
