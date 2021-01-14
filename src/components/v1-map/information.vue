<template>
  <div class="common-box  common-info">
    <a-row type="flex" justify="start" class="content-box">
      <a-col class="content-right">
        <a-row type="flex" justify="space-between" class="content-tool">
          <a-col :span="12">
            <a-row type="flex" justify="start" :gutter="16">
              <a-col>
                采集时间 : 2020年12月24日13:53:17
              </a-col>
              <a-col>
                更新时间 : 2020年12月24日13:53:41
              </a-col>
              <a-col>
                车辆状态 : 在线
              </a-col>
            </a-row>
          </a-col>
          <a-col>
            <a-row type="flex" justify="start" class="tool-where">
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
                <a-button type="primary" @click="getList()"
                  >查询</a-button
                ></a-col
              >
            </a-row>
          </a-col>
        </a-row>
        <div class="content-table">
          <div class="information-box">
            <div :style="backgroundImg" class="information-text">
              <a-row type="flex" justify="start" class="information-row">
                <a-col :span="14">
                  <a-row type="flex" justify="space-between" class="text_1">
                    <a-col class="text_1_left">分水阀温度:6513℃</a-col>
                    <a-col class="text_1_right">电堆温度:6513℃</a-col>
                  </a-row>
                  <a-row type="flex" justify="start" class="text_2">
                    <a-col>流量:321m3/h</a-col>
                  </a-row>
                  <a-row type="flex" justify="end" class="text_3">
                    <a-col>温度:321℃</a-col>
                  </a-row>
                  <a-row type="flex" justify="space-between" class="text_4">
                    <a-col :span="24">电机温度:321m3/h</a-col>
                    <a-col :span="24">控制器温度:321m3/h</a-col>
                    <a-col :span="24">转速:3213rpm</a-col>
                  </a-row>
                  <a-row type="flex" justify="end" class="text_5">
                    <a-col>温度:21312℃</a-col>
                  </a-row>
                  <a-row type="flex" justify="end" class="text_6">
                    <a-col>电压:51V</a-col>
                  </a-row>
                  <a-row type="flex" justify="start" class="text_7">
                    <a-col>电压:51V</a-col>
                  </a-row>
                  <a-row type="flex" justify="start" class="text_8">
                    <a-col :span="24">电流:123.A</a-col>
                  </a-row>
                  <a-row type="flex" justify="start" class="text_9">
                    <a-col :span="24">状态:123</a-col>
                  </a-row>
                  <a-row type="flex" justify="end" class="text_10">
                    <a-col>温度:21312℃</a-col>
                  </a-row>
                  <a-row type="flex" justify="end" class="text_11">
                    <a-col>转速:13123Rpm</a-col>
                  </a-row>
                  <a-row type="flex" justify="start" class="text_12">
                    <a-col :span="24">压力:5231.kpa</a-col>
                  </a-row>
                </a-col>
                <a-col :span="10">
                  <a-row type="flex" justify="start" class="text_13">
                    <a-col :span="24">电压:661231V</a-col>
                  </a-row>
                  <a-row type="flex" justify="start" class="text_14">
                    <a-col :span="24">电流:123.A</a-col>
                  </a-row>
                  <a-row type="flex" justify="start" class="text_15">
                    <a-col :span="24">压力:12123kpa</a-col>
                  </a-row>
                </a-col>
              </a-row>
              <!-- 图片 -->
            </div>
          </div>
          <a-row class="information-status" type="flex" justify="space-between">
            <a-col class="information-status-left">
              <a-row type="flex" justify="start" :gutter="8" class="left-box">
                <a-col :span="9" class="left-echart-box">
                  <myShape></myShape>
                </a-col>
                <a-col :span="15" class="left-text-box">
                  <a-row type="flex" justify="start" :gutter="8">
                    <a-col :span="4">实时速度</a-col>
                    <a-col :span="4">总里程(ODO)</a-col>
                    <a-col :span="4">当日里程(Trip)</a-col>
                  </a-row>
                  <a-row
                    type="flex"
                    justify="start"
                    :gutter="8"
                    class="left-text"
                  >
                    <a-col :span="4">0km/h</a-col>
                    <a-col :span="4">213213km</a-col>
                    <a-col :span="4">3213km</a-col>
                  </a-row>
                </a-col>
              </a-row>
            </a-col>
            <a-col class="information-status-right">
              <myLineChart
                :x="echart.num.x"
                :y="echart.num.y"
                :data="echart.num.data"
              ></myLineChart>
            </a-col>
          </a-row>

          <div class="info-title">实时协议信息</div>
          <div class="information-info-box">
            <div class="info-box-title">DCDC</div>
            <a-row type="flex" justify="start" class="info-text-box">
              <a-col :span="6">
                DCDC输出功率 :0W
              </a-col>
              <a-col :span="6">
                DCDC使能反馈 :0W
              </a-col>
              <a-col :span="6">
                DCDC故障码 :0W
              </a-col>
              <a-col :span="6">
                DCDC生命值 :0W
              </a-col>
            </a-row>
            <div class="info-box-title">参数信息</div>
            <a-row type="flex" justify="start" class="info-text-box">
              <a-col :span="6">
                环境温度 :35.7摄氏度
              </a-col>
              <a-col :span="6">
                里程B : 10142KM
              </a-col>
              <a-col :span="6">
                总氢耗B : 433.4KG
              </a-col>
              <a-col :span="6">
                整车功率需求: 0W
              </a-col>
              <a-col :span="6">
                故障等级: 0
              </a-col>
              <a-col :span="6">
                车速: 36.0KM/h
              </a-col>
              <a-col :span="6">
                钥匙信息: 0
              </a-col>
              <a-col :span="6">
                总减碳排放B: 18240.4KG
              </a-col>
              <a-col :span="6">
                开机信号: 0
              </a-col>
            </a-row>
            <div class="info-box-title">FCU信息</div>
            <a-row type="flex" justify="start" class="info-text-box">
              <a-col :span="6">
                氢气入堆压力 :0.2kpa
              </a-col>
              <a-col :span="6">
                电堆功率 :0.2kpa
              </a-col>
              <a-col :span="6">
                氢气高压压力 :0.2kpa
              </a-col>
              <a-col :span="6">
                电堆电压 :0.2kpa
              </a-col>
              <a-col :span="6">
                系统状态码 :0.2kpa
              </a-col>
              <a-col :span="6">
                剩余氢气量 :0.2kpa
              </a-col>
              <a-col :span="6">
                FCU故障码 :0.2kpa
              </a-col>
              <a-col :span="6">
                散热风扇舍得温度 :0.2kpa
              </a-col>
              <a-col :span="6">
                临时氢耗 :0.2kpa
              </a-col>
              <a-col :span="6">
                电堆温度 :0.2kpa
              </a-col>
              <a-col :span="6">
                电压电流传感器温度 :0.2kpa
              </a-col>
              <a-col :span="6">
                单次氢气量 :0.2kpa
              </a-col>
              <a-col :span="6">
                电堆电流 :0.2kpa
              </a-col>
            </a-row>
               <div class="info-box-title">其他</div>
            <a-row type="flex" justify="start" class="info-text-box">
              <a-col :span="6">
                数字量状态 : 0
              </a-col>
              <a-col :span="6">
                SOC : 0
              </a-col>
              <a-col :span="6">
                总氢耗 : 0
              </a-col>
              <a-col :span="6">
                总减碳排放 : 0
              </a-col>
              <a-col :span="6">
                里程 : 0
              </a-col>
            </a-row>
            <div class="info-box-title">空压机信息</div>
            <a-row type="flex" justify="start" class="info-text-box">
              <a-col :span="6">
                空压机转速舍得 :12112rpm
              </a-col>
              <a-col :span="6">
                空入压力 : 80.1kpa
              </a-col>
              <a-col :span="6">
                空压机使能 : 10
              </a-col>
              <a-col :span="6">
                空压机转速 : 123123rpm
              </a-col>
              <a-col :span="6">
                空气流量 : 110m³/h
              </a-col>
              <a-col :span="6">
                空压机控制器温度 : 42℃
              </a-col>
              <a-col :span="6">
                空压机生命值 : 192
              </a-col>
              <a-col :span="6">
                空压机电机温度 : 55℃
              </a-col>
            </a-row>
            <div class="info-box-title">水流信息</div>
            <a-row type="flex" justify="start" class="info-text-box">
              <a-col :span="6">
                水入温度 :12112℃
              </a-col>
              <a-col :span="6">
                水出温度 : 54℃
              </a-col>
              <a-col :span="6">
               分水阀温度:59.9℃
              </a-col>
              <a-col :span="6">
               水入压力:64.6kpa
              </a-col>
            </a-row>
            <div class="info-box-title">氢回流泵信息</div>
            <a-row type="flex" justify="start" class="info-text-box">
              <a-col :span="6">
                氢回流泵电压:27.6V
              </a-col>
              <a-col :span="6">
              氢回流泵电压:27.6V
              </a-col>
              <a-col :span="6">
               氢回流泵转速反馈:3480rpm
              </a-col>
              <a-col :span="6">
               氢回流泵电流:3.5A
              </a-col>
              <a-col :span="6">
               氢回流泵状态:5
              </a-col>
            </a-row>
            <div class="info-box-title">水泵信息</div>
            <a-row type="flex" justify="start" class="info-text-box">
              <a-col :span="6">
                水泵转速反馈:3498Rpm
              </a-col>
              <a-col :span="6">
              水泵转速设定:7000Rpm
              </a-col>
            </a-row>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import myShape from "@/components/common-shape";
