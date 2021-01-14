<template>
  <a-modal
    v-model="show"
    title="车辆详情"
    centered
    :footer="null"
    class="onShowClass"
  @cancel="handleCancel"
  >
    <a-row type="flex" justify="start" class="onShowClass">
      <a-col :span="12">
        <a-row type="flex" justify="start" :gutter="8">
          <a-col :span="8" class="class_r">车牌号 : </a-col>
          <a-col>{{showList.plateNumber}}</a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row type="flex" justify="start" :gutter="8">
          <a-col :span="8" class="class_r">车架号 : </a-col>
          <a-col>{{showList.frameNumber}}</a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row type="flex" justify="start" :gutter="8">
          <a-col :span="8" class="class_r">终端编号 : </a-col>
          <a-col>{{showList.terminalNo}}</a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row type="flex" justify="start" :gutter="8">
          <a-col :span="8" class="class_r">终端识别码 : </a-col>
          <a-col>{{showList.boxSn}}</a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row type="flex" justify="start" :gutter="8">
          <a-col :span="8" class="class_r">注册时间 : </a-col>
          <a-col>{{showList.registerTime}}</a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row type="flex" justify="start" :gutter="8">
          <a-col :span="8" class="class_r">激活时间 : </a-col>
          <a-col>{{showList.activeTime}}</a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row type="flex" justify="start" :gutter="8">
          <a-col :span="8" class="class_r">车队名称 : </a-col>
          <a-col>{{showList.frameNumber}}</a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row type="flex" justify="start" :gutter="8">
          <a-col :span="8" class="class_r">协议名称 : </a-col>
          <a-col>{{showList.frameNumber}}</a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row type="flex" justify="start" :gutter="8">
          <a-col :span="8" class="class_r">车队图标 : </a-col>
          <a-col>{{showList.icon}}</a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row type="flex" justify="start" :gutter="8">
          <a-col :span="8" class="class_r">是否使用 : </a-col>
          <a-col>{{showList.isUsed}}</a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row type="flex" justify="start" :gutter="8">
          <a-col :span="8" class="class_r">是否监控 : </a-col>
          <a-col>{{showList.isMonitorName}}</a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row type="flex" justify="start" :gutter="8">
          <a-col :span="8" class="class_r">授权码 : </a-col>
          <a-col>{{showList.codeVal}}</a-col>
        </a-row>
      </a-col>
      <a-col :span="12">
        <a-row type="flex" justify="start" :gutter="8">
          <a-col :span="8" class="class_r">车辆型号 : </a-col>
          <a-col>{{showList.frameNumber}}</a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
const list = [
  { name: "车牌号", type: "input" },
  { name: "车架号", type: "input" },
  { name: "终端编号", type: "input" },
  { name: "终端识别码", type: "input" },
  { name: "注册时间", type: "input" },
  { name: "激活时间", type: "input" },
  { name: "车队名称", type: "select" },
  { name: "协议名称", type: "select" },
  { name: "车辆图标", type: "select" },
  { name: "是否使用", type: "select" },
  { name: "是否监控", type: "select" },
  { name: "授权码", type: "input" },
  { name: "车辆型号", type: "select" },
];
export default {
  props: {
    isShow: {
      //横坐标
      type: Boolean,
      default: false,
    },
    list: {
      type: Object,
      default: null,
    },
  },
  computed: {
    show: {
      get: function () {
        return this.isShow;
      },
      set: function () {},
    },
    showList: {
      get: function () {
        return this.list;
      },
      set: function () {},
    },
  },
  watch: {
    list(n,o){
      console.log(n)
    }
  },
  methods: {
    handleCancel(e) {
      // console.log(e);
      // this.visible = false;
      this.showList={}
      this.$emit("changeModalStatus",false)
    },
  },
};
</script>

<style lang="scss" scoped>
.onShowClass {
  .ant-col {
    height: 32px;
    line-height: 32px;
  }
  .class_r {
    text-align: right;
  }
}
</style>