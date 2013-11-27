module.exports = function(grunt) {
  grunt.initConfig({
    'pkg': grunt.file.readJSON('./package.json'),
    
    'requirejs': {
      all: {
        options: {
          baseUrl: './src',
          paths: {
            jquery: '/home/rapid/Downloads/jquery.min.js',
          },
          name: 'jterm',
          out: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js',
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('default', ['requirejs']);
};
