<template>
  <a-modal
    :visible="show"
    :confirm-loading="loading"
    :closable="false"
    :cancel-button-props="{ props: { disabled: true } }"
    centered
    :footer="null"
    dialogClass="alert-message-box"
  >
    <a-row type="flex" justify="start" align="middle">
      <a-col :span="2"><a-icon type="close-circle" /></a-col>
      <a-col :span="22" class="alarm-title">重新登录</a-col>
      <a-col :span="2"></a-col>
      <a-col :span="22" class="alarm-info">您的登录密码已修改,请重新登录账号</a-col>
    </a-row>
  </a-modal>
</template>

<script>
export default {
  props: {
    ruleType: {
      type: [String, Number],
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    show: {
      get: function () {
        return this.isShow;
      },
      set: function () {},
    },
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      loading:false,

    };
  },

};
</script>

<style lang="scss" scoped>
.ant-row-flex{
  .ant-col{
    height: 32px;
    line-height: 32px;
    margin-bottom: 8px;
    font-size: 14px;/*no*/
  }
  .anticon{
    color:red;
    margin-top: 4px;
    font-size: 28px;
    height: 32px;
    line-height: 32px;
  }
  .alarm-title{
    height:32px;
    line-height: 32px;
    font-size: 24px;
  }
}
</style>