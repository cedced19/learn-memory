#Learn-Memory

A Node.js software to learn your leson.

[![Build Status](https://travis-ci.org/cedced19/Learn-Memory.svg)](https://travis-ci.org/cedced19/Learn-Memory)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Dependencies](https://david-dm.org/cedced19/Learn-Memory.png)](https://david-dm.org/cedced19/Learn-Memory)
[![devDependencies](https://david-dm.org/cedced19/Learn-Memory/dev-status.png)](https://david-dm.org/cedced19/Learn-Memory#info=devDependencies)
[![NPM version](https://badge.fury.io/js/learn-memory.svg)](http://badge.fury.io/js/learn-memory)

```bash
$ npm install learn-memory -g
```

Go in command line to the directory where you have your save.

```bash
$ learn
```

**`>=0.0.12`'s data system is not the same as before**

##Options

    -h, --help                  output usage information

    -V, --version               output the version number

    -p, --port [number]          specified the port


## How to add a password ?

You can add a password with the creation of a `config.json`:

```
{
    "user": "",
    "password": ""
}
```


## Developement

To launch in developement:

```bash
$ npm install
$ node learn-memory.js
```

To launch in release:

```bash
$ npm install
$ grunt
$ cd dist/
$ node learn-memory.js
```

NOTE: dist/ is the dist folder.