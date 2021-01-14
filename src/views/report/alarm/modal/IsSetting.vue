<template>
  <a-modal
    v-model="show"
    title="表格列配置"
    centered
    :footer="null"
    @cancel="handleCancel"
    dialogClass="isAddClass"
  >

      <a-row type="flex" justify="start" class="isConfigClass">
      <a-col :span="24">
        <a-checkbox-group @change="onChange">
          <a-row type="flex" justify="start" :gutter="8">
            <a-col :span="8" v-for="(item, i) in configList" :key="i">
              <a-checkbox :value="i"> {{ item }} </a-checkbox
              ><a-icon type="swap" @click="onChangePlace(i)" />
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-col>
      </a-row>
      <a-row type="flex" justify="space-between" class="isModalBtn">
        <a-col >
          <a-button type="primary" @click="onSubmit()">提交</a-button>
        </a-col>
        <a-col>
          <a-button @click="handleCancel()">取消</a-button>
        </a-col>
      </a-row>
  </a-modal>
</template>

<script>
const configList = [
  "中文编码",
  "中文名称",
  "资源摘要",
  "存储周期",
  "数据规模",
  "更新周期",
  "采集地",
  "资源目录类别",
  "状态",
];
export default {
  props: {
    isShow: {
      //横坐标
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
    },
  },

  data() {
    return {

      configList,
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },

    };
  },
  computed: {
    show: {
      get: function () {
        return this.isShow;
      },
      set: function () {},
    },
    treeData: {
      get: function () {
        return this.list;
      },
      set: function () {},
    },
  },
  watch: {
    checkedKeys(val) {
      // console.log("onCheck", val);
    },
    list(v, o) {
    },
  },
  methods: {
    handleCancel(e) {
      // console.log(e);
      // this.visible = false;
      //清空表单
      this.$emit("changeModalStatus", false);
    },
    onCheck(checkedKeys) {
      console.log("onCheck", checkedKeys);
      this.checkedKeys = checkedKeys;
    },
        onChange(checkedValues) {
      console.log("checked = ", checkedValues);
    },
    onSelect(selectedKeys, info) {
      console.log("onSelect", info);
      console.log("onSelect", selectedKeys);
      this.form.title = info.node.dataRef.title;

      this.selectedKeys = selectedKeys;
    },


    onSubmit() {
      let params = {
        deptName: this.form.deptName,
        parentId: this.form.parentId,
      };
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$api.system.addDept(params).then((data) => {
            console.log(data);
            if (data.code == 0) {
                this.$parent.getDept();
              this.$emit("changeModalStatus", false);
              this.$message.success(data.message);
            } else {
              this.$message.error(data.message);
            }
          });
        }
      });
    },

  },
};
</script>

<style lang="scss" scoped>
.isConfigClass{
  margin-bottom:24px;
}
</style>