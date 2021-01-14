<template>
  <div class="common-box  common-info">
    <!-- 面包屑 -->
    <a-row type="flex" justify="start" class="content-box">
      <a-col class="content-right">
        <a-row type="flex" justify="space-between" class="content-tool">
          <a-col :span="10">
            <a-button icon="plus" type="primary" @click="onAdd()">
              添加车队
            </a-button>
          </a-col>
          <a-col>
            <a-row type="flex" justify="start" class="tool-where">
              <a-col>
                <a-input
                  placeholder="请输入车队名称"
                  v-model="where.fleetName"
                />
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
    title: "序号",
    width: 80,
    customRender: (text, record, index) => `${index + 1}`,
    align: "center"
  },
  {
    title: "车队名称",
    dataIndex: "fleetName",
    key: "fleetName",
    align: "center",
    ellipsis: true
  },
  {
    title: "车队描述",
    dataIndex: "fleetDesc",
    key: "fleetDesc",
    align: "center",
    ellipsis: true
  },
  {
    title: "车辆数",
    dataIndex: "vehicleCount",
    key: "vehicleCount",
    align: "center",
    ellipsis: true
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    align: "center",
    key: "createTime",
    ellipsis: true
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    key: "operation",
    scopedSlots: { customRender: "operation" }
  }
];
export default {
  components: {
    myPaginate
  },
  data() {
    return {
      where: {
        fleetName: ""
      },
      columns,
      table: {
        data: [],
        total: 10
      },
      pageConfig: {
        num: 1,
        size: 10
      }
    };
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
        fleetName: this.where.fleetName,
        pageNum: this.pageConfig.num,
        pageSize: this.pageConfig.size
      };
      const data = await this.$api.configuration.getFleetList(params);
      if (data.code == 0) {
        this.table.data = data.data.rows;
        this.table.total = parseInt(data.data.count);
      } else {
        this.$message.error(data.message);
      }
    },
    onAdd() {
      this.$router.push({ name: "ConfigurationAdd" });
    },
    onEdit(key) {
      // console.log('编辑')
      this.$router.push({
        name: "ConfigurationEdit",
        query: { metaDbShow: key }
      });
    },
    async onDel(key) {
      const data = await this.$api.configuration.delFleet(key);
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
      this.where.fleetName = "";
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped></style>