import myLineChart from "@/components/common-line";
export default {
  components: {
    myShape,
    myLineChart
  },
  data() {
    return {
      backgroundImg: {
        backgroundImage: "url(" + require("@/assets/img/dianjimain.png") + ")",

        backgroundRepeat: "no-repeat",

        backgroundSize: "100% 100%"
      },
      echart: {
        num: {
          data: [
            { date: "7-1", duration: 16 },
            { date: "7-2", duration: 21 },
            { date: "7-3", duration: 24 },
            { date: "7-4", duration: 15 },
            { date: "7-5", duration: 13 },
            { date: "7-6", duration: 13 },
            { date: "7-7", duration: 17 }
          ],
          x: {
            name: "date",
            show: true,
            color: "#FFF",
            size: 14,
            chartType: "bar",
            max: 25
          },
          y: [
            {
              name: "duration",
              show: true,
              color: "#00C3B3",
              max: 25,
              tickCount: 5,
              nice: true,
              size: 14,
              config: {
                name: "当前速度",
                symbol: "line",
                size: 2,
                text: "(km/h)",
                style: { stroke: "#FFF", lineWidth: 16 }
              }
            }
          ]
        }
      }
    };
  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/common-color.scss";
.common-box {
  height: 100% !important;
  .content-right {
    width: 100% !important;
  }
  .content-box {
    height: 100%;
    .content-tool {
      height: 56px;
      background-color: $bg-fff;
      padding: 0 32px;
      // border:1px solid $bg-line;
      line-height: 56px;
      .tool-where {
        .ant-col {
          margin-left: 16px;
        }
      }
    }
  }
  .myselect {
    width: 140px; /*no*/
  }
  .content-table {
    background: $bg-color !important;
    height: 89.2% ;
    overflow: auto;
    overflow-x: hidden;
    .information-box {
      position: relative;
      height: 100%;
      width: 100%;
      padding: 0 10%;
      .information-text {
        height: 100%;
        z-index: 999;
        .ant-col {
          color: #fed800;
          font-size: 14px;
        }
        .information-row {
          height: 100%;
        }
        .text_1 {
          position: absolute;
          top: 20%;
          .text_1_left {
            padding-left: 15%;
          }
          .text_1_right {
            padding-right: 18%;
          }
        }
        .text_2 {
          position: absolute;
          top: 32%;
          left: 4%;
        }
        .text_3 {
          position: absolute;
          top: 34%;
          right: 10%;
        }
        .text_4 {
          position: absolute;
          top: 47%;
        }
        .text_5 {
          position: absolute;
          top: 63%;
          right: 8%;
        }
        .text_6 {
          position: absolute;
          top: 66%;
          right: 8%;
          // background:red;
        }
        .text_7 {
          position: absolute;
          top: 67%;
          left: 6%;
        }
        .text_8 {
          position: absolute;
          top: 71%;
          left: 6%;
        }
        .text_9 {
          position: absolute;
          top: 75%;
          left: 6%;
        }
        .text_10 {
          position: absolute;
          top: 83%;
          right: 6%;
        }
        .text_11 {
          position: absolute;
          top: 91%;
          right: 24%;
        }
        .text_12 {
          position: absolute;
          top: 94%;
          left: 37%;
        }
        .text_13 {
          position: absolute;
          top: 89%;
          left: 48%;
        }
        .text_14 {
          position: absolute;
          top: 83%;
          left: 74%;
        }
        .text_15 {
          position: absolute;
          top: 86%;
          left: 74%;
        }
      }
    }
    .information-status {
      padding: 24px 48px;
      .information-status-left,
      .information-status-right {
        border: 1px solid $bg-line;
        width: 47%;
        height: 200px; /*no*/
        .ant-col {
          color: $bg-fff;
        }
      }
      .left-box {
        height: 100%;
        // padding:4px 16px;
        .left-text-box {
          padding-top: 80px; /*no*/
          .ant-col {
            width: 110px; /*no*/
            font-size: 14px;
          }
          .left-text {
            .ant-col {
              color: #fed800;
            }
          }
        }
      }
    }
    .info-title {
      padding: 0 48px;
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      color: #fed800;
    }
    .information-info-box {
      padding: 0 48px 24px;
      .info-box-title {
        text-align: center;
        line-height: 28px;
        background: $bg-black;
        color: $bg-fff;
        border: 1px solid $bg-line;
      }
      .info-text-box {
        background: $bg-font;
        .ant-col {
          color: #fed800;
          text-align: center;
          border: 1px solid $bg-line;
        }
      }
    }
  }
}
</style>
