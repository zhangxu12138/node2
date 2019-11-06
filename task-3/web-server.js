#!/usr/bin/node
const http = require('http'),
      log = console.log,
      fs = require('fs'),
      url = require('url'),
      qs = require('querystring');
var userList = [
  {username:'admin',pwd:'admin'}
];
var chapterList = JSON.parse(fs.readFileSync('./js/data.js','utf8'));
http.createServer((req,res)=>{
  //log(`${req.method}${req.url} HTTP/${req.httpVersion}`);
  //log(req.headers);
  //log('');

  switch(req.method){
    case 'GET':
      select(req,res);
      break;
    case 'POST':
      create(req,res);
      break;
    default:
      break;
    }
}
).listen(8080);

function select(req,res){
  var path = url.parse(req.url);
  var pathQuery = path.query;
  var itemQuery = qs.parse(pathQuery);
  var file = __dirname;
  var fileitem = [];
  if(itemQuery.chapterId && pathQuery != null){
    var data=JSON.stringify(chapterList[itemQuery.chapterId-1]);
    res.setHeader('Content-Length',Buffer.byteLength(data));
    res.setHeader('Content-Type','text/plain;charset="utf-8"');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(data);
  }
  if(req.url == '/list'){
    var data = JSON.stringify(chapterList);
    res.setHeader('Content-Length',Buffer.byteLength(data));
    res.setHeader('Content-Type','text/plain;charset="utf-8"');
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(data);
  }
  switch(req.url){
    case '/list/':
      file += '/chapterList.html';
      break;
    case '/login/':
      file += '/login.html';
      break;
    case '/listmanager/':
      file += '/list.html';
      break;
    case '/addChapter/':
      file += '/addChapter.html';
      break;
    default:
      var fileQuery = req.url.split('?')[0];
      fileitem = fileQuery.split('/');
      //log(fileitem);
      for(var a = 2;a<fileitem.length;a++){
        var s = '/'+fileitem[a];
        file += s
      }
      break;
    }
   // log(file)
    fs.readFile(file,(err,data)=>{
      if(err){
        log(err.message);
        res.statusCode = 404;
        res.end(err.message);
      }else{
        res.writeHead(200,{
          'Content-Type':'text/html'
        })
        res.end(data)
      }
    })
};

function create(req,res){
 // log(`${req.method}${req.url} HTTP/${req.httpVersion}`);
 // log(req.headers);
 // log('');
 
  var item = '';
  if(req.url == '/login/'){
  req.on('data',(data)=>{
    item += data;
  });
  req.on('end',()=>{
    item = JSON.parse(item);
    userList.forEach((person)=>{
      if(person.username == item.username && person.pwd == item.pwd){
        log('成功');
        res.end('http://192.168.58.144:8080/addChapter/');
      }
    });
    log('失败');
    res.end('no');
  });
  }

  if(req.url == '/add'){
    req.on('data',(data)=>{
      item += data;
    });
    req.on('end',()=>{
      item = qs.parse(item.toString('utf8'));
      var newText = new CreateText(item.title,item.content);
      chapterList.push(newText);
      fs.writeFileSync('./js/data.js',JSON.stringify(chapterList));
      
    })
    res.end('OK')
  }

}

function CreateText(chapterName,chapterContent,chapterId,imgPath,chapterDes,publishTimer,author,views){
  var o = new Object();
  o.chapterId = chapterList.length+1;
  o.chapterName = chapterName;
  o.imgPath = imgPath || undefined;
  o.chapterDes = chapterDes || undefined;
  o.chapterContent = chapterContent;
  o.publishTimer = new Date().getTime();
  o.author = author || undefined;
  o.views = views || undefined;
  return o;
}
