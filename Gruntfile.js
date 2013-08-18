module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      'build/game-browserified.js': ['game.js']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
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

  grunt.registerTask('default', ['jshint', 'browserify', 'uglify']);

  grunt.registerTask('thingy', 'whatever', function () {
    grunt.log.write('I am writing something to the console...').ok().error();
  });
};