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

    grunt.registerMultiTask('boot_server_async', 'Boot a server asynchrounously. Task completes on seeing a specific line from the server on stdout.', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var done = this.async();
        var options = this.options({
            cmd:'rails server',
            //args:'server',
            //gemset: 'showroom_harmony_cms',
            env:{},
            cwd:'.',
            failOnError: true
        });

        // TODO Find way of changing current working directory, plugins shouldn't change the workding directory
        grunt.file.setBase(options.cwd);

        var server_cmd = options.cmd;

        var execOptions = {
            cwd:options.cwd,
            env:options.env
        };



        // TODO Iterate over all process environment variables
        process.env['GEM_PATH'] = options.env['GEM_PATH'];

        var child_process = exec(server_cmd, options.args, execOptions, function(err, stdout, stdin){

        });

        var captureOutput = function (child, output) {
            child.pipe(output);
        };
        grunt.file.setBase('/Users/mkam1/michelle_sbm_workspace/CMT/harmony_cms');
        grunt.verbose.writeln('Command:', server_cmd);

        captureOutput(child_process.stdout, process.stdout);

        captureOutput(child_process.stderr, process.stderr);

        var printOutput = true;
        // Listen to output data

        var myChunkFunction = function(chunk){
            grunt.verbose.writeln(">>>> CHUNK: "+chunk + " >>> END CHUNK");

            if(printOutput){
                printOutput = false;
                child_process.stdout.removeListener('data', myChunkFunction);
                grunt.verbose.writeln('>>>>>>>>>>>>>>>>>>>>>> Killing Piping');
                done();
            }
        };

        child_process.stdout.on('data', myChunkFunction);
    });

};
