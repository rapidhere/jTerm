module.exports = function(grunt) {
  grunt.initCofing({
    "pkg": grunt.file.readJSON("./package.json"),
    
    "amd-dist": {
      all: {
        standalone: true,
        env: 'browser',
        exports: 'jterm',
      },
      files: [
        {
          src: "./src/**/*.js",
          dest: "dist/jterm.js",
        },
      ],
    },
  });

  grunt.loadNpmTasks("grunt-amd-dist");
};
