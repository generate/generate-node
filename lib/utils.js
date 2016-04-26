'use strict';

var utils = module.exports = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('generate-ask');
require('generate-collections');
require('generate-defaults');
require('generate-license');
require('common-middleware', 'middleware');
require('common-questions', 'questions');

require('base-npm', 'npm');
require('base-fs-conflicts', 'conflicts');
require('base-fs-rename', 'rename');
require('task-prompts', 'prompts');
require('define-property', 'define');
require('engine-base', 'engine');
require('isobject', 'isObject');
require('mixin-deep', 'merge');
require('namify');
require('parse-git-config', 'git');
require('parse-github-url');
require = fn;

utils.files = require('./files');
