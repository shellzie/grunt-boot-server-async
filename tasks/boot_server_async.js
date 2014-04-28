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

    grunt.registerMultiTask('boot_server_async', 'Boot a server asynchronously. Task completes when a specific line from the server is sent to stdout.', function () {
        // Merge task-specific and/or target-specific options with these defaults.

        var done = this.async();    //Grunt waits for your asynchronous task to complete.
        var options = this.options({
            cmd:'rails server',
            args:'',
            gemset: 'showroom_harmony_cms',
            env:{},
            cwd:'.',
            failOnError: true,
            matchString: 'pid='   //default which applies to rails server. (indicates rails server booted successfully)
        });

        // TODO: Find a better way to change current working directory, plugins shouldn't change the working directory
        //http://gruntjs.com/creating-plugins#avoid-changing-the-current-working-directory:-process.cwd
        grunt.file.setBase(options.cwd);

        var server_cmd = options.cmd;

        var execOptions = {
            cwd:options.cwd,
            env:options.env
        };

        // TODO: Iterate over all process environment variables, not just GEM_PATH
        process.env['GEM_PATH'] = options.env['GEM_PATH'];

        var child_process = exec(server_cmd, options.args, execOptions, function(err, stdout, stdin){

        });

        // data from child goes to output
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

                if (chunk.indexOf(options.matchString) !== -1) {
                    child_process.stdout.removeListener('data', myChunkFunction);
                    grunt.verbose.writeln('>>>>>>>>>>>>>>>>>>>>>> Killing Piping');
                    printOutput = false;
                    done();
                }
            }
        };

        child_process.stdout.on('data', myChunkFunction);
    });

};
