const ws = require("nodejs-websocket");

module.exports = createServer = () => {
  let server = ws.createServer(connection => {
    //客户端向服务器发送字符串时的监听函数
    connection.on("text", result => {
      console.log("connection.on -> text", result);
      //在这里，接收到某一个客户端发来的消息，然后统一发送给所有连接到websocket的客户端
      server.connections.forEach((client) => {
          client.sendText(result);
      });
    });
    //客户端向服务器发送二进制时的监听函数
    connection.on("binary", result => {
      console.log("connection.on -> binary", result);
    });
    //客户端连接到服务器时的监听函数
    connection.on("connect", result => {
      console.log("connection.on -> connect", result);
    });
    //客户端断开与服务器连接时的监听函数
    connection.on("close", result => {
      console.log("connection.on -> close", result);
    });
    //客户端与服务器连接异常时的监听函数
    connection.on("error", result => {
      console.log("connection.on -> error", result);
    });
  }).listen(8182);

  return server;
};
