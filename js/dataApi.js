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
        db.colose();
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