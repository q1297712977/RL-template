<template>

  <div class="common-box  common-info">
      <!-- 面包屑 -->
    <breadcrumb></breadcrumb>
    <div class="common-info-box">
 
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
            <a-form-model-item label="登录账号" prop="mobile">
              <div>{{ form.mobile }}</div>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
                      <a-form-model-item label="登录密码">
                          <a-row type="flex" justify="space-between" class="password">
                              <a-col>
                                  <div>

                                  *********
                                  </div>
                              </a-col>
                              <a-col>
                                  <a-button type="link" @click="changePassword">修改</a-button>
                              </a-col>
                          </a-row>
          <!-- <div class="password">
            <div>********</div>
            <div>
              <a href="javascript:;" @click="changePassword">修改</a>
            </div>
          </div> -->
        </a-form-model-item>
          </a-col>
          <a-col :span="12">
        <a-form-model-item label="组织名称">
          <div>{{ form.deptName }}</div>
        </a-form-model-item>
          </a-col>
          <a-col :span="12">
        <a-form-model-item label="用户角色" prop="role">
          <div>{{ form.roleName }}</div>
        </a-form-model-item>
          </a-col>
          <a-col :span="12">
        <a-form-model-item label="注册时间" prop="date">
          <div>{{ form.createTime }}</div>
        </a-form-model-item>
          </a-col>
        <a-col :span="12">
        <a-form-model-item label="用户状态" prop="status">
          <div v-show="form.status">有效</div>
          <div v-show="!form.status">无效</div>
        </a-form-model-item>
          </a-col>
          <a-col :span="12">
        <a-form-model-item label="姓名" prop="nickName">
          <a-input v-model="form.nickName" />
        </a-form-model-item>
          </a-col>
        <a-col :span="12"></a-col></a-col>
          <a-col :span="12">
        <a-form-model-item label="邮箱" prop="email" class="email">
          <a-input v-model="form.email" placeholder="暂未填写" />
        </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <!-- <div class="height-card"></div> -->
    <a-row justify="space-between" type="flex" class="info-btn">
      <a-col>
        <a-button type="primary" @click="onSubmit">保存</a-button>
      </a-col>
      <!-- <a-col>
        <a-button type="primary">保存</a-button>
      </a-col> -->
    </a-row>
       </div>
    <changePwdModal
      :isShow="modal.isChange"
      @changeModalStatus="modal.isChange = false" 
      @onfatherSubmit="submitSuccess"  
    ></changePwdModal>
    <infoModal
      :isShow="modal.isInfo"
      @changeModalStatus="modal.isInfo = false" 
    ></infoModal>
    
  </div>
</template>

<script>
import changePwdModal from "./modal/changePwd";
import infoModal from "./modal/info";

import breadcrumb from "@/components/layout/layout-breadcrumb";

export default {
  components: {
    changePwdModal,
    infoModal,
    breadcrumb
  },
  data() {
    return {
      //弹窗

      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      other: "",
      form: {},
      modal: {
        isChange: false,
        isInfo: false,
      },
      rules: {
        username: [
          {
            required: true,
            message: "姓名为必填项",
            trigger: "change",
          },
        ],
        nickName: [
          {
            required: true,
            message: "用户名称为必填项",
            trigger: "blur",
          },
        ],
        email: [{ type: "email", message: "邮箱格式不正确", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    // ...mapMutations(["UserList"]),
    onSubmit() {
      // 发送请求
      let params = {
        isTab: 1,
        roleId: this.form.roleId,
        userId: this.form.userId,
        ssex: 0,
        deptId: 1,
        email: this.form.email,
        mobile: this.form.mobile,
        nickName: this.form.nickName,
        username: this.form.username,
      };
      // this.form.isTab=1;
      // this.form.ssex=1;

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$api.system.changeUser(params).then((data) => {
            let res = data.data;
            if (res.code == 0) {
              this.$store.dispatch("UserList", params);
              this.$message.success(res.message);
            }
          });
        }
      });
      return;
      //提示
      this.saveVisible = true;
    },
    changePassword() {
      this.modal.isChange = true;
    },
    async getUser() {
      const data = await this.$api.system.getUser();
      if (data.data.code == 0) {
        this.form = data.data.data;
      }
    },

    submitSuccess() {
      let _this=this
      setTimeout(function () {
        _this.modal.isInfo = true;
      }, 2000);
      setTimeout(function () {
        _this.modal.isInfo = false;
        // 清空token
        localStorage.removeItem("Authorization");
        // localStorage.clear()
        _this.$router.push("/login");
      }, 5000);
    },
  },
};
</script>


<style lang="scss" scoped>
</style>