<template>
    <div class="product" style="min-width:1100px">
        <el-card class="box-card" >
            <div slot="header" class="clearfix">
                <h3>商品出库</h3>
            </div>
            <div class="text item">
                <!-- 表单 -->
                <el-form :inline="true" :model="searchForm">
                    <el-form-item>
                        <el-select style="width:150px"
                                   v-model="searchForm.category"
                                   placeholder="== 选择分类 =="
                                   size="small"
                        >
                            <el-option label="全部分类" value=""></el-option>
                            <el-option label="饮品" value="饮品"></el-option>
                            <el-option label="食品类" value="食品类"></el-option>
                            <el-option label="香烟" value="香烟"></el-option>
                            <el-option label="酒类" value="酒类"></el-option>
                            <el-option label="干货类" value="干货类"></el-option>
                            <el-option label="果蔬/生鲜" value="果蔬/生鲜"></el-option>
                            <el-option label="调味品" value="调味品"></el-option>
                            <el-option label="百货类" value="百货类"></el-option>
                            <el-option label="日用品" value="日用品"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键字：">
                        <el-input
                                style="width:200px"
                                v-model="searchForm.barCode"
                                placeholder="(商品名称，条形码)"
                                size="small"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="doSearch">查询</el-button>
                      <el-button type="primary" size="small" @click="batchclear">全部出库</el-button>
                    </el-form-item>
                </el-form>
                <!-- 表格 -->
                <el-table
                        :data="tableData"
                        @selection-change="SelectionChange"
                        stripe
                        id="print_demo"
                        ref="tableData"
                        tooltip-effect="dark"
                        style="width: 100%;background:transparent;height: 400px;overflow-y: scroll;"

                >
                    <!--table的属性 @selection-change="handleSelectionChange" -->
                    <el-table-column type="selection" width="55"></el-table-column>
<!--                    <el-table-column prop="barCode" label="条形码"></el-table-column>-->
                    <el-table-column prop="name" label="商品名称"></el-table-column>
                    <el-table-column prop="category" label="商品分类"></el-table-column>
                    <el-table-column prop="salePrice" label="商品(元)"></el-table-column>
<!--                    <el-table-column prop="stockPrice" label="进价(元)"></el-table-column>-->
<!--                    <el-table-column prop="marketPrice" label="市场价(元)"></el-table-column>-->
                    <el-table-column prop="stockCount" label="数量"></el-table-column>
                    <el-table-column prop="commodityWeight" label="商品产地"></el-table-column>
                    <el-table-column prop="commodityUnit" label="单位(克)"></el-table-column>
                    <el-table-column label="操作" width='180px'>
                        <template slot-scope="scope">
<!--                            <el-button size="mini"  @click="handleEdit(scope.row)">-->
<!--                                <i class="el-icon-edit"></i>编辑</el-button>-->
                            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">
                                <i class="el-icon-delete"></i>删除</el-button>
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

                <!-- 按钮 -->
                <div style="margin-top:20px">
                    <el-button type="danger" size="mini" @click="batchdel">批量删除</el-button>
                    <el-button type="primary" size="mini" @click="deselect">取消选择</el-button>
                </div>
            </div>
        </el-card>


        <!-- 修改弹窗 -->
        <el-dialog title="修改" :visible.sync="dialogFormVisible">
            <el-form :model="editForm">
                <!-- 用户名 -->
                <el-form-item label="产品名">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <!-- 售价 -->
                <el-form-item label="售价">
                    <el-input v-model="editForm.salePrice" auto-complete="off"></el-input>
                </el-form-item>
                <!-- 市场价 -->
                <el-form-item label="市场价">
                    <el-input v-model="editForm.marketPrice" auto-complete="off"></el-input>
                </el-form-item>
                <!-- 进价 -->
                <el-form-item label="进价">
                    <el-input v-model="editForm.stockPrice" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateProduct">更 新</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>

