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

* `file.mkdir()`
* `file.write()`
* `file.exists()`
* `file.isLink()`
* `file.isDir()`
* `file.isDirAsync()`
* `file.isFile()`
* `file.isPathAbsolute()`
* `file.arePathsEquivalent()`
* `file.doesPathContain()`
* `file.isPathCwd()`
* `file.isPathInCwd()`
* `file.copy()`
* `file.read()`
* `file.readJSON()`

**[[⬆]](#TOC)**

### <a name='toApi'>Getting an API Safe verison</a>

> ### errInstance.toApi()
>
> *Returns* `Object` A sanitized object.

Clones the error object and strips it of all the `Error` getters (like `stack`) and the following attributes:
    
    * `srcError`

```js
var appErr = require('nodeon-error');

var error = new appErr.Error();

console.log(error.toApi());
```

## Release History

- **v0.0.1**, *TBD*
    - Big Bang

## License

Copyright (c) 2014 Thanasis Polychronakis. Licensed under the MIT license.
