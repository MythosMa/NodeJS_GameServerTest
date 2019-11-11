const http = require('http');
http.createServer(function(req, res){
    var response = {
        info:'hello world'
    };
    res.setHeader("Access-Control-Allow-Origin", "*");//跨域
    res.write(JSON.stringify(response));
    res.end();
}).listen(8181);