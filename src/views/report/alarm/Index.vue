<template>
  <div class="common-box  common-info">
    <!-- 面包屑 -->
    <a-row type="flex" justify="start" class="content-box">
      <a-col class="content-right">
        <a-row type="flex" justify="space-between" class="content-tool">
          <a-col :span="3">
            <a-row type="flex" justify="start" :gutter="8">
              <a-col>
                <a-button icon="setting" type="primary" @click="modal.isSetting=true">表格列配置</a-button>
              </a-col>
              <a-col>
                <a-button
                  icon="download"
                  :disabled="selectedRowKeys.length <= 0"
                  >导出</a-button
                >
              </a-col>
            </a-row>
          </a-col>
          <a-col>
            <a-row type="flex" justify="start" class="tool-where">
              <a-col>
                <a-select
                  show-search
                  placeholder="终端编号"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  @change="handleChange"
                  class="myselect"
                >
                  <a-select-option :value="i" v-for="i in 5" :key="i">
                    测试{{ i }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col>
                <a-select
                  show-search
                  placeholder="车牌号"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  @change="handleChange"
                  class="myselect"
                >
                  <a-select-option :value="i" v-for="i in 5" :key="i">
                    测试{{ i }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col>
                <a-select
                  show-search
                  placeholder="车架号"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  @change="handleChange"
                  class="myselect"
                >
                  <a-select-option :value="i" v-for="i in 5" :key="i">
                    测试{{ i }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col>
                <a-date-picker
                  v-model="where.startValue"
                  :disabled-date="disabledStartDate"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="开始时间"
                  @openChange="handleStartOpenChange"
                />
              </a-col>
              <a-col>
                <a-date-picker
                  v-model="where.endValue"
                  :disabled-date="disabledEndDate"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="结束时间"
                  :open="where.endOpen"
                  @openChange="handleEndOpenChange"
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
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange
            }"
            :scroll="{ y: 255, x: 1400 }"
            :customRow="rowClick"
          >
          </a-table>
          <myPaginate :list="table" @getList="getList"></myPaginate>
        </div>
      </a-col>
    </a-row>
    <isSettingModal
      :isShow="modal.isSetting"
      @changeModalStatus="modal.isSetting = false"
    ></isSettingModal>
  </div>
</template>

<script>
import myPaginate from "@/components/layout/layout-paginate";
import isSettingModal from "./modal/IsSetting.vue";

const columns = [
  {
    title: "车牌号",
    dataIndex: "plateNumber",
    key: "plateNumber",
    align: "center",
    width: 150,
    ellipsis: true
  },
  {
    title: "车架号",
    dataIndex: "frameNumber",
    key: "frameNumber",
    width: 150,
    align: "center",
    ellipsis: true
  },
  {
    title: "	终端识别码",
    dataIndex: "boxSn",
    key: "boxSn",
    align: "center",
    ellipsis: true
  },
  {
    title: "报警总次数",
    dataIndex: "totalCount",
    key: "totalCount",
    align: "center",
    ellipsis: true
  }
];
export default {
  components: {
    myPaginate,
    isSettingModal
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
      form: {
        name: ""
      },
      where: {
        //开始时间  结束时间
        startValue: null,
        endValue: null,
        endOpen: false,
        name: ""
      },
      pageConfig: {
        num: 1,
        size: 10
      },
      table: {
        data: [],
        total: 10
      },
      modal: {
        isSetting: false
      },
      columns,
      selectedRowKeys: []
    };
  },
  created() {
    this.getList();
  },

  methods: {
     async getList(num = null, size = null) {
      if(num!=null){
        this.pageConfig.num=num}
      if(size!=null){
        this.pageConfig.size=size}
      let params = {
        boxSn: this.where.fleetName ?? "",
        fleetId: this.where.fleetName ?? "",
        plateNumber: this.where.fleetName ?? "",
        frameNumber: this.where.fleetName ?? "",
        terminalNo: this.where.terminalNo ?? "",
        pageNum: this.pageConfig.num,
        pageSize: this.pageConfig.size
      };
      const data = await this.$api.report.getReportAlarm(params);
      if (data.code == 0) {
        this.table.data = data.data.rows;
        this.table.data = data.data.rows.map((v, index) => {
          return {
            ...v,
            id: index
          };
        });
        this.table.total = parseInt(data.data.count);
      } else {
        this.$message.error(data.message);
      }
    },
    onChangePlace(index) {
      let arr = this.configList;
      // if (index != 0) {
      arr[index] = arr.splice(index - 1, 1, arr[index])[0];
      // } else {
      // arr.unshift(arr.splice(index, 1)[0]);
      // }
    },
    handleCancel(e) {
      this.$emit("changeModalStatus", false);
    },
        filterOption(input, option) {
      console.log(input, option);
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },    handleChange(value) {
      console.log(`selected ${value}`);
    },    //时间组件
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
    },    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
        onSelectChange(selectedRowKeys, info) {
      console.log(selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    onSubmit() {
      this.$message.success("提交成功"); //提交成功属性父级列表
      this.$emit("changeModalStatus", false);
    },
    resetForm() {
      this.where.endValue = null;
      this.where.startValue = null;
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.myselect {
  width: 150px; /*no*/
}
</style>
