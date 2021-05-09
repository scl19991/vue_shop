<template>
<!-- 这里考虑到element ui代码还是比较多的 而且后续为了便于维护---被迫变成了一个封装狂魔 -->
    <el-container class="home-container">
      <!-- 头部区域 -->
  <el-header>
    <home-header/>
  </el-header>
      <!--页面主体区域  -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="isasideCollapse ? '64px': '200px'" >
      <!-- 这里 子父组件通信，监听子组件的点击事件 动态的修改父组件中侧边栏的宽度 -->
      <home-aside :datalist="menulist" ref="aside" @changeWidth="changeWidth"/>
    </el-aside>
    <!-- 右边对应主体 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>
<script>
import HomeAside from './childComps/HomeAside'
import HomeHeader from './childComps/HomeHeader'

export default {
  name:'Home',
  components: { HomeHeader, HomeAside},
  data(){
    return {
      //左侧菜单数据
      menulist: [],
      isasideCollapse: false
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    async getMenuList(){
      const {data: res} = await this.$http.get('menus')
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      //把左侧对应的menulist传入HomeAside组件中（后续有路由跳转）
      this.menulist = res.data;
    },
    changeWidth(isCollapse){
      this.isasideCollapse = isCollapse;
    }
  }
}
</script>

<style scoped>
.home-container{
  height: 100%;
}
.el-header {
  background-color: #373d41;
  padding-left: 0;
}

.el-aside{
  background-color: #333744;

}

.el-main{
  background-color: #EAEDF1;
}

</style>