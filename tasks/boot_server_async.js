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

        //takes whatever options you specified in your gruntfile that you wish to overwrite and puts it into process.env hash
        //eg.  GEM_PATH: '/Users/mkam1/.rvm/gems/ruby-1.9.3-p194@showroom_harmony_cms:/Users/mkam1/.rvm/gems/ruby-1.9.3-p194@global'
        // will set the gem path to showroom_harmony_cms so rails will start up with the correct gemset. otherwise, it
        // uses global gemset if we don't do this.
        for(var key in options.env) {
            process.env[key] = options.env[key];  //e.g. process.env['GEM_PATH'] = options.env['GEM_PATH'];
        }

        var child_process = exec(server_cmd, options.args, execOptions, function(err, stdout, stdin){
            //will never get in here because we keep rails server up through entire grunt script.
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

        var detachIfStarted = function(chunk){
            grunt.verbose.writeln(">>>> CHUNK: "+chunk + " >>> END CHUNK");

            if(printOutput){
                if (chunk.indexOf(options.matchString) !== -1) {
                    child_process.stdout.removeListener('data', detachIfStarted);
                    grunt.verbose.writeln('>>>>>>>>>>>>>>>>>>>>>> Killing Piping');
                    printOutput = false;
                    done();
                }
            }
        };

        child_process.stdout.on('data', detachIfStarted);
    });

};
