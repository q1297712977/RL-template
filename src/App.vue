<template>
  <a-config-provider :locale="zh_CN">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
export default {
  data() {
    return {
      zh_CN
    };
  },
  name: "App",
  components: {},

};
</script>


<style lang="scss" >
@import "./assets/css/global.scss";
.ant-message-notice-content {
  padding: 0;
  margin: 80px 40px 0 0;
  font-size: 16px;
}

.ant-spin-spinning {
  z-index: 1500;
  position: fixed !important;
  top: 10% !important;
}
</style>
