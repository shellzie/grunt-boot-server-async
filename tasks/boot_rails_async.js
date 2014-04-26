/*
 * grunt-boot-rails-async
 * https://github.com/shellzie/grunt-boot-rails-async
 *
 * Copyright (c) 2014 Michelle Kam
 * Licensed under the MIT license.
 */

'use strict';
var exec = require('child_process').exec;

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('boot_rails_async', 'Boot the rails server asynchrounously, . Plugin completes task when server is fully booted, allowing execution against running server.', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var done = this.async();
        var options = this.options({
            cmd:'rails server',
            //args:'server',
            //gemset: 'showroom_harmony_cms',
            gem_path:'/Users/mkam1/.rvm/gems/ruby-1.9.3-p194@showroom_harmony_cms:/Users/mkam1/.rvm/gems/ruby-1.9.3-p194@global',
            cwd:'/Users/mkam1/michelle_sbm_workspace/CMT/harmony_cms/coverage/e2e/instrumented/dev/spec/dummy',
            failOnError: true
        });

        var rails_cmd = options.cmd;

        var execOptions = {
            cwd:options.cwd,
            env:{
                GEM_PATH:options.gem_path
            }
        };

        var my_callback = function (error, stdin, stdout) {

            grunt.verbose.writeln('Callback Called');
            done();
        };

        var child_process = exec(rails_cmd, options.args, execOptions, function(err, stdout, stdin){
            grunt.verbose.writeln('Callback Called');
            if (err && options.failOnError) {
                grunt.warn(err);
            }
            done();
        });

        grunt.verbose.writeln('After Exec');

        var captureOutput = function (child, output) {
            child.pipe(output);
        };

        grunt.verbose.writeln('Command:', rails_cmd);

        captureOutput(child_process.stdout, process.stdout);

        captureOutput(child_process.stderr, process.stderr);

    });

};
