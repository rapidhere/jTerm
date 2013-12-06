module.exports = function(grunt) {
  grunt.initConfig({
    'pkg': grunt.file.readJSON('./package.json'),

    'jshint': {
      all: [
        'Gruntfile.js',
        'src/**/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    'clean': ['dist', 'tmp'],

    'simple-commonjs': {
      all: {
        options: {
          main: 'src/jterm.js',
        },
        files: {
          'dist/jterm-<%= pkg.version %>.jquery.js': ['src/**/*.js', 'src/**/*.json', 'lib/**/*.js'],
        },
      },
    },

    'uglify': {
      all: {
        options: {
          banner: '/* jterm-<%= pkg.version %>, jquery plugin for terminal simulator */',
          report: true,
          mangle: {
            except: ['jQuery'],
          },
        }, 
        files: {
          'dist/jterm-<%= pkg.version %>.jquery.min.js': ['dist/jterm-<%= pkg.version %>.jquery.js']
        },
      },
    },

    'cssmin': {
      all: {
        options: {
          banner: '/* jterm-<%= pkg.version %>, jquery plugin for terminal simulator */',
          report: true,
        },
        files : {
          'dist/jterm-<%= pkg.version %>.min.css': ['src/css/jterm.css']
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-commonjs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('build', ['clean', 'jshint', 'simple-commonjs', 'uglify', 'cssmin']);
};
