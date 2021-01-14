<template>
  <a-modal
    v-model="show"
    title="批量编辑"
    centered
    :footer="null"
    class="onShowClass"
    @cancel="handleCancel"
    
    destroyOnClose
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row type="flex" justify="space-between">
        <a-col :span="18" v-if="type == '1'">
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
        <a-col :span="18" v-else>
          <a-form-model-item label="授权码" class="myForm">
            <a-input v-model="form.codeVal" placeholder="请输入授权码" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row type="flex" justify="space-between">
        <a-col :span="18">
          <a-form-model-item label=" " class="myForm" :colon="false">
            <a-row type="flex" justify="space-between" >
              <a-col>
                <a-button type="primary" @click="onSubmit()">提交</a-button>
              </a-col>
              <a-col>
                <a-button @click="handleCancel()">取消</a-button>
              </a-col>
            </a-row>
          </a-form-model-item>
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
    type: {
      type: String,
      default: "1",
    },
    list: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      form: {
        name: "",
      },
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
      pactList: [],
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
  watch: {
    show(n, o) {
      console.log(n);
      console.log(n);
    },
  },

  created() {
    this.getPact();
  },
  methods: {
    async getPact() {
      let data = await this.$api.configuration.getDicPact();
      data.code == 0 ? (this.pactList = data.data) : [];
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    filterOption(input, option) {
      console.log(input, option);
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    handleCancel(e) {
      // console.log(e);
      // this.visible = false;
      //清空表单
      this.$emit("changeModalStatus", false);
    },

    onSubmit() {
      let params = {
        codeVal: this.form.codeVal,
        protocolId: this.form.protocolId,
        updateType: this.type,
        vehicleIds: this.list
      };
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$api.configuration.allUpdatePact(params).then((data) => {
            if (data.code == 0) {
             this.form={}
              this.$message.success(data.message); //修改成功属性父级列表
              this.$emit("changeModalStatus", false);
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
  },
};
</script>

<style lang="scss" scoped>
</style>