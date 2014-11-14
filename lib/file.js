/*
 * nodeON-file
 * A collection of file helpers.
 * https://github.com/thanpolas/nodeON-file
 *
 * Copyright (c) 2014 Thanasis Polychronakis
 * Licensed under the MIT license.
 */

/**
 * Stripped grunt file module.
 *
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

// Nodejs libs.
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');

var mv = Promise.promisify(require('mv'));
var iconv = require('iconv-lite');
var yaml = require('js-yaml');
var appError = require('nodeon-error');
var temp = require('temp');

// The module to be exported.
var file = module.exports = {};


// The default file encoding to use.
file.defaultEncoding = 'utf8';

var pathSeparatorRe = /[\/\\]/g;

// Like mkdir -p. Create a directory and any intermediary directories.
file.mkdir = function(dirpath, mode) {
  // Set directory mode in a strict-mode-friendly way.
  if (mode == null) {
    mode = parseInt('0777', 8) & (~process.umask());
  }
  dirpath.split(pathSeparatorRe).reduce(function(parts, part) {
    parts += part + '/';
    var subpath = path.resolve(parts);
    if (!file.exists(subpath)) {
      try {
        fs.mkdirSync(subpath, mode);
      } catch(e) {
        throw new Error('Unable to create directory "' + subpath + '" (Error code: ' + e.code + ').', e);
      }
    }
    return parts;
  }, '');
};


// Write a file.
file.write = function(filepath, contents, options) {
  if (!options) { options = {}; }
  // Create path, if necessary.
  file.mkdir(path.dirname(filepath));
  try {
    // Actually write file.
    fs.writeFileSync(filepath, contents);
    return true;
  } catch(e) {
    throw new Error('Unable to write "' + filepath + '" file (Error code: ' + e.code + ').', e);
  }
};

/**
 * Write contents to file asynchronously.
 *
 * @param {string} The full path to save the file.
 * @param {string|Buffer} contents the contents.
 * @param {Object=} optOptions Any options to pass to fs.
 * @return {Promise} A Promise.
 */
file.writeAsync = function(filepath, contents, optOptions) {
  return fs.writeFileAsync(filepath, contents, optOptions);
};

// True if the file path exists.
file.exists = function() {
  var filepath = path.join.apply(path, arguments);
  return fs.existsSync(filepath);
};

// Returns promise with boolean value.
file.existsAsync = function() {
  var args = arguments;
  return new Promise(function(resolve) {
    var filepath = path.join.apply(path, args);
    fs.exists(filepath, function (exists) {
      resolve(exists);
    });
  });
};

// True if the file is a symbolic link.
file.isLink = function() {
  var filepath = path.join.apply(path, arguments);
  return file.exists(filepath) && fs.lstatSync(filepath).isSymbolicLink();
};

// True if the path is a directory.
file.isDir = function() {
  var filepath = path.join.apply(path, arguments);
  return file.exists(filepath) && fs.statSync(filepath).isDirectory();
};

/**
 * Checks if the given path is a directory using promises.
 *
 * @param {string} directory The full path.
 * @return {Promise} Rejects if not.
 * @throws {appError.Error} If not a directory.
 */
file.isDirAsync = function (directory) {
  return fs.statAsync(directory)
    .bind(this)
    .then(function (stat) {
      if (!stat.isDirectory()) {
        var err = new appError.Error('Not a directory');
        err.path = directory;
        throw err;
      }
    });
};

/**
 * Checks if the given path is a directory using promises, returns a
 * Promise with a boolean result.
 *
 * @param {string} directory The full path.
 * @return {Promise(boolean)} A Promise with a Boolean result.
 */
file.isDirAsyncBool = Promise.method(function(directory) {
  return file.isDirAsync(directory)
    .then(function() {
      return true;
    })
    .catch(function(err) {
      if (err.message === 'Not a directory') {
        return false;
      } else {
        throw err;
      }
    });
});

// True if the path is a file.
file.isFile = function() {
  var filepath = path.join.apply(path, arguments);
  return file.exists(filepath) && fs.statSync(filepath).isFile();
};

// Is a given file path absolute?
file.isPathAbsolute = function() {
  var filepath = path.join.apply(path, arguments);
  return path.resolve(filepath) === filepath.replace(/[\/\\]+$/, '');
};

// Do all the specified paths refer to the same path?
file.arePathsEquivalent = function(first) {
  first = path.resolve(first);
  for (var i = 1; i < arguments.length; i++) {
    if (first !== path.resolve(arguments[i])) { return false; }
  }
  return true;
};

// Are descendant path(s) contained within ancestor path? Note: does not test
// if paths actually exist.
file.doesPathContain = function(ancestor) {
  ancestor = path.resolve(ancestor);
  var relative;
  for (var i = 1; i < arguments.length; i++) {
    relative = path.relative(path.resolve(arguments[i]), ancestor);
    if (relative === '' || /\w+/.test(relative)) { return false; }
  }
  return true;
};

// Test to see if a filepath is the CWD.
file.isPathCwd = function() {
  var filepath = path.join.apply(path, arguments);
  try {
    return file.arePathsEquivalent(process.cwd(), fs.realpathSync(filepath));
  } catch(e) {
    return false;
  }
};

// Test to see if a filepath is contained within the CWD.
file.isPathInCwd = function() {
  var filepath = path.join.apply(path, arguments);
  try {
    return file.doesPathContain(process.cwd(), fs.realpathSync(filepath));
  } catch(e) {
    return false;
  }
};

/**
 * Copies a file
 *
 * @param {string} src The full path to the source file.
 * @param {string} dst The full path to the destination file.
 * @return {Promise} A promise.
 * @private
 */
file.copy = function(src, dst) {
  return new Promise(function(resolve, reject) {
    fs.createReadStream(src)
      .on('error', reject)
      .pipe(fs.createWriteStream(dst)
        .on('finish', resolve)
        .on('error', reject));
  });
};

// Read a file, return its contents.
file.read = function(filepath, options) {
  if (!options) { options = {}; }
  var contents;
  contents = fs.readFileSync(String(filepath));
  // If encoding is not explicitly null, convert from encoded buffer to a
  // string. If no encoding was specified, use the default.
  if (options.encoding !== null) {
    contents = iconv.decode(contents, options.encoding || file.defaultEncoding);
    // Strip any BOM that might exist.
    if (!file.preserveBOM && contents.charCodeAt(0) === 0xFEFF) {
      contents = contents.substring(1);
    }
  }
  return contents;
};

// Read a file async
file.readAsync = function(filepath) {
  return fs.readFileAsync(filepath, 'utf8');
};

// Read a file, parse its contents, return an object.
file.readJSON = function(filepath, options) {
  var src = file.read(filepath, options);
  var result;
  result = JSON.parse(src);
  return result;
};

// expose mv
file.mv = mv;

/**
 * Read a yaml file and return the data object.
 *
 * @param {string} filepath Full path to yaml file.
 * @return {Promise(Object)} The yaml data object.
 */
file.readYaml = Promise.method(function (filepath) {
  return file.readAsync(filepath)
    .then(yaml.safeLoad);
});

/**
 * Create a temp dir, promisifies the temp package.
 *
 * @return {Promise(string)} A promise with the temp dir.
 * @see https://github.com/bruce/node-temp
 */
file.createTempDir = function() {
  return new Promise(function(resolve, reject) {
    temp.mkdir('', function (err, dirPath) {
      if (err) {
        reject(err);
        return;
      }
      resolve(dirPath);
    });
  });
};
