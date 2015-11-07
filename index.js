'use strict';

var re = /<%-([\s\S]+?)%>|<%=([\s\S]+?)%>|\$\{([^\\}]*(?:\\.[^\\}]*)*)\}|<%([\s\S]+?)%>|$/g;

function detect(str, data) {
  var matches = str.match(re);

  console.log(matches)
}

/**
 * Expose detect
 */

module.exports = detect;
