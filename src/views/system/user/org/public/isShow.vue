<template>
  <a-modal
    v-model="show"
    title="详情"
    centered
    :footer="null"
    @cancel="handleCancel"
    dialogClass="isShowClass"
  >
    <a-descriptions :column="2">
      <a-descriptions-item label="所属机构" v-if="form.deptName!=null">{{form.deptName}}</a-descriptions-item>
      <a-descriptions-item label="所属机构" v-else>暂无组织</a-descriptions-item>
      <a-descriptions-item label="手机号">{{
        form.mobile
      }}</a-descriptions-item>
      <a-descriptions-item label="登录密码">******</a-descriptions-item>
      <a-descriptions-item label="姓名">{{
        form.nickName
      }}</a-descriptions-item>
      <a-descriptions-item label="性别">男</a-descriptions-item>
      <a-descriptions-item label="角色权限">{{
        form.roleName
      }}</a-descriptions-item>
      <a-descriptions-item label="邮箱">{{ form.email }}</a-descriptions-item>
      <a-descriptions-item label="用户状态">{{
        form.status == "1" ? "正常" : "禁用"
      }}</a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>

<script>
export default {
  props: {
    isShow: {
      //横坐标
      type: Boolean,
      default: false
    },
    info: {
      type: Object
    }
  },

  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },

      // tree组织
      treeConfig: {
        value: [],
        replaceFields: {
          key: "id",
          title: "label",
          children: "children",
          value: "id"
        }
      },
      //addOrg前端控制
      rules: {
        deptName: [
          { required: true, message: "组织名称为必填项", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "上级组织为必选项", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    show: {
      get: function() {
        return this.isShow;
      },
      set: function() {}
    },
    treeData: {
      get: function() {
        return this.list;
      },
      set: function() {}
    },
    form: {
      get: function() {
        return this.info;
      },
      set: function() {}
    }
  },
  watch: {
    checkedKeys(val) {
      // console.log("onCheck", val);
    },
    form(v, o) {
      console.log(v, o);
    }
  },
  methods: {
    handleCancel(e) {
      this.$emit("changeModalStatus", false);
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .ant-descriptions-item-label {
  width: 100px !important;
}
</style>
