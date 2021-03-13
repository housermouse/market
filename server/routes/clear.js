/*
	商品模块路由
*/
var express = require('express');
var router = express.Router();

// 引入数据库连接模块
const connection = require('../db/mysqlConn')


// SQL拼装函数
function getSql(barCode, customer, id, saled) {
    // 1.准备
    let sql = 'SELECT id,category,barCode,name,salePrice,marketPrice,stockPrice,stockCount,commodityWeight,commodityUnit,customer FROM t_shopping_cart';
    // 是否是第一个条件的标志
    let first = true;

    // 2.执行判断
    if (barCode && barCode != "") {
        if (first) { // 第一个条件
            sql += ` WHERE barCode='${barCode}'`
        } else {// 不是第一个条件
            sql += ` AND barCode='${barCode}'`
        }

        first = false
    }

    // 2.执行判断
    if (customer && customer != "") {
        if (first) { // 第一个条件
            sql += ` WHERE customer='${customer}'`
        } else {// 不是第一个条件
            sql += ` AND customer='${customer}'`
        }

        first = false
    }

    // 2.执行判断
    if (id && id != "") {
        if (first) { // 第一个条件
            sql += ` WHERE id='${id}'`
        } else {// 不是第一个条件
            sql += ` AND id='${id}'`
        }

        first = false
    }

    // 2.执行判断
    if (saled && saled != "") {
        if (first) { // 第一个条件
            sql += ` WHERE saled='${saled}'`
        } else {// 不是第一个条件
            sql += ` AND saled='${saled}'`
        }

        first = false
    }

    // 3.结果
    return sql;
}

//渲染列表
router.post('/getClearList', function (req, resp) {
    // 1. 准备
    const {barCode, name} = req.body;
    // resp.send(getSql(category, searchKey));
    // 2) 执行SQL
    connection.query(getSql(barCode, name, "", "0"), function (error, data) {
        if (error) throw error;
        // 3. 结果
        resp.send(data);
    })
});


// 删除数据
router.get("/deletedata", (req, res) => {

    //接收参数
    let {id} = req.query;

    //准备sql
    let sqlStr = `delete from t_commodity where id='${id}'`;
    //执行sql
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;

        if (data.affectedRows === 1) {
            res.send({code: 0, reason: "删除商品成功"})
        } else {
            res.send({code: 1, reason: "删除商品失败"})
        }

    })

})


// 更新用户
router.post('/clearProduct', (req, resp) => {
    const {data, name} = req.body;
    connection.query(getSql(data.barCode, name, "", "0"), function (error, getData) {
        if (error) throw error;
        const sql = `UPDATE t_commodity SET stockCount=${parseInt(data.stockCount) - parseInt(data.buyCount)} WHERE barCode=${data.barCode}`
        connection.query(sql, (err) => {
            if (err) throw err;
            if (getData.length > 0) {
                var count = getData[0].stockCount;
                const sql = `UPDATE t_shopping_cart SET  stockCount='${parseInt(count) + parseInt(data.buyCount)}' WHERE barCode=${data.barCode}`
                connection.query(sql, (err, result) => {
                    if (err) throw err;

                    if (result.affectedRows === 1) { // 影响1行,代表成功修改
                        resp.send({
                            success: true,
                            message: '用户修改成功!'
                        })
                    } else {
                        resp.send({
                            success: false,
                            message: '用户修改失败!'
                        })
                    }
                })
            } else {
                const addSql = `INSERT INTO t_shopping_cart(category,barCode,name,salePrice,marketPrice,stockPrice,stockCount,commodityWeight,commodityUnit,vipDiscount,promotion,goodsDesc,customer,saled) 
                VALUES('${data.category}','${data.barCode}','${data.name}',${data.salePrice},${data.marketPrice},${data.stockPrice},${data.buyCount},'${data.commodityWeight}','${data.commodityUnit}','${data.vipDiscount}','${data.promotion}','${data.goodsDesc}','${name}','0')`
                connection.query(addSql, (err, result) => {
                    if (err) throw err;

                    // 3、 响应结果
                    // 判断是否成功添加了1条数据
                    if (result.affectedRows === 1) {
                        resp.send({
                            success: true,
                            message: '产品入库成功！'
                        })
                    } else {
                        resp.send({
                            success: false,
                            message: '产品入库失败，请联系管理员！'
                        })
                    }
                })
            }
        })
    })
    // connection.query(sql,(err,result)=>{
    //     if(err) throw err;
    //
    //     if(result.affectedRows===1){ // 影响1行,代表成功修改
    //         resp.send({
    //             success:true,
    //             message:'用户修改成功!'
    //         })
    //     }else{
    //         resp.send({
    //             success:false,
    //             message:'用户修改失败!'
    //         })
    //     }
    // })
})


