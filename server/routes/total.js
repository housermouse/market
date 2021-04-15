/*
	商品模块路由
*/

var express = require('express');
var router = express.Router();
var moment = require('moment');

// 引入数据库连接模块
const connection = require('../db/mysqlConn')

//渲染列表
router.post('/getTotalMessage', function (req, resp) {
    // 1. 准备
    // 2) 执行SQL
    let option = {}
    let today = moment().startOf('day').format('x');
    let tomorrow = moment().endOf('day').format('x');
    console.log(today);
    let sql = `select SUM(salePrice) as total from t_shopping_cart where saleTime>'${today}' and saleTime<'${tomorrow}'`;
    connection.query(sql, function (error, data) {
        if (error) throw error;
        // 3. 结果
        option.today = data[0].total ? data[0].total : 0;
        let yesterday = moment().subtract(1, 'day').startOf('day').format('x');
        let sql = `select SUM(salePrice) as total from t_shopping_cart where saleTime>'${yesterday}' and saleTime<'${today}'`;
        connection.query(sql, function (error, data) {
            if (error) throw error;
            option.yesterday = data[0].total ? data[0].total : 0;
            let _2day = moment().subtract(2, 'day').startOf('day').format('x');
            let sql = `select SUM(salePrice) as total from t_shopping_cart where saleTime>'${_2day}' and saleTime<'${yesterday}'`;
            connection.query(sql, function (error, data) {
                if (error) throw error;
                option._2day = data[0].total ? data[0].total : 0;
                let _3day = moment().subtract(3, 'day').startOf('day').format('x');
                let sql = `select SUM(salePrice) as total from t_shopping_cart where saleTime>'${_2day}' and saleTime<'${_3day}'`;
                connection.query(sql, function (error, data) {
                    if (error) throw error;
                    option._3day = data[0].total ? data[0].total : 0;
                    let _4day = moment().subtract(4, 'day').startOf('day').format('x');
                    let sql = `select SUM(salePrice) as total from t_shopping_cart where saleTime>'${_3day}' and saleTime<'${_4day}'`;
                    connection.query(sql, function (error, data) {
                        if (error) throw error;
                        option._4day = data[0].total ? data[0].total : 0;
                        resp.send(option);
                    })
                })
            })
        })
    })
});

router.post('/getTotalAmount', function (req, resp) {
    let sql = `select SUM(salePrice) as total from t_shopping_cart`;
    connection.query(sql, function (error, data) {
        if (error) throw error;
        resp.send(data[0]);
    });
});

router.post('/getPopularList', function (req, resp) {
    let sql = `SELECT SUM(stockCount) as sumCount,name FROM t_shopping_cart GROUP BY name ORDER BY sumCount DESC limit 10`;
    connection.query(sql, function (error, data) {
        if (error) throw error;
        resp.send(data);
    });
});

router.post('/getLackList', function (req, resp) {
    let sql = `SELECT name FROM t_commodity where stockCount<10 ORDER BY stockCount asc limit 10`;
    connection.query(sql, function (error, data) {
        if (error) throw error;
        resp.send(data);
    });
});
module.exports = router;