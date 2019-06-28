<template>
  <el-row class="app-header">
    <el-col :span="14">
      <div class="grid-content bg-purple">
        江苏传智播客教育科技有限公司
      </div>
    </el-col>
    <el-col :span="4" :offset="6">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img :src="userInfo.photo" width="30px">{{ userInfo.name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>账户设置</el-dropdown-item>
          <el-dropdown-item>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      userInfo: {} // 存储用户登录后返回的数据
    }
  },
  created () { // 在实例创建好之后，将本地存储的用户信息赋值给userInfo，保证数据可以渲染到模板上。
  // 注意将内容转换为js对象JSON.parse(window.localStorage.getItem('user_info'))
    this.userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  }
}
</script>

<style lang="less" scoped>
.app-header {
  height: 60px;
  display: flex;
  align-items: center;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .el-dropdown-link {
    vertical-align: middle;
    img {
      vertical-align: middle;
      border-radius: 15px;
    }
    .el-icon-arrow-down {
      vertical-align: middle;
    }
  }
</style>
