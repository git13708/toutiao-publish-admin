<template>
  <div class="publish-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.query.id ? '修改' : '发布' }}文章</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form
        ref="publish-form"
        :model="article"
        :rules="formRules"
        label-width="60px"
        size="mini">
        <el-form-item label="标题:" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容:" prop="content">
          <el-tiptap
            :extensions="extensions"
            lang="zh"
            height="300"
            placeholder="请输入文章内容"
            v-model="article.content"></el-tiptap>
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
        </el-form-item>
        <el-form-item label="封面:">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道:" prop="channel_id">
          <el-select
            v-model="article.channel_id"
            placeholder="请选择频道">
            <el-option v-for="(channel, index) in channels"
             :label="channel.name"
             :value="channel.id"
             :key="index"
             ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  getArticleChannels,
  addArticle,
  getArticle,
  updateArticle
} from '@/api/article.js'
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Preview,
  Image,
  TextColor,
  TextHighlight
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/api/image.js'
export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap
  },
  props: {},
  data () {
    return {
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: { // 文章封面
          type: 0, // 封面类型 -1：自动，0-无图，1-1张，3-3张
          images: []
        },
        channel_id: null
      },
      channels: [], // 文章频道数据
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 3 }), // 标题
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Image({
          // 默认会把图片生成Base64字符串和内容存储在一起,
          // 如果自定义图片上传.则在这里配置
          // 图片的上传方法,返回一个Promise<url>
          uploadRequest (file) {
            const fd = new FormData()
            fd.append('image', file)
            return uploadImage(fd).then(res => {
              return res.data.data.url
            })
          }
        }),
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(), // 斜体
        new Strike(), // 删除线
        new HorizontalRule(), // 分隔线
        new ListItem(),
        new BulletList(), // 无序列表
        new OrderedList(), // 有序列表
        new TodoItem(),
        new TodoList(),
        new Fullscreen(),
        new Preview(),
        new TextColor(),
        new TextHighlight()
      ],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在5到30个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (value === '<p></p>') {
                callback(new Error('请输入文章内容'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        channel_id: [
          { required: true, message: '请选择文章频道' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()
    // 由于我们让发表和修改使用的同一个组件
    // 所以这里要判断
    // 如果路由路径参数中有id,则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted () {},
  methods: {
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onPublish (draft = false) {
      this.$refs['publish-form'].validate(valid => {
        if (!valid) {
          return
        }

        // 验证通过,提交表单
        // 如果是修改文章，则执行修改操作，否则执行添加操作
        const articleId = this.$route.query.id
        if (articleId) {
          // 执行修改操作
          updateArticle(articleId, this.article, draft).then(res => {
            this.$message({
              message: `${draft ? '存入草稿' : '修改'}成功`,
              type: 'success'
            })
            // 跳转到内容管理页面
            this.$router.push('/article')
          }).catch(err => {
            console.log('修改文章失败', err)
            this.$message.error('修改文章失败！')
          })
        } else {
          addArticle(this.article, draft).then(res => {
            this.$message({
              message: `${draft ? '存入草稿' : '发表'}成功`,
              type: 'success'
            })
            this.$router.push('/article')
          }).catch(err => {
            console.log('发表文章失败', err)
            this.$message.error('发表文章失败！')
          })
        }
      })
    },
    // 加载文章内容
    loadArticle () {
      getArticle(this.$route.query.id).then(res => {
        this.article = res.data.data
      }).catch(err => {
        console.log('获取文章失败', err)
        this.$message.error('获取文章失败！')
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
