# generate-node [![NPM version](https://img.shields.io/npm/v/generate-node.svg?style=flat)](https://www.npmjs.com/package/generate-node) [![NPM downloads](https://img.shields.io/npm/dm/generate-node.svg?style=flat)](https://npmjs.org/package/generate-node) [![Build Status](https://img.shields.io/travis/generate/generate-node.svg?style=flat)](https://travis-ci.org/generate/generate-node)

Generate a node.js project, with everything you need to begin writing code and easily publish the project to npm.

## Install

Install globally with [npm](https://www.npmjs.com/)

```sh
$ npm install -g generate-node
```

## CLI

Run the `node` generator from the command line:

```sh
$ gen node
```

## Tasks

### [git](generator.js#L77)

Runs the `default` task from [generate-git](https://github.com/generate/generate-git) to initialize a git repository. Also `git add`s and does first commit.

**Example**

```sh
$ gen node:git
```

### [mocha](generator.js#L91)

Generate a mocha unit test file.

**Example**

```sh
$ gen node:mocha
```

### [npm](generator.js#L105)

Install the latest `devDependencies` in package.json.

**Example**

```sh
$ gen node:npm
```

### [ask](generator.js#L119)

Prompt the user and use answers as context in templates

**Example**

```sh
$ gen node:ask
```

### [tasks](generator.js#L137)

Prompt the user to choose which tasks to run.

**Example**

```sh
$ gen node:tasks
```

### [files](generator.js#L149)

Prompt the user to choose which files to write to disk.

**Example**

```sh
$ gen node:files
```

### [dest](generator.js#L163)

Prompts the user for the `dest` to use. This is called by the `default` task.

**Example**

```sh
$ gen node:dest
```

### [prompt-mocha](generator.js#L182)

Prompt to generate mocha unit tests. Runs the `default` task from [generate-mocha](https://github.com/generate/generate-mocha).

**Example**

```sh
$ gen node:prompt-mocha
```

### [prompt-git](generator.js#L196)

Prompt to initialize a git repository (also does git add and first commit). Runs the `ask` task from [generate-git](https://github.com/generate/generate-git).

**Example**

```sh
$ gen node:prompt-git
```

### [prompt-npm](generator.js#L209)

Prompt to install the latest `devDependencies` in package.json.

**Example**

```sh
$ gen node:prompt-npm
```

### [default](generator.js#L233)

Runs the `default` task to generate complete a node.js project, with all of the necessary files included. Runs the [prompt-mocha](#prompt-mocha), [prompt-npm](#prompt-npm), and [prompt-git](#prompt-git) tasks as task-dependencies.

**Example**

```sh
$ gen node
```

## API

To use this generator programmatically, as a plugin or sub-generator, you must first install the generator locally.

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

app.use(node());
```

**Use as a generator plugin**

In your [generate](https://github.com/generate/generate) generator:

```js
module.exports = function(app) {
  app.use(node());
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

## Related projects

You might also be interested in these projects:

* [generate-git](https://www.npmjs.com/package/generate-git): Generator for initializing a git repository and adding first commit. | [homepage](https://github.com/generate/generate-git)
* [generate-license](https://www.npmjs.com/package/generate-license): Generate a license file for a GitHub project. | [homepage](https://github.com/generate/generate-license)
* [generate-mocha](https://www.npmjs.com/package/generate-mocha): Generate mocha test files. | [homepage](https://github.com/generate/generate-mocha)
* [generate](https://www.npmjs.com/package/generate): Fast, composable, highly extendable project generator with a user-friendly and expressive API. | [homepage](https://github.com/generate/generate)

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/generate/generate-node/issues/new).

## Building docs

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install verb && npm run docs
```

Or, if [verb](https://github.com/verbose/verb) is installed globally:

```sh
$ verb
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
Released under the [MIT license](https://github.com/generate/generate-node/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on April 26, 2016._