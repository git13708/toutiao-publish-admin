<template>
  <div id="app">
    <h2>黑马头条内容发布系统</h2>
    <!-- 路由出口 -->
    <router-view/>
    <el-button>默认按钮</el-button>
    <el-button type="danger">默认按钮</el-button>
    <el-button type="info" round>默认按钮</el-button>
    <el-button type="info" circle icon="el-icon-edit"></el-button>
    <el-row>
      <el-button icon="el-icon-search" circle></el-button>
      <el-button type="primary" icon="el-icon-edit" circle></el-button>
      <el-button type="success" icon="el-icon-check" circle></el-button>
      <el-button type="info" icon="el-icon-message" circle></el-button>
      <el-button type="warning" icon="el-icon-star-off" circle></el-button>
      <el-button type="danger" icon="el-icon-delete" circle></el-button>
    </el-row>
    <el-input-number v-model="num" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      num: 1
    }
  },
  methods: {
    handleChange (value) {
      console.log(value)
    }
  }
}
</script>

<style scoped lang="less">
</style>
