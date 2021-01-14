<template>
  <div class="common-box  common-info">
    <!-- 面包屑 -->
    <a-row type="flex" justify="start" class="content-box">
      <a-col class="content-right">
        <a-row type="flex" justify="space-between" class="content-tool">
          <a-col :span="10">
            <a-button type="primary" @click="onAdd()">新增菜单</a-button>
          </a-col>
          <a-col>
            <a-row type="flex" justify="start" class="tool-where">
              <a-col>
                <a-input
                  placeholder="请输入菜单名称"
                  v-model="where.menuName"
                />
              </a-col>
              <a-col>
                <a-button type="primary" @click="getList">查询</a-button></a-col
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
            rowKey="id"
            :scroll="{ y: 240 }"

            :indent-size="10"
          >
            <a slot="name" slot-scope="text">{{ text }}</a>
            <template slot="operation" slot-scope="text, record">
              <span>
                <a-button
                  type="link"
                  class="status_edit"
                  @click="() => onEdit(record.id)"
                  >编辑</a-button
                >
                <a-popconfirm
                  class="status_del"
                  title="确认删除菜单吗?"
                  @confirm="() => onDelete(record.id)"
                  ><a-button type="link">删除</a-button></a-popconfirm
                >
              </span>
            </template>
          </a-table>
          <!-- <div class="paginate-footer"> -->
            <!-- <a-row type="flex" justify="space-between">
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
            </a-row> -->
          <!-- </div> -->
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
const columns = [
  // {
  //   title: "序号",
  //   width: 64,
  //   customRender: (text, record, index) => `${index + 1}`,
  //   align: "center",
  // },
  {
    title: "菜单名称",
    dataIndex: "label",
    key: "label",
    align: "center",

    ellipsis: true
  },
  {
    title: "URL链接",
    dataIndex: "path",
    align: "center",
    key: "path",
    ellipsis: true
  },
  // {
  //   title: "后端权限",
  //   dataIndex: "perms",
  //   align: "center",
  //   key: "perms",
  //   ellipsis: true
  // },
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
    align: "center",
    title: "操作",
    dataIndex: "operation",
    key: "operation",
    scopedSlots: { customRender: "operation" }
  }
];

export default {
  data() {
    return {
      table: {
        form: [],
        columns,
        total: 10
      },
      size: "large",
      selectedRowKeys: [],
      where: {
        menuName: ""
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
    async getList(num, size) {
      let params = {
        menuName: this.where.menuName,
        pageNum: num,
        pageSize: size
      };
      const data = await this.$api.system.getMenuList(params);
      // console.log(data.data);
      if (data.data.code == 0) {
        this.table.form = data.data.data.rows;
        this.table.total = data.data.data.total;
      } else {
        this.$message.error(data.data.message);
      }
    },
    onChangeSize(num, size) {
      this.getList(num, size);
    },
    onShowSizeChange(num, size) {
      console.log(num, size);
      this.getList(num, size);
    },
    onAdd() {
      this.$router.push({ name: "MenuAdd" });
    },
    onEdit(key) {
      // console.log(key);
      this.$router.push({ name: `MenuEdit`, query: { metaDbShow: key } });
    },
    async onDelete(key) {
      this.$message.error("测试期间,不可删除");
      return;
      let params = new Array();
      params.push(key);
      const data = await this.$api.system.menuDel(params); //删除所有的接口
      // const data = await this.$api.system.menuDel({key});
      if (data.data.code == 0) {
        this.$store.dispatch("changeMenusList");
        this.getList();
        this.$message.success(data.data.message);
      } else {
        this.$message.error(data.data.message);
      }
    },
    resetForm(){
      this.where.menuName=''
      this.getList()
    }
  }
};
</script>
<style lang="scss" scoped></style>
