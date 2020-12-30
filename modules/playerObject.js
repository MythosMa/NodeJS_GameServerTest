class PlayerObject {
  //构造函数中的相关初始化，玩家角色状态
  constructor() {
    this.dt = 1 / 60; //因为游戏的设计帧率是60帧，所以服务器在计算数据的时候，也选择60帧(即每秒进行60次计算)
    this.update = null; //循环计时器

    //角色状态参数，站立，向左右方向行走
    this.State = {
      STATE_STAND: 1,
      STATE_WALK_LEFT: 2,
      STATE_WALK_RIGHT: 3
    };

    //玩家角色数据集，初始化随机的id和随机的名字
    this.playerData = {
      playerId: this.makeUUID(),
      playerName: "player" + Math.ceil(Math.random() * 100),
      playerAttribute: {
        //角色数据
        logout: false, //是否退出地图的标示符
        currentState: this.State.STATE_STAND, //角色当前状态
        moveSpeed: 150.0, //角色移动速度
        position: {
          //角色在地图中的坐标
          x: -500,
          y: -460
        },
        scale: {
          //角色动画的缩放参数，角色的面向是通过缩放参数来控制的
          x: 3,
          y: 3
        }
      }
    };
    this.connection = null; //角色的websocket连接对象
  }

  //获取到角色的相关数据，用在map中生成数据合集
  getPlayerData() {
    return this.playerData;
  }

  addConnection(connection) {
    this.connection = connection;
  }

  makeUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  //接收玩家的操作，目前只有操控移动，所以这里是根据操作改变角色状态
  operation(data) {
    this.playerData.playerAttribute.currentState = data.state;
  }

  /**
   * 角色在服务器生成后，需要发送消息到客户端
   * 客户端进行角色人物动画加载，加载完成后，再通知服务器可以开始角色数据运算
   * 这里使用定时器循环计算
   */

  start() {
    this.update = setInterval(() => {
      if (!this.playerData.playerAttribute) {
        return;
      }
      switch (this.playerData.playerAttribute.currentState) {
        case this.State.STATE_STAND:
          break;
        case this.State.STATE_WALK_LEFT:
          this.walkLeft();
          break;
        case this.State.STATE_WALK_RIGHT:
          this.walkRight();
          break;
      }
      //计算完成后，通过websocket的连接对象，连同地图中全部的npc和角色信息，一并返回给客户端
      if (this.connection) {
        let map = this.connection.map;
        let mapData = map.getMapInfo();
        let data = {
            /**
             * 数据格式暂定
             * dataType 数据操作指令
             * data 数据
             */
          dataType: "GAME_PLAYER_DATA",
          data: mapData
        };
        this.connection.sendText(JSON.stringify(data));
      }
    }, this.dt * 1000);
  }

  //标记角色离开地图，停止数据计算
  end() {
    this.playerData.playerAttribute.logout = true;
    clearInterval(this.update);
  }

  //计算角色移动后的坐标，和处理面向
  walkLeft() {
    let dis = this.playerData.playerAttribute.moveSpeed * this.dt;
    this.playerData.playerAttribute.position.x =
      this.playerData.playerAttribute.position.x - dis;
    this.playerData.playerAttribute.scale.x =
      Math.abs(this.playerData.playerAttribute.scale.x) * -1;
  }

  walkRight() {
    let dis = this.playerData.playerAttribute.moveSpeed * this.dt;
    this.playerData.playerAttribute.position.x =
      this.playerData.playerAttribute.position.x + dis;
    this.playerData.playerAttribute.scale.x = Math.abs(
      this.playerData.playerAttribute.scale.x
    );
  }
}

module.exports = PlayerObject;
