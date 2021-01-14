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
              <a-form-model-item label="车牌号" class="myForm" prop="plateNumber">
                <a-input
                  v-model="form.plateNumber"
                  placeholder="请输入车牌号"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="车架号" class="myForm" prop="frameNumber">
                <a-input
                  v-model="form.frameNumber"
                  placeholder="请输入车架号"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="终端编号" class="myForm" > 
                <a-input
                  v-model="form.terminalNo"
                  placeholder="请输入终端编号"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="终端识别码" class="myForm" prop="boxSn">
                <a-input v-model="form.boxSn" placeholder="请输入终端识别码" />
              </a-form-model-item>
            </a-col>
            <!-- <a-col :span="12">
              <a-form-model-item label="注册时间" class="myForm">
                <a-input
                  v-model="form.name"
                  placeholder="请输入注册时间"
                  disabled
                />
              </a-form-model-item>
            </a-col> -->
            <!-- <a-col :span="12">
              <a-form-model-item label="激活时间" class="myForm">
                <a-input
                  v-model="form.name"
                  placeholder="请输入激活时间"
                  disabled
                />
              </a-form-model-item>
            </a-col> -->
            <a-col :span="12">
              <a-form-model-item label="车队名称" class="myForm">
                <a-select
                  v-model="form.fleetId"
                  show-search
                  placeholder="请选择车队名称"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  @change="handleChange"
                >
                  <a-select-option
                    :value="item.id"
                    v-for="(item, i) in fleetList"
                    :key="i"
                  >
                    {{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="协议名称" class="myForm">
                <a-select
                  v-model="form.protocolId"
                  show-search
                  placeholder="请选择协议名称"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  @change="handleChange"
                >
                  <a-select-option
                    :value="item.id"
                    v-for="(item, i) in pactList"
                    :key="i"
                    >{{ item.protocolName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="车辆图标" class="myForm">
                <a-select
                  placeholder="车辆图标"
                  @change="handleChange"
                  v-model="form.icon"
                >
                  <a-select-option value="jack"> 是 </a-select-option>
                  <a-select-option value="lucy"> 否 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="是否使用" class="myForm">
                <a-select
                  placeholder="是否使用"
                  @change="handleChange"
                  v-model="form.isUsed"
                >
                  <a-select-option :value="1"> 是 </a-select-option>
                  <a-select-option :value="0"> 否 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="是否监控" class="myForm">
                <a-select
                  placeholder="是否监控"
                  @change="handleChange"
                  v-model="form.isMonitor"
                >
                  <a-select-option :value="1"> 是 </a-select-option>
                  <a-select-option :value="0"> 否 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="授权码" class="myForm">
                <a-input v-model="form.codeVal" placeholder="请输入授权码" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="车辆型号" class="myForm">
                <a-select
                  show-search
                  placeholder="请选择车辆型号"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  @change="handleChange"
                  v-model="form.vehicleModelId"
                >
                  <a-select-option
                    :value="item.id"
                    v-for="(item, i) in modelList"
                    :key="i"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
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
      form: {},
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
            fleetList: [],
      modelList: [],
      pactList: [],
      rules: {
        boxSn: [
          {
            required: true,
            message: "终端识别码为必填项",
            trigger: "blur"
          }
        ],
        frameNumber: [
          {
            required: true,
            message: "车架号为必填项",
            trigger: "blur"
          }
        ],
        plateNumber: [
          {
            required: true,
            message: "车牌号为必填项",
            trigger: "blur"
          }
        ],
      }
    };
  },
  created() {
    this.getFleet();
    this.getPact();
    this.getModel();
  },
  methods: {
        async getFleet() {
      let data = await this.$api.configuration.getDicFleet();
      data.code == 0 ? (this.fleetList = data.data) : [];
    },
    async getPact() {
      let data = await this.$api.configuration.getDicPact();
      data.code == 0 ? (this.pactList = data.data) : [];
    },
    async getModel() {
      let data = await this.$api.configuration.getDicModel();
      data.code == 0 ? (this.modelList = data.data) : [];
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    //提交
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$api.configuration.addVehicle(this.form).then(data => {
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
