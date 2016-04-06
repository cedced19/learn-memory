var fs = require('fs');
var bs = require('browser-sync')
var watchify = require('watchify');
var browserify = require('browserify');

var path = function (d) {
  var p = require('path');
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
      proxy: 'http://localhost:7772'
  });

  bs.watch(path('../public/stylesheets/*.css')).on('change', bs.reload);
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
