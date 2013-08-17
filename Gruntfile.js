module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      'build/game-browserified.js': ['game.js']
    },
    jshint: {
      files: {
        src: 'game.js'
      }
    },
    uglify: {
      options: {
        banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      'build/game-min.js': 'build/game-browserified.js'
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['browserify', 'uglify']);
};