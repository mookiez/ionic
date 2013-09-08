var fs = require('fs'),
    path = require('path'),
    wrench = require('wrench'),
    argv = require('optimist')
      .usage('Usage: ionic appname')
      .argv;

Ionic = function() {
};

Ionic.prototype = {
  _checkArgs: function() {
    if(argv._.length == 0) {
      return false;
    }
    return true;
  },

  _printUsage: function() {
    process.stderr.write('Usage: ionic appname');
    process.exit(1);
  },

  _writeTemplateFolder: function() {
    wrench.copyDirRecursive('template', this.appName, function(err, curFiles) {
      console.log(curFiles);
    });
  },

  // Prompt the user for a response
  _ask: function(question) {
    var response;

    process.stdout.write(question + ' ');
    process.stdin.resume();
    response = fs.readSync(process.stdin.fd, 100, 0, "utf8");
    process.stdin.pause();
    return response[0].trim();
  },

  _checkTargetPath: function() {
    if(fs.existsSync(this.targetPath)) {
      var resp = this._ask('The ' + this.targetPath + ' directory already exists. Overwrite files? (y/n)')
      if(resp === 'y') {
        return true;
      }
      return false;
    }
    return true;
  },
  
  run: function() {
    if(this._checkArgs() === false) {
      return this._printUsage();
    }

    this.appName = argv._[0];
    this.targetPath = path.resolve(this.appName);

    // Make sure to create this, or ask them if they want to override it
    if(this._checkTargetPath() === false) {
      process.stderr.write('Not continuing.');
      process.exit(1);
    }

    console.log('Creating Ionic app in folder', this.targetPath);

    this._writeTemplateFolder();
  }
};


var ionic = new Ionic();
ionic.run();