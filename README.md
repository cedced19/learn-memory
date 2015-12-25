# Learn-Memory

A Node.js software to learn your lesson.

[![Build Status](https://travis-ci.org/cedced19/learn-memory.svg)](https://travis-ci.org/cedced19/learn-memory)
[![NPM version](https://badge.fury.io/js/learn-memory.svg)](http://badge.fury.io/js/learn-memory)

![](https://raw.githubusercontent.com/cedced19/learn-memory/master/demo.png)

## CLI

```bash
$ npm install learn-memory -g
```

Go in command line to the directory where you have your save.

```bash
$ learn
```

## Server

```bash
$ git clone --depth=1 https://github.com/cedced19/learn-memory
$ cd ./learn-memory
$ npm install --production
$ npm start --production
```

## Options

```
--production               launch in production mode

--port [number]          specified the port
```

## API

There are a Rest API on `http://localhost:7772/api/`.

You can use a [application](https://github.com/cedced19/learn-memory-mobile)  to show you your lessons on your mobile phone online and __offline__.

There are two solution to get lessons on this application:
* redirect ports on your server and get your global ip
* be on the same wifi as your server and get its local ip
