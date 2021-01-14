<template>
  <div class="common-box  common-info">
    <!-- 面包屑 -->
    <a-row type="flex" justify="start" class="content-box">
      <a-col class="content-right">
        <a-row type="flex" justify="space-between" class="content-tool">
          <a-col :span="4">
            <a-button icon="download" :disabled="selectedRowKeys.length <= 0"
              >导出</a-button
            >
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
                <a-date-picker @change="onChangeDate"   v-model="where.createValue"/>
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
            :scroll="{ y: 255, x: 1600 }"
            :customRow="rowClick"
          >
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
    title: "总里程(KM)",
    dataIndex: "totalMileage",
    align: "center",
    key: "totalMileage",
    ellipsis: true
  },
  {
    title: "总运行时长(h)",
    dataIndex: "totalRunTime",
    align: "center",
    key: "totalRunTime",
    ellipsis: true
  },
  {
    title: "总氢耗(KG)",
    dataIndex: "totalHydrogenConsumption",
    align: "center",
    key: "totalHydrogenConsumption",
    ellipsis: true
  },
  {
    title: "总碳减排(KG)",
    dataIndex: "totalCarbonReduction",
    align: "center",
    key: "totalCarbonReduction",
    ellipsis: true
  },
  {
    title: "出勤率(%)",
    dataIndex: "attendance",
    align: "center",
    key: "attendance",
    ellipsis: true
  },
  {
    title: "总故障数(%)",
    dataIndex: "totalAlarmCount",
    align: "center",
    key: "totalAlarmCount",
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
      form: {
        name: ""
      },
      where: {
        name: "",
  createValue: null,

      },
      pageConfig: {
        num: 1,
        size: 10
      },
      table: {
        data: [],
        total: 10
      },
      columns,
      selectedRowKeys: [],

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
        boxSn: this.where.fleetName ?? "",
        fleetId: this.where.fleetName ?? "",
        plateNumber: this.where.fleetName ?? "",
        frameNumber: this.where.fleetName ?? "",
        terminalNo: this.where.terminalNo ?? "",
        date:this.where.createValue==null?'':this.where.createValue,
        pageNum: this.pageConfig.num,
        pageSize: this.pageConfig.size
      };
      const data = await this.$api.report.getReportDay(params);
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
    onSelectChange(selectedRowKeys, info) {
      console.log(selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
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
    onChangeDate(date, dateString) {
      this.where.createValue = dateString;
      console.log(date, dateString);
      console.log(this.startDate)
    },
    resetForm() {
      this.where.createValue = null;
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
