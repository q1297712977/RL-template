<template>
  <a-layout-content>
    <div class="common-box">
      <a-row type="flex" justify="start" class="common-title" :gutter="16">
        <a-col class="title-text" :span="4">平台总览 (截止到2020-12-17)</a-col>
        <a-col class="title-text"> 车队总数 :2 </a-col>
        <a-col class="title-text"> 车辆总数 : 2 </a-col>
      </a-row>
      <a-row
        type="flex"
        justify="space-between"
        class="common-card"
      >
        <a-col :span="3"
          ><div>
            <a-icon type="file-protect" />
            激活车辆
          </div>
          <div class="count-box-content-num">
            {{ table.vehicleInfo.registerCount }}
          </div></a-col
        >
        <a-col :span="3"
          ><div>
            <a-icon type="file-protect" />
            活跃车辆
          </div>
          <div class="count-box-content-num">
            {{ table.vehicleInfo.activeCount }}
          </div></a-col
        >
        <a-col :span="3"
          ><div>
            <a-icon type="file-protect" />
            在线车辆
          </div>
          <div class="count-box-content-num">
            {{ table.vehicleInfo.onlineCount }}
          </div></a-col
        >
        <a-col :span="3"
          ><div>
            <a-icon type="file-protect" />
            离线车辆
          </div>
          <div class="count-box-content-num">
            {{ table.vehicleInfo.offlineCount }}
          </div></a-col
        >
        <a-col :span="3"
          ><div>
            <a-icon type="file-protect" />
            日均在线率
          </div>
          <div class="count-box-content-num">
            {{ table.vehicleInfo.avgOnlineRate }}
          </div></a-col
        >
        <a-col :span="3"
          ><div>
            <a-icon type="file-protect" />
            日均在线时长
          </div>
          <div class="count-box-content-num">
            {{ table.vehicleInfo.avgOnlineTime }}
          </div></a-col
        >
        <a-col :span="3"
          ><div>
            <a-icon type="file-protect" />
            报警车辆
          </div>
          <div class="count-box-content-num">
            {{ table.vehicleInfo.alarmCount }}
          </div></a-col
        >
      </a-row>
          <div class="echart-box">
      <a-row type="flex" justify="space-between">
        <a-col :span="5">
          <a-row type="flex" justify="center" class="echart-box-title">
            <a-col class="echart-title-left">
              <div>当日运行时长</div>
              <div class="echart-title-time">{{table.info.runTime}}</div>
            </a-col>
            <a-col>
              <div>总运行时长</div>
              <div class="echart-title-time">{{table.info.totalRunTime}}</div>
            </a-col>
          </a-row>
          <div class="echart-line-box">
            <lineChart
              :x="echart.work.x"
              :y="echart.work.y"
              :data="echart.work.data"
              :height="echart.work.height"
            ></lineChart>
          </div>
        </a-col>
        <a-col :span="5">
          <a-row type="flex" justify="center" class="echart-box-title">
            <a-col class="echart-title-left">
              <div>当日里程</div>
              <div class="echart-title-time">{{table.info.mileage}}</div>
            </a-col>
            <a-col>
              <div>总里程</div>
              <div class="echart-title-time">{{table.info.totalMileage}}</div>
            </a-col>
          </a-row>
          <div class="echart-line-box">
            <lineChart
              :x="echart.work1.x"
              :y="echart.work1.y"
              :data="echart.work1.data"
              :height="echart.work1.height"
            ></lineChart>
          </div>
        </a-col>
        <a-col :span="5">
          <a-row type="flex" justify="center" class="echart-box-title">
            <a-col class="echart-title-left">
              <div>当日氢耗</div>
              <div class="echart-title-time">{{table.info.hydrogenConsumption}}</div>
            </a-col>
            <a-col>
              <div>总氢耗</div>
              <div class="echart-title-time">{{table.info.totalHydrogenConsumption}}</div>
            </a-col>
          </a-row>
          <div class="echart-line-box">
            <lineChart
              :x="echart.work2.x"
              :y="echart.work2.y"
              :data="echart.work2.data"
              :height="echart.work2.height"
            ></lineChart>
          </div>
        </a-col>
        <a-col :span="5">
          <a-row type="flex" justify="center" class="echart-box-title">
            <a-col class="echart-title-left">
              <div>当日减碳排放</div>
              <div class="echart-title-time">{{table.info.carbonReduction}}</div>
            </a-col>
            <a-col>
              <div>总减碳排行</div>
              <div class="echart-title-time">{{table.info.totalCarbonReduction}}</div>
            </a-col>
          </a-row>
          <div class="echart-line-box">
            <lineChart
              :x="echart.work3.x"
              :y="echart.work3.y"
              :data="echart.work3.data"
              :height="echart.work3.height"
            ></lineChart>
          </div>
        </a-col>
      </a-row>
    </div>
    </div>
  </a-layout-content>
</template>


