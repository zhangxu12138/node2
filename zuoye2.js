const fs = require('fs'),
      method = process.argv[2],
      dir = process.argv[3],
      file = __dirname,
      join = require('path').join;
if(typeof(method) === 'undefined'){
    console.error('没有输入命令')
    process.exit(1);
}
if(method === 'mkdir'){
    if(dir === 'undefined'){
        console.error('没有输入要创建的目录名称');
        process.exit(1)
    }
    fs.mkdir(dir,err=>{
        if(err) throw err;
    })
    console.log("创建成功");
    process.exit(0);
}
if(method === 'list'){
    fs.readdir(file,(err,files)=>{
        if(err) throw err;
        files.forEach(filesChild=>{
            if(!fs.statSync(filesChild).isDirectory()){
                var filesize = join(file,filesChild);
                fs.stat(filesize,(err, stats)=>{
                    if(err) throw err;
                    console.log(`{"fileName":"${filesChild}","fileSize":"${stats.size}"}`)
                })
            }
        })
       
    })
    
}else{
    console.error("输入有误")
    process.exit(1);
}
