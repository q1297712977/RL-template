<template>
  <a-modal
    title="上传Excel"
    v-model="show"
    destroyOnClose
    centered
    :closable="false"
    :footer="null"
    :maskClosable="true"
    :width="'45%'"
    @cancel="handleCancel"
    dialogClass="uploadModelClass"
  >
    <a-form-model
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      labelAlign="left"
    >
      <a-form-model-item
        label="文件名称 "
        :colon="false"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-row type="flex" justify="space-between">
          <a-col :span="16">
            <a-input v-model="fileConfig.fileName" disabled />
          </a-col>
          <a-col :span="7">
            <a-upload
              name="file"
              :multiple="true"
              :customRequest="customRequest"
              @change="importFile"
              :file-list="[]"
              :beforeUpload="beforeFileUpload"
            >
              <a-button type="primary">
                <a-icon type="upload" />文件上传
              </a-button>
            </a-upload>
          </a-col>
        </a-row>
      </a-form-model-item>
      <!-- <a-form-model-item label="   " :colon="false">
            <a-progress :percent="50" status="active" />
          </a-form-model-item> -->
      <a-form-model-item
        label="说明"
        :colon="false"
        :wrapper-col="{ span: 20 }"
      >
        <a-row v-show="fileConfig.infoShow">
          <a-col>
            1、批量前请先
            <a-button type="link" @click="downloadFile" download="filename"
              >下载模板</a-button
            >,并按照模板格式要求进行数据录入;
          </a-col>
          <a-col
            >2、上传时会对Excel文件表格内容进行验证,请确保无重复数据,表格内如有异常数据会导致上传失败;</a-col
          >
          <a-col>3、每次最多只能导入500条数据。</a-col>
        </a-row>
        <a-row v-show="!fileConfig.infoShow">
          <a-col>
            您此次共上传了<span class="status_green"
              >{{ fileConfig.message.count }} 条信息</span
            >,
            <span class="status_blue">
              成功上传 {{ fileConfig.message.success }} 条信息</span
            >,
            <span class="status_del">
              错误 {{ fileConfig.message.error }} 处</span
            >
          </a-col>
          <a-col>
            为了不影响您的使用，请点击“下载”查询错误信息，修改完毕后重新上传。
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item label="  " :colon="false" :wrapper-col="{ span: 20 }">
        <a-row type="flex" justify="start">
          <a-col>
            <a-button key="back" @click="handleCancel"> 取消 </a-button>
          </a-col>
          <a-col :offset="1" v-show="fileConfig.infoShow">
            <a-button
              key="submit"
              type="primary"
              @click="fileConfig.infoShow = false"
              :disabled="fileConfig.message.errorFileName == ''"
            >
              立即解析
            </a-button>
          </a-col>
          <a-col :offset="1" v-show="!fileConfig.infoShow">
            <a-button
              key="submit"
              type="primary"
              @click="onSubmitFileOk"
              :disabled="fileConfig.message.errorFileName == ''"
            >
              下载结果
            </a-button>
          </a-col>
        </a-row>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
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
  { name: "车辆型号", type: "select" },
];
export default {
  props: {
    isShow: {
      //横坐标
      type: Boolean,
      default: false,
    },
  },
  computed: {
    show: {
      get: function () {
        return this.isShow;
      },
      set: function () {},
    },
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },

      /**
       * 文件上传
       */
      fileConfig: {
        isShow: false,
        fileName: "",
        infoShow: true,
        message: {
          errorFileName: "",
        },
      },
    };
  },
  watch: {
  },
  methods: {
    handleCancel(e) {
      // console.log(e);
      // this.visible = false;
      this.fileConfig.isShow=false
      this.fileConfig.fileName=''
      this.fileConfig.message.errorFileName=''
      this.$emit("changeModalStatus", false);

    },
    beforeFileUpload(file) {
      return new Promise((resolve, reject) => {
        const isExcel = file.type === "application/vnd.ms-excel";
        if (!isExcel) {
          this.$message.error("您只能上传Excel文件");
          return reject(false);
        }
        this.$message.info("文件正在上传中...");
        return resolve(true);
      });
    },
    importFile(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      console.log(info.file);
      if (info.file.status == "removed") {
      }

      if (info.file.status === "done") {
        console.log(222);
        this.$message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} 上传失败.`);
      }
    },
    customRequest(data) {
      // 上传提交
      // console.log(data);
      this.formData = new FormData();
      const file = data.file;
      this.formData.append("file", file);
      this.$api.upload.importVehicleFile(this.formData).then((data) => {
        console.log(data);
        this.$set(this.fileConfig, "message", data.data);
        this.fileConfig.fileName = data.data.errorFileName;
        // console.log(this.fileConfig)
        if (data.code == "0") {
          this.$message.success(data.message);
          // const item = {
          //   uid: file.uid + file.name,
          //   name: file.name,
          //   status: "done",
          //   index: this.table.taskIndex
          // };
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
      // let params = this.fileConfig.message.errorFileName;
      let params = this.fileConfig.fileName;
      // console.log(params,typeof(params))
      // this.$message.error("接口异常")
      // return
      await this.$api.upload.downVehicleFile(params);
      // this.$emit("changeModalStatus", false);
      // this.$emit(getList());
      // this.fileConfig.isShow = false;
      // (this.fileConfig.fileName = ""), this.getList();
    },
    // onCancelFile() {
    //   this.fileConfig.message = { errorFileName: "" };
    //   (this.fileConfig.fileName = ""), (this.fileConfig.infoShow = true);
    //   this.fileConfig.isShow = false;
    //   this.getList();
    // },
    //文件下载
    async downloadFile() {
      await this.$api.upload.getvehicleFile();
    },
  },
};
</script>

<style lang="scss" scoped>
.onShowClass {
  .ant-col {
    height: 32px;
    line-height: 32px;
  }
  .class_r {
    text-align: right;
  }
}
</style>