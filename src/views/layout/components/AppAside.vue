<template>
<!-- element 官网找 导航菜单 -->

<!--
  el-menu
    default-active 指定默认激活的菜单项
    @open、@close 展示和收起菜单项的时候会触发
    background-color 背景颜色
    text-color  文字颜色
    active-text-color 文字高亮颜色
    router 可以用做路由之间的跳转
  el-submenu
    index 导航标识，可以用做路由导航路径，必须唯一
 -->
  <el-menu default-active="2"
           class="el-menu-vertical-demo"
           @open="handleOpen"
           @close="handleClose"
           router
           background-color="#545c64"
           text-color="#fff"
           active-text-color="#ffd04b">
    <el-menu-item index="/">
      <i class="el-icon-menu"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>内容管理</span>
      </template>
      <el-menu-item index="/publish">
      <i class="el-icon-menu"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="2-2">
      <i class="el-icon-menu"></i>
      <span slot="title">内容列表</span>
    </el-menu-item>
    <el-menu-item index="2-3">
      <i class="el-icon-menu"></i>
      <span slot="title">评论列表</span>
    </el-menu-item>
    <el-menu-item index="2-4">
      <i class="el-icon-menu"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>粉丝管理</span>
      </template>
      <el-menu-item index="3-1">
      <i class="el-icon-menu"></i>
      <span slot="title">图文数据</span>
    </el-menu-item>
    <el-menu-item index="3-2">
      <i class="el-icon-menu"></i>
      <span slot="title">粉丝概况</span>
    </el-menu-item>
    <el-menu-item index="3-3">
      <i class="el-icon-menu"></i>
      <span slot="title">粉丝画像</span>
    </el-menu-item>
    <el-menu-item index="3-4">
      <i class="el-icon-menu"></i>
      <span slot="title">粉丝列表</span>
    </el-menu-item>
    </el-submenu>
    <el-menu-item index="4">
      <i class="el-icon-setting"></i>
      <span slot="title">账号设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style scoped>
.el-menu {
  height: 100%;
}
</style>
