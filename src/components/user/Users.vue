<template>
<div>
  <!-- 面包屑 头部导航 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图 -->
  <el-card>
    <!-- 搜索与添加区域 -->
  <el-row :gutter="20">
    <el-col :span="8">
      <el-input placeholder="请输入内容">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </el-col>
    <el-col :span="4">
      <el-button type="primary">添加用户</el-button>
    </el-col>
  </el-row>
  <!-- 用户列表区域 -->
  <el-table
      :data="userlist"
      style="width: 100%"
      border stripe>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column prop="mg_state" label="状态"></el-table-column>
      <el-table-column label="操作"></el-table-column>
  </el-table>
  </el-card>
</div>
</template>

<script>
export default {
  name:'Users',
  data(){
   return {
     queryInfo: {
       query: '',
       pagenum: 1,
       pagesize: 2,
     },
       total: 0,
       pagenum: Number,
       userlist: []
   }
  },
  created () {
    this.getUserlist()
  },
  methods: {
    async getUserlist(){
      const {data: res} = await this.$http.get('users',{ params : this.queryInfo})
      if(res.meta.status != 200)  return this.$message.error('获取用户列表失败！')
      console.log(res);
      this.total = res.data.total
      this.pagenum = res.data.pagenum
      this.userlist = res.data.users
    }
  }
}
</script>

<style scoped>
.el-breadcrumb{
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card{
  box-shadow: 0 1px 1px rgba(0, 0, 0, .15) !important; 
}
.el-table{
  margin-top: 15px;
  font-size: 12px;
}
</style>
