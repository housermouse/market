# 1
Vue-cli+ElementUI+express 超市管理系统

##market
market安装依赖
yarn/cnpm i 
启动服务器
yarn serve

##serve
serve安装依赖
yarn/cnpm i
启动服务器
start.bat/yarn start


###登录板块###
token 
router 

###用户管理模块###

增删改查
批量修改/删除
分页
模糊查询
修改密码
用户名回填

###商品管理模块###
增删改查
批量修改/删除
分页
模糊查询

###入库管理模块###
增删改查
批量修改/删除
分页
模糊查询

###统计模块###
半成品

###会员管理模块###
增删改查
批量修改/删除
分页
模糊查询


###用户模块表设计###
CREATE TABLE `t_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `avatarUrl` text,
  `role` int(11) DEFAULT NULL,
  `inputTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;



###商品模块表设计###
CREATE TABLE `t_commodity` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `category` varchar(50) DEFAULT NULL,
      `barCode` varchar(50) DEFAULT NULL,
      `name` varchar(50) DEFAULT NULL,
      `salePrice` float(10,2) DEFAULT NULL,
      `marketPrice` float(10,2) DEFAULT NULL,
      `stockPrice` float(10,2) DEFAULT NULL,
      `stockCount` int(11) DEFAULT NULL,
      `commodityWeight` float(10,2) DEFAULT NULL,
      `commodityUnit` varchar(10) DEFAULT NULL,
      `vipDiscount` varchar(10) DEFAULT NULL,
      `promotion` varchar(10) DEFAULT NULL,
      `goodsDesc` text,
      PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


###入库表设计和会员表设计###
详情参见router里参数，添加一个id即可。会员需添加inputTime


###数据库###

	增加：
		INSERT INTO table_name(key,key1,key2) VALUES(value,value1,value2)

	删除：
		DELETE FROM table_name WHERE condition;

	修改：
		UPDATE table_name SET field1=newvalue, field2=newvalue WHERE runoob_id=3;

	查询：
		SELECT * FROM table_name WHERE 参数
		示例：SELECT * FROM table_name WHERE username='zhangsan' && pwd='12'
		
		
	**高级用法**
		联合查询：
			SELECT b.*, u.username FROM borrowmoney b JOIN user u ON b.userid=u.id
		分页查询：
			SELECT * FROM table_name LIMIT 5,10; // 检索指定记录，从索引5开始，找到10条数据
		获取数据条数：
			SELECT COUNT(*) FROM table_name

借鉴至 https://github.com/yaojwen/1.git