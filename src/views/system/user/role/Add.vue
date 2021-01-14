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
              <a-form-model-item label="名称" prop="roleName">
                <a-input v-model="form.roleName" placeholder="请输入角色名称" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="描述">
                <a-input v-model="form.remark" placeholder="请输入角色描述" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12" class="isRoleTree">
              <a-form-model-item label="选择权限" prop="menuIds">
                <a-tree
                  v-model="treeConfig.checkedKeys"
                  checkable
                  :default-expanded-keys="treeConfig.expandedKeys"
                  :default-selected-keys="treeConfig.selectedKeys"
                  :auto-expand-parent="treeConfig.autoExpandParent"
                  :tree-data="treeConfig.treeData"
                  @expand="onExpand"
                  @select="onSelect"
                  :replace-fields="treeConfig.replaceFields"
                />
              </a-form-model-item>
            </a-col>
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
      //form样式
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      treeConfig: {
        autoExpandParent: true,
        checkedKeys: [],
        expandedKeys: ["1"],
        defaultCheckedKeys: ["1"],
        treeData: [],
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        replaceFields: {
          key: "id",
          title: "label",
          children: "children",
        },
      },

      form: {},
      rules: {
        roleName: [
          { required: true, message: "角色名称为必填项", trigger: "change" },
        ],
        menuIds: [
          { required: true, message: "角色权限为必填项", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    checkedKeys(val) {
      console.log("onCheck", val);
    },
  },
  created() {
    this.getMenuList();
  },
  methods: {
    async getMenuList(key) {
      let params = key ?? "";
      const data = await this.$api.system.getMenuList(params);
      let res = data.data;
      if (res.code == 0) {
        // this.treeConfig.treeData = res.data.rows;
        let arr = res.data.rows;
        arr.forEach((item) => {
          if (item.path == "/") {
            this.treeConfig.checkedKeys.push(item.id);
            item.disabled = true;
          } else if (item.path == "/system") {
            item.children.forEach((key) => {
              if (key.path == "/system/person") {
                this.treeConfig.checkedKeys.push(key.id);
                key.disabled = true;
              }
            });
          }
        });
        this.treeConfig.treeData = arr;
      }
      console.log(this.treeConfig.treeData);
    },
    onSubmit() {
      this.form.menuIds = this.treeConfig.checkedKeys.toString();
      console.log(this.form.menuIds)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$api.system.addRole(this.form).then((data) => {
            let res = data.data;
            if (res.code == 0) {
              this.$message.success(res.message, () => {
                // this.$router.push({ name: "RoleIndex" });
                this.$router.history.go(-1)
              });
            }else{
              this.$message.error(res.message)
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
      this.$router.history.go(-1)
    },
    onExpand(expandedKeys) {
      console.log("onExpand", expandedKeys);
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      console.log("onCheck", checkedKeys);
      this.treeConfig.checkedKeys = checkedKeys;
    },
    onSelect(selectedKeys, info) {
      console.log("onSelect", info);
      this.treeConfig.selectedKeys = selectedKeys;
    },
  },
};
</script>

<style lang="scss" scoped>
.isRoleTree {
  .ant-tree {
    height: 400px;
    // background: red;
    max-height:400px;
    overflow: auto;
  }
}

</style>
