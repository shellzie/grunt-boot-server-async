grunt-boot-rails-async
======================

> Boot a server asynchronously. Task completes when server is fully booted, allowing execution for your next grunt task.

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-boot-server-async --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-boot-server-async');
```

## The "boot_server_async" task

### Overview
In your project's Gruntfile, add a section named `boot_server_async` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  boot_server_async: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  boot_server_async: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  boot_server_async: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```


#### Example Usage
An example which starts a rails server.

The `cwd` property indicates the directory in which you want to execute your command. It supports templates such as
<%= dirs.instrumentedE2E%> if that is defined in your initConfig object.

`cmd` is the command used to start your server

`matchString` is the string in stdout that indicates your server has fully started. This is used to determine when the
task has completed and then done() is called.

In the example below, we are starting a rails server. For the rails app to use the correct gemset (not the global),
you may find that you have to set the `GEM_PATH` explicitly pointing to your application's gemset path to avoid a "gem
not found error." This is because relying on cd'ing to the `cwd` directory you wish to boot the server in does
not seem to be enough to switch into the correct gemset.

```js
grunt.initConfig({
   dirs: {
       // configurable paths
       app: 'dev',
       coverageE2E: 'coverage/e2e',
       instrumentedE2E: '<%= dirs.coverageE2E %>/instrumented',
   },
   boot_server_async: {
      rails: {
          options: {
              cwd: '<%= dirs.instrumentedE2E %>/dev/spec/dummy',
              cmd: 'rails server',
              matchString: 'Ctrl-C',
              env: {
                  GEM_PATH: '~/.rvm/gems/ruby-1.9.3-p194@showroom_harmony_cms:~/.rvm/gems/ruby-1.9.3-p194@global'
              }
          }
      }
});
```

Start a standalone selenium server:

```js
grunt.initConfig({
   boot_server_async: {
      selenium: {
          options: {
              cmd: "webdriver-manager start",
              matchString: 'Started org.openqa.jetty.jetty.Server',   //the string to look for which signals server has successfully booted
          }
      }
});
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
