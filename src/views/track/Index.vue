<template>
  <!-- <div class="v1-component"> -->
  <!-- 轨迹回放 -->
  <!-- <replayInfo
    ></replayInfo>
    </div> -->
  <div class="common-box  common-info">
    <!-- 面包屑 -->
  <a-row type="flex" justify="start" class="content-box">
      <a-col class="content-right">
          <div class="myMapClass">
      <replayInfo></replayInfo>
          </div>
      </a-col>
</a-row>

  </div>
</template>

<script>
import replayInfo from "@/components/v1-map/replayInfo";

export default {
  components: {
    replayInfo
  }
};
</script>

<style lang="scss" scoped>
// .main-right{
//     margin-left: 0px;
//     .replay-box{
//         height:100%;
//     }
//     .ant-table-body{
//         // max-height:344px!important;
//     }
// }
.common-box{
  height: 100%!important;
      overflow: auto!important;

}
.myMapClass{
    height:100%;
    padding:40px 32px 0px;
}
</style>
