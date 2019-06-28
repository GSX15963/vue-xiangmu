<template>
<!-- element官网 Container布局容器 -->
  <el-container>
    <el-aside width="200px">
      <!-- 侧边栏 -->
      <AppAside></AppAside>
    </el-aside>
    <el-container>
      <el-header>
        <!-- 顶部导航 -->
        <AppHeader></AppHeader>
      </el-header>
      <!-- 中间内容区域 -->
      <el-main>
        <!-- layout 组件路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 加载子路由
import AppAside from './components/AppAside.vue'
import AppHeader from './components/AppHeader.vue'
export default {
  name: 'AppLayout',
  // 注册为layout 的子路由
  components: {
    AppAside,
    AppHeader
  },
  data () {
    return {}
  }
}
</script>

<style scoped>
.el-container {
  height: 100%;
}
</style>
