<template>
  <div class="product" style="min-width:1100px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>历史订单管理</h3>
      </div>
      <div class="text item">
        <!-- 表单 -->
        <el-form :inline="true" :model="searchForm">
          <!--                    <el-form-item>-->
          <!--                        <el-select style="width:150px"-->
          <!--                                   v-model="searchForm.category"-->
          <!--                                   placeholder="== 选择分类 =="-->
          <!--                                   size="small"-->
          <!--                        >-->
          <!--                            <el-option label="全部分类" value=""></el-option>-->
          <!--                            <el-option label="饮品" value="饮品"></el-option>-->
          <!--                            <el-option label="食品类" value="食品类"></el-option>-->
          <!--                            <el-option label="香烟" value="香烟"></el-option>-->
          <!--                            <el-option label="酒类" value="酒类"></el-option>-->
          <!--                            <el-option label="干货类" value="干货类"></el-option>-->
          <!--                            <el-option label="果蔬/生鲜" value="果蔬/生鲜"></el-option>-->
          <!--                            <el-option label="调味品" value="调味品"></el-option>-->
          <!--                            <el-option label="百货类" value="百货类"></el-option>-->
          <!--                            <el-option label="日用品" value="日用品"></el-option>-->
          <!--                        </el-select>-->
          <!--                    </el-form-item>-->
          <el-form-item label="关键字：">
              <el-input
                      style="width:200px"
                      clearable
                      v-model="searchForm.buyMan"
                      placeholder="(客户)"
                      size="small"
              ></el-input>
          </el-form-item>
          <el-form-item label="开始时间：">
            <el-date-picker
                style="width:200px"
                clearable
                v-model="searchForm.startTime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：">
            <el-date-picker
                style="width:200px"
                clearable
                v-model="searchForm.endTime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="doSearch">查询</el-button>
<!--            <el-button type="primary" size="small" @click="batchclear">全部打印</el-button>-->
          </el-form-item>
        </el-form>
        <!-- 表格 -->
        <el-table
            :data="tableData"
            @selection-change="SelectionChange"
            stripe
            ref="tableData"
            tooltip-effect="dark"
            style="width: 100%;background:transparent;height: 400px;overflow-y: scroll; color: white;"

        >
          <!--table的属性 @selection-change="handleSelectionChange" -->
          <!--                    <el-table-column prop="barCode" label="条形码"></el-table-column>-->
          <el-table-column prop="saledId" label="订单号"></el-table-column>
          <el-table-column prop="buyMan" label="客户"></el-table-column>
          <!--                  <el-table-column prop="salePrice" label="商品(元)"></el-table-column>-->
          <!--                    <el-table-column prop="stockPrice" label="进价(元)"></el-table-column>-->
          <!--                    <el-table-column prop="marketPrice" label="市场价(元)"></el-table-column>-->
          <!--                  <el-table-column prop="stockCount" label="数量"></el-table-column>-->
          <!--                  <el-table-column prop="commodityWeight" label="商品产地"></el-table-column>-->
          <el-table-column prop="saleTime" label="下单时间" :formatter="renderInputTime"></el-table-column>
          <el-table-column label="操作" width='180px'>
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">
                <i class="el-icon-edit"></i>编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
            style="margin-top:20px;background:transparent"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[1, 3, 5, 10]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>

        <!--                &lt;!&ndash; 按钮 &ndash;&gt;-->
        <!--                <div style="margin-top:20px">-->
        <!--                    <el-button type="danger" size="mini" @click="batchdel">批量删除</el-button>-->
        <!--                    <el-button type="primary" size="mini" @click="deselect">取消选择</el-button>-->
        <!--                </div>-->
      </div>
    </el-card>


    <!-- 修改弹窗 -->
    <el-dialog title="历史订单" style="width: 2000px" :visible.sync="dialogFormVisible">
      <el-table
          :data="saledData"
          stripe
          ref="saledData"
          tooltip-effect="dark"
          style="width: 100%;height: 350px;overflow-y: scroll;"

      >
        <el-table-column style="color: black;" prop="saledId" label="订单号"></el-table-column>
        <el-table-column width="110" prop="name" label="商品名称"></el-table-column>
        <el-table-column width="80" prop="category" label="商品分类"></el-table-column>
        <el-table-column width="80" prop="salePrice" label="商品(元)"></el-table-column>
        <!--                    <el-table-column prop="stockPrice" label="进价(元)"></el-table-column>-->
        <!--                    <el-table-column prop="marketPrice" label="市场价(元)"></el-table-column>-->
        <el-table-column width="50" prop="stockCount" label="数量"></el-table-column>
        <el-table-column width="80" prop="commodityWeight" label="商品产地"></el-table-column>
        <el-table-column width="75" prop="commodityUnit" label="单位(克)"></el-table-column>
        <el-table-column width="75" prop="buyMan" label="客户"></el-table-column>
        <el-table-column prop="saleTime" label="下单时间" :formatter="renderInputTime"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchclear()">打 印</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>

