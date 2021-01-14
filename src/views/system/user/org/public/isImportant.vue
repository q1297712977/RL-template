<template>
  <div>
    <a-modal
      title="导入成员"
      v-model="show"
      destroyOnClose
      centered
      :closable="false"
      :footer="null"
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
          :label-col="{ span: 4 }"
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
              您此次共上传了<span class="fileConfig-count"
                >{{ fileConfig.message.count }} 条信息</span
              >,
              <span class="fileConfig-success">
                成功上传 {{ fileConfig.message.success }} 条信息</span
              >,
              <span class="fileConfig-error">
                错误 {{ fileConfig.message.error }} 处</span
              >
            </a-col>
            <a-col>
              为了不影响您的使用，请点击“下载”查询错误信息，修改完毕后重新上传。
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item
          label="  "
          :label-col="{ span: 4 }"
          :colon="false"
          :wrapper-col="{ span: 20 }"
        >
          <a-row type="flex" justify="start">
            <a-col>
              <a-button key="back" @click="onCancelFile">
                取消
              </a-button>
            </a-col>
            <a-col :offset="1" v-show="fileConfig.infoShow">
              <a-button
                key="submit"
                type="primary"
                @click="fileConfig.infoShow = false"
                :disabled="fileConfig.message.key == ''"
              >
                立即解析
              </a-button>
            </a-col>
            <a-col :offset="1" v-show="!fileConfig.infoShow">
              <a-button
                key="submit"
                type="primary"
                @click="onSubmitFileOk"
                :disabled="fileConfig.message.key == ''"
              >
                下载结果
              </a-button>
            </a-col>
          </a-row>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
      //横坐标
      type: Boolean,
      default: false
    },
    deptId:{
      type:String
    }
  },
  data() {
    return {
      form: {
        deptName: "",
        parentId: 0
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      /**
       * 文件上传
       */
      fileConfig: {
        fileName: "",
        infoShow: true,
        message: {
          errorFileName: "",
          key:''
        }
      }
    };
  },
  computed: {
    show: {
      get: function() {
        return this.isShow;
      },
      set: function() {}
    },
    treeData: {
      get: function() {
        return this.list;
      },
      set: function() {}
    }
  },
  watch: {
    show(n, o) {
    //   console.log(n, o);
    }
  },
  methods: {
    /**
     * 文件上传
     */
    /**
     */
    isShowFileModal() {
      if (this.where.deptId == "") {
        this.$message.error("请先选中组织,在进行操作");
        return;
      }
      this.fileConfig.isShow = true;
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
      this.$parent.getUserByDept();
      this.$emit("changeModalStatus", false);

      this.fileConfig={}

    //   this.fileConfig.isShow = false;
    //   this.fileConfig.fileName = "";
    },
    onCancelFile() {
    //   this.$parent.getUserByDept();
      this.$emit("changeModalStatus", false);
    //   this.fileConfig={}
        this.fileConfig.message = { key: "" };
        this.fileConfig.infoShow = true;
        this.fileConfig.fileName = "";
    },
    async downloadFile() {
      // console.log("下载接口");
      let params = this.deptId;
      await this.$api.upload.getUserFile(params);
    }
  }
};
</script>

<style lang="sass" scoped></style>
