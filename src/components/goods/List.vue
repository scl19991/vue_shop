<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query"
          clearable @clear="getGoodsList">
          <el-button slot="append" icon="el-icon-search"
          @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodslist" border stripe class="table">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="95px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="170px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
          @click="removeById(scope.row.goods_id)"></el-button>
          </template>
          
        </el-table-column>
      </el-table>

      <!-- pagination分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name:'List',
  data(){
   return {
     //查询参数对象
     queryInfo:{
       query:'',
       pagenum: 1,
       pagesize: 10
     },
     //商品列表
     goodslist:[],
     //总数据条数
     total: 0, 
   }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    //根据分页获取相应的商品列表(get都要加params)
    async getGoodsList(){
      const {data: res} = await this.$http.get('goods',{params: this.queryInfo})
      if(res.meta.status != 200){
        return this.$message.error('获取商品列表失败！')
      }
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    //监听页数的改变
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    //监听当前页的改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    //监听商品删除的按钮
    async removeById(id){
      const confirmResult = await this.$confirm(
      '此操作将永久删除该商品, 是否继续?', 
      '提示', 
      {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).catch(err=> err);
      //点击确定 返回的是confirm 取消 返回的是cancel
      if(confirmResult === 'cancel'){
        this.$message({type: 'info',message: '已取消删除'});
      }else{
        const{data: res} = await this.$http.delete(`goods/${id}`)
        if(res.meta.status == 200){
          this.$message({type: 'success',message: '删除成功!'});
          this.getGoodsList()
        }else{
          this.$message({type: 'error',message: '删除失败,网络错误!'});
        }
      }
    },
    //点击添加商品跳转到对应的组件
    goAddpage(){
     this.$router.push('/goods/add')
    }
  }
}
</script>

<style scoped>
.table{
  margin-top: 20px;
}
</style>
