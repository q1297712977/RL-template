<template>
  <div class="common-box  common-info">
    <!-- 面包屑 -->
    <a-row type="flex" justify="start" class="content-box">
      <a-col class="content-right">
        <a-row type="flex" justify="space-between" class="content-tool">
          <a-col :span="10"> 
   <a-button icon="plus" type="primary" @click="onAdd()">
              添加协议
            </a-button>
          </a-col>
          <a-col>
            <a-row type="flex" justify="start" class="tool-where">
              <a-col>
                <a-input placeholder="请输入协议名称" v-model="where.name" />

              </a-col>
              <a-col>
                <a-button type="primary" @click="getList()"
                  >查询</a-button
                ></a-col
              >
              <a-col> <a-button @click="resetForm()">重置</a-button> </a-col>
            </a-row>
          </a-col>
        </a-row>
        <div class="content-table">
          <!-- <a-row type="flex" justify="start">
          <a-col>1</a-col>  
          </a-row> -->
         <a-table
            :columns="columns"
            :data-source="table.data"
            :pagination="false"
            rowKey="id"
            :scroll="{ y: 255 }"

          >
            <a slot="name" slot-scope="text">{{ text }}</a>
            <template slot="operation" slot-scope="text, record">
              <span>
                <a-button
                  type="link"
                  class="status_edit"
                  @click="onEdit(record.id)"
                  >编辑</a-button
                >
              </span>
              <span>
                <a-popconfirm
                  class="status_del"
                  title="确认删除吗?"
                  @confirm="() => onDel(record.id)"
                  ><a-button type="link">删除</a-button></a-popconfirm
                >
              </span>
            </template>
          </a-table>
<myPaginate :list="table" @getList="getList"></myPaginate>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
	import myPaginate from "@/components/layout/layout-paginate";
const columns = [
    {
    title: "协议码",
    dataIndex: "protocolCode",
    key: "protocolCode",
    align: "center",
    ellipsis: true,
  },
  {
    title: "协议名称",
    dataIndex: "protocolName",
    key: "protocolName",
    align: "center",
    ellipsis: true,
  },

  {
    title: "用户",
    dataIndex: "userName",
    key: "userName",
    align: "center",
    ellipsis: true,
  },
  // {
  //   title: "协议分类配置",
  //   dataIndex: "vehicleCount",
  //   key: "vehicleCount",
  //   align: "center",
  //   ellipsis: true,
  // },
  // {
  //   title: "协议参数配置",
  //   dataIndex: "vehicleCount",
  //   key: "vehicleCount",
  //   align: "center",
  //   ellipsis: true,
  // },
  {
    title: "创建时间",
    dataIndex: "createTime",
    align: "center",
    key: "createTime",
    ellipsis: true,
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    key: "operation",
    scopedSlots: { customRender: "operation" },
  },
];
export default {
                components: {
                myPaginate
              },
  data() {
    return {
      rowClassName: (record, index) => {
        let className = "dark-row";
        if (index % 2 === 1) className = "light-row";
        return className;
      },

      form: {
        name: "",
      },
      where: {
        name: "",
      },
      columns,
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
      selectedRowKeys: [],

      iconConfig: {
        isShow: true,
        text: "展开搜索条件",
        isWhere: false,
      },
      //开始时间  结束时间
      startValue: null,
      endValue: null,
      endOpen: false,
      table: {
        data: [],
        total: 10,
      },
      pageConfig: {
        num: 1,
        size: 10,
      },
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
  created() {
    this.getList();
  },
  methods: {
    async getList(num=null,size=null) {
            if (num != null) {
        this.pageConfig.num = num;
      }
      if (size != null) {
        this.pageConfig.size = size;
      }
      let params = {
        protocolName: this.where.name,
        pageNum: this.pageConfig.num,
        pageSize: this.pageConfig.size,
      };
      const data = await this.$api.configuration.getPactList(params);
      if (data.code == 0) {
        this.table.data = data.data.rows;
        this.table.total = parseInt(data.data.count);
      } else {
        this.$message.error(data.message);
      }
    },
    changeIcon() {
      this.iconConfig.isShow = !this.iconConfig.isShow;
      this.iconConfig.text = "收起搜索条件";
      this.iconConfig.isWhere = !this.iconConfig.isWhere;
    },
    onSelectChange(selectedRowKeys, info) {
      console.log(selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    onChange(pageNumber) {
      console.log("Page: ", pageNumber);
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    filterOption(input, option) {
      console.log(input, option);
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    //时间组件
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    onAdd() {
      this.$router.push({ name: "ConfigurationPactAdd" });
    },
    onEdit(key) {
      // console.log('编辑')
      this.$router.push({
        name: "ConfigurationPactEdit",
        query: { metaDbShow: key },
      });
    },
    async onDel(key) {
      console.log(key)
      const data = await this.$api.configuration.delPact(key);
      if (data.code == 0) {
        this.getList();
        this.$message.success(data.message);
      } else {
        this.$message.error(data.message);
      }
    },
    onChangeSize(num, size) {
      this.pageConfig.num = num;
      this.pageConfig.size = size;
      this.getList();
    },
    onShowSizeChange(num, size) {
      this.pageConfig.num = num;
      this.pageConfig.size = size;
      this.getList();
    },
    resetForm() {
      this.where.name = "";
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped></style>
