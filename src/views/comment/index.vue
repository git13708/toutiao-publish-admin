<template>
  <div class="comment-container">
    <el-card>
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <!--
        1.把数据列表绑定给表格的 data
        2.设计表格列
        3.给表格列绑定要渲染的数据字段
       -->
      <el-table
        class="table-list"
        :data="articles"
        stripe
      >
        <el-table-column
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数">
        </el-table-column>
        <el-table-column
          prop="fans_comment_count"
          label="粉丝评论数">
        </el-table-column>
        <el-table-column
          label="评论状态">
          <template slot-scope="scope">
            {{scope.row.comment_status ? '正常' : '关闭'}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.disabled"
              @change="onStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!--
        绑定页码
        绑定每页大小
        current-page 控制激活的页码,初始肯定是第1页
        page-sizes 控制可选每页大小
        page-size 控制每页数量
       -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      />
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'
export default {
  name: 'CommentIndex',
  components: {},
  props: {},
  data () {
    return {
      articles: [], // 文章数据列表
      currentPage: 1,
      totalCount: 0,
      pageSize: 10
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles()
  },
  mounted () {},
  methods: {
    handleSizeChange () {
      this.loadArticles(1)
    },
    handleCurrentChange (page) {
      // 页码改变,加载指定页码数据
      this.loadArticles(page)
    },
    loadArticles (page = 1) {
      this.currentPage = page
      getArticles({
        page,
        per_page: this.pageSize,
        response_type: 'comment'
      }).then(res => {
        const results = res.data.data.results
        results.forEach(article => {
          article.disabled = false
        })
        this.articles = results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (article) {
      article.disabled = true
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        article.disabled = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启文章评论成功' : '关闭文章评论成功'
        })
      }).catch(err => {
        console.log('操作失败', err)
        article.comment_status = !article.comment_status
        article.disabled = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.table-list {
  margin-bottom: 30px;
}
</style>
