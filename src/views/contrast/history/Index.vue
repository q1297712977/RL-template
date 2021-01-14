<template>
  <div class="common-box  common-info">
    <!-- 面包屑 -->
    <a-row type="flex" justify="start" class="content-box">
      <a-col class="content-right">
        <a-row type="flex" justify="space-between" class="content-tool">
          <a-col :span="8">
            <!-- <a-button icon="setting" type="primary" @click="modal.isSetting=true">
              选择参数
            </a-button> -->
          </a-col>

          <a-col :span="16">
            <a-row type="flex" justify="end" class="tool-where">
             <a-col  >
            <a-range-picker
              :disabled-date="disabledDate"
              :show-time="{
                hideDisabledOptions: true,
                defaultValue: [
                  moment('00:00:00', 'HH:mm:ss'),
                  moment('11:59:59', 'HH:mm:ss'),
                ],
              }"
              format="YYYY-MM-DD HH:mm:ss"
              dropdownClassName="historyPicker"
            />
          </a-col>
              <a-col>
            <!-- <a-select
              show-search
              placeholder="请选择车辆"
              option-filter-prop="children"
              :filter-option="filterOption"
              @change="handleChange"
              class="myselect"
            >
              <a-select-option value="jack"> 测试车辆1 </a-select-option>
              <a-select-option value="lucy"> 测试车辆2 </a-select-option>
              <a-select-option value="tom"> 测试车辆3 </a-select-option>
            </a-select> -->
            <a-select
                  mode="tags"
                  style="width: 100%"
                  class="myselect"
                   :maxTagCount="3"
                  placeholder="请选择车辆"
                  @change="handleChangeModel"
                >
                  <a-select-option
                    v-for="i in 25"
                    :key="(i + 9).toString(36) + i"
                  >
                    测试车辆{{ (i + 9).toString(36) + i }}
                  </a-select-option>
                </a-select>
              </a-col>
              <!-- <a-col>
            <a-select
              show-search
              placeholder="请选择车辆"
              option-filter-prop="children"
              :filter-option="filterOption"
              @change="handleChange"
              class="myselect"
            >
              <a-select-option value="jack"> 测试车辆1 </a-select-option>
              <a-select-option value="lucy"> 测试车辆2 </a-select-option>
              <a-select-option value="tom"> 测试车辆3 </a-select-option>
            </a-select>
              </a-col> -->
              <a-col>
                     <a-button icon="setting" class="isChangeClass" type="primary" @click="modal.isSetting=true">
              选择参数
            </a-button>
              </a-col>
              <a-col>
                <a-button type="primary" @click="getList()"
                  >开始对比</a-button
                ></a-col
              >
              <a-col> <a-button @click="resetForm()">重置</a-button> </a-col>
            </a-row>
          </a-col>
        </a-row>
        <div class="content-table">
     <div class="v1-component-echart">
        <a-row type="flex" justify="space-between" :gutter="16">
          <a-col :span="12" v-for="(item,i) in isShowList" :key="i">
                <div class="echart-title">
                  参数{{i+1}}
                </div>
            <myLineChart
              :x="echart.num.x"
              :y="echart.num.y"
              :data="echart.num.data"
            ></myLineChart>
          </a-col>
        </a-row>
      </div>
        </div>
      </a-col>
    </a-row>
    <isSettingModal
      :isShow="modal.isSetting"
      @getChildrenList="getChildList"
      @changeModalStatus="modal.isSetting = false"
    ></isSettingModal>
  </div>
</template>

<script>
// import myPaginate from "@/components/layout/layout-paginate";
import getTime from "@/utils/getTime.js";
import myLineChart from "@/components/common-line";
import isSettingModal from "./modal/IsSetting.vue";


import moment from "moment";

export default {
  components: {
    myLineChart,isSettingModal
  },
  data() {
    return {
      checkList:[],
      isShowList:[],
       modal:{
        isSetting:false
       },
    echart: {
        num: {
          data: [
            { date: "7-1", duration: 16, num: 7 },
            { date: "7-2", duration: 21, num: 4 },
            { date: "7-3", duration: 24, num: 8 },
            { date: "7-4", duration: 15, num: 0 },
            { date: "7-5", duration: 13, num: 5 },
            { date: "7-6", duration: 13, num: 2 },
            { date: "7-7", duration: 17, num: 3 },
          ],
          x: {
            name: "date",
            show: true,
            color: "#333",
            size: 14,
            chartType: "line",
            max: 25,
          },
          y: [
            {
              name: "duration",
              show: true,
              color: "#2C68FF",
              max: 25,
              tickCount: 5,
              nice: true,
              config: {
                name: "测试车辆1",
                symbol: "line",
                size: 2,

                text: "(小时)",
                style: { stroke: "#2C68FF", lineWidth: 16 },
              },
            },
            {
              name: "num",
              show: false, //是否展示Y轴
              color: "#87d068",
              max: 25,
              tickCount: 5,
              config: {
                name: "测试车辆2",
                symbol: "line",
                size: 2,
                text: "(小时)",
                style: { stroke: "#87d068", lineWidth: 16 },
              },
            },
          ],
        },
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    moment,

    async getList() {
       this.isShowList =[...this.checkList]
    },
    //CheckBox多选
    onChange(checkedValues) {
      console.log("checked = ", checkedValues);
      this.checkList = checkedValues;
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
   getChildList(val){
     console.log(val)
     this.checkList = val
   },
    resetForm() {
      this.where.fleetName = "";
      this.getList();
    },
        //限制时间
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf("day");
    },
         handleChangeModel(value) {
      console.log(`selected ${value}`);
    },
  }
};
</script>

<style lang="scss" scoped>
.myselect {
  // width: 140px;
  min-width: 140px; /*no*/
  // height: 32px;
  // line-height: 1.5;
  ::v-deep .ant-select-selection--multiple{
    min-height:32px!important;
    .ant-select-selection__rendered{
      line-height: 30px;
      ul>li{
        height:24px;
        line-height: 22px;
      }

    }
  }
}
::v-deep.ant-calendar-picker{
  width:350px!important;
}
.ant-checkbox-group{
width:100%;
}
.content-table{
 overflow:auto;
.v1-component-echart {
    // min-height: 730px;
    height: auto;
    // height:826px;
    .ant-col {
      // background:skyblue;
      height: 330px;
    }
        .echart-title{
      float:right;
      height:24px;
      line-height:24px;
      padding-right:16px;
    }
  }
}
.isChangeClass{
  background-color:#181B31!important;
  border-color:#181B31!important;
}
</style>
