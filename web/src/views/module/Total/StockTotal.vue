<template>
    <div class="stock-total">
         <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h3>销售统计</h3>

            </div>
            <div class="text item">
<!--                <el-form -->
<!--                 :inline="true" -->
<!--                 :model="StockTotalform" -->
<!--                 >-->
<!--                     <el-form-item label="时间">-->
<!--                        -->
<!--                        <el-form-item>-->
<!--                            <el-date-picker -->
<!--                            type="date" -->
<!--                            placeholder="选择日期" -->
<!--                            v-model="StockTotalform.date1" -->
<!--                            style="width: 200px"></el-date-picker>-->
<!--                        </el-form-item>-->
<!--                        -->
<!--                        <el-form-item>&emsp;&emsp;</el-form-item>-->

<!--                         <el-form-item>-->
<!--                            <el-date-picker -->
<!--                            type="date" -->
<!--                            placeholder="选择日期" -->
<!--                            v-model="StockTotalform.date2" -->
<!--                            style="width: 200px"></el-date-picker>-->
<!--                        </el-form-item>&emsp;-->
<!--                    </el-form-item>-->
<!--                    -->
<!--                    <el-form-item>-->
<!--                        <el-button type="primary" @click="onSubmit">查询</el-button>-->
<!--                    </el-form-item>-->
<!--               </el-form>-->
               <div id="stockcharts" style="height:400px;"></div>
              <div class="clearfix"><p style="color: white" >总营业额：{{totalAmount}}</p></div>
            </div>
        </el-card>
    </div>
</template>

<script>
    import {getTotalMessage,getTotalAmount} from "@/api/apis";
    import moment from "moment";

    export default {
        data(){
            return {
              StockTotalform:{
                  date1:"",
                  date2:""
              },
              totalAmount:''
            }
        },
        mounted(){
            this.getAllAmount();
             this.onSubmit();
        },
        methods : {
            onSubmit() {
              // const _this= this;
              var option = {
                title: {
                  text: '销售统计',
                  left: "center"
                },
                xAxis: {
                  type: 'category',
                  data: [moment().subtract(4, 'days').format('MM-DD'),
                    moment().subtract(3, 'days').format('MM-DD'),
                    moment().subtract(2, 'days').format('MM-DD'),
                    moment().subtract(1, 'days').format('MM-DD'),
                    moment().format('MM-DD')]
                },
                yAxis: {
                  type: 'value'
                },
                series: [{
                  data: [10, 15, 16, 11, 2],
                  type: 'line'
                }]
              }
              getTotalMessage()
                  .then(data => {
                    option.series[0].data[0]=data._4day;
                    option.series[0].data[1]=data._3day;
                    option.series[0].data[2]=data._2day;
                    option.series[0].data[3]=data.yesterday;
                    option.series[0].data[4]=data.today;
                    this.StockTotal(option);
                    // eslint-disable-next-line no-console
                    console.log(data);
                  })
            },
            getAllAmount(){
              getTotalAmount()
                  .then(data => {
                    // eslint-disable-next-line no-console
                    console.log(data);
                    this.totalAmount=data.total;
                  });
            },
            StockTotal(option){//echarts
                 // 基于准备好的dom，初始化echarts实例
                var myChart = this.$echarts.init(document.getElementById('stockcharts'));

                // 指定图表的配置项和数据


                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        }

    }
</script>

<style lang="less">
.stock-total {
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
.stock-total .el-card .el-card__header {
  padding: 12px 20px;
  background: transparent;
  border-bottom: 0;
}
.stock-total .el-card.is-always-shadow {
  box-shadow: 0 0px 15px 10px rgba(0, 0, 0, 0.1);
}
.stock-total .el-card .el-card__header h3 {
  color: lightblue;
}
</style>