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
            gem_path: '/Users/mkam1/.rvm/gems/ruby-1.9.3-p194@showroom_harmony_cms:/Users/mkam1/.rvm/gems/ruby-1.9.3-p194@global',
            cwd:'.',
            failOnError: true
        });

        // TODO Find way of changing current working directory, plugins shouldn't change the workding directory
        grunt.file.setBase(options.cwd);

        var rails_cmd = options.cmd;

        var execOptions = {
            cwd:options.cwd,
            env:{
                GEM_PATH:options.gem_path
            }
        };

        // TODO Iterate over all process environment variables
        process.env['GEM_PATH'] = options.gem_path;

        var child_process = exec(rails_cmd, options.args, execOptions, function(err, stdout, stdin){
            grunt.verbose.writeln('>>>>>>>>>>>>>>> env vars = ');
            grunt.verbose.writeln('Callback Called');
            if (err && options.failOnError) {
                grunt.warn(err);
            }
            done();
        });

        var captureOutput = function (child, output) {
            child.pipe(output);
        };

        grunt.verbose.writeln('Command:', rails_cmd);

        captureOutput(child_process.stdout, process.stdout);

        captureOutput(child_process.stderr, process.stderr);

        // Listen to output data
        child_process.stdout.on('data', function(chunk){
            grunt.verbose.writeln(">>>> CHUNK: "+chunk + " >>> END CHUNK");
            done();
        });
    });

};
