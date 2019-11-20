const redis = require('redis');
const client = redis.createClient(8888);

client.on('ready', (error) => {
    console.log('redis ready error : ' + error);
});

client.on('error', (error) => {
    console.log('redis error error : ' + error);
});

client.on('connect'. (error) => {
    console.log('redis connect error : ' + error);
});

let redisDB = {};

//设置操作
redisDB.set = (key, value, expire, callback) => {
    client.set(key, value, (err, result) => {
        if(err) {
            console.log('redis client set error : ' + err);
            callback && callback(err);
            return;
        }
        if(expire && !isNaN(expire) && expire > 0) {
            client.expire(key, parseInt(expire));
        }

        callback && callback(result);
    });
};

//获取操作
redisDB.get = (key, callback) => {
    client.get(key, (err, result) => {
        if(err) {
            console.log('redis client get error : ' + err);
            callback && callback(err);
            return;
        }
        callback && callback(result);
    });
};

//哈希操作
redisDB.hset = (key, filed, val, callback) => {
    client.hset(key, filed, val, (err, result) => {
        if(err) {
            console.log('redis client hset error : ' + err);
            callback && callback(err);
            return;
        }
        callback && callback(result);
    });
};

redisDB.hget = () => {
    client.hget(key, filed, (err, result) => {
        if(err) {
            console.log('redis client hget error : ' + err);
            callback && callback(err);
            return;
        }
        callback && callback(result);
    });
}


export default redisDB;