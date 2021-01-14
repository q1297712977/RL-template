<template>
  <div class="common-box  common-info">
    <!-- 面包屑 -->
    <a-row type="flex" justify="start" class="content-box">
      <a-col class="content-right">
        <a-row type="flex" justify="space-between" class="content-tool">
          <a-col :span="10">
            <a-button type="primary" @click="onAdd()">新增角色</a-button>
          </a-col>
          <a-col>
            <a-row type="flex" justify="start" class="tool-where">
              <a-col>
                <a-input
                  placeholder="请输入角色名称"
                  v-model="where.roleName"
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
            :columns="table.columns"
            :data-source="table.form"
            :pagination="false"
            table-layout:fixed
            :scroll="{ y: 240 }"
            rowKey="roleId"
          >
            <a slot="name" slot-scope="text">{{ text }}</a>
            <template slot="operation" slot-scope="text, record">
              <span>
                <a-button
                  type="link"
                  class="status_edit"
                  @click="() => onEdit(record.roleId)"
                  >编辑</a-button
                >
                <a-popconfirm
                  class="status_del"
                  title="确认删除吗?"
                  @confirm="() => onDelete(record.roleId)"
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
    width: 80,
    customRender: (text, record, index) => `${index + 1}`,
    align: "center"
  },
  {
    title: "角色名称",
    dataIndex: "roleName",
    key: "roleName",
    align: "center",
    ellipsis: true
  },
  {
    title: "描述",
    align: "center",
    dataIndex: "remark",
    key: "remark",
    ellipsis: true
  },
  {
    title: "创建人",
    dataIndex: "createName",
    key: "createName",
    align: "center",
    ellipsis: true,
    slots: { title: "XXX" }
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
      table: {
        form: [],
        columns,
        total: 10
      },
      size: "large",
      selectedRowKeys: [],
      where: {},
      /**
       * 分页设置
       */
      pageConfig: {
        num: 1,
        size: 10
      }
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
        roleName: this.where.roleName,
        pageNum: this.pageConfig.num,
        pageSize: this.pageConfig.size
      };
      const data = await this.$api.system.getRoles(params);
      if (data.code == 0) {
        this.table.form = data.data.rows;
        this.table.total = parseInt(data.data.total);
      } else {
        this.$message.error(data.message);
      }
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

    onAdd() {
      this.$router.push({ name: "RoleAdd" });
    },
    onEdit(key) {
      // console.log(key)
      this.$router.push({ name: "RoleEdit", query: { metaDbShow: key } });
    },
    async onDelete(key) {
      const data = await this.$api.system.delRole(key);
      let res = data.data;
      if (res.code == 0) {
        this.getList();
        this.$message.success(data.data.message);
      } else {
        this.$message.error(data.data.message);
      }
    },
    resetForm() {
      this.where.roleName = "";
      this.getList();
    }
  }
};
</script>
<style lang="scss" scoped></style>
