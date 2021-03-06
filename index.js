const http = require('http');
const url = require('url');
const chatServer = require('./Server/chatServer');
const mapServer = require('./Server/mapServer');
// const wsServer = require('./websocketServer');

http.createServer(function(req, res){
    var request = url.parse(req.url, true).query
    var response = {
        info: request.input ? request.input + ', hello world' : 'hello world'
    };
    res.setHeader("Access-Control-Allow-Origin", "*");//跨域
    res.write(JSON.stringify(response));
    res.end();
}).listen(8181);

const chat = chatServer(8183);
const map = mapServer(8184);
// const chatServer = wsServer(8182);
// const mapServer = wsServer(8183);