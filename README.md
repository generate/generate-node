# generate-node [![NPM version](https://img.shields.io/npm/v/generate-node.svg?style=flat)](https://www.npmjs.com/package/generate-node) [![NPM downloads](https://img.shields.io/npm/dm/generate-node.svg?style=flat)](https://npmjs.org/package/generate-node) [![Build Status](https://img.shields.io/travis/generate/generate-node.svg?style=flat)](https://travis-ci.org/generate/generate-node)

Generate a node.js project, with everything you need to begin writing code and easily publish the project to npm.

## TOC

- [What is generate?](#what-is-generate)
- [CLI](#cli)
- [Usage as a sub-generator](#usage-as-a-sub-generator)
- [Usage as a plugin](#usage-as-a-plugin)
- [Tasks](#tasks)
- [API](#api)
  * [Install](#install)
  * [Usage](#usage)
- [Docs](#docs)
  * [CLI](#cli-1)
  * [Tasks](#tasks-1)
  * [API](#api-1)
- [Related projects](#related-projects)
- [Contributing](#contributing)
- [Building docs](#building-docs)
- [Running tests](#running-tests)
- [Author](#author)
- [License](#license)

_(TOC generated by [verb](https://github.com/verbose/verb) using [markdown-toc](https://github.com/jonschlinkert/markdown-toc))_

## What is generate?

Generate is a new, open source developer framework for rapidly initializing and scaffolding out new code projects, offering an intuitive CLI, and a powerful and expressive API that makes it easy and enjoyable to use.

Visit the [getting started guide](https://github.com/generate/getting-started) or the [generate](https://github.com/generate/generate) project and documentation to learn more.

## CLI

**Installing the CLI**

To run the `node` generator from the command line, you'll need to install [generate](https://github.com/generate/generate) globally first. You can that now with the following command:

```sh
$ npm i -g generate
```

This adds the `gen` command to your system path, allowing it to be run from any directory. Visit the [generate](https://github.com/generate/generate) project and documentation to learn more.

**Run the `node` generator from the command line**

Once both [generate](https://github.com/generate/generate) and `generate-node` are installed globally, you can run the generator with the following command:

Run the `node` generator from the command line:

```sh
$ gen node
```

## Usage as a sub-generator

You can use generate-node as a [sub-generator](https://github.com/generate/generate){docs/sub-generators}. See the [generate](https://github.com/generate/generate) docs for more details.

```js
app.register('foo', require('generate-node'));
```

This adds the namespace `foo` to

## Usage as a plugin

Extend your generator with the features and settings of this generator.

**Example**

```js
app.use(require('generate-node'));

// use any task from `generate-node`!
app.task('default', ['files']);
```

## Tasks

### [mit](generator.js#L78)

Generate a `MIT` license file. Runs the `default` task from [generate-license](https://github.com/generate/generate-license).

**Example**

```sh
$ gen node:mit
```

### [git](generator.js#L93)

Initialize a git repository, and add files and first commit. Runs the `default` task from [generate-git](https://github.com/generate/generate-git).

**Example**

```sh
$ gen node:git
```

### [mocha](generator.js#L107)

Generate a mocha unit test file. Runs the `default` task from [generate-mocha](https://github.com/generate/generate-mocha).

**Example**

```sh
$ gen node:mocha
```

### [npm](generator.js#L121)

Install the latest `dependencies` and `devDependencies` in package.json.

**Example**

```sh
$ gen node:npm
```

### [tasks](generator.js#L138)

Asks you to choose which tasks to run.

**Example**

```sh
$ gen node:tasks
```

### [prompt](generator.js#L156)

Prompt the user and pass answers to rendering engine to use as context in templates. Specify questions to ask with the `--ask` flag. See [common-questions](https://github.com/generate/common-questions) for the complete list of available built-in questions.

**Example**

```sh
$ gen node:prompt
# ask all `author` questions
$ gen node:prompt --ask=author
# ask `author.name`
$ gen node:prompt --ask=author.name
```

### [prompt-mocha](generator.js#L175)

Asks if you'd like to generate mocha unit tests. Runs the `default` task from [generate-mocha](https://github.com/generate/generate-mocha).

**Example**

```sh
$ gen node:prompt-mocha
```

### [prompt-git](generator.js#L189)

Asks if you'd like to initialize a git repository (also does git `add` and first commit). If true the [first-commit](#first-commit) task is run.

**Example**

```sh
$ gen node:prompt-git
```

### [prompt-npm](generator.js#L203)

Asks if you'd like install the latest `devDependencies` in package.json. If true, the [npm](#npm) task is run.

**Example**

```sh
$ gen node:prompt-npm
```

### [choices](generator.js#L218)

Asks if you want to save your choices from user prompts and automatically use them without asking again the next time the generator is run. If you change your mind, just run `gen node:choices` and you'll be prompted again.

**Example**

```sh
$ gen node:choices
```

### [post-generate](generator.js#L245)

Asks if you want to use the same "post-generate" choices next time this generator is run. If you change your mind, just run `gen node:choices` and you'll be prompted again.

If `false`, the [prompt-mocha](#prompt-mocha), [prompt-npm](#prompt-npm), and [prompt-git](#prompt-git) tasks will be
run after files are generated then next time the generator is run.
If `true`, the [mocha](#mocha), [npm](#npm), and [git](#git) tasks will be run (and you will not
be prompted) after files are generated then next time the generator is run.

**Example**

```sh
$ gen node:post-generate
```

### [project](generator.js#L290)

Generate a complete a node.js project, with all of the necessary files included.

_(Note that this task does not initialize a [git](#git) repository, generate [mocha](#mocha)
unit tests or install [npm](#npm) dependencies. If you want these things you can either
run the [default task](#default), or run the tasks individually.)_

**Example**

```sh
$ gen node:project
```

### [default](generator.js#L315)

Generate a complete node.js project, then optionally install npm dependecies, mocha unit tests, and initialize a git repository.

**Example**

```sh
$ gen node
# or
$ gen node:default
```

## API

To use this generator as a node.js module, as a plugin or sub-generator, you must first install the generator locally.

### Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install generate-node
```

### Usage

Then use in your project:

```js
var node = require('generate-node');
```

**Use as a plugin**

In your [generate](https://github.com/generate/generate) project:

```js
var generate = require('generate');
var app = generate();

app.use(node);
```

**Use as a generator plugin**

In your [generate](https://github.com/generate/generate) generator:

```js
module.exports = function(app) {
  app.use(node);
};
```

**Use as a sub-generator**

In your [generate](https://github.com/generate/generate) generator:

```js
module.exports = function(app) {
  // name the sub-generator whatever you want
  app.register('foo', require('generate-node'));
};
```

## Docs

### CLI

**Installing the CLI**

To run the `node` generator from the command line, you'll need to install [generate](https://github.com/generate/generate) globally first. You can do that now with the following command:

```sh
$ npm i -g generate
```

This adds the `gen` command to your system path, allowing it to be run from any directory.

**Help**

Get general help and a menu of available commands:

```sh
$ gen help
```

**Running the `node` generator**

Once both [generate](https://github.com/generate/generate) and `generate-node` are installed globally, you can run the generator with the following command:

```sh
$ gen node
```

If completed successfully, you should see both `starting` and `finished` events in the terminal, like the following:

```sh
[00:44:21] starting ...
...
[00:44:22] finished ✔
```

If you do not see one or both of those events, please [let us know about it](../../issues).

### API

This updater can also be used as a node.js library in your own updater. To do so you must first install generate-node locally.

**Install**

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save generate-node
```

**Use as a plugin in your generator**

Use as a plugin if you want to extend your own generator with the features, settings and tasks of generate-node, as if they were created on your generator.

In your `generator.js`:

```js
module.exports = function(app) {
  app.use(require('generate-node'));

  // specify any tasks from generate-node. Example:
  app.task('default', ['node']);
};
```

**Use as a sub-generator**

Use as a sub-generator if you want expose the features, settings and tasks from generate-node on a _namespace_ in your generator.

In your `generator.js`:

```js
module.exports = function(app) {
  // register the generate-node generator (as a sub-generator with an arbitrary name)
  app.register('foo', require('generate-node'));

  app.task('minify', function(cb) {
    // minify some stuff
    cb();
  });

  // run the "default" task on generate-node (aliased as `foo`), 
  // then run the `minify` task defined in our generator
  app.task('default', function(cb) {
    app.generate(['foo:default', 'minify'], cb);
  });
};
```

Tasks from `generate-node` will be available on the `foo` namespace from the API and the command line. Continuing with the previous code example, to run the `default` task on `generate-node`, you would run `gen foo:default` (or just `gen foo` if `foo` does not conflict with an existing task on your generator).

To learn more about namespaces and sub-generators, and how they work, [visit the getting started guide](https://github.com/generate/getting-started).

## Related projects

You might also be interested in these projects:

* [generate](https://www.npmjs.com/package/generate): The Santa Claus machine for GitHub projects. Scaffolds out new projects, or creates any kind… [more](https://github.com/generate/generate) | [homepage](https://github.com/generate/generate "The Santa Claus machine for GitHub projects. Scaffolds out new projects, or creates any kind of required file or document from any given templates or source materials.")
* [generate-git](https://www.npmjs.com/package/generate-git): Generator for initializing a git repository and adding first commit. | [homepage](https://github.com/generate/generate-git "Generator for initializing a git repository and adding first commit.")
* [generate-license](https://www.npmjs.com/package/generate-license): Generate a license file for a GitHub project. | [homepage](https://github.com/generate/generate-license "Generate a license file for a GitHub project.")
* [generate-mocha](https://www.npmjs.com/package/generate-mocha): Generate mocha test files. | [homepage](https://github.com/generate/generate-mocha "Generate mocha test files.")

## Contributing

This document was generated by [verb-readme-generator](https://github.com/verbose/verb-readme-generator) (a [verb](https://github.com/verbose/verb) generator), please don't edit directly. Any changes to the readme must be made in [.verb.md](.verb.md). See [Building Docs](#building-docs).

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new). Or visit the [verb-readme-generator](https://github.com/verbose/verb-readme-generator) project to submit bug reports or pull requests for the readme layout template.

## Building docs

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-readme-generator && verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on June 15, 2016._