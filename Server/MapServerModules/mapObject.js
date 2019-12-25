const playerObj = require("../../modules/PlayerObject");

class MapObject {
    constructor(mapName) {
        this.mapName = mapName;
        this.npcs = [];
        this.players = [];
    }
    init() {

    }
    addPlayer(player) {
        for(let i in this.players) {
            let playerItem = this.players[i];
            if(player.getPlayerData().playerId === playerItem.getPlayerData().playerId) {
                return;
            }
        }
        this.players.push(player);
    }
    deletePlayer(player) {
        player.end();
        setTimeout(() => {
            this.players.splice(this.players.indexOf(player), 1);
        }, 1000);
    }
    sayHello() {
        console.log("hello -> " + this.mapName);
    }
    getMapInfo() {
        return {
            npcs: this.npcs.map((item) => {return null}),
            players: this.players.map((item) => {return item.getPlayerData()})
        }
    }
}

module.exports = MapObject;