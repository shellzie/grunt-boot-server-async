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

    grunt.registerMultiTask('boot_server_async', 'Boot a server asynchronously. Task completes when a specific line is read from stdout',
        function () {
        // Merge task-specific and/or target-specific options with these defaults.

        var done = this.async();    //Grunt waits for your asynchronous task to complete.
        var options = this.options({
            cmd:'',     //command to start server
            args:'',     // optional args to send to the above command
            env:{},     //optional environment variables to specify. eg. rails server needs GEM_SET
            cwd:'.',     //directory to boot server
            failOnError: true,  //stop grunt script from further execution if error is encountered
            matchString: ''     //string in stdout to listen for that indicates server is fully booted
        });

        // TODO: Find a better way to change current working directory, plugins shouldn't change the working directory
        //http://gruntjs.com/creating-plugins#avoid-changing-the-current-working-directory:-process.cwd

        var originalCwd = process.cwd();    //save current working dir
        grunt.file.setBase(options.cwd);    //temporarily set working dir to what was passed in by user
        var server_cmd = options.cmd;

        var execOptions = {
            cwd:options.cwd,
            env:options.env
        };

        //takes whatever options you specified in your gruntfile that you wish to overwrite and puts it into process.env hash
        //eg.  GEM_PATH: '~/.rvm/gems/ruby-1.9.3-p194@showroom_harmony_cms:~/.rvm/gems/ruby-1.9.3-p194@global'
        // will set the gem path to the gemset specified in gruntfile so rails will start up with the correct gemset. otherwise, it
        // uses global gemset if we don't do this.
        for(var key in options.env) {
            process.env[key] = options.env[key];  //e.g. process.env['GEM_PATH'] = options.env['GEM_PATH'];
        }

        var child_process = exec(server_cmd, options.args, execOptions, function(err, stdout, stdin){
            //will never get here because we keep rails server up through entire grunt script.
        });

        // data from child goes to output
        var captureOutput = function (child, output) {
            child.pipe(output);
        };

        grunt.file.setBase(originalCwd);

        captureOutput(child_process.stdout, process.stdout);
        captureOutput(child_process.stderr, process.stderr);

        var printOutput = true;
        // Listen to output data

        // detach the listener, which listens for changes in stdout, once matchString is output to terminal.
        // otherwise, process will hang.
        var detachIfStarted = function(chunk){
            if(printOutput){
                if (chunk.indexOf(options.matchString) !== -1) {
                    child_process.stdout.removeListener('data', detachIfStarted);
                    printOutput = false;
                    done();
                }
            }
        };

        child_process.stdout.on('data', detachIfStarted);
    });

};
