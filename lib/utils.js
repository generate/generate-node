'use strict';

var utils = module.exports = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('common-middleware', 'middleware');
require('common-questions', 'questions');

require('base-fs-conflicts', 'conflicts');
require('base-fs-rename', 'rename');
require('extend-shallow', 'extend');
require('task-prompts', 'prompts');
require('define-property', 'define');
require('isobject', 'isObject');
require('is-valid-app', 'isValid');
require('kind-of', 'typeOf');
require('mixin-deep', 'merge');
require('namify');
require('parse-git-config', 'git');
require('parse-github-url');
require('through2', 'through');
require = fn;

utils.files = require('./files');
utils.renameFile = require('./rename');
