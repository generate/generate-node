'use strict';

process.env.GENERATE_CLI = true;

require('mocha');
var assert = require('assert');
var assemble = require('assemble');
var cwd = require('base-cwd');
var questions = require('base-questions');
var generators = require('base-generators');
var generator = require('..');
var app;

describe('usage with assemble', function() {
  this.slow(300);

  beforeEach(function() {
    app = assemble({silent: true});
    app.use(cwd());
    app.use(questions());
    app.use(generators());
  });

  describe('plugin', function() {
    it('should only register the plugin once', function(cb) {
      var count = 0;
      app.on('plugin', function(name) {
        if (name === 'generate-node') {
          count++;
        }
      });
      app.use(generator);
      app.use(generator);
      app.use(generator);
      assert.equal(count, 1);
      cb();
    });
  });

  describe('generator', function() {
    it('should add a generator to the instance', function(cb) {
      app.use(generator);
      assert.equal(typeof app.files, 'function');
      assert.equal(typeof app.includes, 'function');
      assert.equal(typeof app.layouts, 'function');
      cb();
    });

    it('should create custom collections passed on app options', function() {
      app.option({
        create: {
          snippet: { viewType: 'partial' },
          section: { viewType: 'partial' },
          block: { viewType: 'layout' }
        }
      });

      app.generator('foo', function(foo) {
        foo.use(generator);
        assert(foo.views.hasOwnProperty('snippets'));
        assert(foo.views.hasOwnProperty('sections'));
        assert(foo.views.hasOwnProperty('blocks'));
      });
    });

    it('should create custom collections passed on generator options', function() {
      app.generator('foo', function(foo) {
        foo.option({
          create: {
            snippet: { viewType: 'partial' },
            section: { viewType: 'partial' },
            block: { viewType: 'layout' }
          }
        });
        foo.use(generator);
        assert(foo.views.hasOwnProperty('snippets'));
        assert(foo.views.hasOwnProperty('sections'));
        assert(foo.views.hasOwnProperty('blocks'));
      });
    });

    it('should extend a generator', function(cb) {
      app.generator('foo', function(foo) {
        foo.use(generator);
        assert(foo.views.hasOwnProperty('files'));
        assert(foo.views.hasOwnProperty('layouts'));
        assert(foo.views.hasOwnProperty('includes'));
        cb();
      });
    });

    it('should not change layouts defined on layouts', function(cb) {
      app.generator('foo', function(app) {
        app.extendWith(generator);
        app.engine('*', require('engine-base'));

        app.task('render', function(cb) {
          app.layout('default', {content: 'one {% body %} two'});
          app.layout('base', {content: 'three {% body %} four', layout: 'default'});
          app.file('foo.md', {content: 'this is foo', layout: 'base'});

          app.toStream('files')
            .pipe(app.renderFile('*'))
            .pipe(app.dest('test/actual'))
            .on('end', cb);
        });

        app.build('render', function(err) {
          if (err) return cb(err);
          assert.equal(app.layouts.getView('base').layout, 'default');
          assert.equal(app.files.getView('foo').layout, 'base');
          cb();
        });
      });
    });

    it('should set layout to `empty` on renderable templates with no layout', function(cb) {
      app.generator('foo', function(app) {
        app.extendWith(generator);
        app.engine('*', require('engine-base'));

        app.task('render', function(cb) {
          app.layout('default', {content: '{% body %}'});
          app.file('foo.md', {content: 'this is foo'});

          app.toStream('files')
            .pipe(app.renderFile('*'))
            .pipe(app.dest('test/actual'))
            .on('end', cb);
        });

        app.build('render', function(err) {
          if (err) return cb(err);

          assert.equal(app.files.getView('foo').layout, 'empty');
          cb();
        });
      });
    });
  });
});
