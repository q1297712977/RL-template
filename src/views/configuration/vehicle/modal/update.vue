<template>
  <div>
  <a-modal
    v-model="show"
    title="远程更新"
    centered
    :footer="null"
    class="onShowClass"
    @cancel="handleCancel"
  >
  <a-row type="flex" justify="start">
    <a-col>本次升级车辆数: 20 </a-col>
  </a-row>
  <a-row type="flex" justify="start" class="carClass">
    <a-col :span="24">
      <a-row type="flex" justify="start">
        <a-col :span="4" v-for="i in 10" :key="i">黑A88888</a-col>
      </a-row>
    </a-col>
  </a-row>
    <a-row type="flex" justify="center" :gutter="16">
      <a-col>
        <a-button type="primary" @click="onUpdate()">确认升级</a-button>
      </a-col>
    </a-row>
  </a-modal>
  <a-modal
    v-model="isUpdate"
    title="更新中"
    centered
    :footer="null"
    class="onShowClass"
    @cancel="handleCancel"
    dialogClass="updateClass"
  >
  <a-row type="flex" justify="start">
    <a-col :span="24">
        <a-table :columns="columns" :data-source="data" :pagination="false" rowKey="index0">
        <a slot="name" slot-scope="text">{{ text }}</a>
      </a-table>
    </a-col>
  </a-row>

    <a-row type="flex" justify="center" :gutter="16">
      <a-col>
        <a-button  @click="onSubmit()">关闭</a-button>
      </a-col>
    </a-row>
  </a-modal>
    </div>
</template>

<script>
import getColumn from "@/utils/getColumns.js";

const list1 = [
  "车牌号",
  "车架号",
  "终端编号",
  "所属车队",
  "升级状态",
  "升级时间",
];
const columns = getColumn.getColumns(list1);
const data = getColumn.getData(list1);
export default {
  props: {
    isShow: {
      //横坐标
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      form: {
        name: "",
      },
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
      isUpdate:false,
      columns,data,
      rules: {
        name: [
          {
            required: true,
            message: "Please input Activity name",
            trigger: "blur",
          },
          {
            min: 3,
            max: 5,
            message: "Length should be 3 to 5",
            trigger: "blur",
          },
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
  },
  methods: {
    handleCancel(e) {
      // console.log(e);
      // this.visible = false;
      //清空表单
      this.$emit("changeModalStatus", false);
    },
    onUpdate(){
      this.isUpdate=true
      this.$emit("changeModalStatus", false);

    },
    onSubmit() {
      this.isUpdate=false
      // this.$message.success("修改成功"); //修改成功属性父级列表
      // this.$emit("changeModalStatus", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.carClass{
  margin: 8px 0;
  border:2px solid #999;
}
::v-deep .ant-table-content .ant-table-body{
  max-height: unset!important;
}
::v-deep .updateClass{
    width:50%!important;
    min-width: 400PX!important;
  .ant-row-flex-start{
    margin-bottom: 8px;
  }
}
</style>