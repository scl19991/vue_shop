<template>
<div class="home-aside">
<div class="toggle-button" @click="toggleClick">|||</div>
<el-menu
  background-color="#333744"
  text-color="#fff"
  active-text-color="#409EFF"
  unique-opened
  :collapse="isCollapse"
  :collapse-transition="false"
  :router="true"
  :default-active="activePath">
  <!-- 一级菜单  动态绑定index：解决点一个全部展开的情况 只接受字符串 所以字符串拼接-->
  <el-submenu :index="item.id + ''" v-for="(item,index) in datalist" :key="item.id">
    <template slot="title">
      <i :class="iconslist[index]"></i>
      <span>{{item.authName}}</span>
    </template>
    <!-- 二级菜单 根据index的值 确定点击跳转路径 且配置:router="true" 开启路由模式-->
    <el-menu-item :index="'/' + child.path" v-for="child in item.children" :key="child.id" @click="saveNavState('/' + child.path)">
      <template slot="title">
        <i class="el-icon-menu"></i>
        <span>{{child.authName}}</span>
      </template>
    </el-menu-item>
  </el-submenu>
</el-menu>
</div>

</template>

<script>
export default {
  name:'HomeAside',
  props: {
    datalist: Array,
  },
  data(){
    return {
      iconslist:[
      'iconfont icon-user',
      'iconfont icon-tijikongjian',
      'iconfont icon-shangpin',
      'iconfont icon-danju',
      'iconfont icon-baobiao'],
      isCollapse: false,
      activePath: String
    }
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  destroyed () {
  },
  methods: {
    toggleClick(){
      this.isCollapse = !this.isCollapse
      this.$emit('changeWidth',this.isCollapse)
    },
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped>
  .iconfont{
    margin-right: 10px;
  }
  .el-menu{
    border-right: none;
  }
  .toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    color: #fff;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
