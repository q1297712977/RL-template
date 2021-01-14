<template>
  <a-modal
    v-model="show"
    title="授权码车辆列表"
    centered
    :footer="null"
    dialogClass="isModal720"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row type="flex" justify="start" :gutter="8" class="whereClass">
        <a-col>
          <a-input placeholder="授权码"></a-input>
        </a-col>
        <a-col>
          <a-button>查询</a-button>
        </a-col>
        <a-col>
          <a-button type="primary">确定</a-button>
        </a-col>
      </a-row>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        rowKey="name"
        :scroll="{ y: 255 }"
      >
        <span slot="status" slot-scope="text">
          <span v-show="text % 2 == 0" class="status_green">在线</span>
          <span v-show="text % 2 == 1" class="status_grey">离线</span>
        </span>
        <template slot="operation" slot-scope="text, record">
          <span>
            <a-button type="link" class="common-operation">查看</a-button>
          </span>
        </template>
      </a-table>
    </a-form-model>
  </a-modal>
</template>

<script>
const columns = [
  {
    title: "终端编号",
    dataIndex: "name",
    align: "center",
    ellipsis: true,
    key: "name",
    width: "120px",
    scopedSlots: { customRender: "name" }
  },
  {
    title: "车牌号",
    dataIndex: "age",
    align: "center",
    key: "age",
    ellipsis: true
  },
  {
    align: "center",
    title: "车架号",
    dataIndex: "ces",
    key: "ces",
    ellipsis: true
  },
  {
    align: "center",
    title: "状态",
    dataIndex: "status",
    key: "status",
    ellipsis: true,
    scopedSlots: { customRender: "status" }
  }
  // {
  //   title: "操作",
  //   align: "center",
  //   dataIndex: "operation",
  //   width: "10%",
  //   scopedSlots: { customRender: "operation" }
  // }
];

const data = [];
for (let index = 0; index < 20; index++) {
  data.push({
    name: "测试" + index,
    age: "测试车牌号" + index,
    ces: "测试车架号" + index,
    status: index
  });
}
export default {
  props: {
    isShow: {
      //横坐标
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      form: {
        name: ""
      },
      data,
      columns,
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
      rules: {
        name: [
          {
            required: true,
            message: "Please input Activity name",
            trigger: "blur"
          },
          {
            min: 3,
            max: 5,
            message: "Length should be 3 to 5",
            trigger: "blur"
          }
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
    }
  },
  methods: {
    handleCancel(e) {
      // console.log(e);
      // this.visible = false;
      //清空表单
      this.$emit("changeModalStatus", false);
    },
    onSubmit() {
      this.$message.success("修改成功"); //修改成功属性父级列表
      this.$emit("changeModalStatus", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.whereClass {
  margin-bottom: 16px;
  .ant-input {
    height: 32px;
    line-height: 32px;
  }
}
.ant-table-wrapper {
  margin-bottom: 24px;
}
::v-deep .ant-table .ant-table-content .ant-table-body {
  max-height: 350px !important;
}
</style>
