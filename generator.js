'use strict';

module.exports = function(app, base) {
  // base.compose(app, ['base']);
  app.extendWith(base);
  app.addTemplate('package', 'package.json');

  // app.task('install', function(cb) {
  //   base.generators.install.build('default', cb);
  // });

  // app.task('git', function(cb) {
  //   base.generators.git.build('default', cb);
  // });

  app.task('default', ['project']);
};
