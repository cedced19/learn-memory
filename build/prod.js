var fs = require('fs');
var browserify = require('browserify');
var uglifyify = require('uglifyify');

var path = function (d) {
  var p = require('path');
  return p.resolve(__dirname, d);
};

var b = browserify({ cache: {}, entries: [path('../public/javascripts/index.js')], packageCache: {} });
b.transform({
    global: true,
    sourcemap: false
}, 'uglifyify');

var prod = function () {
  b.bundle().pipe(fs.createWriteStream(path('../public/javascripts/scripts.js')));
};

if (module.parent) {
  module.exports = prod;
} else {
  prod();
}
