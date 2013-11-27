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
          out: 'main-dist.js',
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
};
