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
                  checkable
                  v-model="checkedKeys"
                  :tree-data="treeConfig.treeData"
                  :replace-fields="treeConfig.replaceFields"
                  @expand="onExpand"
                  @select="onSelect"
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
      checkedKeys: [],
      treeConfig: {
        isTrue: false,
        autoExpandParent: true,
        // checkedKeys: [],
        expandAll: true,
        expandedKeys: ["1"],
        defaultCheckedKeys: [],
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        replaceFields: {
          key: "id",
          title: "label"
        },
        childrenList: [],
        parentList: []
      },

      form: {},
      rules: {
        roleName: [
          { required: true, message: "角色名称为必填项", trigger: "change" }
        ],
        menuIds: [
          { required: true, message: "角色权限为必填项", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    // checkedKeys(val) {
    //   console.log("onCheck", val);
    // },
    checkedKeys: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal != oldVal && oldVal.length > 0) {
          this.treeConfig.isTrue = true;
        }
      }
    }
  },
  created() {
    this.getMenuList().then(res => {
      if (res) {
        this.getRoleMenu(this.$route.query.metaDbShow);
      }
    });

    this.getRoleInfo(this.$route.query.metaDbShow);
    // let arr  = this.form.menuIds?this.form.menuIds.split(","):[]
  },
  methods: {
    async getMenuList() {
      const data = await this.$api.system.getMenuList();
      let res = data.data;
      let flag = false;
      if (res.code == 0) {
        let arr = res.data.rows;
        this.getChildList(arr);
        this.getParentList(arr);
        console.log(this.treeConfig.parentList)
        // console.log(this.treeConfig.childrenList)
        arr.forEach(item => {
          if (item.path == "/") {
            // this.checkedKeys.push(item.id);
            // this.treeConfig.checkedKeys.push(item.id);
            item.disabled = true;
          } else if (item.path == "/system") {
            item.children.forEach(key => {
              if (key.path == "/system/person") {
                // this.treeConfig.checkedKeys.push(key.id);
                // this.checkedKeys.push(key.id);
                key.disabled = true;
              }
            });
          }
        });
        this.treeConfig.treeData = arr;
        // this.getRoleMenu(this.$route.query.metaDbShow);
        return true;
      }
      console.log(this.treeConfig.treeData);
    },
    async getRoleMenu(key) {
      const data = await this.$api.system.getRoleMenu(key);
      console.log(data);
      let res = data.data;
      if (res.code == 0) {
        this.treeConfig.checkedKeys = res.data;
        let arr = new Set(res.data);
        let childList = new Set([...this.treeConfig.childrenList]);
        let intersectionSet = new Set([...arr].filter(x => childList.has(x)));
        console.log(intersectionSet);
        let newArr = Array.from(intersectionSet);
        // console.log(newArr)
        // this.treeConfig.checkedKeys = newArr;
        this.checkedKeys = newArr;
        // this.$set(this.treeConfig,'checkedKeys',res.data)
      }
    },
    async getRoleInfo(key) {
      const data = await this.$api.system.getRoleInfo(key);
      let res = data.data;
      if (res.code == 0) {
        this.form = res.data;
      }
    },
    onSubmit() {
      if (this.treeConfig.isTrue) {
        // this.form.menuIds = [...this.checkedKeys];
        this.form.menuIds = this.getPidById()
      } else {
        this.form.menuIds = [...this.treeConfig.checkedKeys];
      }
      console.log(this.form.menuIds)
      // return
      let params = {
        menuIds: this.form.menuIds.toString(),
        roleId: this.form.roleId,
        roleName: this.form.roleName,
        remark: this.form.remark
      };
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$api.system.updateRole(params).then(data => {
            let res = data.data;
            if (res.code == 0) {
              this.$store.dispatch("changeMenusList");
              this.$message.success(res.message);
              this.$router.history.go(-1);
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

    onExpand(expandedKeys) {
      // console.log("onExpand", expandedKeys);
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      console.log("onCheck", checkedKeys);
      this.checkedKeys = checkedKeys;
    },
    onSelect(selectedKeys, info) {
      this.treeConfig.selectedKeys = selectedKeys;
    },
    getChildList(data) {
      let arr = [];

      data.forEach(item => {
        if (!item.hasChildren) {
          // this.treeConfig.parentList[item.parentId].push(item.id)
          this.treeConfig.childrenList.push(item.id);
        } else {
          this.getChildList(item.children);
        }
      });
    },
    getParentList(data) {
      let arr = [];
      let newArr = [];
      data.forEach((item, index) => {
          this.treeConfig.parentList.push({
             id: item.id,
             parentId: item.parentId
           });
        if (item.hasChildren) {
          this.getParentList(item.children);
        }
      });
      //  console.log( this.treeConfig.parentList)
    },
    getPidById() {
      console.log(this.treeConfig.parentList)
      console.log(this.checkedKeys)
      let arr = new Set([...this.treeConfig.parentList]);
      let childList = new Set([...this.checkedKeys]);
      let intersectionSet = new Set([...arr].filter(x => childList.has(x.id)));
      let newArr = Array.from(intersectionSet);
      // console.log(arr);
      // console.log(childList);
      console.log(newArr);
      let str = []
      newArr.forEach((item)=>{
        str.push(item.id)
        if(str.indexOf(item.parentId)==-1&&item.parentId!=0){
          str.push(item.parentId)
        }
      })
      // console.log(str)
      return str
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.$router.history.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.isRoleTree {
  .ant-tree {
    height: 400px;
    // background: red;
    max-height: 400px;
    overflow: auto;
  }
}
</style>
