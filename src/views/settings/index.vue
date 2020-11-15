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
          <el-form
            ref="settings-form"
            :model="user"
            label-width="80px"
            size="small"
          >
            <el-form-item label="编号:">
              {{user.id}}
            </el-form-item>
            <el-form-item label="手机:">
              {{user.mobile}}
            </el-form-item>
            <el-form-item label="媒体名称:">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍:">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="updateProfileLoading"
                @click="onUpdateUser"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="2" :span="4">
          <el-avatar
            shape="square"
            :size="150"
            fit="cover"
            :src="user.photo"
          >
          </el-avatar>
          <!-- <p @click="$refs.file.click()">点击修改头像</p> -->
          <label for="file">点击修改头像</label>
          <input
            id="file"
            type="file"
            hidden
            ref="file"
            @change="onFileChange"
          />
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      @opened="onDialogOpened"
      @closed="onDialogClosed"
    >
      <div class="preview-image-wrap">
        <img
          class="preview-image"
          :src="previewImage"
          ref="preview-image"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="onUpdatePhoto"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserProfile,
  updateUserPhoto,
  updateUserProfile
} from '@/api/user.js'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'

// 图片裁切器必须在图片在可视状态下才能正常完成初始化
// 获取图片DOM节点
// const image = document.getElementById('image')
// 初始化裁切器
// const cropper = new Cropper(image,{})

export default {
  name: 'SettingsIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      }, // 用户资料
      dialogVisible: false, // 控制上传图片预览
      previewImage: '', // 预览图片
      cropper: null,
      updatePhotoLoading: false,
      updateProfileLoading: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUser()
  },
  mounted () {},
  methods: {
    onUpdateUser () {
      this.updateProfileLoading = true
      const { name, intro, email } = this.user
      updateUserProfile({
        name,
        intro,
        email
      }).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        // 关闭loading状态
        this.updateProfileLoading = false
        // 发布通知,用户信息已修改
        globalBus.$emit('update-user', this.user)
      }).catch(err => {
        this.$message.error('保存失败', err)
        this.updateProfileLoading = false
      })
    },
    loadUser () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onFileChange () {
      // 处理图片预览
      const file = this.$refs.file
      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData
      // 展示弹出层,预览用户选择的图片
      this.dialogVisible = true
      // 解决选择相同文件不触发 change事件问题
      this.$refs.file.value = ''
    },
    onDialogOpened () {
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }

      const image = this.$refs['preview-image']
      this.cropper = new Cropper(image, {
        // 裁切器比例
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        cropBoxMovable: false,
        cropBoxResizable: false,
        background: false,
        movable: true
        // 当你移动裁切器的时候会触发调用crop方法
        // crop (event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
    },
    onDialogClosed () {
      // 对话框关闭时,销毁裁切器
      // this.cropper.destroy()
    },
    onUpdatePhoto () {
      // 获取裁切的图片对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        // 请求提交fd
        updateUserPhoto(fd).then(res => {
          // 关闭对话框
          this.dialogVisible = false

          this.$message({
            type: 'success',
            message: '更新头像成功'
          })
          // 更新视图展示
          // 直接把裁切结果的文件对象转为blob
          this.user.photo = window.URL.createObjectURL(file)
          globalBus.$emit('update-user', this.user)
          // 把服务器端返回的图片进行展示有点慢
          // this.user.photo = res.data.data.photo
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.preview-image-wrap {
  .preview-image {
    display: block;
    min-width: 100%;
    height: 200px;
  }
}
</style>
