<template>
  <div class="common-box  common-info">
    <!-- 面包屑 -->
    <a-row type="flex" justify="start" class="content-box">
      <a-col class="content-right">
        <a-row type="flex" justify="start" class="content-tool content-tool-top">
          <a-col :span="18">
            <a-row type="flex" justify="start" :gutter="16">
              <a-col>
                <a-button icon="plus" type="primary" @click="onAdd()">
                  添加车辆
                </a-button>
              </a-col>
              <a-col>
                <a-button
                  icon="plus-square"
                  type="primary"
                  @click="onShow('add')"
                >
                  新增授权码车辆
                </a-button></a-col
              >
              <a-col>
                <!-- s            <a-button icon="edit" type="primary" :disabled="selectedRowKeys.length<=0" @click="onShow('allEdit')"> 批量编辑 </a-button> -->
                <a-dropdown :disabled="selectedRowKeys.length <= 0">
                  <a-menu slot="overlay" @click="handleMenuClick">
                    <a-menu-item key="1">
                      <a-icon type="user" />协议名称
                    </a-menu-item>
                    <a-menu-item key="2">
                      <a-icon type="user" />授权码
                    </a-menu-item>
                  </a-menu>
                  <a-button style="margin-left: 8px">
                    批量编辑 <a-icon type="down" />
                  </a-button>
                </a-dropdown>
              </a-col>
              <a-col>
                <a-button
                  icon="setting"
                  type="primary"
                  :disabled="selectedRowKeys.length <= 0"
                  @click="onShow('setIP')"
                >
                  设置IP端口
                </a-button></a-col
              >
              <a-col>
                <a-button
                  icon="cloud-sync"
                  type="primary"
                  :disabled="selectedRowKeys.length <= 0"
                  @click="onShow('update')"
                >
                  远程更新
                </a-button></a-col
              >
              <a-col>
                <a-button
                  icon="upload"
                  type="primary"
                  @click="onShow('important')"
                >
                  批量导入
                </a-button></a-col
              >
            </a-row>
          </a-col>
          <!-- <a-col>
            <a-row type="flex" justify="start" class="tool-where" >
              <a-col>
                <a-input
                  placeholder="请输入车型名称"
                  v-model="where.modelName"
                />
              </a-col>
              <a-col>
                <a-input
                  placeholder="请输入车型名称"
                  v-model="where.modelName"
                />
              </a-col>
              <a-col>
                <a-button type="primary" @click="getList">查询</a-button></a-col
              >
              <a-col> <a-button @click="resetForm()">重置</a-button> </a-col>
            </a-row>
          </a-col> -->
        </a-row>
        <a-row type="flex" justify="start" class="content-tool" >
          <a-col :span="18">
            <a-row type="flex" justify="start" class="tool-where" :gutter="8">
              <a-col >
 <a-select
                v-model="where.fleetId"
                  show-search
                  placeholder="请选择车队"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  @change="handleChange"
                  class="myselect"
                  @dropdownVisibleChange="
                    (value) => changeSelect(value, 'fleet')
                  "
                >
                  <a-select-option
                    :value="item.id"
                    v-for="(item, i) in whereList.fleetList"
                    :key="i"
                  >
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col>
                <a-select
                  show-search
                v-model="where.plateNumber"
                  placeholder="请选择车牌号"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  @change="handleChange"
                  class="myselect"
                  @dropdownVisibleChange="
                    (value) => changeSelect(value, 'plateNumber')
                  "
                >
                  <a-select-option value="jack"> 测试1 </a-select-option>
                  <a-select-option value="lucy"> 测试2 </a-select-option>
                  <a-select-option value="tom"> 测试3 </a-select-option>
                </a-select>
              </a-col>
              <a-col>
                <a-select
                  show-search
                v-model="where.frameNumber"
                  placeholder="请选择车架号"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  @change="handleChange"
                  class="myselect"
                  @dropdownVisibleChange="
                    (value) => changeSelect(value, 'frameNumber')
                  "
                >
                  <a-select-option value=""> 请选择车架号 </a-select-option>
                  <a-select-option value="lucy"> 测试2 </a-select-option>
                  <a-select-option value="tom"> 测试3 </a-select-option>
                </a-select>
              </a-col>
              <a-col>
                <a-select
                v-model="where.terminalNo"
                  show-search
                  placeholder="请选择终端编号"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  @change="handleChange"
                  class="myselect"
                  @dropdownVisibleChange="
                    (value) => changeSelect(value, 'terminalNo')
                  "
                >
                  <a-select-option value="jack"> 测试1 </a-select-option>
                  <a-select-option value="lucy"> 测试2 </a-select-option>
                  <a-select-option value="tom"> 测试3 </a-select-option>
                </a-select>
              </a-col>
              <a-col>
                <a-select
                  show-search
                v-model="where.boxSn"
                  placeholder="请选择终端识别码"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  @change="handleChange"
                  class="myselect"
                  @dropdownVisibleChange="
                    (value) => changeSelect(value, 'boxSn')
                  "
                >
                  <a-select-option value="jack"> 测试1 </a-select-option>
                  <a-select-option value="lucy"> 测试2 </a-select-option>
                  <a-select-option value="tom"> 测试3 </a-select-option>
                </a-select>
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
            :columns="columns"
            :data-source="table.data"
            :pagination="false"
            rowKey="id"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange
            }"
            :scroll="{ y: 255, x: 1500 }"
            :rowClassName="rowClassName"
            :customRow="rowClick"
          >
            <a slot="name" slot-scope="text">{{ text }}</a>
            <template slot="operation" slot-scope="text, record">
              <span>
                <a-button
                  type="link"
                  class="status_show"
                  @click.stop="onShow('show', record.id)"
                  >查看</a-button
                >
              </span>
              <span>
                <a-button
                  type="link"
                  class="status_edit"
                  @click.stop="onEdit(record.id)"
                  >编辑</a-button
                >
              </span>
              <span>
                <a-popconfirm
                  class="status_del"
                  title="确认删除吗?"
                  @confirm="() => onDel(record.id)"
                  ><a-button type="link" @click.stop
                    >删除</a-button
                  ></a-popconfirm
                >
              </span>
            </template>
          </a-table>
          <myPaginate :list="table" @getList="getList"></myPaginate>
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
        </div>
      </a-col>
    </a-row>
    <isAddModal
      :isShow="modal.add"
      @changeModalStatus="modal.add = false"
    ></isAddModal>
    <isShowModal
      :isShow="modal.isShow"
      :list="modal.vehicleInfo"
      @changeModalStatus="modal.isShow = false"
    ></isShowModal>
    <isEditModal
      :isShow="modal.allEdit"
      :type="modal.isStatus"
      :list="selectedRowKeys"
      @changeModalStatus="
        getList();
        selectedRowKeys = [];
        modal.allEdit = false;
      "
    ></isEditModal>
    <isSetIPModal
      :isShow="modal.setIP"
      @changeModalStatus="modal.setIP = false"
    ></isSetIPModal>
    <isUpdateModal
      :isShow="modal.update"
      @changeModalStatus="modal.update = false"
    ></isUpdateModal>
    <isImportantModel
      :isShow="modal.important"
      @changeModalStatus="modal.important = false"
    ></isImportantModel>
  </div>
