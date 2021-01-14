<template>
  <div class="common-box  common-info">
    <!-- 面包屑 -->
    <a-row type="flex" justify="start" class="content-box">
      <a-col class="content-right">
        <a-row type="flex" justify="space-between" class="content-tool">
          <a-col :span="10">
            <a-row type="flex" justify="start" :gutter="8">
              <a-col>
                <a-button
                  type="primary"
                  :disabled="paginage.isDisabled"
                  @click="onDel()"
                >
                  删除
                </a-button>
              </a-col>
              <a-col>
                <a-button
                  type="primary"
                  :disabled="paginage.isDisabled"
                  @click="onRead()"
                >
                  标记已读
                </a-button>
              </a-col>
              <a-col>
                <a-button type="primary" @click="onAllRead()">
                  全部已读
                </a-button>
              </a-col>
              <a-col FF>
                <a-button type="primary" @click="onAllDel()">
                  全部删除
                </a-button>
              </a-col>
            </a-row>
          </a-col>
          <a-col>
            <a-row type="flex" justify="start" class="tool-where">
              <a-col>
                <a-range-picker @change="onChange" :value="createValue">
                </a-range-picker>
              </a-col>
              <a-col>
                <a-select v-model="where.flag">
                  <a-select-option value="">全部消息</a-select-option>
                  <a-select-option value="2">已读消息</a-select-option>
                  <a-select-option value="1">未读消息</a-select-option>
                </a-select>
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
            :columns="table.columns"
            :data-source="table.form"
            :pagination="false"
            rowKey="id"
            :scroll="{ y: 240 }"
            :customRow="rowClick"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange
            }"
          >
            <span slot="flag" slot-scope="flag">
              <span v-show="flag == 2" class="status_green">已读</span>
              <span v-show="flag == 1" class="status_grey">未读</span>
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
    title: "内容",
    dataIndex: "message",
    key: "message",
    align: "center",
    scopedSlots: { customRender: "name" },

    ellipsis: true
  },

  {
    title: "状态",
    dataIndex: "flag",
    key: "flag",
    ellipsis: true,
    width: 150,
    align: "center",
    scopedSlots: { customRender: "flag" }
  },
  {
    title: "时间",
    dataIndex: "createTime",
    key: "createTime",
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
      rowClick: (record, index) => ({
        on: {
          click: () => {
            // 点击改行时要做的事情
            // ......
            let num = this.selectedRowKeys.indexOf(record.id);
            if (num > -1) {
              this.selectedRowKeys.splice(num, 1);
            } else {
              this.selectedRowKeys.push(record.id);
            }
          }
        }
      }),
      selectedRowKeys: [],
      table: {
        form: [],
        columns,
        total: 1,
        TypeList: []
      },
      paginage: {
        pageSize: 20,
        current: 4,
        isDisabled: true
      },
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
      wrapperCol: { span: 15 },
      createValue: [],
      size: "large",
      selectedRowKeys: [],
      where: {
        flag: ""
      },
      usePagination: false
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    }
  },
  watch: {
    selectedRowKeys(value) {
      value.length > 0
        ? (this.paginage.isDisabled = false)
        : (this.paginage.isDisabled = true);
    }
    // table: {
    //   deep: true,
    //   handler(newVal, oldVal) {
    //     if (newVal.form != oldVal.form) {
    //       this.getMessageCount();
    //     }
    //   },
    // },
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
        flag: this.where.flag,
        pageNum: this.pageConfig.num,
        pageSize: this.pageConfig.size
      };
      const data = await this.$api.system.getMessageList(params);
      if (data.code == 0) {
        // this.table.form = data.data.data.rows;
        this.$set(this.table, "form", data.data.rows);
        this.$set(this.table, "total", parseInt(data.data.total));
        // this.table.total = parseInt(data.data.data.total);
        // console.log(this.table.total, typeof this.table.total);
      } else {
        this.$message.error(data.data.message);
      }
    },

    onChange(date, dateString) {
      this.createValue = date;
      this.where.createTimeFrom = dateString[0];
      this.where.createTimeTo = dateString[1];
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    onDel() {
      const modal = this.$confirm({
        content: "是否删除当前选中项",
        okText: "是",
        cancelText: "否",
        centered: true,
        icon: e => {
          return <a-icon type="close-circle" style="color:red" />;
        },
        onOk: e => {
          this.$api.system.delMessage(this.selectedRowKeys).then(data => {
            if (data.data.code == 0) {
              this.$store.dispatch("MessageCount");
              this.getList();
              this.$message.success(data.data.message);
              modal.destroy();
              this.selectedRowKeys = [];
            } else {
              this.$message.error(data.data.message);
            }
          });
        }
      });
    },
    onRead() {
      const modal = this.$confirm({
        content: "是否已读当前选中项",
        okText: "是",
        cancelText: "否",
        centered: true,
        onOk: e => {
          let params = new Array();
          this.selectedRowKeys.forEach(item => {
            let arr = {
              id: item,
              flag: 2
            };
            params.push(arr);
          });
          this.$api.system.updateMessage(params).then(data => {
            if (data.data.code == 0) {
              this.$store.dispatch("MessageCount");
              this.getList();
              this.$message.success(data.data.message);
              modal.destroy();
              this.selectedRowKeys = [];
            } else {
              this.$message.error(data.data.message);
            }
          });
        }
      });
    },
    onAllDel() {
      const modal = this.$confirm({
        content: "是否全部删除",
        okText: "是",
        cancelText: "否",
        centered: true,
        onOk: () => {
          this.$api.system.allDelMessage().then(data => {
            if (data.data.code == 0) {
              this.$store.dispatch("MessageCount");
              this.getList();
              this.$message.success(data.data.message);
              modal.destroy();
            } else {
              this.$message.error(data.data.message);
            }
          });
        }
      });
    },
    onAllRead() {
      const modal = this.$confirm({
        content: "是否全部已读",
        okText: "是",
        cancelText: "否",
        centered: true,
        onOk: e => {
          let params = "";
          this.$api.system.allUpdateMessage(params).then(data => {
            if (data.data.code == 0) {
              this.$store.dispatch("MessageCount");
              this.getList();
              // this.getMessageCount();
              this.$message.success(data.data.message);
              modal.destroy();
              this.selectedRowKeys = [];
            } else {
              this.$message.error(data.data.message);
            }
          });
        }
      });
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
