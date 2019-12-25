const wsServer = require("../modules/websocketServer");
const mapObject = require("./MapServerModules/mapObject");
const playerObject = require("../modules/PlayerObject");

const map_1 = new mapObject("map_1");

const textCallback = (server, result, connection) => {
  let dataType = result.dataType;
  let player = null;
  let responseData = {
    dataType: "",
    data: ""
  };

  switch (dataType) {
    case "PLAYER_SERVER_INIT":
      player = new playerObject();
      player.addConnection(connection);
      connection["player"] = player;
      connection["map"] = map_1;
      connection.sendText(
        makeResponseData("PLAYER_SERVER_INIT_OVER", player.getPlayerData())
      );
      break;
    case "PLAYER_CLIENT_INIT_OVER":
      player = connection.player;
      player.start();
      map_1.addPlayer(player);
      break;
    case "PLAYER_OPERATION":
      player = connection.player;
      player.operation(result.data);
      break;
  }
};

const connectCallback = (server, result, connection) => {
  connection.sendText(makeResponseData("CONNECT_SUCCESS", null));
};

const closeConnectCallback = (server, result, connection) => {
  map_1.deletePlayer(connection.player);
};

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