import {
  getCleartList,
  clearDelete,
  updateProduct,
  getClearDatatByPage,
  batchdelClear,
  getLoginUsername,
  clearOutProduct
} from "@/api/apis.js";
    import * as printJS from "print-js";

    export default {
        data() {
            return {
                searchForm: {
                    category: "",
                    searchKey: ""
                },
                tableData:[],
                name:'',
                editForm: {
                    id: "",
                    name: "",
                    salePrice: "",
                    marketPrice: "",
                    stockPrice: "",
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
          getCleartList(barCode,name,saled){
                // 发送请求加载数据
            getCleartList(barCode,name,saled).then(data => {
                    // 把结果更新到数据对象,由双向绑定完成页面更新
                    this.tableData = data;
                });
            },

            //查询用户
            doSearch(){
                const _this= this;
              getCleartList(this.searchForm.barCode,_this.name,"0")
                    .then(data =>{
                        _this.tableData = data;
                    })
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
                        clearDelete( id )
                            .then(res => {
                                //接收响应数据
                                let { code, reason } = res;
                                //判断
                                if (code === 0) {
                                    //成功
                                    this.$message({
                                        type: "success",
                                        message: reason
                                    });
                                    //重新刷新页面 -- 再次请求数据
                                    this.getCleartList("",this.name,"0");
                                }
                                else if (code === 1) {
                                    //失败
                                    this.$message.error(reason);
                                }
                            })
                    })
                    .catch(() => {
                    });
            },
          batchclear(){
            const _this= this;
            getCleartList(this.searchForm.barCode,_this.name,"0")
                .then(resultData =>{
                  this.list = resultData || [];
                  let data = []
                  for (let i=0; i < this.list.length; i++) {
                    data.push({
                      name: this.list[i].name,
                      category: this.list[i].category,
                      salePrice: this.list[i].salePrice,
                      stockCount: this.list[i].stockCount,
                      commodityWeight: this.list[i].commodityWeight,
                      commodityUnit: this.list[i].commodityUnit,
                    })
                  }
                  printJS({
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
                      }
                    ],
                    type: 'json',
                    header: '出库商品单',
                    // 样式设置
                    gridStyle: 'border: 2px solid #3971A5;',
                    gridHeaderStyle: 'color: red;  border: 2px solid #3971A5;'
                  })
                  clearOutProduct(_this.name).then(resultData =>{
                    // eslint-disable-next-line no-console
                    console.log(resultData);
                    getClearDatatByPage(this.currentPage, this.pageSize).then(res => {
                      this.tableData = res.data.data;
                      this.total = res.data.total;
                    });
                  })
                })
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
                                _this.getCleartList("",_this.name,"0");
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
                // 显示对话框
                this.dialogFormVisible = true;
                // 手动把行数据,更新form对象上即可
                this.editForm = row;
            },

            // 分页
            ajaxgetListProduct() {
              getClearDatatByPage(this.currentPage, this.pageSize).then(res => {
                    this.tableData = res.data.data;
                    this.total = res.data.total;
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

            batchdel() {
                //批量删除
                //如果用户没有选中 -- 就不用发送请求
                const _this=this;

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
                        batchdelClear(_this.IdArr)
                            .then(res => {
                                //接收响应参数

                                let { code, reason } = res.data;

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

            deselect(){//取消选择
                this.$refs.tableData.clearSelection();
            },
        },
        //页面加载时候调用一次渲染
        mounted() {
          const token = localStorage.getItem('token');
          const _this = this;
          getLoginUsername(token)
          .then((result)=>{

            // 成功
            if(result.success){
              _this.name = result.name;
              _this.getCleartList("",result.name,"0")
            }else{
              // 失败提示,跳转登录
            }
          })
            // this.ajaxgetListProduct(this.currentPage);
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
            label{color:#fff}
        }
    }
    .product .el-card .el-card__header {
        padding: 12px 20px;
        background: transparent;
        border-bottom: 0;
    }
    .product .el-card.is-always-shadow {
        box-shadow: 0 0px 15px 10px rgba(0, 0, 0, 0.1);
        border:0;

    }
    .product .el-card .el-card__header h3 {
        color: lightblue;
    }
    .product .el-table .el-table__row,.product .el-table td,.product .el-table th, .el-table tr {
        background: transparent !important;
        border:0;
        color: #fff;
    }
    .product .el-table td{width: 80px !important;}
    .product .el-table--enable-row-hover .el-table__body tr:hover>td{
        background-color: #212e3e !important;
    }
    .product .el-table::before{
        height: 0;
    }
    .product table{width: 1000px;background-color:transparent;}
    .product .el-table div.cell{text-align: center;}
    .product .el-pagination__total{color:#fff;}

    .product .el-pagination button:disabled,.product .el-pagination .btn-next, .el-pagination .btn-prev,.product .el-pager li{background:transparent;}
</style>