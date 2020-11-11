<template>
  <div class="login-container">
    <!--
      el-form 表单组件
      每个表单项都必须使用 el-form-item 组件包裹
     -->
    <div class="login-box">
      <img src="./logo_index.png" alt="">
      <!--
        配置form表单验证
        1.必须给el-form组件绑定model为表单数据对象
        2.给需要验证的表单项el-form-item绑定prop属性
            注意:prop属性需要指定表单对象中的数据名称
        3.通过el-form组件的rules属性配置验证规则

        手动触发表单验证
        1.给el-form设置ref起个名字 随便起名 不要重复即可
        2.通过ref获取el-form组件,调用组件的validate方法进行验证
      -->
      <el-form
        ref="login-form"
        :model="user"
        :rules="formRules"
      >
        <el-form-item prop="mobile">
          <el-input
            v-model="user.mobile"
            placeholder="请输入手机号"
            ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="user.code"
            placeholder="请输入验证码"
            ></el-input>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onLogin"
            class="login-btn"
            :loading="loginLoading"
            >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810', // 验证码
        agree: true // 是否同意协议
      },
      loginLoading: false, // 登录的loading状态
      formRules: { // 表单验证规则
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'change' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式不正确', trigger: 'change' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式', trigger: 'change' }
        ],
        agree: [
          {
            // 自定义校验规则
            // 验证通过:callback()
            // 验证失败:callback(new Error('错误消息'))
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error('请勾选用户协议'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLogin () {
      // 表单验证,validate方法是异步的
      this.$refs['login-form'].validate(valid => {
        // 如果表单验证失败,停止请求提交
        if (!valid) {
          return
        }

        // 验证通过,提交登录
        this.login()
      })
    },
    login () {
      // 处理后端响应结果
      //    成功: xxx
      //    失败: xxx
      // 开启登录中 loading.....
      this.loginLoading = true

      // 对于代码中的请求操作
      // 1.接口请求可能需要重用
      // 2.实际工作中,接口非常容易变动
      // 我们建议的做是把所有的请求封装成函数然后统一组织到模块中进行管理
      // 这样做的好处就是:管理维护更方便,也好重要
      login(this.user).then(res => {
        // 登录成功
        console.log(res)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        // 关闭 loading
        this.loginLoading = false
        // 跳转到首页
        // this.$router.push('/')
        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        // 登录失败
        console.log('登录失败', err)
        this.$message.error('登录失败,手机号或验证码错误!')
        // 关闭 loading
        this.loginLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("./login_bg.jpg") no-repeat;
  background-size: cover;
}
.login-box {
  background: #fff;
  width: 400px;
  height: 340px;
  flex-direction: column;
  // text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}
.login-btn {
  width: 100%;
}
.login-container .login-box  img {
  width: 50%;
  margin: 20px auto;
}
.login-container .login-box .el-form {
  width: 75%;
}
</style>
