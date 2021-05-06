<template>
<div>
  <div class="header-left">
      <img src="~assets/loo_left.png" alt="">
      <span>电商后台管理系统</span>
  </div>
  <el-button type="info" @click="logout" class="header-btn">退出</el-button>
</div>
</template>

<script>
export default {
  name:'HomeHeader',
  methods: {
    logout(){
      window.sessionStorage.clear()
      this.$message.success('退出成功，返回首页')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #373d41;
  padding-left: 0;
}

.header-left{
  float: left;
  font-size: 20px;
  color: #fff;
}

.header-left img{
  vertical-align: middle;
  margin-right: 15px;
}

.header-btn{
  float: right;
  margin-top: 10px;
}
</style>