<script>
import lineChart from "@/components/common-line-v1";
import getTime from "@/utils/getTime.js";
export default {
  components: {
    lineChart,
  },
  data() {
    return {
      rowClassName: (record, index) => {
        let className = "dark-row";
        if (index % 2 === 1) className = "light-row";
        // console.log(className);
        return className;
      },

      echart: {
        work: {
          height: 184,
          data: [
            { date: "7-1", duration: 16 },
            { date: "7-2", duration: 21 },
            { date: "7-3", duration: 24 },
            { date: "7-4", duration: 15 },
            { date: "7-5", duration: 13 },
            { date: "7-6", duration: 13 },
            { date: "7-7", duration: 17 },
          ],
          x: {
            name: "date",
            show: true,
            color: "#61b78e",
            size: 14,
            // max: 25
          },
          y: {
            name: "duration",
            show: true,
            color: "#61b78e",
            size: 14,
            // max: 24,
            // tickCount: 9, //最大数量
            nice: true,
            config: {
              name: "工作时长",
              chartType: "line",
              symbol: "line",
              text: "(小时)",
              style: { stroke: "#2C68FF", lineWidth: 16 },
            },
          },
        },
        work1: {
          height: 184,
          data: [
            { date: "7-1", duration: 16 },
            { date: "7-2", duration: 21 },
            { date: "7-3", duration: 24 },
            { date: "7-4", duration: 15 },
            { date: "7-5", duration: 13 },
            { date: "7-6", duration: 13 },
            { date: "7-7", duration: 17 },
          ],
          x: {
            name: "date",
            show: true,
            color: "#396BA8",
            size: 14,
            // max: 25
          },
          y: {
            name: "duration",
            show: true,
            color: "#396BA8",
            size: 14,
            // max: 24,
            // tickCount: 9, //最大数量
            nice: true,
            config: {
              name: "工作时长",
              chartType: "line",
              symbol: "line",
              text: "(小时)",
              style: { stroke: "#2C68FF", lineWidth: 16 },
            },
          },
        },
        work2: {
          height: 184,
          data: [
            { date: "7-1", duration: 16 },
            { date: "7-2", duration: 21 },
            { date: "7-3", duration: 24 },
            { date: "7-4", duration: 15 },
            { date: "7-5", duration: 13 },
            { date: "7-6", duration: 13 },
            { date: "7-7", duration: 17 },
          ],
          x: {
            name: "date",
            show: true,
            color: "#1D8EC3",
            size: 14,
            // max: 25
          },
          y: {
            name: "duration",
            show: true,
            color: "#1D8EC3",
            size: 14,
            // max: 24,
            // tickCount: 9, //最大数量
            nice: true,
            config: {
              name: "工作时长",
              chartType: "line",
              symbol: "line",
              text: "(小时)",
              style: { stroke: "#2C68FF", lineWidth: 16 },
            },
          },
        },
        work3: {
          height: 184,
          data: [
            { date: "7-1", duration: 16 },
            { date: "7-2", duration: 21 },
            { date: "7-3", duration: 24 },
            { date: "7-4", duration: 15 },
            { date: "7-5", duration: 13 },
            { date: "7-6", duration: 13 },
            { date: "7-7", duration: 17 },
          ],
          x: {
            name: "date",
            show: true,
            color: "#AD443B",
            size: 14,
            // max: 25
          },
          y: {
            name: "duration",
            show: true,
            color: "#AD443B",
            size: 14,
            // max: 24,
            // tickCount: 9, //最大数量
            nice: true,
            config: {
              name: "工作时长",
              chartType: "line",
              symbol: "line",
              text: "(小时)",
              style: { stroke: "#2C68FF", lineWidth: 16 },
            },
          },
        },
      },
      table: {
        info: [],
        vehicleInfo: [],
      },
    };
  },
  computed: {
    count() {
      return (
        parseInt(this.table.vehicleInfo.offlineCount) +
        parseInt(this.table.vehicleInfo.onlineCount)
      );
    },
  },
  created() {
    this.getAllInfo();
    this.getAllVehicleInfo();
    this.today = getTime.getToday();
  },
  methods: {
    async getAllInfo() {
      const data = await this.$api.home.getAllInfo();
      if (data.code == 0) {
        this.table.info = data.data;
      } else {
        this.$message.error(data.message);
      }
    },
    async getAllVehicleInfo() {
      const data = await this.$api.home.getAllVehicleInfo();
      if (data.code == 0) {
        this.table.vehicleInfo = data.data;
      } else {
        this.$message.error(data.message);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.common-box {
  height:100%!important;
  .common-card {
      height:160px;
      margin: 24px 0;
      padding:0 16px;
      padding-bottom: 24px;
      border-bottom: 1px solid #D4D8E1;
      .ant-col{
          border:1px solid skyblue;
          padding: 32px 16px;
          text-align: center;
          font-size: 18px;
          .count-box-content-num{
              margin-top:8px;
              font-size: 24px;
              color:#181B31;
          }
      }
  }
.echart-box {
 padding:0 16px;
  height: 240px;
  // background:skyblue;
  .ant-col {
    background: #263139;
    height: 240px;
    // padding: 0 4px;
    color: #fff;
  }
  .echart-box-title {
    padding-top: 8px;
    .ant-col {
      padding-left: 16px;
    }
    .echart-title-left {
      height: 48px;
      padding-left: 0;
      padding-right: 16px;
      text-align: right;
      line-height: 48px;
      border-right: 1px solid #999;
    }
    div {
      height: 24px;
      line-height: 24px;
      font-size: 16px;
    }
    .echart-title-time {
      color: #999;
    }
  }
  .echart-line-box {
    margin-top: 24px;
    height: 160px;
  }
}
}
</style>