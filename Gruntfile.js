var path = require('path');
module.exports = function(grunt) {

  var config = {
  concat: {
    main: {
    files: [
        {
          src: ['assets/js/angular.min.js', 'assets/js/angular-sanitize.min.js', 'assets/js/markdown/angular-marked.js', 'assets/js/markdown/marked.js', 'assets/js/app.js'],
          dest: '.tmp/public/js/scripts.js'
        }
      ]
    }
  },
  cssmin: {
        main: {
          files: {
            '.tmp/styles/styles.css': ['.tmp/styles/styles.css']
          }
        }
  },
  uglify:{
      options :  {
        mangle :  false
      },
      main: {
        files: [
              {
                dest: '.tmp/js/scripts.js',
                src: [ '.tmp/js/scripts.js' ]
                },
               ]
             }
       },
    copy:{
      main: {
        files: [{
          expand: true,
          cwd: './assets',
          src: ['**/*.*'],
          dest: '.tmp/public'
        }]
      }
    },
    watch: {
      scripts: {
        files: 'assets/js/*.js',
        tasks: ['concat', 'uglify'],
        options: {
          interrupt: true
        }
      },
      styles: {
        files: 'assets/styles/*.css',
        tasks: ['uncss', 'cssmin'],
        options: {
          interrupt: true
        }
      }
    },
  uncss: {
      main: {
        options: {
          stylesheets  : ['../assets/styles/bootstrap.css', '../assets/styles/main.css'],
        },
        files: {
            '.tmp/public/styles/styles.css': ['views/homepage.ejs']
        }
      }
  }
};

  grunt.initConfig(config);

  // Load all Grunt tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-watch');

  grunt.registerTask('prod', ['copy', 'concat', 'uglify', 'uncss', 'cssmin']);
  grunt.registerTask('default', ['prod', 'watch']);
};