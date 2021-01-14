<template>
  <div class="common-box  common-info">
    <!-- 面包屑 -->
    <a-row type="flex" justify="start" class="content-box">
      <a-col class="content-right">
        <a-row type="flex" justify="space-between" class="content-tool">
          <a-col :span="2">
            <a-button icon="download" :disabled="selectedRowKeys.length <= 0"
              >导出</a-button
            >
          </a-col>
          <a-col :span="22">
            <a-row type="flex" justify="end" class="tool-where">
              <a-col>
                <a-select
                  show-search
                  placeholder="车队"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  @change="handleChange"
                  class="myselect"
                   v-model="where.fleetId"

                >
                  <a-select-option :value="item.id" v-for="(item,i) in fleetList" :key="i">
                    {{item.name}}
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
                  placeholder="终端识别码"
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
                  v-model="startValue"
                  :disabled-date="disabledStartDate"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="开始时间"
                  @openChange="handleStartOpenChange"
                />
              </a-col>
              <a-col>
                <a-date-picker
                  v-model="endValue"
                  :disabled-date="disabledEndDate"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="结束时间"
                  :open="endOpen"
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
            :data-source="data"
            :pagination="false"
            rowKey="index0"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,

              onChange: onSelectChange
            }"
            :scroll="{ y: 255, x: 1600 }"
            :customRow="rowClick"
          >
            <a slot="name" slot-scope="text">{{ text }}</a>
            <template slot="operation" slot-scope="text, record">
              <span>
                <a-button
                  type="link"
                  class="common-operation"
                  @click="onEdit(record)"
                  >编辑</a-button
                >
              </span>
              <span>
                <a-popconfirm
                  class="common-operation common-operation-del"
                  title="确认删除吗?"
                  @confirm="() => onDel(record)"
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
import getColumn from "@/utils/getColumns.js";
import getTime from "@/utils/getTime.js";
// console.log(getColumn)
const list = [
  "采集时间",
  "DCDC输出功率",
  "故障等级",
  "开机信号",
  "钥匙信号",
  "FCU故障码",
  "数字量状态",
  "DCDC使能反馈",
  "DCDC故障码",
  "整车功率需求",
  "空气流量",
  "分水阀温度",
  "DCDC生命值",
  "空气机生命值",
  "水入温度",
  "水出温度",
  "环境温度"
];
const columns = getColumn.getColumns(list);
const data = getColumn.getData(list);
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
            let num = this.selectedRowKeys.indexOf(record.index0);
            if (num > -1) {
              this.selectedRowKeys.splice(num, 1);
            } else {
              this.selectedRowKeys.push(record.index0);
            }
          }
        }
      }),
      table: {
        form: [],
        total:100
      },
      pageConfig: {
        num: 1,
        size: 10
      },
      where: {
        name: ""
      },
      data,
      columns,
      fleetList:[],
      selectedRowKeys: [],
      where: {},
      //开始时间  结束时间
      startValue: null,
      endValue: null,
      endOpen: false
    };
  },
  created() {
    // this.getList();
    this.getDicFleet()
  },
  methods: {
    async getList(num = null, size = null) {
      console.log(this.where)
      return
      if (num != null) {
        this.pageConfig.num = num;
      }
      if (size != null) {
        this.pageConfig.size = size;
      }
      let params = {
        mobile: this.where.mobile ?? "",
        createTimeFrom: this.where.createTimeFrom ?? "",
        createTimeTo: this.where.createTimeTo ?? "",
        pageNum: this.pageConfig.num,
        pageSize: this.pageConfig.size
      };
      const data = await this.$api.querydata.getQueryDataList(params);
      this.table.form = data.data.data.rows;
      this.table.total = parseInt(data.data.data.total);
    },
    async getDicFleet() {
      const data = await this.$api.configuration.getDicFleet();
      this.fleetList = data.data;
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
    //时间组件
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
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    resetForm() {
      this.endValue = null;
      this.startValue = null;
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.common-box {
  height: 100% !important;
}
.content-table {
  height: 89.1% !important;
}
.myselect {
  width: 150px; 
  min-width:120px;/*no*/
}
.ant-calendar-picker{
  min-width:120px!important;/*no*/
}
</style>
