<template>
  <div class="common-box common-info">
    <!-- 面包屑 -->
    <breadcrumb></breadcrumb>

    <div class=" common-info-box">
      <div class="info-title">基本信息</div>
      <div class="info-box">
        <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          htmlFor="labelClass"
        >
          <a-row type="flex" justify="space-between">
            <a-col :span="12">
    <a-form-model-item label="协议码" class="myForm" prop="protocolCode">
              <a-input v-model="form.protocolCode" placeholder="请输入协议码" />
            </a-form-model-item>
            </a-col>
            <a-col :span="12"></a-col>
            <a-col :span="12">
            <a-form-model-item label="协议名称" class="myForm" prop="protocolName">
              <a-input
                v-model="form.protocolName"
                placeholder="请输入协议名称"
              />
            </a-form-model-item>
            </a-col>
            
            <!-- <a-col :span="12"></a-col> -->
          </a-row>
        </a-form-model>
      </div>
      <div class="height-card"></div>
      <a-row justify="space-between" type="flex" class="info-btn">
        <a-col>
          <a-button @click="resetForm">取消</a-button>
        </a-col>
        <a-col>
          <a-button type="primary" @click="onSubmit">保存</a-button>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import breadcrumb from "@/components/layout/layout-breadcrumb";
export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      form: {
        fleetName: "",
        fleetDesc: "",
        vehicleList: []
      },
      where: {
        name: ""
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
      mockData: [],
      targetKeys: [],
      rules: {
        protocolName: [
          {
            required: true,
            message: "协议名称为必填项",
            trigger: "blur"
          }
        ],
        protocolCode: [
          {
            required: true,
            message: "协议码为必填项",
            trigger: "blur"
          }
        ],
      }
    };
  },
  methods: {
    

    //提交
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$api.configuration.addPact(this.form).then(data => {
            if (data.code == 0) {
              this.$message.success(data.message, () => {
                this.$router.history.go(-1);
              });
            } else {
              this.$message.error(data.message);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.$router.history.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped></style>
