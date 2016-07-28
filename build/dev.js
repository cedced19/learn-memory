var fs = require('fs');
var bs = require('browser-sync')
var watchify = require('watchify');
var browserify = require('browserify');
var p = require('path');

var path = function (d) {
  return p.resolve(__dirname, d);
};

var b = browserify({ cache: {}, entries: [path('../public/javascripts/index.js')], packageCache: {} });
b.plugin(watchify);

var bundle = function () {
  bs.notify('Compiling...');
  b.bundle().pipe(fs.createWriteStream(path('../public/javascripts/scripts.js')));
  bs.reload();
};

var dev = function () {
  bs.init({
      proxy: 'http://localhost:' + require('env-port')('7772'),
      middleware: [
          {
              route: '/stylesheets/styles.css',
              handle: function (req, res, next) {
                 fs.createReadStream(path('../public/stylesheets/index.css')).pipe(res);
              }
          }
      ]
  });

  bs.watch(path('../public/stylesheets/index.css')).on('change', bs.reload);
  bs.watch(path('../public/views/*.html')).on('change', bs.reload);
  bs.watch(path('../views/*.ejs')).on('change', bs.reload);

  b.on('update', bundle);
  bundle();
};

if (module.parent) {
  module.exports = dev;
} else {
  dev();
}
