class MapObject {
    constructor(mapName) {
        this.mapName = mapName;//地图名称
        this.npcs = [];//地图中npc的数组
        this.players = [];//地图中玩家的数组
    }

    //客户端连接完毕，创建玩家的数据信息后将其放入地图的玩家数组中
    addPlayer(player) {
        for(let i in this.players) {
            let playerItem = this.players[i];
            if(player.getPlayerData().playerId === playerItem.getPlayerData().playerId) {
                return;
            }
        }
        this.players.push(player);
    }
    /**
     * 监听到玩家离开地图，要从数组中将玩家信息删除
     * 因为玩家离开后，需要通知其他还在连接中的玩家
     * 所以延迟从数组中删掉，是为了给其他玩家发送地图玩家数据时标记玩家退出
     */
    deletePlayer(player) {
        setTimeout(() => {
            this.players.splice(this.players.indexOf(player), 1);
        }, 1000);
    }

    //地图信息，将npc和玩家数据打包成数据集
    getMapInfo() {
        return {
            npcs: this.npcs.map((item) => {return null}),
            players: this.players.map((item) => {return item.getPlayerData()})
        }
    }
}

module.exports = MapObject;