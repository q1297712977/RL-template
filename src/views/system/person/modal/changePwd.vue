<template>
  <a-modal
    title="修改密码"
    :visible="show"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
    centered
    dialogClass="changePassword"
  >
    <a-form-model
      :model="passwordForm"
      :rules="passRules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      ref="passwordForm"
    >
      <a-form-model-item label="旧密码" prop="password">
        <a-input type="password" v-model="passwordForm.password" />
      </a-form-model-item>
      <a-form-model-item label="新密码" prop="newPassword">
        <a-input type="password" v-model="passwordForm.newPassword" />
      </a-form-model-item>
      <a-form-model-item label="再次确认" prop="rePassword">
        <a-input type="password" v-model="passwordForm.rePassword" />
      </a-form-model-item>
    </a-form-model>
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
    let checkPassword = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("密码不能为空"));
      } else {
        this.$api.system.checkPassword(value).then((res) => {
          if (!res.data) {
            return callback(new Error("旧密码不正确"));
          } else {
            callback();
          }
        });
      }
    };
    let rePassword = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("确认密码不能为空"));
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      passwordForm: {},
      labelCol: { span: 6 },
      loading: false,
      wrapperCol: { span: 14 },
      passRules: {
        password: [{ validator: checkPassword, trigger: "blur" }],
        newPassword: [
          {
            required: true,
            trigger: "blur",
            message: "新密码是必填项",
          },
        ],
        rePassword: [{ validator: rePassword, trigger: "blur" }],
      },
    };
  },
  methods: {
    handleOk(e) {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          this.$api.system
            .changePassword(this.passwordForm.newPassword)
            .then((data) => {
              if (data.code == 0) {
                this.$message.success(data.message)
                this.$emit("changeModalStatus", false); //状态
                 this.$emit("onfatherSubmit"); //传值
              }
            });
        }
      });
    },
    handleCancel(e) {
      this.$emit("selectedDbKey", this.params); //传值
      this.$emit("changeModalStatus", false); //状态
    },
  },
};
</script>

<style lang="scss" scoped>
</style>