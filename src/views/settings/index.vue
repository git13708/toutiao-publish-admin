<template>
  <div class="settings-container">
    <el-card>
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- /面包屑路径导航 -->
      <el-row>
        <el-col :span="15">
          <el-form ref="ref" label-width="80px" size="small">
            <el-form-item label="编号:">
              123
            </el-form-item>
            <el-form-item label="手机:">
              456
            </el-form-item>
            <el-form-item label="媒体名称:">
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍:">
              <el-input type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:">
              <el-input></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="2" :span="4">
          <el-avatar
            shape="square"
            :size="150"
            :fit="cover"
            src="http://toutiao-img.itheima.net/Ftb-E6bXjx1HlnJHPhe5N6E_seaI"
          >
          </el-avatar>
          <p>点击修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SettingsIndex',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style lang="less" scoped>

</style>
