<template>
  <a-modal
    v-model="show"
    title="设置IP端口"
    centered
    :footer="null"
    class="onShowClass"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row type="flex" justify="start">
        <a-col :span="12">
          <a-form-model-item label="IP名称" class="myForm">
            <a-input v-model="form.name" placeholder="请输入IP名称" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="IP端口" class="myForm">
            <a-input v-model="form.name" placeholder="请输入IP端口" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row type="flex" justify="end">
        <a-col :span="19">
          <!-- <a-form-model-item label=" " class="myForm" :colon="false"> -->
            <a-row type="flex" justify="space-between" >
              
              <a-col>
                <a-button type="primary" @click="onSubmit()">提交</a-button>
              </a-col>
              <a-col>
                <a-button @click="handleCancel()">取消</a-button>
              </a-col>
            </a-row>
          <!-- </a-form-model-item> -->
        </a-col>
      </a-row>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  props: {
    isShow: {
      //横坐标
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      form: {
        name: "",
      },
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
      rules: {
        name: [
          {
            required: true,
            message: "Please input Activity name",
            trigger: "blur",
          },
          {
            min: 3,
            max: 5,
            message: "Length should be 3 to 5",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    show: {
      get: function () {
        return this.isShow;
      },
      set: function () {},
    },
  },
  methods: {
    handleCancel(e) {
      // console.log(e);
      // this.visible = false;
      //清空表单
      this.$emit("changeModalStatus", false);
    },
    onSubmit() {
      this.$message.success("修改成功"); //修改成功属性父级列表
      this.$emit("changeModalStatus", false);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>