// 用户添加
router.post('/productAdd', (req, resp) => {
    // 1、接受请求参数
    const {
        category,
        barCode,
        name,
        salePrice,
        marketPrice,
        stockPrice,
        stockCount,
        commodityWeight,
        commodityUnit,
        vipDiscount,
        promotion,
        goodsDesc
    } = req.body;

    // 2、处理请求
    // 2.1 用户添加第一步：  验证用户名是否重复
    const sql = `SELECT * FROM t_commodity WHERE name='${name}'`
    connection.query(sql, (err, result) => {
        // 判断结果
        if (err) throw err;

        // 判断
        if (result.length > 0) {  //出现重复
            resp.send({
                success: false,
                message: "产品已重复,请重新输入"
            })
        } else { // 新用户名可用
            // 2.2 用户添加第二步：  用户的添加
            const addSql = `INSERT INTO t_commodity(category,barCode,name,salePrice,marketPrice,stockPrice,stockCount,commodityWeight,commodityUnit,vipDiscount,promotion,goodsDesc) VALUES('${category}','${barCode}','${name}',${salePrice},${marketPrice},${stockPrice},${stockCount},'${commodityWeight}','${commodityUnit}','${vipDiscount}','${promotion}','${goodsDesc}')`
            console.log(addSql);
            connection.query(addSql, (err, result) => {
                if (err) throw err;

                // 3、 响应结果
                // 判断是否成功添加了1条数据
                if (result.affectedRows === 1) {
                    resp.send({
                        success: true,
                        message: '产品添加成功！'
                    })
                } else {
                    resp.send({
                        success: false,
                        message: '产品添加失败，请联系管理员！'
                    })
                }
            })
        }
    })
})


//用户分页
router.get("/getdatabypage", (req, resp) => {

    //接收请求参数
    let {pageSize, currentPage, saled} = req.query;
    let start = (currentPage - 1) * pageSize;
    let sql = `SELECT * FROM t_shopping_cart`
    if (saled != null && saled != "") {
        sql += ` WHERE saled = ${saled}`
    }
    sql += ` LIMIT ${start},${pageSize}`

    connection.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const countSql = 'SELECT COUNT(id) total FROM t_shopping_cart'
            connection.query(countSql, (err, countResult) => {
                resp.send({
                    data: result,
                    total: countResult[0].total
                })
            })
        } else {
            resp.send([])
        }
    })
})


//删除选中的用户数据
router.get("/batchdel", (req, res) => {

    //接收请求参数
    let {IdArr} = req.query; //IdArr是个数组
    //准备sql
    for (let id in IdArr) {
        connection.query(getSql("", "", IdArr[id]), function (error, getData) {
            if (error) throw error;
            console.log(getData)
            if (getData.length > 0) {
                const getproductSql = `select * from t_commodity where barCode = '${getData[0].barCode}'`;
                connection.query(getproductSql, function (error, getProductData) {
                    if (error) throw error;
                    console.log(getproductSql)
                    if (getProductData.length > 0) {
                        const sql = `UPDATE t_commodity SET stockCount=${parseInt(getData[0].stockCount) + parseInt(getProductData[0].stockCount)} WHERE barCode=${getData[0].barCode}`
                        connection.query(sql, (err) => {
                            if (err) throw err;
                        })
                    }
                })

            }
        })
    }
    //执行sql
    let sqlStr = `DELETE FROM t_shopping_cart WHERE id IN (${IdArr})`;
    connection.query(sqlStr, (err, data) => {
        if (err) throw err;
        // res.send(sqlStr)
        if (data.affectedRows > 0) {
            res.send({code: 0, reason: "删除商品成功"})
        } else {
            res.send({code: 1, reason: "删除商品失败"})
        }

    })
})
//渲染列表
router.post('/getHistoryList', function (req, resp) {
    // 1. 准备
    const {barCode, name} = req.body;
    // resp.send(getSql(category, searchKey));
    // 2) 执行SQL
    console.log(req.body)
    connection.query(getSql(barCode, name, "", "1"), function (error, data) {
        if (error) throw error;
        // 3. 结果
        resp.send(data);
    })
});

//渲染列表
router.post('/clearOut', function (req, resp) {
    // 1. 准备
    const {name} = req.body;
    // resp.send(getSql(category, searchKey));
    // 2) 执行SQL
    console.log(req.body);
    let sql = `update t_shopping_cart set saled = '1' where customer = '${name}' and saled = '0'`
    connection.query(sql, function (error, data) {
        if (error) throw error;
        // 3. 结果
        resp.send(data);
    })
});
module.exports = router;