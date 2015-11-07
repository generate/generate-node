
function Logger(options) {
  this.options = options || {};
  this.colors = {};
  this.styles = {};
  this.levels = {};
  this.icons = {};
  this.data = {};
}

Logger.prototype.icon = function(name, str) {
  if (this.options.icons === false) {
    str = '';
  }
  this.icons[name] = str + ' ';
  return this;
};

Logger.prototype.color = function(name, fn) {
  fn.__proto__ = this;
  this[name] = fn;
  return this;
};

Logger.prototype.style = function(name, color, icon) {
  this.styles[name] = {
    color: color,
    icon: icon || name
  };
  return this;
};

Logger.prototype.level = function(num, name, style) {
  if (arguments.length === 1) {
    return this.levels[num];
  }
  this.levels[num] = {
    name: name,
    style: this.styles[style]
  };
  return this;
};

Logger.prototype.create = function(name, level, template) {
  var lvl = this.level(level);
  var fn = this[lvl.style.color];
  var icon = this.icons[lvl.style.icon];

  this[name] = function() {
    var args = [].slice.call(arguments);
    if (template) {
      args.unshift(fn(icon + template));
    } else {
      args.unshift(fn(icon));
    }
    return console.log.apply(console, args);
  }.bind(this);
  return this;
};


var logger = new Logger();

logger.icon('success', require('success-symbol'));
logger.icon('info', require('info-symbol'));
logger.icon('error', require('error-symbol'));
logger.icon('warning', require('warning-symbol'));

logger.color('green', require('ansi-green'));
logger.color('cyan', require('ansi-cyan'));
logger.color('red', require('ansi-red'));
logger.color('yellow', require('ansi-yellow'));
logger.color('gray', require('ansi-gray'));
logger.color('bold', require('ansi-bold'));

logger.style('success', 'green');
logger.style('info', 'cyan');
logger.style('error', 'red');
logger.style('warning', 'yellow');

logger.level(0, 'FATAL', 'error');
logger.level(1, 'ERROR', 'error');
logger.level(2, 'WARNING', 'warning');
logger.level(4, 'SUCCESS', 'success');
logger.level(5, 'INFO', 'info');

logger.create('ok', 4, 'success!');
logger.create('done', 4, 'done! %s');

console.log(logger.cyan.bold.red.cyan('foo'))
logger.ok('foo', 'bar')
