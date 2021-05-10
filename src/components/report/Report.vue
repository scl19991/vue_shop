<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
//导入echarts
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  name:'Report',
  data(){
   return {
     //需要合并的数据
     options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
   }
  },
  //挂载完dom
  async mounted () {
    //初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    //配置项和数据
    const {data: res} = await this.$http.get('reports/type/1')
    if(res.meta.status != 200){
      return thsi.$message.error('获取折线图数据失败！')
    }
    const result =  _.merge(res.data,this.options)
    // 使用刚指定的配置项和数据显示图表
    myChart.setOption(result);
  }
}
</script>

<style scoped>

</style>
