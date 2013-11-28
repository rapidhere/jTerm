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
          'dist/jterm-<%= pkg.version %>.jquery.js': ['src/**/*.js', 'src/**/*.json'],
        },
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-simple-commonjs');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', ['clean', 'jshint', 'simple-commonjs']);
};
