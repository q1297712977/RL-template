<template>
  <a-card
    class="box-card"
    title="车辆位置信息"
    style="padding: 0 80 30 80; border-radius: 4px"
  >
    <a-button  shape="round" slot="extra" @click="onClose">关闭</a-button>
    <!-- <p v-if="isInfo">车辆名称 : 测试一下</p>
      <p v-if="isInfo">地点 : 测试一下2222</p>
      <p v-if="isInfo">说明 : 测试一下111111</p> -->
    <a-row type="flex" justify="start" v-if="isInfo">
      <a-col> 车辆名称:{{ info.markerName }} </a-col>
    </a-row>
    <a-row type="flex" justify="start" v-if="isInfo" :gutter="8">
      <a-col> 车速:测试111 </a-col>
      <a-col> 状态:测试111 </a-col>
    </a-row>
    <a-row type="flex" justify="start" v-if="isInfo">
      <a-col> 里程:测试111 </a-col>
    </a-row>
    <a-row type="flex" justify="start" v-if="isInfo">
      <a-col> 经纬度:测试111 </a-col>
    </a-row>
    <a-row type="flex" justify="start" v-if="isInfo">
      <a-col> 位置:测试111 </a-col>
    </a-row>
    <a-row type="flex" justify="start" v-if="isInfo">
      <a-col> 定位时间:2020-11-11 14:30 </a-col>
    </a-row>
    <p v-if="!isInfo" style="text-align: center; color: #b3b3b3">暂无信息</p>
    <a-row type="flex" justify="space-between" class="info-button">
      <a-col>
        <a-button type="primary" @click="getInfo()">参数详情</a-button>
      </a-col>
      <a-col>
        <a-button type="primary" @click="rePlay()">轨迹回放</a-button>
      </a-col>
    </a-row>
  </a-card>
</template>
<script>
export default {
  props: {
    info: {
      //传值
      type: Object,
    },
  },

  data() {
    return {
      overlay: null,
      infoWindow: null,
      isInfo: true,
      modal: {
        parameterInfo: false, //参数详情
        replayShow: false,
      },
    };
  },
  methods: {
    initialize(e) {
      this.overlay = e.overlay;
      console.log(this.overlay);
      this.infoWindow = e.infoWindow;
    },
    //关闭
    onClose() {
      // this.infoWindow.close();
      console.log(1);
      this.$emit("changeModalStatus", false);
      this.show = false;
    },
    rePlay() {
      this.modal.replayShow = true;
      this.$emit("changeReplayStatus", true);
      console.log("回放");
    },
    getInfo() {
      this.modal.parameterInfo = true;
      this.$emit("changeParameterStatus", true);

      console.log("参数详情");
    },
  },
};
</script>
 
<style lang="scss" scoped>
.info-button {
  margin-top: 8px;
  .ant-btn {
    padding: 0 15px;
    height: 32px;
    line-height: 32px;
  }
}
.box-card {
  position: absolute;
  right: 48px;
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