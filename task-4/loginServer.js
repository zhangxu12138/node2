const http = require('http'),
      fs = require('fs'),
      qs = require('querystring');


http.createServer((req,res)=>{
    switch (req.method) {
        case 'GET':
            console.log(req.method);
            getMsg(req,res);
            break;
        case 'POST':
            console.log(req.method);
            postMsg(req,res)
            break;
    }
}).listen(8081)

function getMsg(req,res){
    if(req.url === '/login'){
        show(res)
    }else{
        res.stateCode = 404;
        res.end();
    }
}

function postMsg(req,res){
    if(req.url === '/login'){
        var logincount = 1;
        var data = '';
        req.on('data',(chunk)=>{
            data += chunk;
        });
        req.on('end',()=>{
            var account = qs.parse(data);
            if(account.username === 'zhangsan' && account.pwd === '123'){
                if(typeof req.headers.cookie === 'undefined'){
                    res.writeHead(200,{
                        'Set-cookie':`logincount=1;max-age=6000`
                    });
                    res.end(`load ${logincount} times`)
                }else{
                    var pair = req.headers.cookie.split('=');
                    logincount = Number(pair[1])+1;
                    res.writeHead(200,{
                        'Set-cookie':`logincount=${logincount};max-age=6000`
                    });
                    res.end(`load ${logincount} times`)
                }
                
            }else{
                res.stateCode = 404;
                res.end('username or password is wrong,please try again');
            }
        })

    }else{
        res.stateCode = 404;
        res.end();
    }
}

function show(res){
    var data = fs.readFileSync('./login.html','utf8');
    res.writeHead(200,{
        'Content-Type':'text/html'
    });
    res.end(data)
}