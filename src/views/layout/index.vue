<template>
  <el-container class="layout-container">
    <el-aside
      class="aside"
      width="auto"
      >
        <!-- <AppAside/> -->
        <app-aside
         class="aside-menu"
         :is-collapse="isCollapse"/>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <!--
            class样式处理
            {
              css类名: 布尔值
            }
            true: 作用类名
            true: 不作用类名
           -->
          <i
           :class="{
             'el-icon-s-fold': isCollapse,
             'el-icon-s-unfold': !isCollapse
            }"
           @click="isCollapse = !isCollapse"></i>
          <span>江苏传智播客科技有限公司</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img class="avatar" :src="user.photo" alt=""/>
            <span>{{user.name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$router.push('/settings')">设置</el-dropdown-item>
            <!--
              组件默认是不识别原生事件的,除非内部做了处理
             -->
            <el-dropdown-item
              @click.native="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/aside.vue'
import { getUserProfile } from '@/api/user'
import globalBus from '@/utils/global-bus'

export default {
  name: 'LayoutIndex',
  components: { AppAside },
  props: {},
  data () {
    return {
      user: {}, // 当前登录用户信息
      isCollapse: false // 侧边菜单栏的展开状态
    }
  },
  computed: {},
  watch: {},
  created () {
    // 组件初始化好,请求获取用户资料
    this.loadUserProfile()
    // 注册自定义事件
    // 当这个事件发布以后,这个注册函数才会执行
    globalBus.$on('update-user', (data) => {
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  mounted () {},
  methods: {
    // 除了登录接口,其它所有接口都需要授权才能请求使用
    // 或者说,除了登录接口,其它接口都需要提供你的身份令牌才能获取数据
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onLogout () {
      this.$confirm('确诊退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 把用户的登录状态清除
        localStorage.removeItem('user')
        // 跳转到登录页面
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.aside {
  background-color: #d3dce6;
  .aside-menu {
    height: 100%;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
}
.main {
  background-color: #e9eef3;
}
.avatar-wrap {
  display: flex;
  align-items: center;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
</style>
