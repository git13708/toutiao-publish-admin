<template>
  <div id="app">
    <!-- 路由出口 -->
    <router-view/>
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
