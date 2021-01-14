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
              <a-form-model-item label="所属组织" prop="deptId">
                <a-tree-select
                  v-model="form.deptId"
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="treeConfig.treeData"
                  placeholder="请选择所属组织"
                  tree-default-expand-all
                  :replace-fields="treeConfig.replaceFields"
                >
                </a-tree-select>
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item label="手机号" prop="mobile">
                <a-input placeholder="同作为登录账号" v-model="form.mobile" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="登录密码" prop="password">
                <a-input placeholder="1234qwer" disabled />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="用户姓名" prop="nickName">
                <a-input placeholder="请输入用户姓名" v-model="form.nickName" />
              </a-form-model-item>
            </a-col>

            <a-col :span="12">
              <a-form-model-item label="角色权限" prop="roleId">
                <a-select placeholder="请选择成员角色" v-model="form.roleId">
                  <a-select-option v-for="item in Roles" :key="item.roleId">{{
                    item.roleName
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="电子邮箱" prop="email">
                <a-input placeholder="请输入电子邮箱" v-model="form.email" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="性别" prop="ssex">
                <a-radio-group v-model="form.ssex">
                  <a-radio value="0" name="ssex" defaultChecked>
                    男
                  </a-radio>
                  <a-radio value="1" name="ssex">
                    女
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="12"></a-col>
            <a-col :span="12">
              <a-form-model-item label="用户状态" prop="status">
                <a-radio-group v-model="form.status">
                  <a-radio value="1" name="status" defaultChecked>
                    有效
                  </a-radio>
                  <a-radio value="2" name="status">
                    禁用
                  </a-radio>
                </a-radio-group>
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
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      other: "",

      treeConfig: {
        treeData: [],
        replaceFields: {
          key: "id",
          title: "label",
          children: "children",
          value: "id"
        }
      },
      form: {
        isTab: 1,
        roleId: ""
      },
      Roles: [],
      rules: {
        roleId: [
          { required: true, message: "角色权限为必填项", trigger: "change" }
        ],
        ssex: [{ required: true, message: "性别为必填项", trigger: "change" }],
        deptId: [
          { required: true, message: "组织为必填项", trigger: "change" }
        ],
        mobile: [
          { required: true, message: "手机号为必填项", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "用户名为必填项", trigger: "blur" }
        ],
        username: [
          { required: true, message: "登录账号为必填项", trigger: "blur" }
        ],
        email: [{ type: "email", message: "邮箱格式不正确", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getDept();
    this.getRoles();
    this.getList(this.$route.query.metaDbShow);
  },
  methods: {
    async getList(key) {
      let params = key ?? "{}";
      // console.log(params);
      const data = await this.$api.system.getUserById(params);
      // console.log(data)
      if (data.code == 0) {
        this.form = data.data;
      } else {
        this.$message.error(data.message);
      }
    },
    async getRoles(key) {
      let roleName = key ?? "";
      const data = await this.$api.system.getRoles(roleName);
      if (data.code == 0) {
        this.Roles = data.data.rows;
        // this.$set(this.form,'Roles',data.data.data.rows)
        // console.log(this.Roles)
      } else {
        this.$message.error(data.message);
      }
    },
    async getDept(key) {
      let params = key ?? "";
      const data = await this.$api.system.getDept(params);
      if (data.code == 0) {
        // this.treeConfig.treeData = data.data.data.rows;
        this.$set(this.treeConfig, "treeData", data.data.rows);
        // console.log(this.treeConfig.treeData)
      } else {
        this.$message.error(data.message);
      }
    },
    onSubmit() {
      let params = {
        deptId: this.form.deptId,
        mobile: this.form.mobile,
        nickName: this.form.nickName,
        ssex: this.form.ssex,
        roleId: this.form.roleId,
        email: this.form.email,
        status: this.form.status,
        isTab: 1,
        usename: this.form.mobile,
        userId: this.form.userId
      };
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$api.system.changeUser(params).then(data => {
            if (data.data.code == 0) {
              // this.$store.dispatch("UserList", params);

              this.$message.success(data.data.message, () => {
                this.$router.history.go(-1);
              });
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
    onChangeSex(checkedValues) {
      // console.log("checked = ", checkedValues);
    }
  }
};
</script>

<style lang="scss" scoped></style>
