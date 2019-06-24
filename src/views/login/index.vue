<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png"
             alt="黑马头条">
      </div>
      <div class="login-form">
        <el-form ref="form"
                 :model="form">
          <el-form-item>
            <el-input v-model="form.mobile"
                      placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- 支持栅格布局，一共是24列 -->
            <el-col :span="10">
              <el-input v-model="form.code"
                        placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="9"
                    :offset="5">
              <el-button @click="hanleSendCode">获取验证码</el-button>
            </el-col>
          </el-form-item>
          <el-form-item>
            <!-- 给组件加 class，会作用到它的根元素 -->
            <el-button class="btn-login"
                       type="primary"
                       @click="onSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// gt.js向全局window暴露了一个函数 initGeetest
import '@/vendor/gt'

export default {
  name: 'APPLogin',
  data () {
    return {
      form: {
        mobile: '15661871940',
        code: ''
      },
      captchaObj: null// 表示
    }
  },
  methods: {
    onSubmit () {
      console.log('submit')
    },
    hanleSendCode () {
      // 获取data里form中的mobile
      const { mobile } = this.form

      // 解决方案：需要通过 captchaObj 是否值为null，来检测验证码是否进行过初始化
      if (this.captchaObj) {
        // 如果验证码已经初始化过，就让它直接显示弹出框，不再继续发送请求
        return this.captchaObj.verify()
      }

      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        const data = res.data.data
        // console.log(data)
        // eslint-disable-next-line no-undef
        initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          // data.new_captcha  表示的是const data = res.data.data 中的new_captcha状态
          product: 'bind'// 隐藏按钮式
        }, captchaObj => {
          // 在此时，需给data里的captchaObj属性进行赋值;注意要讲function改为箭头函数，箭头函数this指向window
          this.captchaObj = captchaObj
          // 这里可以调用验证实例 captchaObj 的实例方法
          captchaObj.onReady(function () {
            // 只有 ready 了才能显示验证码，ready表示验证码完成初始化
            // onSuccess 表示验证成功；onError 表示验证失败；onClose 表示关闭了验证框
            captchaObj.verify() // 显示验证码
          })
          // 此时有一个问题：当用户第一次‘点击获取验证码’后，把弹出框关掉；再点击时，就会再生成一个DOM元素。解决方案：就是在发送请求前先判断验证码是否已经初始化好了。如果初始化好了，就直接显示；
        })
      })
    }
  }
}
</script>

<style lang = "less" scoped>
.login-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
  .login-head {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    img {
      width: 200px;
    }
  }
  .login-form-wrap {
    background-color: #fff;
    padding: 50px;
    border-radius: 10px;
    .btn-login {
      width: 100%;
    }
  }
}
</style>
