const http = require('http');
const url = require('url');


http.createServer(function(req, res){
    var request = url.parse(req.url, true).query
    var response = {
        info: request.input ? request.input + ', hello world' : 'hello world'
    };
    res.setHeader("Access-Control-Allow-Origin", "*");//跨域
    res.write(JSON.stringify(response));
    res.end();
}).listen(8181);