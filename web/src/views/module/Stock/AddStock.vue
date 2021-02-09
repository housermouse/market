<template>
  <div class="addstock">
    <el-card class="box-card">
      <!-- 标题 -->
      <div slot="header" class="clearfix">
        <h3>商品入库</h3>
      </div>
      <!-- 表单内容 -->
      <el-form :model="stock" status-icon :rules="rules" ref="stock" label-width="100px">
        <el-form-item label="商品条码" prop="barCode">
          <el-input type="text" v-model="stock.barCode" auto-complete="off"></el-input>
        </el-form-item>
<!--        <el-form-item label="商品名称" prop="name">-->
<!--          <el-input type="text" v-model="stock.name" auto-complete="off"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="进价" prop="stockPrice">-->
<!--          <el-input v-model="stock.stockPrice"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="数量" prop="stockCount">
          <el-input v-model="stock.stockCount"></el-input>
        </el-form-item>
<!--        <el-form-item label="所属分类" prop="category">-->
<!--          <el-select-->
<!--            v-model="stock.category"-->
<!--            placeholder="== 选择分类 =="-->
<!--            size="small"-->
<!--          >-->
<!--            <el-option label="全部分类" value=""></el-option>-->
<!--            <el-option label="饮品" value="饮品"></el-option>-->
<!--            <el-option label="食品类" value="食品类"></el-option>-->
<!--            <el-option label="香烟" value="香烟"></el-option>-->
<!--            <el-option label="酒类" value="酒类"></el-option>-->
<!--            <el-option label="干货类" value="干货类"></el-option>-->
<!--            <el-option label="果蔬/生鲜" value="果蔬/生鲜"></el-option>-->
<!--            <el-option label="调味品" value="调味品"></el-option>-->
<!--            <el-option label="百货类" value="百货类"></el-option>-->
<!--            <el-option label="日用品" value="日用品"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

        <el-form-item>
          <el-button type="primary" @click="stockAdd()">保存</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>

import { stockAdd } from "@/api/apis.js";

export default {
  data() {
    return {
      stock: {
        barCode: "",
        name: "",
        category: "",
        stockPrice: "",
        stockCount: "",
      },
            rules: {
        barCode: [
          { required: true, message: "请输入商品条形码", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入商品名称", trigger: "change" }
        ],
        category: [
          { required: true, message: "请选择商品分类", trigger: "blur" }
        ],
        stockPrice: [
          { required: true, message: "请输入商品进价(数字)", trigger: "blur" }
        ],
        stockCount: [
          { required: true, message: "请输入入库数量(数字)", trigger: "blur" }
        ]
      },
    };
  },
  methods: {
     stockAdd() {
      // 缓存全局this
      const _this = this;

      stockAdd(this.stock).then(data => {
        if (data.success) {
          // 添加成功
          // 提示成功,自动跳转到入库列表
          _this.$message({
            message: data.message,
            type: "success",
            duration: 500, // 500ms自动挂壁
            onClose() {
              _this.$router.push("/home/InventoryManage"); // 跳转到入库列表
            }
          })
        } else {
          // 提示错误
          _this.$message({
            message: data.message,
            type: "error"
          });
        }
      });
    },
    
  }
};
</script>
<style lang="less">
.addstock {
  width: 700px;
}
.addstock .el-card {
  background: transparent;
  border: 0;
}
.addstock .el-card .el-card__header {
  border-bottom: 0;
}
.addstock .el-card .el-card__header h3 {
  color: lightblue;
  font-size: 16px;
}
.addstock .el-card.is-always-shadow {
  box-shadow: 0 0px 15px 10px rgba(0, 0, 0, 0.1);
}
.addstock input {
  width: 400px;
}
.addstock .el-card label {
  color: #fff;
}
</style>