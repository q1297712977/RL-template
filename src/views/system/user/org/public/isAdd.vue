<template>
  <a-modal
    v-model="show"
    title="新增组织"
    centered
    :footer="null"
    @cancel="handleCancel"
    dialogClass="isAddClass"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      labelAlign="left"
    >
      <a-row type="flex" justify="start">
        <a-col :span="24">
          <a-form-model-item label="组织名称" class="myForm" prop="deptName">
            <a-input v-model="form.deptName" placeholder="请输入组织名称" />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item label="上级组织" class="myForm" prop="parentId">
            <a-tree-select
              v-model="form.parentId"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeData"
              placeholder="请选择上级组织"
              :replace-fields="treeConfig.replaceFields"
            ></a-tree-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="24" class="isTextareaClass">
          <a-form-model-item label="组织描述">
            <a-textarea placeholder="请输入组织描述" :rows="4" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row type="flex" justify="space-between" class="isModalBtn">
        <a-col :offset="4">
          <a-button type="primary" @click="onSubmit()">提交</a-button>
        </a-col>
        <a-col>
          <a-button @click="handleCancel()">取消</a-button>
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
    },
  },

  data() {
    return {
      form: {
        deptName: "",
        parentId: 0,
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },

      // tree组织
      treeConfig: {
        value: [],
        replaceFields: {
          key: "id",
          title: "label",
          children: "children",
          value: "id",
        },
      },
      //addOrg前端控制
      rules: {
        deptName: [
          { required: true, message: "组织名称为必填项", trigger: "blur" },
        ],
        parentId: [
          { required: true, message: "上级组织为必选项", trigger: "change" },
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
      this.resetForm();
      this.$emit("changeModalStatus", false);
    },

    onExpand(expandedKeys) {
      console.log("onExpand", expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      console.log("onCheck", checkedKeys);
      this.checkedKeys = checkedKeys;
    },
    onSelect(selectedKeys, info) {
      console.log("onSelect", info);
      console.log("onSelect", selectedKeys);
      this.form.title = info.node.dataRef.title;

      this.selectedKeys = selectedKeys;
    },

    onChange(e) {
      const value = e.target.value;
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
    //清空表单
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>