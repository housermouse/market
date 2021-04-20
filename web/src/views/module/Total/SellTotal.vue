<template>
    <div class="sell-total">
         <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3>销售数据统计</h3>
            </div>
           <el-row>
             <el-col :span="12">
               <p style="color: white;font-weight: bolder;padding-left: 20px;">热门商品</p>
               <ul>
                <li v-for="(item,i) in popularProduct" style="list-style: none;color: white;"  v-bind:key="item">{{i+1}}：{{item.name}}</li>
             </ul>
               </el-col>
             <el-col :span="12">
               <p style="color: white;font-weight: bolder;padding-left: 20px;">缺货商品</p>
               <ul v-if="lackProduct==null||lackProduct.length==0">
                <li style="list-style: none;color: white;"> 无</li>
               </ul>
               <ul v-else>
                 <li v-for="(item,i) in lackProduct"  style="list-style: none;color: white;" v-bind:key="item">{{i+1}}：{{item.name}}</li>
               </ul>
             </el-col>
           </el-row>
        </el-card>
    </div>
</template>

<script>
import {getLackList, getPopularList} from "@/api/apis";

    export default {
        name: 'hello',
        data(){
            return {
                SellTotalForm :{
                   region:"",
                   date1:"",
                   date2:""
                },
                popularProduct:[],
                lackProduct:[],
                msg: '缺货商品',
            }
        },
        // mounted(){
        //     this.selltotal();
        // },
        methods:{
            onSubmit(){
              getPopularList()
                  .then(data => {
                    this.popularProduct=data;
                  })
              getLackList()
                  .then(data => {
                    this.lackProduct=data;
                  })
            },
            selltotal(option){
                // 基于准备好的dom，初始化echarts实例
                var myChart = this.$echarts.init(document.getElementById('sellcharts'));

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        },
        mounted(){
          this.onSubmit();
        },
        
    }
</script>

<style lang="less">
.sell-total {
    width: 95%;
  .el-card {
    background: transparent;
    padding-bottom: 20px;
    border: 0;
    h3 {
      font-size: 16px;
    }
    label{ color:#fff}
  }
}
.sell-total .el-card .el-card__header {
  padding: 12px 20px;
  background: transparent;
  border-bottom: 0;
}
.sell-total .el-card.is-always-shadow {
  box-shadow: 0 0px 15px 10px rgba(0, 0, 0, 0.1);
}
.sell-total .el-card .el-card__header h3 {
  color: lightblue;
}
</style>