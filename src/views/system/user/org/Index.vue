<template>
  <div class="common-box">
    <a-row type="flex" justify="start" class="content-box">
      <leftWhere
        :list="treeConfig.treeData"
        @deptId="getDeptId"
        @changeModalStatus="changeAddModal"
        @changeEditModalStatus="changeEditModal"
        @treeData="changeModalData"
        @fatherGetDept="getDept"
      ></leftWhere>
      <a-col class="content-right">
        <a-row type="flex" justify="space-between" class="content-tool">
          <a-col :span="8">
            <a-row type="flex" justify="start" :gutter="8">
              <a-col>
                <a-button type="primary" icon="usergroup-add" @click="onAdd()">
                  新增成员
                </a-button>
              </a-col>
              <a-col>
                <a-button type="primary" icon="upload" @click="isShowFileModal">
                  导入成员
                </a-button>
              </a-col>
            </a-row>
          </a-col>
          <a-col>
            <a-row type="flex" justify="start" class="tool-where">
              <a-col>
                <a-input placeholder="请输入姓名" v-model="where.nickName" />
              </a-col>
              <a-col>
                <a-input placeholder="请输入手机号" v-model="where.mobile" />
              </a-col>
              <a-col>
                <a-select style="width: 160px" v-model="where.roleId">
                  <a-select-option value>请选择角色</a-select-option>
                  <a-select-option :key="item.roleId" v-for="item in RoleList">
                    {{ item.roleName }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col>
                <a-button type="primary" @click="getUserByDept()"
                  >查询</a-button
                ></a-col
              >
              <a-col> <a-button @click="resetForm()">重置</a-button> </a-col>
            </a-row>
          </a-col>
        </a-row>
        <div class="content-table">
          <a-table
            :columns="table.columns"
            :data-source="table.data"
            :pagination="false"
            table-layout:fixed
            :scroll="{ y: 240 }"
            rowKey="userId"
          >
            <a slot="name" slot-scope="text">{{ text }}</a>
            <template slot="operation" slot-scope="text, record">
              <span>
                <a-button
                  type="link"
                  class="status_show"
                  @click="() => onShow(record)"
                  >查看</a-button
                >
                <a-button
                  type="link"
                  class="status_edit"
                  @click="() => onEdit(record.userId)"
                  >编辑</a-button
                >
                <a-popconfirm
                  class="status_del"
                  title="确认删除该用户吗"
                  @confirm="() => onDelete(record.userId)"
                  ><a-button type="link">删除</a-button></a-popconfirm
                >
              </span>
            </template>
          </a-table>
          <myPaginate :list="table" @getList="getUserByDept"></myPaginate>
        </div>
      </a-col>
    </a-row>

    <isAddModal
      :isShow="modal.isAdd"
      :list="treeConfig.treeData1"
      @changeModalStatus="modal.isAdd = false"
    ></isAddModal>
    <isShowModal
      :isShow="modal.isShow"
      :info="modal.info"
      @changeModalStatus="modal.isShow = false"
    ></isShowModal>
    <isEditModal
      :isShow="modal.isEdit"
      :info="modal.info"
      :list="treeConfig.treeData1"
      @changeModalStatus="modal.isEdit = false"
    ></isEditModal>
    <isImportantModal
      :isShow="modal.isImportant"
      :deptId="where.deptId"
      @changeModalStatus="modal.isImportant = false"
    ></isImportantModal>
  </div>
</template>

<script>
import leftWhere from "./public/contentLeft";
import isAddModal from "./public/isAdd";
import isEditModal from "./public/isEdit";
import isImportantModal from "./public/isImportant";
import isShowModal from "./public/isShow";
import myPaginate from "@/components/layout/layout-paginate";
const columns = [
  {
    title: "序号",
    width: 80,
    customRender: (text, record, index) => `${index + 1}`,
    align: "center"
  },
  {
    title: "姓名",
    dataIndex: "nickName",
    key: "nickName",
    align: "center",
    ellipsis: true
  },
  {
    title: "登录账号",
    dataIndex: "mobile",
    key: "mobile",
    width: 120,
    align: "center",
    ellipsis: true
  },
  {
    title: "用户角色",
    dataIndex: "roleName",
    key: "roleName",
    align: "center",
    ellipsis: true
  },
  {
    title: "所属组织",
    dataIndex: "deptName",
    key: "deptName",
    align: "center",
    ellipsis: true
  },
  {
    title: "用户状态",
    dataIndex: "status",
    key: "status",
    align: "center",
    ellipsis: true,
    customRender: (text, row, index) => {
      if (text == 1) {
        return "有效";
      } else {
        return "无效";
      }
    }
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    ellipsis: true,
    align: "center"
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    key: "operation",
    width: "18%",
    scopedSlots: { customRender: "operation" }
  }
];
import orgTree from "@/utils/orgTree";

export default {
  watch: {
    selectDeptName: {
      deep: true,
      handler(newVal, oldVal) {
        this.getDept();
      }
    }
  },
  components: {
    leftWhere,
    isAddModal,
    isEditModal,
    isImportantModal,
    isShowModal,
    myPaginate
  },
  data() {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },

      openKeys: ["2"],
      modal: {
        isShow: false,
        isOwn: false,
        isAdd: false,
        isEdit: false,
        isImportant: false,
        info: {}
      },
      config: {
        seen: false,
        current: 0,
        status: false,
        num: 1,
        treeData: []
      },

      treeConfig: {
        treeData: []
      },
      // 搜索org条件
      selectDeptName: "",

      treeExpandedKeys: [],
      /**
       * 分页设置
       */
      pageConfig: {
        num: 1,
        size: 10
      },
      /**
       * 文件上传
       */
      fileConfig: {
        isShow: false,
        fileName: "",
        infoShow: true,
        message: {
          key: ""
        }
      },
      size: "large",
      selectedRowKeys: [],
      RoleList: [],
      where: {
        userName: "",
        mobile: "",
        roleId: "",
        deptId: ""
      },
      table: {
        columns,
        data: [],
        total: 10
      }
    };
  },
  created() {
    this.getDept();
    this.getUserByDept();
    this.getRoles();
  },
  methods: {
    getDeptId(key) {
      console.log(key);
      this.where.deptId = key;
      this.getUserByDept();
    },
    changeModalData(data) {
      this.$set(this.config, "treeData", data);
    },
    changeAddModal(status) {
      this.$set(this.modal, "isAdd", status);
    },
    changeEditModal(data) {
      let params = {
        deptName: data.label,
        parentId: data.parentId,
        deptId: data.id
      };
      this.$set(this.modal, "info", params);
      this.$set(this.modal, "isEdit", true);
    },
    async getDept(name) {
      console.log(1);
      let params = {
        deptName: name ? name : ""
      };
      const data = await this.$api.system.getDept(params);
      if (data.code == 0) {
        // this.treeConfig.treeData = [...data.data.data.rows];
        //修改参数,新增组件参数
        let tree = orgTree(data.data.rows);
        this.$set(this.treeConfig, "treeData", [...data.data.rows]);
        // console.log(this.treeConfig.treeData);
        let list = data.data.rows;
        list.unshift({
          label: "顶级组织",
          parentId: "0",
          id: "0"
        });
        // this.treeConfig.treeData1 = list;
        this.$set(this.treeConfig, "treeData1", list);
        // this.$emit("treeData", list);
        // console.log(this.treeConfig.treeData);
      } else {
        this.$message.error(data.data.message);
      }
    },
    async getRoles(key) {
      let params = key ?? "";
      const data = await this.$api.system.getRoles(params);
      if (data.code == 0) {
        this.RoleList = data.data.rows;
      } else {
        this.$message.error(data.message);
      }
      // console.log(this.RoleList)
    },
    async getUserByDept(num=null,size=null) {
      if (num != null) {
        this.pageConfig.num = num;
      }
      if (size != null) {
        this.pageConfig.size = size;
      }
      let params = {
        deptId: this.where.deptId,
        nickName: this.where.nickName,
        mobile: this.where.mobile,
        roleId: this.where.roleId,
        pageNum: this.pageConfig.num,
        pageSize: this.pageConfig.size
      };
      // console.log(params);
      const data = await this.$api.system.getUserByDept(params);
      if (data.code == "0") {
        this.table.data = data.data.rows;
        this.table.total = parseInt(data.data.total);
      } else {
        this.$message.error(data.message);
      }
    },

    //搜索org
    selectDept() {
      // alert("搜索org");
    },
    onAdd() {
      
      this.$router.push({ name: "OrgAdd" });
    },
    onEdit(key) {
      console.log(key)
      this.$router.push({ name: "OrgEdit", query: { metaDbShow: key } });
    },
    //详情页
    onShow(key) {
      // this.$router.push({ name: "OrgShow", query: { metaDbShow: key } });
      this.$set(this.modal, "info", key);
      this.modal.isShow = true;
    },
    onDelete(key) {
      this.$api.system.delUser(key).then(data => {
        if (data.code == 0) {
          this.getUserByDept();
          this.$message.success(data.message);
        } else {
          this.$message.error(data.message);
        }
      });
    },

    //单击组织结构
    onSelectTree(selectedKeys, info) {
      if (selectedKeys[0] != undefined) {
        this.where.deptId = selectedKeys[0];
      }
      this.getUserByDept();
    },

    /**
     * 文件上传
     */
    /**
     */
    isShowFileModal() {
      if (this.where.deptId == "") {
        this.$message.warning("请先选中组织,在进行操作");
        return;
      }
      this.modal.isImportant = true;
    },
    beforeFileUpload(file) {
      return new Promise((resolve, reject) => {
        const isExcel = file.type === "application/vnd.ms-excel";
        if (!isExcel) {
          this.$message.error("您只能上传Excel文件");
          return reject(false);
        }
        //   const isLt2M = file.size / 1024 / 1024 < 2
        //   if (!isLt2M) {
        //     this.$message.error('文件大小不能大于2MB')
        //     return reject(false)
        //   }
        this.$message.info("文件正在上传中...");
        return resolve(true);
      });
    },
    importFile(info) {
      if (info.file.status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      // console.log(info.file);
      if (info.file.status == "removed") {
      }

      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} 上传失败.`);
      }
    },
    customRequest(data) {
      // 上传提交
      this.formData = new FormData();
      const file = data.file;
      this.formData.append("file", file);
      this.$api.upload.importUserFile(this.formData).then(data => {
        this.$set(this.fileConfig, "message", data.data);
        this.fileConfig.fileName = file.name;
        if (data.code == "0") {
          this.$message.success(data.message);
          const item = {
            uid: file.uid + file.name,
            name: file.name,
            status: "done",
            index: this.table.taskIndex
          };
        } else {
          this.$message.error(data.message);
        }
      });
    },
    async onSubmitFileOk() {
      /**
       * 成功刷新列表 关闭弹窗
       */
      // this.fileConfig.infoShow=false
      let params = this.fileConfig.message.key;
      await this.$api.upload.getUserErrorFile(params);
      this.getUserByDept();
      this.fileConfig.isShow = false;
      this.fileConfig.fileName = "";
    },
    onCancelFile() {
      this.getUserByDept();
      this.fileConfig.message = { key: "" };
      this.fileConfig.infoShow = true;
      this.fileConfig.isShow = false;
      this.fileConfig.fileName = "";
    },
    async downloadFile() {
      // console.log("下载接口");
      let params = this.where.deptId;
      await this.$api.upload.getUserFile(params);
    },
    resetForm() {
      this.where.nickName = "";
      this.where.mobile = "";
      this.where.roleId = "";
      this.getUserByDept();
    },

    /**
     * 分页
     */
    onChangeSize(num, size) {
      console.log(num, size);
      this.pageConfig.num = num;
      this.pageConfig.size = size;
      this.getUserByDept();
    },
    onShowSizeChange(num, size) {
      console.log(num, size);

      this.pageConfig.num = num;
      this.pageConfig.size = size;
      this.getUserByDept();
    }
  }
};
</script>

<style lang="sass" scoped></style>
