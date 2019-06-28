
<template>
  <div class="login-wrap">
    <div class="login-form-wrap">
      <div class="login-head">
        <img src="./logo_index.png"
             alt="黑马头条">
      </div>
      <div class="login-form">
        <!--
          表单验证：
          rules 配置验证规则
            给需要验证的表单项添加 prop属性
          ref 获取表单组件，可以手动调用表单组件的验证方法
         -->
        <el-form :model="form"
                 :rules="rules"
                 ref="ruleForm">
          <el-form-item prop="mobile">
            <el-input v-model="form.mobile"
                      placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <!-- 支持栅格布局，一共是24列 -->
            <el-col :span="10">
              <el-input v-model="form.code"
                        placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="9"
                    :offset="5">
              <el-button @click="hanleSendCode"
                         :disabled="!!codeTimer || codeLoading">
                <!-- :disabled= "codeTimer" 会报一个错误，提示期望获得一个布尔值，但定时器的返回值是数字标识，所以在codeTimer前面加两个取反符号（感叹号），进行强制转换布尔值（!!codeTimer"） -->
                {{ codeTimer ? `剩余${codeSecons}秒` : '获取验证码'}}
                <!-- 三元表达式，如果有定时器就显示定时器的秒数，如果没有就显示“获取验证码” -->
              </el-button>
            </el-col>
          </el-form-item>
          <el-form-item prop="agree">
            <el-checkbox v-model="form.agree"></el-checkbox>
            <span>我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
          </el-form-item>
          <el-form-item>
            <!-- 给组件加 class，会作用到它的根元素 -->
            <el-button class="btn-login"
                       type="primary"
                       @click="headlelogin"
                       :loading="loginLoading">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// 安装好后，引入进来，用它来发送请求
import axios from 'axios'
// gt.js向全局window暴露了一个函数 initGeetest
import '@/vendor/gt'
// 创建常量保存定时器时间
const initCodeSeconds = 6