import {
  getHistoryList,
  productDelete,
  updateProduct,
  batchdelProduct, getLoginUsername,
} from "@/api/apis.js";
import * as printJS from "print-js";
import moment from "moment";

export default {
  data() {
    return {
      searchForm: {
        category: "",
        searchKey: "",
        saledId: "",
        startTime:"",
        endTime:"",
        buyMan:""
      },
      saledData: [],
      tableData: [],
      currentSaledId: '',
      name: '',
      editForm: {
        birthDay: '',
        saleTime: ''
      },

      // dialog对话框的默认显示状态
      dialogFormVisible: false,
      editId: "",
      IdArr: [], //选中数据的id

      // 分页
      InventorytableData: [],
      currentPage: 1, //当前页
      pageSize: 5, //每页数据条数
      total: 10, //总数据条数
      visible: false
    };
  },
  methods: {

    //渲染页面
    getHistoryList(searchForm, name) {
      getHistoryList({currentPage:this.currentPage, pageSize:this.pageSize}, name).then(data => {
        // 把结果更新到数据对象,由双向绑定完成页面更新
        this.tableData = data.data;
        this.total = data.total;
      });
    },

    //查询用户
    doSearch() {
      const _this = this;
      const {buyMan,startTime,endTime} = this.searchForm
      if(moment(startTime).valueOf()>moment(endTime).valueOf()){
        this.$message.error('开始时间不能大于结束时间');
        return;
      }
      getHistoryList({buyMan,startTime,endTime,currentPage:'1', pageSize:'5'}, _this.name)
          .then(data => {
            this.tableData = data.data;
            this.total = data.total;
          })
    },
    // 渲染时间
    renderInputTime(r, col, val) {
      // moment函数参数需要处理的时间对象
      // format时间处理格式

      // eslint-disable-next-line no-console
      return moment(parseInt(val)).format("YYYY-MM-DD HH:mm:ss");
    },

    //删除
    handleDelete(id) {
      //提示用户 是否进行此操作
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            //成功
            productDelete(id)
                .then(res => {
                  //接收响应数据
                  let {code, reason} = res;
                  //判断
                  if (code === 0) {
                    //成功
                    this.$message({
                      type: "success",
                      message: reason
                    });
                    //重新刷新页面 -- 再次请求数据
                    this.getHistoryList("", name);
                  } else if (code === 1) {
                    //失败
                    this.$message.error(reason);
                  }
                })
          })
          .catch(() => {
          });
    },

    //修改信息、再渲染
    updateProduct() {
      const _this = this;

      updateProduct(this.editForm).then(result => {
        if (result.success) {
          this.$message({
            // 修改成功
            type: "success",
            message: result.message,
            duration: 500,
            onClose() {
              // 先隐藏对话框
              _this.dialogFormVisible = false;
              // 刷新页面
              _this.getHistoryList("", name);
            }
          });
        } else {
          this.$message({
            // 删除失败
            type: "error",
            message: result.message
          });
        }
      });
    },


    handleEdit(row) {
      const _this = this;
      getHistoryList({saledId: row.saledId}, _this.name)
          .then(data => {
            _this.saledData = data.data;
            _this.currentSaledId = row.saledId;
            // 显示对话框
            this.dialogFormVisible = true;
          })

      // 手动把行数据,更新form对象上即可
      // this.editForm = row;
    },

    // 分页
    ajaxgetListProduct() {
      getHistoryList({currentPage:this.currentPage, pageSize:this.pageSize,saled:"1"}).then(res => {
        this.tableData = res.data;
        this.total = res.total;
      });
    },

    handleSizeChange(pageSize) {
      //每页条数
      this.pageSize = pageSize;
      //调用显示当前页数据函数
      this.ajaxgetListProduct();
    },
    handleCurrentChange(NewcurrentPage) {
      //当前页
      this.currentPage = NewcurrentPage;
      //调用显示当前页数据函数
      this.ajaxgetListProduct();
    },

    SelectionChange(data) {
      //当选择项发生变化时会触发该事件 -- 批量删除
      // eslint-disable-next-line no-console
      this.IdArr = data.map(v => v.id); //取出所有数据的id们
    },
    batchclear() {
      const _this = this;
      getHistoryList({saledId: _this.currentSaledId}, _this.name)
          .then(resultData => {
            // eslint-disable-next-line no-console
            this.list = resultData.data || [];
            let data = []
            for (let i = 0; i < this.list.length; i++) {
              data.push({
                name: this.list[i].name,
                category: this.list[i].category,
                salePrice: this.list[i].salePrice,
                stockCount: this.list[i].stockCount,
                commodityWeight: this.list[i].commodityWeight,
                commodityUnit: this.list[i].commodityUnit,
                marketPrice: this.list[i].marketPrice + '天',
                birthDay: this.list[i].birthDay == null ? '-' : moment(parseInt(this.list[i].birthDay)).format('YYYY-MM-DD'),
              })
            }
            printJS({
              documentTitle: this.list[0].shopName,
              printable: data,
              properties: [
                {
                  field: 'name',
                  displayName: '商品名称',
                  columnSize: 1
                },
                {
                  field: 'category',
                  displayName: '商品分类',
                  columnSize: 1
                },
                {
                  field: 'salePrice',
                  displayName: '售价',
                  columnSize: 1
                },
                {
                  field: 'stockCount',
                  displayName: '数量',
                  columnSize: 1
                },
                {
                  field: 'commodityWeight',
                  displayName: '商品产地',
                  columnSize: 1
                },
                {
                  field: 'commodityUnit',
                  displayName: '单位',
                  columnSize: 1
                },
                {
                  field: 'marketPrice',
                  displayName: '保质期',
                  columnSize: 1
                },
                {
                  field: 'birthDay',
                  displayName: '生产日期',
                  columnSize: 1
                }
              ],
              type: 'json',
              header: '店铺联系电话：'+this.list[0].shopNumber+' 地址：'+this.list[0].shopAddress+ '--------------------------------------客户姓名：' + this.list[0].buyMan,
              headerStyle: 'font-size:12px;',
              // 样式设置
              gridStyle: 'border: 2px solid #3971A5;',
              gridHeaderStyle: 'color: red;  border: 2px solid #3971A5;'
            })
          })
    },

    batchdel() {
      //批量删除
      //如果用户没有选中 -- 就不用发送请求
      const _this = this;

      if (!_this.IdArr.length) {
        _this.$message.error("请选中需要批量删除的数据！！！");
        return;
      }
      //优化用户体验 -- 警示框
      _this.$confirm("此操作将批量删除选中数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(() => {
            //发送ajax
            batchdelProduct(_this.IdArr)
                .then(res => {
                  //接收响应参数

                  let {code, reason} = res.data;

                  //判断
                  if (code === 0) {
                    //删除成功
                    // eslint-disable-next-line no-console
                    console.log("init");
                    _this.$message({
                      type: "success",
                      message: reason
                    });
                    //刷新网页数据
                    this.ajaxgetListProduct();
                  } else if (code === 1) {
                    //删除失败
                    _this.$message.error(reason);
                  }
                })
                .catch(err => {
                  alert(err)
                });
          })
          .catch(() => {
            _this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
    },

    deselect() {//取消选择
      this.$refs.tableData.clearSelection();
    },
  },
  //页面加载时候调用一次渲染
  mounted() {
    const token = localStorage.getItem('token');
    const _this = this;
    getLoginUsername(token)
        .then((result) => {

          // 成功
          if (result.success) {
            _this.name = result.name;
            _this.getHistoryList("", result.name);
          } else {
            // 失败提示,跳转登录
          }
        })
    this.ajaxgetListProduct();
  }
};
</script>

<style lang="less">
.product {
  .el-card {
    background: transparent;
    padding-bottom: 20px;
    border: 0;

    h3 {
      font-size: 16px;
    }

    label {
      color: #fff
    }
  }
}

.product .el-card .el-card__header {
  padding: 12px 20px;
  background: transparent;
  border-bottom: 0;
}

.product .el-card.is-always-shadow {
  box-shadow: 0 0px 15px 10px rgba(0, 0, 0, 0.1);
  border: 0;

}

.product .el-card .el-card__header h3 {
  color: lightblue;
}

.product .el-table .el-table__row, .product .el-table td, .product .el-table th, .el-table tr {
  background: transparent !important;
  border: 0;
}

.product .el-table td {
  width: 80px !important;
}

.product .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #212e3e !important;
}

.product .el-table::before {
  height: 0;
}

.product table {
  width: 1000px;
  background-color: transparent;
}

.product .el-table div.cell {
  text-align: center;
}

.product .el-pagination__total {
  color: #fff;
}

.product .el-pagination button:disabled, .product .el-pagination .btn-next, .el-pagination .btn-prev, .product .el-pager li {
  background: transparent;
}
</style>