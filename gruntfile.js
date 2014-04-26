/*
 * grunt-boot-rails-async
 * https://github.com/shellzie/grunt-boot-rails-async
 *
 * Copyright (c) 2014 Michelle Kam
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    boot_rails_async: {
      default_options: {
          options: {
            cwd: '/Users/mkam1/michelle_sbm_workspace/CMT/harmony_cms/coverage/e2e/instrumented/dev/spec/dummy',
            gem_path: '/Users/mkam1/.rvm/gems/ruby-1.9.3-p194@showroom_harmony_cms:/Users/mkam1/.rvm/gems/ruby-1.9.3-p194@global'
          }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('get-setup', [
      'jshint:all',
      'nodeunit'
  ]);

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'boot_rails_async:default_options', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);



};
