<template>
  <div class="image-container">
    <el-card>
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div
        class="action-head"
      >
        <el-radio-group
          v-model="collect"
          size="mini"
          @change="onCollectChange"
        >
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button
          size="mini"
          type="success"
          @click="dialogUploadVisible = true"
        >上传素材</el-button>
      </div>
      <!-- 素材列表 -->
      <el-row :gutter="10">
        <el-col
          :xs="12"
          :sm="6"
          :md="6"
          :lg="4"
          v-for="(img, index) in images"
          :key="index"
          class="image-item"
        >
          <el-image
            style="height: 100px"
            :src="img.url"
            fit="cover"
          ></el-image>
          <div class="image-action">
            <!--
              class 样式绑定
              {
                CSS类名: 布尔值
              }
             -->
            <el-button
              type="warning"
              :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
              circle
              size="mini"
              @click="onCollect(img)"
              :loading="img.loading"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete-solid"
              circle
              size="mini"
              @click="onDelete(img)"
              :loading="img.loading"
            ></el-button>
          </div>
        </el-col>
      </el-row>
      <!-- /素材列表 -->
      <!-- 分页组件 -->
      <!--
        分页数据改变以后,页码不会变化
        它需要单独处理高亮的页码
       -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        @current-change="onPageChange"
        :page-size="pageSize"
        :current-page.sync="page"
      ></el-pagination>
      <!-- /分页组件 -->
    </el-card>
    <el-dialog
      title="上传素材"
      :visible.sync="dialogUploadVisible"
      :append-to-body="true"
    >
      <!--
        upload 组件本身就支持请求提交操作,
        你使用它不用自己去发请求,会自动发.
        请求方法:默认为POST
        请求路径:action
        请求头:headers
       -->
      <el-upload
        :show-file-list="false"
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        :on-success="onUploadSuccess"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/image.js'
export default {
  name: 'ImageIndex',
  components: {},
  props: {},
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false,
      images: [], // 图片素材列表
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount: 0,
      page: 1,
      pageSize: 20
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadImages()
  },
  mounted () {},
  methods: {
    loadImages (page = 1) {
      // 重置高亮页码
      this.page = page
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        const results = res.data.data.results
        results.forEach(img => {
          // img对象本来没有loading数据
          // 我们这里手动的往里面加该数据是用来控制每个收藏按钮的loading状态
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },
    onCollectChange () {
      this.loadImages()
    },
    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false
      // 更新素材列表
      this.loadImages(this.page)
    },
    onPageChange (page) {
      this.loadImages(page)
    },
    onCollect (img) {
      img.loading = true
      collectImage(img.id, !img.is_collected).then(res => {
        img.is_collected = !img.is_collected
        img.loading = false
      })
    },
    onDelete (img) {
      img.loading = true
      deleteImage(img.id).then(res => {
        img.loading = false
        this.loadImages(this.page)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.action-head {
  padding-bottom:20px;
  display: flex;
  justify-content: space-between
}
.image-item {
  position: relative;
}
.image-action {
  font-size: 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: #fff;
  height: 40px;
  background-color: rgba(204, 204, 204, .5);
  position: absolute;
  bottom: 4px;
  left: 5px;
  right: 5px;
}
</style>
