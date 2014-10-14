#!/usr/bin/env node
"use strict";
var   opn = require("opn"),
        app = require("express")(),
        serveStatic = require("serve-static"),
        path = require("path"),
        fs = require("fs"),
        bodyParser = require("body-parser"),
        filename = process.cwd() + "/save.json",
        chalk = require("chalk");


app.use(serveStatic(__dirname));
app.use(bodyParser.json());

app.get("/save", function(req, res) {
    fs.readFile(filename, "utf8", function(err, data) {
        if (err) {
            res.json(new Array());
        }else{
            res.end(data);
        }
    });
});

app.post("/set", function(req, res, next) {
    fs.writeFile(filename,  JSON.stringify(req.body, null, 4), "utf8", function(err) {
            if(err) {
                console.log(chalk.red("There are an error: " + err));
                res.status(500);
                res.end();
            }else{
                console.log(chalk.green("The file has just saved!"));
                res.end();
            }
    });
});

app.post("/new", function(req, res, next) {
    req.body.last().newId();
    fs.writeFile(filename,  JSON.stringify(req.body, null, 4), "utf8", function(err) {
            if(err) {
                console.log(chalk.red("There are an error: " + err));
                res.status(500);
                res.end();
            }else{
                console.log(chalk.green("The file has just saved!"));
                res.json(req.body.last());
            }
    });
});

var server = require("http").createServer(app);
server.listen(791, function() {
    console.log("Server running at\n  => "+ chalk.green("http://localhost:791") + "\nCTRL + C to shutdown");
    opn("http://localhost:791");
});

Array.prototype.last = function(){
    if (this.length == 1){
        return this[0];
    }
    return this[this.length -1];
}

Object.prototype.newId = function(){
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz";
         var stringLength = 8;
         var randomstring = "";
         for(var i = 0; i < stringLength; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum, rnum + 1);
    }
    return this.id = randomstring;
}