export default {
  name: 'APPLogin',
  data () {
    return {
      form: { // 可以起其他名字来表示这个表单数据
        mobile: '15661871940',
        code: '',
        agree: ''// 表示勾选用户协议
      },
      rules: { // 表单验证规则；自定义规则的话，去Element官网中看文档
        mobile: [
          // { required（必填）: true, message（提示语句）: '请输入手机号', trigger（什么时候验证）: 'blur（失去焦点）' }
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          { len: 11, message: '长度必须为11个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '长度必须为6个字符', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议', trigger: 'change' },
          { pattern: /true/, message: '请同意用户协议', trigger: 'change' }
          // { patten(正则验证规则): /true/(表示必须为true), message: '请同意用户协议', trigger: 'change'(change表示发生改变时触发) }
        ]
      },
      captchaObj: null, // 表示验证码是否初始化，或者验证码的状态
      loginLoading: false, // 表示登录按钮的 loading 状态
      codeSecons: initCodeSeconds, // 倒计时的时间;;此时如果要更改定时器时间，还得改两个地方，所以可以通过创建一个全局的常量用来保存定时器时间
      codeTimer: null, // 倒计时定时器
      sendMobile: '', // 保存初始化验证码之后要发送短信的手机号
      codeLoading: false // 储存禁用状态
    }
  },
  methods: {
    headlelogin () { // 提交登录
      // element表单组件的方法，用于获取当前表单的验证状态
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) { // 如果验证不通过，则结束继续执行代码
          return
        }
        this.login() // 当表单验证通过后，调用登录函数
      })
    },
    // 把登录发送的请求封装到一个函数中 login
    login () { // 登录函数
      this.loginLoading = true
      axios({
        method: 'POST',
        url: '/authorizations',
        data: this.form // 发送表单数据
      }).then(res => { // 成功后的代码，也就是状态码是 >=200 或者 <400 时，都会进入这里
        // 登陆成功，将接口返回的用户信息数据放到本地存储
        window.localStorage.setItem('user_info', JSON.stringify(res.data.data))

        // Element 提供的消息提示组件
        this.$message({ // 这个弹出消息，是用的Element组件
          message: '恭喜你，登录成功！',
          type: 'success'
        })
        this.$router.push({ // 成功后跳转到首页
          name: 'home' // 首页路由名是home
        })
        this.loginLoading = false
      }).catch(err => { // 失败后的代码，也就是状态码 >= 400的，都会进入这里；catch可以检测到错误err
        // console.dir(err)可以打印出这个错误
        if (err.response.status === 400) { // 判断err下的response里的status是否是400
          this.$message.error('登录失败，手机号或验证码错误！')
        }
        this.loginLoading = false
      })
      // this.loginLoading = false  这里因为 axios 是异步的，所以不能写在这里，必须写在上面
    },
    hanleSendCode () { // 发送验证码
      // 验证手机号是否有效，有效才初始化验证码插件；反之不初始化
      this.$refs['ruleForm'].validateField('mobile', errorMessage => { // element 表单验证-验证单个选项
        if (errorMessage.trim().length > 0) {
          // trim() 去除空格
          // eslint-disable-next-line no-useless-return
          return
        }

        // 解决方案：需要通过 captchaObj 是否值为null，来检测验证码是否进行过初始化插件
        if (this.captchaObj) {
          // 手机号码有效，初始化验证码插件，在初始化验证码插件之前判断手机号是否发生变化，用sendCode和之前初始化的手机号进行比对，如果两次手机号不一致，就重新初始化插件
          if (this.form.mobile !== this.sendMobile) {
            // 将之前生成的验证码插件删除
            document.body.removeChild(document.querySelector('.geetest_panel'))
            // 手机发生改变后初始化
            this.showGeetest()
          } else {
            // 如果验证码已经初始化过，并且两次号码一致，就让它直接显示弹出框，不再继续发送请求
            this.captchaObj.verify()
          }
        } else {
          // 第一次初始化
          this.showGeetest()
        }
      })
    },
    showGeetest () { // 显示验证码组件
      // 当发送请求后，对‘获取验证码’开启禁用状态
      this.codeLoading = true
      // *****函数中的 function 定义的函数中的 this 指向 window *****
      axios({ // 显示验证码组件
        method: 'GET',
        url: `/captchas/${this.form.mobile}`
      }).then(res => {
        // res.data 表示服务端响应回来的数据
        // 表示获取服务端响应过来的data属性
        const data = res.data.data
        // console.log(data)
        window.initGeetest({// 下面是从极验官网复制的
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
          // 因为函数中的 function 定义的函数 this 指向 window，并不是指向Vue实例，所以换为箭头函数
          captchaObj.onReady(() => {
            // 只有 ready 了才能显示验证码，ready表示验证码完成初始化
            // onSuccess 表示验证成功；onError 表示验证失败；onClose 表示关闭了验证框
            captchaObj.verify() // 显示验证码
            // 初始化好了以后，解除‘获取验证码’的禁用状态
            this.codeLoading = false
          }).onSuccess(() => { // 当验证码初始化成功后
            const {
              // 解构验证码初始化成功后，返回的一个对象；这个对象里的键值，就是用于发送短信接口必须传的参数
              // eslint-disable-next-line no-unused-vars是修复报错时系统自动添加的,表示没有使用该元素，或者没有该元素
              geetest_challenge: challenge, // 就是在解构后另起别名，起为服务端接口要求的参数名
              geetest_seccode: seccode,
              geetest_validate: validate } =
              captchaObj.getValidate()
            axios({ // 获取短信验证码
              method: 'GET',
              // **问题：用户在验证完成后又更改手机号，导致短信发错
              // 解决方案第一步：在这里必须要获取当前最新的手机号，所以${this.form.mobile}，而不是${mobile}；；在上面显示验证码插件时，也确保是最新的手机号
              // 第二步，在发送验证码之前进行判断手机号是否有变化；先创建一个保存号码的变量
              url: `/sms/codes/${this.form.mobile}`,
              params: { // params用于传递 query 查询字符串参数
                challenge,
                seccode,
                validate
              }
            }).then(res => {
              // console.log(res.data)
              // 在获取验证码后，调取倒计时，显示倒计时
              this.codeCountDown()
            })
          })
          // 在验证码初始化的时候有一个问题：当用户第一次‘点击获取验证码’后，把弹出框关掉；再点击时，就会再生成一个DOM元素。解决方案：就是在发送请求前先判断验证码是否已经初始化好了。如果初始化好了，就直接显示；
        })
      })
    },
    codeCountDown () { // 倒计时
      // console.log(123)
      this.codeTimer = window.setInterval(() => {
        // console.log(456)
        this.codeSecons--// 倒计时的时间减一
        if (this.codeSecons <= 0) { // 如果时间为0
          this.codeSecons = initCodeSeconds // 让倒计时的时间回到初始状态（初始的秒数）
          // 清除定时器，并且重置this.codeTimer为null
          window.clearInterval(this.codeTimer)
          this.codeTimer = null // 重置定时器 this.codeTimer 为null
        }
      }, 1000)
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
