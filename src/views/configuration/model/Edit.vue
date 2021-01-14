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
            <a-form-model-item label="车辆类型" class="myForm" prop="modelName">
              <a-input v-model="form.modelName" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="储能装置种类" class="myForm">
              <a-input v-model="form.energyStorageType" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="减排系数" class="myForm" prop="emissionReductionCoefficient">
              <a-input v-model="form.emissionReductionCoefficient" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="驱动电机类型" class="myForm">
              <a-input v-model="form.motorType" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="驱动电机额定功率" class="myForm">
              <a-input v-model="form.motorRatedPower" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="驱动电机额定转速" class="myForm">
              <a-input v-model="form.motorRatedSpeed" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="驱动电机额定转矩" class="myForm">
              <a-input v-model="form.motorRatedTorque" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="驱动电机安装数量" class="myForm">
              <a-input v-model="form.motorQuantity" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="驱动电机布置型式/位置" class="myForm">
              <a-input v-model="form.motorPosition" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="驱动电机冷却方式" class="myForm">
              <a-input v-model="form.motorCoolingType" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="电动汽车续航里程" class="myForm">
              <a-input v-model="form.maxEnduranceMileage" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="电动汽车最高车速" class="myForm">
              <a-input v-model="form.maxSpeed" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="动力蓄电池包总数" class="myForm">
              <a-input v-model="form.batteryQuantity" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="动力蓄电池包序号" class="myForm">
              <a-input v-model="form.batterySn" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="生产商代码" class="myForm">
              <a-input v-model="form.manufacturerCode" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="电池类型代码" class="myForm">
              <a-input v-model="form.batteryType" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="额定能量" class="myForm">
              <a-input v-model="form.ratedEnergy" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="额定电压" class="myForm">
              <a-input v-model="form.ratedVol" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="电池生产日期代码" class="myForm">
              <a-input v-model="form.batteryProduceDateCode" />
            </a-form-model-item>
          </a-col>
                    <a-col :span="12">
            <a-form-model-item label="流水号" class="myForm">
              <a-input v-model="form.serialNumber" />
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
       
      },
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
      rules: {
        emissionReductionCoefficient: [
          {
            required: true,
            message: "减排系数必填项",
            trigger: "blur"
          }
        ],
        modelName: [
          {
            required: true,
            message: "车型名称必填项",
            trigger: "blur"
          }
        ],
      }
    };
  },
  created() {
    this.getInfo(this.$route.query.metaDbShow);

  },
  methods: {
   //获取单条数据
    async getInfo(key) {
      const data = await this.$api.configuration.getModelInfo(key);
      if (data.code == 0) {
        this.form = data.data;
      }
    },
    //提交
    onSubmit(){
            this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$api.configuration.updateModel(this.form).then((data) => {
            if(data.code==0){
              this.$message.success(data.message, () => {
                this.$router.history.go(-1)
              });
            }else{
              this.$message.error(data.message)

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
