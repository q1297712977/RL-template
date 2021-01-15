<template>
  <div class="login">
    <img src="@/assets/img/denglu-bj.png" class="login-img" alt="" />
    <div class="login-box">
      <div class="box-title">雄韬氢雄燃料电池运营监控系统</div>
      <!-- <div class="box-title">燃料电池运营监控系统</div> -->
      <div class="box-title-en">Fuel Cell Operation Monitoring System</div>
      <div class="login-form">
        <a-row
          class="a-row-style"
          type="flex"
          justify="center"
          align="top"
          v-if="isLogin == '1'"
        >
          <!-- <a-col :span="24" class="form-title">欢迎登录</a-col> -->
          <a-col :span="24" class="form-content">
            <a-form-model
              ref="form"
              layout="vertical"
              :model="form"
              :rules="rules"
            >
              <a-form-model-item prop="mobile">
                <a-input v-model="form.mobile" placeholder="请输入手机号">
                  <a-icon
                    slot="prefix"
                    type="user"
                    style="color: rgba(0, 0, 0, 0.25)"
                  />
                </a-input>
              </a-form-model-item>
              <a-form-model-item prop="password">
                <a-input
                  v-model="form.password"
                  type="password"
                  placeholder="请输入密码"
                >
                  <a-icon
                    slot="prefix"
                    type="lock"
                    style="color: rgba(0, 0, 0, 0.25)"
                  />
                </a-input>
              </a-form-model-item>
              <a-form-model-item prop="verificatioc_code">
                <a-row
                  class="a-row-style"
                  justify="center"
                  align="top"
                  :gutter="10"
                >
                  <a-col :span="15">
                    <a-input
                      v-model="form.verificatioc_code"
                      type="code"
                      placeholder="请输入图片验证码"
                      v-on:keyup.enter="onSubmit"
                    >
                      <a-icon
                        slot="prefix"
                        type="lock"
                        style="color: rgba(0, 0, 0, 0.25)"
                      />
                    </a-input>
                  </a-col>

                  <a-col class="img-style" :span="9">
                    <img
                      :src="codeImg"
                      alt="验证码"
                      @click="getCode()"
                      style="width: 100%; height: 100%"
                      srcset
                    />
                  </a-col>
                </a-row>
              </a-form-model-item>
              <!-- <a-form-model-item class="login-form-button">
                <a-button type="primary" @click="onSubmit">立即登录</a-button>
              </a-form-model-item> -->
              <a-form-model-item
                style="margin-bottom: 3px"
                class="login-form-button"
              >
                <a-button type="primary" @click="onSubmit">立即登录</a-button>
              </a-form-model-item>
            </a-form-model>

            <a-row
              type="flex"
              justify="space-between"
              class="login-to-forgot login-to-forgot-right"
            >
              <a-col :span="24">
                <a @click="changeLogin">忘记密码?</a>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
        <a-row
          class="a-row-style"
          type="flex"
          justify="center"
          align="top"
          v-else-if="isLogin == '2'"
        >
          <!-- <a-col :span="24" class="form-title-reset">重置密码</a-col> -->
          <a-col :span="24" class="form-content">
            <a-form-model
              ref="reForm"
              layout="vertical"
              :model="reForm"
              :rules="rules"
            >
              <a-form-model-item prop="mobile">
                <a-input v-model="reForm.mobile" placeholder="请输入手机号">
                  <a-icon
                    slot="prefix"
                    type="user"
                    style="color: rgba(0, 0, 0, 0.25)"
                  />
                </a-input>
              </a-form-model-item>
              <a-form-model-item prop="newPassword">
                <a-input
                  v-model="reForm.newPassword"
                  type="password"
                  placeholder="请输入密码"
                >
                  <a-icon
                    slot="prefix"
                    type="lock"
                    style="color: rgba(0, 0, 0, 0.25)"
                  />
                </a-input>
              </a-form-model-item>
              <a-form-model-item prop="RePpassword">
                <a-input
                  v-model="reForm.RePpassword"
                  type="password"
                  placeholder="请再次输入密码"
                >
                  <a-icon
                    slot="prefix"
                    type="lock"
                    style="color: rgba(0, 0, 0, 0.25)"
                  />
                </a-input>
              </a-form-model-item>

              <a-row :gutter="16">
                <a-col class="gutter-row" :span="18">
                  <a-form-model-item prop="code">
                    <a-input v-model="reForm.code" placeholder="请输入验证码">
                      <a-icon
                        slot="prefix"
                        type="lock"
                        style="color: rgba(0, 0, 0, 0.25)"
                      />
                    </a-input>
                  </a-form-model-item>
                </a-col>
                <a-col class="img-style" :span="6">
                  <a-button v-if="showText == null" @click="getMobileCode"
                    >获取验证码</a-button
                  >
                  <a-button v-else>{{ showText }}</a-button>
                </a-col>
              </a-row>

              <a-form-model-item
                style="margin-bottom: 3px"
                class="login-form-button"
              >
                <a-button type="primary" @click="resetPassword"
                  >立即重置</a-button
                >
              </a-form-model-item>
              <!-- <a-form-model-item >
                <a-row  class="login-to-forgot login-to-forgot-right">
                  <a-col class="forgot-to-login" @click="changeLogin" :span="24"
                    >返回登录</a-col
                  >
                </a-row>s
              </a-form-model-item> -->
              <a-row
                type="flex"
                justify="space-between"
                class="login-to-forgot login-to-forgot-right"
              >
                <a-col :span="24">
                  <a @click="changeLogin">返回登录?</a>
                </a-col>
              </a-row>
            </a-form-model>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    let rePassword = (rule, value, callback) => {
      // console.log(value);
      if (value == "") {
        callback(new Error("确认密码不能为空"));
      } else if (value !== this.reForm.newPassword) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      timeCounter: null,
      isGetCode: true,
      showText: null,
      reForm: {
        code: "",
        mobile: "",
        RePpassword: "",
        newPassword: ""
      },
      form: {
        mobile: "17621542157",
        password: "111111",
        verificatioc_code: ""
      },
      table: {
        flag: false
      },
      isLogin: "1",
      backstyle: {
        backgroundImage: "url(" + require("@/assets/img/login-right.png") + ")",
        backgroundRepeat: "no-repeat",

        backgroundPosition: "right top"
      },
      codeKey: "",
      codeImg: "",
      rules: {
        mobile: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        verificatioc_code: [
          {
            required: true,
            message: "验证码不能为空",
            trigger: "blur"
          }
        ],

        newPassword: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        RePpassword: [
          {
            required: true,
            message: "确认密码不能为空",
            trigger: "blur"
          },
          { validator: rePassword, trigger: "blur" }
        ],
        code: [
          {
            required: true,
            message: "短信验证码为必填项",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getCode();
  },
  mounted() {},

  methods: {
    ...mapMutations(["loginIn"]),
    // ...mapMutations(["changeLogin"]),

    onSubmit() {
      let _this = this;
      let params = {
        code: 12314,
        auth_type: "sms",
        mobile: this.form.mobile,
        key: this.codeKey,
        verificatioc_code: this.form.verificatioc_code,
        grant_type: "password",
        password: this.form.password
        // username:this.form.username
      };
      this.$router.push("/");
      this.$message.success("登录成功");
    },
    resetPassword() {
      let params = {
        code: this.reForm.code,
        mobile: this.reForm.mobile,
        password: this.reForm.newPassword
      };
      console.log(params);
      // console.log(this.$refs.reForm)
      // return
      this.$refs.reForm.validate(valid => {
        if (valid) {
          this.$api.login.changePassword(params).then(data => {
            if (data.data.code == 0) {
              this.isLogin = true;
              this.$message.success(data.data.message);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      // console.log("重置表单");
      this.$refs.form.resetFields();
    },
    getCode() {
      this.codeKey = new Date().getTime();
      this.codeImg = this.$api.login.code(this.codeKey);
    },
    // 倒计时显示处理
    countDownText(s) {
      this.showText = `${s}s后重新获取`;
    },
    getMobileCode() {
      this.countDown(60);
    },
    countDown(times) {
      const self = this;
      // 时间间隔 1秒
      const interval = 1000;
      let count = 0;
      self.timeCounter = setTimeout(countDownStart, interval);
      function countDownStart() {
        if (self.timeCounter == null) {
          return false;
        }
        count++;
        self.countDownText(times - count + 1);
        if (count > times) {
          clearTimeout(self.timeCounter);
          self.showText = null;
        } else {
          self.timeCounter = setTimeout(countDownStart, interval);
        }
      }
    },
    changeLogin() {
      if (this.isLogin == "1") {
        // console.log(this.$refs.form, "tij ");
        this.$refs.form.resetFields();
        this.isLogin = "2";
      } else {
        // console.log(this.$refs.reForm, "cz");
        this.$refs.reForm.resetFields();
        this.isLogin = "1";
      }
    },
    registeredUser() {
      if (this.isLogin == "1") {
        this.$refs.form.resetFields();
        // this.form={}
      } else {
        // this.reForm={}
        this.$refs.reForm.resetFields();
      }
      this.isLogin = "3";
    },
    async getUser() {
      const data = await this.$api.system.getUser();
      // console.log(data);
      return data;
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
  align-items: center; /*定义body的元素垂直居中*/
  justify-content: center; /*定义body的里的元素水平居中*/
  .login-img {
    width: 100%;
    height: 100%; /**宽高100%是为了图片铺满屏幕 */
    z-index: -1;
    position: absolute;
  }
  .login-box {
    // height: 580px;
    // background: skyblue;
    width: 880px;
    padding: 0px 120px;
    .box-title {
      height: 64px;
      line-height: 64px;
      font-size: 36px;
      font-weight: 800;
      text-align: center;
      letter-spacing: 8px;
    }
    .box-title-en {
      height: 48px;
      line-height: 48px;
      font-size: 28px;
      font-weight: 500;
      text-align: center;
      margin-bottom: 8px;
      // letter-spacing:8px;
    }
    .login-form {
      .ant-form-item {
        padding-bottom: 0px !important;
        ::v-deep .ant-input {
          height: 48px !important;
          min-height: 32px !important; /*no*/
        }
      }
      .img-style {
        height: 48px;
        min-height: 32px !important; /*no*/
        .ant-btn {
          height: 48px !important;
          line-height: 48px !important;
          padding: 0 !important;
          text-align: center;
          width: 100%;
        }
      }
      .form-content {
        height: 400px;

        position: relative;
        .login-form-button {
          text-align: center;
          position: absolute;
          bottom: 8%;
          width: 100%;
          // margin-bottom: 8px !important; /*no*/
          .ant-btn {
            height: 40px;
            min-height: 32px;
            width: 100%;
            font-size: 16px;
          }
        }
        .login-to-forgot {
          position: absolute;
          bottom: 1%;
          .ant-col {
            text-align: center;
            a {
              color: #2e4a78;
              line-height: 32px;
              font-size: 20px;
              letter-spacing: 1px;
            }
          }
        }
      }
    }
  }
}
</style>
