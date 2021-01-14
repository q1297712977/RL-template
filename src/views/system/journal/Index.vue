<template>
  <div class="common-box  common-info">
    <!-- 面包屑 -->
    <a-row type="flex" justify="start" class="content-box">
      <a-col class="content-right">
        <a-row type="flex" justify="space-between" class="content-tool">
          <a-col :span="10"> </a-col>
          <a-col>
            <a-row type="flex" justify="start" class="tool-where">
              <a-col>
                <a-range-picker
                  @change="onChange"
                  :value="createValue"
                ></a-range-picker>
              </a-col>
              <a-col>
                <a-input placeholder="请输入登录账号" v-model="where.mobile" />
              </a-col>
              <a-col>
                <a-button type="primary" @click="getList()">查询</a-button></a-col
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
            :columns="table.columns"
            :data-source="table.form"
            :pagination="false"
            rowKey="id"
            :scroll="{ y: 240 }"
          >
            <a slot="name" slot-scope="text">{{ text }}</a>
            <span slot="flag" slot-scope="flag">
              <span v-show="flag == 2" class="status_1">已读</span>
              <span v-show="flag == 1" class="status_0">未读</span>
            </span>
            <template slot="operation" slot-scope="text, record">
              <span>
                <a-button
                  type="link"
                  class="common-operation"
                  @click="onEdit(record.id)"
                  >编辑</a-button
                >
              </span>
              <span>
                <a-popconfirm
                  class="common-operation common-operation-del"
                  title="确认删除吗?"
                  @confirm="() => onDel(record.id)"
                  ><a-button type="link">删除</a-button></a-popconfirm
                >
              </span>
            </template>
          </a-table>
          <!-- <div class="paginate-footer">
            <a-row type="flex" justify="space-between">
              <a-col> 共 : {{ table.total }} 条 </a-col>
              <a-col>
                <a-pagination
                  show-size-changer
                  @change="onChangeSize"
                  :total="table.total"
                  @showSizeChange="onShowSizeChange"
                  show-quick-jumper
                />
              </a-col>
            </a-row>
          </div> -->
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
    title: "序号",
    width: 64,
    customRender: (text, record, index) => `${index + 1}`,
    align: "center"
  },
  {
    title: "登录账号",
    dataIndex: "mobile",
    key: "mobile",
    align: "center",
    width: 150,
    ellipsis: true
  },

  {
    title: "用户角色",
    dataIndex: "roleName",
    key: "roleName",
    ellipsis: true,
    align: "center",
    width: 150
  },
  {
    title: "IP地址",
    dataIndex: "ip",
    key: "ip",
    ellipsis: true,
    align: "center",
    width: 150
  },
  {
    title: "Mac地址",
    dataIndex: "mac",
    key: "mac",
    align: "center",
    ellipsis: true,
    width: 150
  },
  {
    title: "登录时间",
    dataIndex: "loginTime",
    key: "loginTime",
    align: "center",
    width: "15%",
    ellipsis: true
  }
];

export default {
  components: {
    myPaginate
  },
  data() {
    return {
      table: {
        form: [],
        columns,
        total: 1,
        TypeList: []
      },
      createValue: [],
      size: "large",
      selectedRowKeys: [],
      where: {},
      /**
       * 分页设置
       */
      pageConfig: {
        num: 1,
        size: 10
      },
      iconConfig: {
        isShow: true,
        text: "展开搜索条件",
        isWhere: false
      },
      labelCol: { span: 9 },
      wrapperCol: { span: 15 }
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    }
  },

  created() {
    this.getList();
  },
  methods: {
    async getList(num = null, size = null) {
      if (num != null) {
        this.pageConfig.num = num;
      }
      if (size != null) {
        this.pageConfig.size = size;
      }
      let params = {
        createTimeFrom: this.where.createTimeFrom ?? "",
        createTimeTo: this.where.createTimeTo ?? "",
        mobile: this.where.mobile ?? "",
        pageNum: this.pageConfig.num,
        pageSize: this.pageConfig.size
      };
      const data = await this.$api.system.getLogList(params);
      // if (data.data.code == 0) {
      this.table.form = data.data.data.rows;
      this.table.total = parseInt(data.data.data.total);
      // console.log(this.table.total, typeof this.table.total);
      // } else {
      //   this.$message.error(data.data.message);
      // }
    },

    onChangeSize(num, size) {
      this.pageConfig.num = num;
      this.pageConfig.size = size;
      this.getList(num, size);
    },
    onShowSizeChange(num, size) {
      this.pageConfig.num = num;
      this.pageConfig.size = size;
      this.getList(num, size);
    },
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    onChange(date, dateString) {
      this.createValue = date;
      this.where.createTimeFrom = dateString[0];
      this.where.createTimeTo = dateString[1];
    },

    reForm() {
      this.createValue = [];
      this.where = {
        mobile: "",
        createTimeFrom: "",
        createTimeTo: ""
      };
      this.getList();
    },
    changeIcon() {
      this.iconConfig.isShow = !this.iconConfig.isShow;
      this.iconConfig.text = "收起搜索条件";
      this.iconConfig.isWhere = !this.iconConfig.isWhere;
    },
    resetForm() {
      this.createValue = [];
      this.where = {
        flag: "",
        createTimeFrom: "",
        createTimeTo: ""
      };
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped></style>
