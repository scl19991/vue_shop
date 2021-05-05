<template>
  <div>这是我们的主页
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name:'Home',
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

</style>