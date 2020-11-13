<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑路径导航 -->
      </div>
      <!-- 数据筛选表单 -->
      <el-form ref="form" label-width="45px" size="mini">
        <el-form-item label="状态:">
          <el-radio-group v-model="status">
            <!--
              el-radio 默认把label作为文本和选中之后的value值
             -->
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道:">
          <el-select
            v-model="channelId"
            placeholder="请选择频道">
            <el-option label="全部" :value="null"/>
            <el-option v-for="(channel, index) in channels"
             :label="channel.name"
             :value="channel.id"
             :key="index"
             ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期:">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!--
            button 按钮的 click事件有个默认参数
            当你没有指定参数的时候,它会默认传递一个没用的数据
           -->
          <el-button
            type="primary"
            :disabled="loading"
            @click="loadArticles(1)">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- /数据筛选表单 -->
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到{{totalCount}}条结果:
      </div>
      <!-- 数据列表 -->
      <!--
        Table表格组件
        1.把需要展示的数组列表绑定给table组件的data属性
          注意:你不用去v-for遍历,它自己会遍历
        2.设计表格列 el-table-column
          width:可以设置表格列宽度
          label:可以设置列标题
          prop:用来设定要渲染的列表项数据字段,只能展示文本
        3.如果表格列默认只能渲染普通文本,如果需要展示其它内容,
          例如 放个按钮,放个图片,那就需要自定义表格列模板了
       -->
      <el-table
        :data="articles"
        style="width: 100%"
        stripe
        class="list-table"
        size="small"
        v-loading="loading"
        >
        <el-table-column
          label="封面">
          <template slot-scope="scope">
            <el-image
              lazy
              style="width: 50px; height: 50px"
              :src="scope.row.cover.images[0]"
              fit="cover"
              :preview-src-list="scope.row.cover.images"
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
              <div slot="error" class="image-slot">
                <img
                  class="article-cover"
                  src="./no-cover.gif"
                  alt="暂无封面"/>
              </div>
            </el-image>
            <!-- <img
              v-if="scope.row.cover.images[0]"
              class="article-cover"
              :src="scope.row.cover.images[0]"
              alt="封面图"/>
            <img
              v-else
              class="article-cover"
              src="./no-cover.gif"
              alt="暂无封面"/> -->
            <!--
              下面这种情况是在运行期间动态改变处理的.
              而本地图片必须在打包的时候就存在
             -->
            <!-- <img class="article-cover" :src="scope.row.cover.images[0]||'./no-cover.gif'" alt=""/> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          label="状态">
          <!-- 如果需要在自定义列模板中获取遍历项数据,那么就在template上声明slot-scope="scopt" -->
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{articleStatus[scope.row.status].text}}</el-tag>
            <!-- <el-tag v-if="scope.row.status === 0"  type="warning">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>
            <el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>
            <el-tag v-else-if="scope.row.status === 4" type="info">已删除</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间">
        </el-table-column>
        <el-table-column
          label="操作">
          <!-- 如果需要自定义表格列模板,则把需要自定义的内容放到template里面 -->
          <template slot-scope="scope">
            <el-button
                icon="el-icon-edit"
                size="mini"
                type="primary"
                circle
              ></el-button>
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="danger"
              circle
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- /数据列表 -->
      <!-- 列表分页 -->
      <!--
        total 用来设定总数据的条数
        它默认按10条每页计算总页码
       -->
      <el-pagination
        layout="prev, pager, next"
        background
        :total="totalCount"
        :page-size="pageSize"
        :disabled="loading"
        :current-page.sync="page"
        @current-change="onCurrentChange"
        />
      <!-- /列表分页 -->
    </el-card>
  </div>
</template>

<script>
import {
  getArticles,
  getArticleChannels,
  deleteArticle
} from '@/api/article'

export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      articles: [], // 文章数据列表
      articleStatus: [ // 文章状态
        { status: 0, text: '草稿', type: 'info' }, // 0
        { status: 1, text: '待审核', type: '' }, // 1
        { status: 2, text: '审核通过', type: 'success' }, // 2
        { status: 3, text: '审核失败', type: 'warning' }, // 3
        { status: 4, text: '已删除', type: 'danger' } // 4
      ],
      channels: [], // 频道列表数据
      totalCount: 0, // 总数据条数
      pageSize: 10, // 每页大小
      status: null, // 查询文章的状态,不传就是全部
      channelId: null, // 查询文章的频道
      rangeDate: null, // 筛选的范围日期
      loading: true, // 加载表格数据中
      page: 1 // 当前页码
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles()
    this.loadChannels()
  },
  mounted () {},
  methods: {
    /**
     * 加载内容数据
     */
    loadArticles (page = 1) {
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null
      }).then(res => {
        // total_count 代码规范不允许这样命名
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        if (page === 1) {
          this.totalCount = totalCount
        }
        // 关闭加载中 loading
        this.loading = false
      }).catch(err => {
        console.log(err)
        // 关闭加载中 loading
        this.loading = false
      })
    },
    /**
     * 分页获取数据
     */
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    onDeleteArticle (articleId) {
      this.$confirm('确诊删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(articleId.toString()).then(res => {
          // 删除成功，更新当前页的文章数据列表
          this.loadArticles(this.page)
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="less" scoped>
.filter-card {
  margin-bottom: 20px;
}
.list-table {
  margin-bottom: 20px;
}
.article-cover {
  width: 50px;
  height: 50px;
  background-size: cover;
}
</style>
