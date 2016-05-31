/*!
 * <%= ask('project.name') %> (https://github.com/<%= ask('project.owner') %>/<%= ask('project.name') %>)
 *
 * Copyright (c) <%= year %>, <%= ask('author.name') %>.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('<%= ask("project.name") %>');

module.exports = function(config) {
  return function(app) {
    if (this.isRegistered('<%= ask("project.name") %>')) return;
    debug('initializing "%s", from "%s"', __filename, module.parent.id);

    this.define('<%= ask("project.alias") %>', function() {
      debug('running <%= ask("project.alias") %>');
      
    });
  };
};
