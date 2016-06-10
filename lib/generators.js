'use strict';

var generators = module.exports = require('lazy-cache')(require);
var fn = require;
require = generators;

/**
 * Lazily required module dependencies
 */

require('generate-collections', 'collections');
require('generate-defaults', 'defaults');
require('generate-git', 'git');
require('generate-license', 'license');
require('generate-mocha', 'mocha');

require = fn;

