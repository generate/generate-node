---
install: 
  dependencies: ['debug', 'is-valid-app']
---
/*!
 * <%= ask('project.name') %> (https://github.com/<%= ask('project.owner') %>/<%= ask('project.name') %>)
 *
 * Copyright (c) <%= year %>, <%= ask('author.name') %>.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('<%= ask("project.name") %>');
var isValid = require('is-valid-app');

module.exports = function(config) {
  return function(app) {
    if (!isValid(app, '<%= ask("project.name") %>')) return;
    debug('initializing "%s", from "%s"', __filename, module.parent.id);

    // do plugin stuff
  };
};
