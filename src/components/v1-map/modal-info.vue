<template>

  <a-card
    class="box-card"
    title="围栏内车辆列表"
    v-show="isShow && list.length > 0"
    style="padding: 0 80 30 80;border-radius: 4px"
  >
    <a-button shape="round" slot="extra" @click="handleCancel">关闭</a-button>
    <a-row
      type="flex"
      justify="space-between"
      v-for="(item, i) in list"
      :key="i"
    >
      <a-col>车牌号{{ item.markerId }}</a-col>
      <a-col>{{item.markerName}}</a-col>
    </a-row>
  </a-card>
</template>
<script>
export default {
  props: {
    list: {
      //传值
      type: Array,
      default: [],
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleOk(e) {
      // console.log(e);
      this.visible = false;
    },
    handleCancel(e) {
      // console.log(e);
      this.$emit("changeModalStatus", false);
      this.show = false;
    },
  },
  created() {
    console.log(this.list);
    // console.log(this.info);
  },
  watch: {
    list(n,o){
      console.log(n)
    }
  },
  computed: {
    show: {
      get: function () {
        // console.log(this.isShow);
        return this.isShow;
        // return true
      },
      set: function () {},
    },
  },
};
</script>
 
<style lang="scss" scoped>

.box-card {
  position: absolute;
  right: 8px;
  top: 240px;
  width: 400px;
  ::v-deep .ant-card-head {
    line-height: 56px;
    height: 56px;
    min-height: 56px;
    .ant-card-head-wrapper {
      .ant-card-head-title {
        padding: 0px;
      }
      .ant-card-extra {
        height: 56px;
        line-height: 56px;
        padding: 0px;
        .ant-btn {
          height: 32px;
          line-height: 32px;
        }
      }
    }
  }
}
</style>