#!/usr/bin/node
var fs = require('fs');
var list = JSON.parse(fs.readFileSync('./js/data.js','utf8'));
var obj = {name:'tom'};
list.push(obj);
fs.writeFileSync('./js/data.js',JSON.stringify(list));
