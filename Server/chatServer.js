const wsServer = require('../modules/websocketServer');

const textCallback = (server, result) => {
    let resJson = JSON.parse(result); 

    //消息的处理，根据客户端传来的数据结构，拼接成完整的消息字段再返回给客户端
    let channel = '';
    if(resJson.channel === 0) {
        channel = '世界';
    }else if(resJson.channel === 1){
        channel = '团队';
    }else{
        channel = '密聊';
    }

    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    server.connections.forEach((client) => {
        let content = `[${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}][${channel}][${resJson.userID}]:${resJson.content}`;
        let chatChannel = resJson.channel;
        let msg = {
            content: content,
            channel: chatChannel
        } 
        client.sendText(JSON.stringify(msg));
    });
}

const connectCallback = (server, result) => {
    
}

module.exports = ChatServer = (port) => {
    let callbacks = {
        textCallback: (server, result) => {
            textCallback(server, result);
        },
        connectCallback: (server, result) => {
            connectCallback(server, result);
        },
    };

    const chatServer = wsServer(port, callbacks);
};