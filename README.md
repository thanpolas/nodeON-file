# nodeON-file

> A collection of file helpers.

[![Build Status](https://secure.travis-ci.org/thanpolas/nodeON-file.png?branch=master)](http://travis-ci.org/thanpolas/nodeON-file)

## Install

Install the module using NPM:

```
npm install nodeON-file --save
```
## <a name='TOC'>Table of Contents</a>

1. [Overview](#overview)
1. [API](#api)

## Overview

Lorem ipsum trololol.

## API

Provides the following methods:

* `file.mkdir(dirpath, mode)` Synchronous.
* `file.write(filepath, contents, options)` Synchronous.
* `file.writeAsync(filepath, contents, optOptions)` ASynchronous.
* `file.exists(args..*)` Synchronous; Any number of arguments, gets joined up.
* `file.existsAsync(args..*)` Asynchronous; Any number of arguments, gets joined up.
* `file.isLink(args..*)` Synchronous; Any number of arguments, gets joined up.
* `file.isDir(args..*)` Synchronous; Any number of arguments, gets joined up.
* `file.isDirAsync(directory)` Asynchronous; Returns Promise, rejects if not dir.
* `file.isDirAsyncBool(directory)` Asynchronous; Returns Promise with a boolean result.
* `file.isFile(args..*)` Synchronous; Any number of arguments, gets joined up.
* `file.isPathAbsolute(args..*)` Synchronous; Any number of arguments, gets joined up.
* `file.arePathsEquivalent(first, args..*)` Synchronous; Any number of arguments, gets joined up.
* `file.doesPathContain(ancestor, args..*)` Synchronous; Are descendant path(s) contained within ancestor path? Note: does not test if paths actually exist.
* `file.isPathCwd(args..*)` Synchronous; Any number of arguments, gets joined up.
* `file.isPathInCwd(args..*)` Synchronous; Any number of arguments, gets joined up.
* `file.copy(src, dst)` Asynchronous; Returns Promise.
* `file.read(filepath, options)` Synchronous.
* `file.readAsync(filepath)` ASynchronous.
* `file.readJSON(filepath, options)` Synchronous.
* `file.readYaml(filepath)`  Asynchronous; Returns Promise.
* `file.createTempDir()` Asynchronous; Creates a temporary directory, returns full path.

**[[⬆]](#TOC)**

## Release History

- **v0.1.5**, *24 Sep 2014*
    - Added `createTempDir()` method.
- **v0.1.4**, *24 Sep 2014*
    - Added `writeAsync()` method.
- **v0.1.3**, *17 Aug 2014*
    - Added `existsAsync()` method.
- **v0.1.1**, *16 Aug 2014*
    - Added `readAsync()` method.
- **v0.1.0**, *14 Aug 2014*
    - Big Bang

## License

Copyright (c) 2014 Thanasis Polychronakis. Licensed under the MIT license.

Mostly stripped from the [Grunt](http://gruntjs.com/) file module.

Copyright (c) 2013 "Cowboy" Ben Alman
Licensed under the MIT license.
https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
