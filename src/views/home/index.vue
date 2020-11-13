<template>
  <div class="home-container">
    <div class="amap-wrapper">
      <el-amap
        ref="map"
        :vid="'amapDemo'"
        :center="center"
        :zoom="zoom"
        :plugin="plugin"
        :events="events"
        :mapStyle="mapStyle"
        class="amap-demo"
      >
      </el-amap>
    </div>
  </div>
</template>

<script>
export default {
  // 指定 name 选项的另一个好处是使用调试.
  // 有名字的组件有更友好的警告信息.
  // 另外,当在有vue-devtools,未命名组件将显示成anonymousComponent,这很没有语义.通过提供name选项,可以获得更有语义信息的组件树.
  // 结论:给一个组件起个名字是非常有意义的,尽量不要让组件名字重复
  name: 'HomeIndex',
  components: {},
  props: {},
  data () {
    return {
      center: [106.315739, 29.592531],
      zoom: 18,
      mapStyle: 'amap://styles/8b6be8ec497009e17a708205348b899a', // 设置地图样式
      events: {
        init (o) {
          // console.log(o.getCenter())
        },
        zoomchange: (e) => {
          console.log(e)
        },
        zoomend: (e) => {
          // 获取当前缩放zoom值
          console.log(this.$refs.map.$$getInstance().getZoom())
          console.log(e)
        },
        click: e => {
          console.dir(e)
        }
      },
      // 使用其他组件
      plugin: [
        {
          pName: 'Scale',
          events: {
            init (instance) {
              // console.log(instance)
            }
          }
        },
        {
          pName: 'ToolBar',
          events: {
            init (instance) {
              // console.log(instance)
            }
          }
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style lang="less" scoped>
.home-container {
  position: absolute;
  left: 130px;
  right: 0;
  top: 60px;
  bottom: 0;
  .amap-wrapper {
    height: 100%;
  }
}

</style>