</template>

<script>
import getColumn from "@/utils/getColumns.js";
import getTime from "@/utils/getTime.js";
import isShowModal from "./modal/isShow";
import isAddModal from "./modal/isAdd";
import isEditModal from "./modal/allEdit";
import isSetIPModal from "./modal/setIP";
import isUpdateModal from "./modal/update";
import isImportantModel from "./modal/important";
import myPaginate from "@/components/layout/layout-paginate";
const list = [
  { name: "车牌号", type: "input" },
  { name: "车架号", type: "input" },
  { name: "终端编号", type: "input" },
  { name: "终端识别码", type: "input" },
  { name: "注册时间", type: "input" },
  { name: "激活时间", type: "input" },
  { name: "车队名称", type: "select" },
  { name: "协议名称", type: "select" },
  { name: "车辆图标", type: "select" },
  { name: "是否使用", type: "select" },
  { name: "是否监控", type: "select" },
  { name: "授权码", type: "input" },
  { name: "车辆型号", type: "select" }
];
const columns = [
  {
    title: "车牌号",
    dataIndex: "plateNumber",
    key: "plateNumber",
    align: "center",
    ellipsis: true
  },

  {
    title: "车架号",
    dataIndex: "frameNumber",
    key: "frameNumber",
    ellipsis: true,
    align: "center"
  },
  {
    title: "车辆识别码",
    dataIndex: "boxSn",
    key: "fleetId",
    align: "center",
    ellipsis: true
  },
  {
    title: "终端编号",
    dataIndex: "terminalNo",
    key: "terminalNo",
    align: "center",
    ellipsis: true
  },
  {
    title: "终端识别码",
    dataIndex: "boxSn",
    key: "boxSn",
    align: "center",
    ellipsis: true
  },
  {
    title: "协议名称",
    dataIndex: "protocolName",
    key: "protocolName",
    align: "center",
    ellipsis: true
  },
  {
    title: "车辆状态",
    dataIndex: "isUsed",
    key: "isUsed",
    align: "center",
    ellipsis: true,
    customRender: (text, row, index) => {
      if (text == 1) {
        return "在线";
      } else {
        return "离线";
      }
    }
  },
  {
    title: "注册时间",
    dataIndex: "registerTime",
    key: "registerTime",
    align: "center",
    width: "150px",
    ellipsis: true
  },
  {
    title: "激活时间",
    dataIndex: "activeTime",
    key: "activeTime",
    width: "150px",
    align: "center",
    ellipsis: true
  },
  {
    title: "最后上线时间",
    dataIndex: "lastOnlineTime",
    key: "lastOnlineTime",
    width: "150px",
    align: "center",
    ellipsis: true
  },
  {
    title: "车辆图标",
    dataIndex: "icon",
    key: "icon",
    align: "center",
    ellipsis: true
  },
  {
    title: "是否监控",
    dataIndex: "isMonitorName",
    key: "isMonitorName",
    align: "center",
    ellipsis: true
  },
  {
    title: "授权码",
    dataIndex: "codeVal",
    key: "codeVal",
    align: "center",
    ellipsis: true
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    width: "15%",
    key: "operation",
    scopedSlots: { customRender: "operation" }
  }
];
export default {
  components: {
    isAddModal,
    isShowModal,
    isEditModal,
    isSetIPModal,
    isUpdateModal,
    isImportantModel,
    myPaginate
  },
  data() {
    return {
      rowClassName: (record, index) => {
        let className = "dark-row";
        if (index % 2 === 1) className = "light-row";
        return className;
      },
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
      form: {
        name: ""
      },
      where: {},
      columns,
      whereList: {
        //         fleetList:[],
        // plateNumberList:[],
        // frameNumber:[],
        // terminalNo:[],
        // boxSn:[],
      },
      list,
      showList: {},
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
      selectedRowKeys: [],

      iconConfig: {
        isShow: true,
        text: "展开搜索条件",
        isWhere: false
      },
      modal: {
        isShow: false,
        vehicleInfo: {},
        allEdit: false,
        isStatus: "1",
        setIP: false,
        update: false,
        important: false,
        add: false
      },

      table: {
        data: [],
        total: 10
      },
      pageConfig: {
        num: 1,
        size: 10
      },
      pactList: [],
      
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
        fleetId: this.where.fleetId ? this.where.fleetId : "",
        plateNumber: this.where.plateNumber ? this.where.plateNumber : "",
        frameNumber: this.where.frameNumber ? this.where.frameNumber : "",
        terminalNo: this.where.terminalNo ? this.where.terminalNo : "",
        boxSn: this.where.boxSn ? this.where.boxSn : "",
        pageNum: this.pageConfig.num,
        pageSize: this.pageConfig.size
      };
      const data = await this.$api.configuration.getVehicleList(params);
      console.log(data);
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
    //批量编辑
    handleMenuClick(e) {
      this.modal.isStatus = e.key;
      this.onShow("allEdit");
    },
    onAdd() {
      this.$router.push({ name: "ConfigurationVehicleAdd" });
    },
    onEdit(key) {
      // console.log('编辑')
      this.$router.push({
        name: "ConfigurationVehicleEdit",
        query: { metaDbShow: key }
      });
    },
    onShow(key, data = null) {
      // console.log('编辑')
      console.log(key, data);
      switch (key) {
        case "add":
          //  console.log('新增授权码')
          this.modal.add = true;
          break;
        case "allEdit":
          this.modal.allEdit = true;
          break;
        case "setIP":
          this.modal.setIP = true;
          break;
        case "update":
          this.modal.update = true;
          break;
        case "important":
          this.modal.important = true;
          break;
        case "show":
          this.modal.isShow = true;
          this.getVehicleInfo(data);
          break;
        default:
          break;
      }
      console.log(key);
    },
    async onDel(key) {
      const data = await this.$api.configuration.delVehicle(key);
      console.log(data);
      if (data.code == 0) {
        this.getList();
        this.$message.success(data.message);
      } else {
        this.$message.error(data.message);
      }
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
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
    //文件下载
    async downloadFile() {
      await this.$api.upload.getvehicleFile();
    },
    //获取单条数据
    async getVehicleInfo(key) {
      const data = await this.$api.configuration.getVehicleInfo(key);
      if (data.code == 0) {
        this.modal.vehicleInfo = data.data;
      }
    },
    resetForm() {
      this.where.fleetId = null;
      this.where = {};
      this.getList();
    },
    changeSelect(status, key) {
      console.log(status, key);
      if (!status) return;
      switch (key) {
        case "fleet":
          if (this.where.fleetList == undefined) {
            this.getFleet();
          }
          break;

        default:
          break;
      }
    },
    async getFleet() {
      let data = await this.$api.configuration.getDicFleet();
      data.code == 0 ? this.$set(this.whereList, "fleetList", data.data) : [];
    }
  }
};
</script>

<style lang="scss" scoped>
.content-tool {
  // border-bottom:1px solid ;
  border-bottom:1px solid #D4D8E1;

  .tool-where {
    .ant-col {
      margin-left: 0px!important;
    }
    .myselect{
      width:160px;/*no*/
    }
  }
}

.content-table{
  height:82%!important;
  min-height: 648px!important;
  // background: red!important;
}
</style>
