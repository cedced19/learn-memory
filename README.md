# Learn-Memory

A Node.js software to learn your lesson.
This software is translated in English and French.

[![Build Status](https://travis-ci.org/cedced19/learn-memory.svg)](https://travis-ci.org/cedced19/learn-memory)
[![NPM version](https://badge.fury.io/js/learn-memory.svg)](http://badge.fury.io/js/learn-memory)

![](https://raw.githubusercontent.com/cedced19/learn-memory/master/demo.png)

You have to __install [mongodb](https://docs.mongodb.com/manual/installation/)__ to use new versions of Learn Memory.  
If you want to use Learn Memory without mongodb, you have to do `npm install learn-memory@0.4.0 -g`

## CLI

```bash
$ npm install learn-memory -g
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

--port [number]            specified the port
```

## APIs

* __lessons__: `/api/` (⇒ you can specify if you want 'attachments', 'createdAt', and 'content' field)
* __version__: `/api/version` (to get current version and npm version)
* __registrants__: `/api/registrants` (to validate new users)
* __users__: `/api/users`
* __attachments__: `/api/attachments`

## Other software to use with

* __[learn-memory-mobile](https://github.com/cedced19/learn-memory-mobile)__: an application to show you your lessons on your mobile phone online and __offline__.
* __[learn-memory-archiver](https://github.com/cedced19/learn-memory-archiver)__: a software to save your lessons and your attachements.
* __[learn-memory-static](https://github.com/cedced19/learn-memory-static)__: a software to generate files to host your lessons on an static http server.
* __[learn-memory-static-desktop](https://github.com/cedced19/learn-memory-static-desktop)__: a GUI to generate files to host your lessons on an static http server.
* __[learn-memory-statistics](https://github.com/cedced19/learn-memory-statistics)__: a node module to get statistics from data from a Learn Memory website.
* __[learn-memory-statistics-cli](https://github.com/cedced19/learn-memory-statistics-cli)__: a CLI to see statistics from your Learn Memory server.
* __[learn-memory-desktop](https://github.com/cedced19/learn-memory-desktop)__: a GUI to use a little Learn Memory server on Microsoft Windows.


## Access to server

There are two solutions to get lessons on this application:
* redirect port 7772 on your server and get your global ip
* be on the same wifi as your server and get its local ip

## Import a lesson save in database

```
$ mongoimport --db sails --collection lessons --file save.json --jsonArray
```

## Developers

There are two npm commands with which you can compile javascript:
* `npm run dev`: reload page on change and build bundle
* `npm run prod`: build and uglify bundle
