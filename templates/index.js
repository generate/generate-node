/*!
 * <%= ask('name') %> (https://github.com/<%= ask('owner') %>/<%= ask('name') %>)
 *
 * Copyright (c) <%= year %>, <%= ask('author.name') %>.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('<%= name %>');

module.exports = function(config) {
  return function(app) {
    if (this.isRegistered('<%= name %>')) return;

    this.define('<%= alias %>', function() {
      debug('running <%= alias %>');
      
    });
  };
};
