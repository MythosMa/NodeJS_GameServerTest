const wsServer = require("../modules/websocketServer");//引入websocketServer
const mapObject = require("./MapServerModules/mapObject");//引入地图类
const playerObject = require("../modules/playerObject");//引入角色类

const map_1 = new mapObject("map_1");//初始化地图信息

//同聊天服务器一样，几个回调函数来处理连接的监听
const textCallback = (server, result, connection) => {
  let dataType = result.dataType;
  let player = null;

  //通过dataType的操作指令，执行不同的任务
  /**
   * PLAYER_SERVER_INIT 服务器角色初始化，用于客户端连接成功后，向服务器发送的命令
   * PLAYER_SERVER_INIT_OVER 服务器完成角色初始化，向客户端发送命令，要求客户端创建角色相关数据
   * PLAYER_CLIENT_INIT_OVER 客户端角色创建完成，通知服务器开始角色数据计算
   * PLAYER_OPERATION 客户端发起操作，控制角色，改变角色状态
   */
  switch (dataType) {
    case "PLAYER_SERVER_INIT"://服务器角色初始化，并添加连接对象
      player = new playerObject();
      player.addConnection(connection);
      connection["player"] = player;
      connection["map"] = map_1;
      connection.sendText(
        makeResponseData("PLAYER_SERVER_INIT_OVER", player.getPlayerData())
      );
      break;
    case "PLAYER_CLIENT_INIT_OVER"://客户端角色创建完成，开启角色数据计算，并将角色信息添加到地图信息中心
      player = connection.player;
      player.start();
      map_1.addPlayer(player);
      break;
    case "PLAYER_OPERATION"://客户端发来的操作，改变角色状态
      player = connection.player;
      player.operation(result.data);
      break;
  }
};

//通知客户端连接成功
const connectCallback = (server, result, connection) => {
  connection.sendText(makeResponseData("CONNECT_SUCCESS", null));
};

//客户端取消连接，将该客户端角色移出地图数据
const closeConnectCallback = (server, result, connection) => {
  connection.player.end();
  map_1.deletePlayer(connection.player);
};

//打包数据的公共函数
const makeResponseData = (dataType, data) => {
  return JSON.stringify({
    dataType,
    data
  });
};

module.exports = MapServer = port => {
  let callbacks = {
    textCallback: (server, result, connection) => {
      textCallback(server, result, connection);
    },
    connectCallback: (server, result, connection) => {
      connectCallback(server, result, connection);
    },
    closeConnectCallback: (server, result, connection) => {
      closeConnectCallback(server, result, connection);
    }
  };

  const mapServer = wsServer(port, callbacks);
};
