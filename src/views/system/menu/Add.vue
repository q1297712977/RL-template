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
                label="名称"
                prop="menuName"
                :wrapper-col="{ span: 18 }"
              >
                <a-input v-model="form.menuName" placeholder="请输入名称" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12"></a-col>
            <a-col :span="12">
              <a-form-model-item label="类型" :wrapper-col="{ span: 18 }">
                <a-radio-group v-model="form.type" button-style="solid">
                  <a-radio-button value="0">菜单</a-radio-button>
                  <a-radio-button value="1">按钮</a-radio-button>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="12"></a-col>

            <a-col :span="12" v-if="form.type == 0">
              <a-form-model-item
                label="URL链接"
                prop="path"
                :wrapper-col="{ span: 18 }"
              >
                <a-input v-model="form.path" placeholder="请输入URL链接" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="后端权限" :wrapper-col="{ span: 18 }">
                <a-input v-model="form.perms" placeholder="请输入后端权限" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="菜单图标" :wrapper-col="{ span: 18 }">
                <a-row type="flex" justify="space-between">
                  <a-col :span="18">
                    <a-input
                      v-model="form.icon"
                      placeholder="请选择菜单图标"
                      disabled
                    />
                  </a-col>
                  <a-col :offset="1">
                    <a-button @click="changeIcon">设置图标</a-button>
                  </a-col>
                </a-row>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="菜单序号" :wrapper-col="{ span: 18 }">
                <a-input v-model="form.orderNum" placeholder="请输入菜单序号" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item
                label="上级菜单"
                prop="parentId"
                :wrapper-col="{ span: 18 }"
              >
                <a-tree-select
                  v-model="form.parentId"
                  maxTagCount:10
                  style="width: 100%"
  
                  dropdownClassName="isTreeSelectClass"
                  :tree-data="treeConfig.treeData"
                  placeholder="请选择上级菜单"
                  :replace-fields="treeConfig.replaceFields"
                ></a-tree-select>
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

      <icon
        :isShow="modal.iconShow"
        @changeIconText="changeIconText"
        @changeModalStatus="modal.iconShow = false"
      ></icon>
    </div>
  </div>
</template>
<script>
import icon from "./Icon";
import breadcrumb from "@/components/layout/layout-breadcrumb";

export default {
  components: {
    icon,breadcrumb
  },
  data() {
    return {
      //form样式
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      treeConfig: {
        treeData: [],
        value: [],
        replaceFields: {
          key: "id",
          title: "label",
          children: "children",
          value: "id"
        }
      },
      modal: {
        iconShow: false,
        iconText: ""
      },
      form: {
        type: "0"
      },
      rules: {
        menuName: [
          { required: true, message: "权限名称为必填项", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "上级菜单为必填项", trigger: "change" }
        ],
        path: [{ required: true, message: "上级菜单为必填项", trigger: "blur" }]
      }
    };
  },
  watch: {
    value(value) {
      // console.log(value);
    }
  },
  created() {
    this.getMenuList();
  },
  methods: {
    async getMenuList(key) {
      let menuName = key ?? "";
      const data = await this.$api.system.getMenuList(menuName);
      // console.log(data);
      let res = data.data;
      if (res.code == 0) {
        let list = res.data.rows;
        list.unshift({
          label: "顶级菜单",
          parentId: "0",
          id: "0"
        });
        this.treeConfig.treeData = list;
        // console.log(this.treeConfig.treeData);
      }
    },
    onSubmit() {
      // console.log(this.form)
      // return
      // console.log(this.form)
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$api.system.menuAdd(this.form).then(data => {
            let res = data.data;
            if (res.code == 0) {
              this.getUserRouter();
              this.$message.success(res.message, () => {
                // this.$router.push({ name: "MenuIndex" });
                this.$router.history.go(-1);
              });
            } else {
              this.$message.error(res.message);
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
      // console.log("onExpand", expandedKeys);
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      // console.log("onCheck", checkedKeys);
      this.treeConfig.checkedKeys = checkedKeys;
    },
    onSelect(selectedKeys, info) {
      // console.log("onSelect", info);
      this.treeConfig.selectedKeys = selectedKeys;
    },

    /**
     * 设置图标
     */
    changeIcon() {
      this.modal.iconShow = true;
    },
    changeIconText(key) {
      // console.log(key)
      this.form.icon = key;
    },
    async getUserRouter() {
      let data = await this.$api.system.getUserRouter();
      if (data.data.code == 0) {
        let arr = data.data.data.routes;
        arr.pop();
        this.menuList = arr;
        this.$store.dispatch("changeMenus", JSON.stringify(arr));
      } else {
        this.logout();
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
