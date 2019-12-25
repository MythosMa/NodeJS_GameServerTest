class PlayerObject {
    constructor() {
        this.dt = 1 / 60;
        this.update = null;

        this.State = {
            STATE_STAND: 1,
            STATE_WALK_LEFT : 2,
            STATE_WALK_RIGHT : 3,
        }

        this.playerData = {
            playerId: this.makeUUID(),
            playerName: "player" + Math.ceil(Math.random() * 100),
            playerAttribute: {
                logout: false,
                currentState: this.State.STATE_STAND,
                moveSpeed: 150.0,
                position: {
                    x: -500,
                    y: -460
                },
                scale: {
                    x: 3,
                    y: 3
                }
            }
        }
        this.connection = null;
    }

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

    operation(data) {
        this.playerData.playerAttribute.currentState = data.state;
    }

    start() {
        this.update = setInterval(() => {
            if(!this.playerData.playerAttribute) {
                return;
            }
            switch(this.playerData.playerAttribute.currentState) {
                case this.State.STATE_STAND:
                    break;
                case this.State.STATE_WALK_LEFT:
                    this.walkLeft();
                    break;
                case this.State.STATE_WALK_RIGHT:
                    this.walkRight();
                    break;
            }
            if(this.connection) {
                let map = this.connection.map;
                let mapData = map.getMapInfo();
                let data = {
                    dataType: "GAME_PLAYER_DATA",
                    data: mapData
                }
                this.connection.sendText(JSON.stringify(data));
            }
        }, this.dt * 1000);
    }

    end() {
        this.playerData.playerAttribute.logout = true;
        clearInterval(this.update);
    }

    walkLeft() { 
        let dis = this.playerData.playerAttribute.moveSpeed * this.dt;
        this.playerData.playerAttribute.position.x = this.playerData.playerAttribute.position.x - dis;
        this.playerData.playerAttribute.scale.x = Math.abs(this.playerData.playerAttribute.scale.x) * -1;
    }

    walkRight() {
        let dis = this.playerData.playerAttribute.moveSpeed * this.dt;
        this.playerData.playerAttribute.position.x = this.playerData.playerAttribute.position.x + dis;
        this.playerData.playerAttribute.scale.x = Math.abs(this.playerData.playerAttribute.scale.x);
    }

}

module.exports = PlayerObject;