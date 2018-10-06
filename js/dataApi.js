'use strict'
var _ = require('underscore');
var Q = require('q');
var sqlite3 = require('sqlite3').verbose();
var db = null;
var curDBFileName = '';//当前数据库路径

/**
 * 切换数据库
 * @param {String} dbFile 数据库绝对路径
 * @return {Promise} 引用索引 
 */
function changeDB(dbFile) {
    if (curDBFileName == dbFile) {
        return Promise.resolve(db);
    }
    let defered = Q.defer();
    if (db != null) {
        db.close();
        db = null;
    }
    db = new sqlite3.Database(dbFile, function (err, data) {
        if (!err) {
            curDBFileName = dbFile;
            defered.resolve(db);
        } else {
            defered.reject(err);
        }
    });
    return defered.promise;
}
/**获取DB*/
function getDB(path) {
    if (path) {
        return changeDB(path);
    } else if (db) {
        return Promise.resolve(db);
    } else {
        return Promise.reject(new Error('数据库尚未初始化！'));
    }
}
/**将数据封装为通用格式 */
function sendData(d) {
    return {
        error: 0,
        msg: '',
        data: d,
        other:''
    }
}
/**将Error封装为通用格式 */
function sendAsError(err) {
    return {
        error: 1,
        mag: err.msg || err,
        data: '',
        other:''
    }
}
/**默认错误处理*/
function onError(err) {
    console.log(err);
    console.log(err.stack);
    throw new Error(err);
}
/** 封装错误 */
function asError(err) {
    return sendAsError(err);
}
/**通用查询接口*/
function getCommonData(db, sql, callback) {
    const supportActionType = {
        'insert': 'run',
        'update': 'run',
        'delete': 'run',
        'replac': 'run',
        'select': 'all'
    };
    var sqlActioType = sql.slice(0, 6).toLowerCase();
    if (!sqlActioType in supportActionType) {
        console.log("sql语句错误：" + sql);
        throw new Error('操作类型不支持' + sqlActioType);
    }
    var actionType = supportActionType[sqlActioType];
    let defered = Q.defer();
    db[actionType](sql, function (err, data) {
        if (err) {
            console.log(err);
            if (callback) {
                callback(asError(err), null);
            } else {
                defered.reject(asError(err));
            }
        } else {
            if (callback) {
                callback(null, asData(data));
            } else {
                defered.resolve(asData(data));
            }
        }
    });
    return defered.promise;
}
//通用查询接口 -for 数据库
function getData(dbPath, sql) {
    if (!sql && dbPath) {
        sql = dbPath;
        dbPath = curDBFileName;
    }
    return getDB(dbPath).then(function () {
        return getCommonData(db, sql);
    }, onError).catch(onError);
}
//封装数据
function asData(objData) {
    return sendData(objData);
}
//封装错误
function asError(err) {
    return sendAsError(err);
}
//获取所有日志信息列表
function getAllShareLog() {
    return getData(`SELECT * from share_log;`);
}
//获取所有的日志类型
function getAllShareType() {
    return getData(`SELECT * from account_type;`);
}
//根据id获取指定日志记录
function getShareLogById(id) {
    return getData(`SELECT * from share_log where guid = '${id}';`);
}

exports.getAllShareLog = getAllShareLog;
exports.getAllShareType = getAllShareType;
exports.getShareLogById = getShareLogById;
exports.changeDB = changeDB;