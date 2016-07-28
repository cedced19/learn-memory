var fs = require('fs');
var path = require('path');
var browserify = require('browserify');
var uglifyify = require('uglifyify');
var cssmin = require('clean-css');

var prod = function () {
    var b = browserify({ cache: {}, entries: [path.resolve(__dirname, '../public/javascripts/index.js')], packageCache: {} });
    b.transform({
        global: true,
        sourcemap: false
    }, 'uglifyify');
    b.bundle().pipe(fs.createWriteStream(path.resolve(__dirname, '../public/javascripts/scripts.js')));

    var source = fs.readFileSync(path.resolve(__dirname, '../public/stylesheets/index.css'));
    var minified = new cssmin().minify(source).styles;
    fs.writeFileSync(path.resolve(__dirname, '../public/stylesheets/styles.css'), minified, 'utf8');
};


if (module.parent) {
  module.exports = prod;
} else {
  prod();
}
