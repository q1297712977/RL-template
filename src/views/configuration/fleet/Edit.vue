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
              <a-form-model-item
                label="车队名称"
                class="myForm"
                prop="fleetName"
              >
                  
                <a-input v-model="form.fleetName" placeholder="请输入车队名称" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12"></a-col>
            <a-col :span="12">
              <a-form-model-item label="车队描述" class="myForm">
                <a-textarea
                  placeholder="请输入车队描述"
                  v-model="form.fleetDesc"
                  :auto-size="{ minRows: 3, maxRows: 5 }"
                  class="myTextarea"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="24">
              <a-form-model-item
                label="车辆列表"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 20 }"
              >
                <a-transfer
                  :data-source="mockData"
                  :list-style="{
                    width: '300px',
                    height: '300px'
                  }"
                  show-search
                  :target-keys="targetKeys"
                  :render="renderItem"
                  @change="handleChange"
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
        fleetName: [
          {
            required: true,
            message: "车队名称为必填项",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getInfo(this.$route.query.metaDbShow);

    this.getMock();
  },
  methods: {
    getMock() {
      const targetKeys = [];
      const mockData = [];
      for (let i = 0; i < 20; i++) {
        const data = {
          key: i.toString(),
          title: `测试车辆${i + 1}`,
          description: `测试车辆${i + 1}`,
          chosen: Math.random() * 2 > 1,
        };
        if (data.chosen) {
          targetKeys.push(data.key);
        }
        mockData.push(data);
      }
      this.mockData = mockData;
      this.targetKeys = targetKeys;
    },
    renderItem(item) {
      const customLabel = (
        <span class="custom-item">
          {item.title} - {item.description}
        </span>
      );

      return {
        label: customLabel, // for displayed item
        value: item.title, // for title and filter matching
      };
    },
    handleChange(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.targetKeys = targetKeys;
    },

    //获取单条数据
    async getInfo(key) {
      const data = await this.$api.configuration.getFleetInfo(key);
      if (data.code == 0) {
        this.form = data.data;
      }
    },
    //提交
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$api.configuration.updateFleet(this.form).then((data) => {
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
