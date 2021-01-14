<template>
  <div :id="id" class="mychart"></div>
</template>

<script>
import { Chart, Util } from "@antv/g2";

export default {
  props: {
    x: {
      //横坐标
      type: Object,
    },
    y: {
      //纵坐标
      type: Array,
    },
    data: {
      //数据源
      type: Array,
    },
    changeXy: {
      //图表高度
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      chart: null,
      height: 500,
      id: Math.random()
        .toString(36)
        .substr(2),
    };
  },
  mounted() {
    this.g2pie();
    window.onresize = () => {
      this.height =
        document.getElementsByClassName("mychart").clientHeight - 20;
    };
  },
  methods: {
    g2pie() {
      if (this.chart) {
        // 如果存在的话就删除图表再重新生成
        this.chart.destroy();
        this.chart = null;
      }
      this.chart = new Chart({
        container: this.id, // 指定图表容器 ID
        autoFit: true,
        // width: "100%", // 指定图表宽度
        height: this.height, // 指定图表高度
      });
      this.chart.data(this.data);

      //配置x轴
      // console.log(this.x);
      if (this.x.show && this.x) {
        this.chart.axis(this.x.name, {
          label: {
            style: {
              fill: this.x.color,
              fontSize: this.x.size,
            },
          },
        });
      }
      this.y.forEach((e) => {
        if (e.show) {
          this.chart.axis(e.name, {
            label: {
              style: {
                fill: this.x.color,
                fontSize: e.size,
              },
            },
          });
        } else {
          // console.log(e.name);
          this.chart.axis(e.name, false);
        }
      });

      //提示信息
      this.chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });
      //存储X轴信息
      let xArr = new Array();
      // Step 3: 创建图形语法，绘制折线图
      // console.log(1)
      this.y.forEach((item) => {
        // 设置y轴信息
        this.chart.scale(item.name, {
          min: 0,
          max: this.x.max,
          // tickCount:item.tickCount,
          nice: item.nice,
          // alias: item.config.name + item.config.text,
        });
        //设置x轴方块//设置图形下指示
        xArr.push({
          name: item.config.name,
          value: item.config.name,
          marker: { symbol: item.config.symbol, style: item.config.style },
        });
        // console.log(item.config)
        // console.log(xArr)
        this.chart.legend({
          // position:'right-top',
          position:'bottom',
          custom: true,
          items: xArr,
          itemName:{
            style:{
              fill:this.x.color
            }
          }
          // width:300,
          // itemWrap:true
        });
        let xy = this.x.name + "*" + item.name;
        let yx = item.name + "*" + this.x.name;
        if (this.changeXy) {
          this.chart.coordinate("rect").transpose();
        }
      
        if (this.x.chartType == "line") {
          this.chart
            .line()
            .position(xy)
            .adjust("stack")
            .color(item.color)
            .tooltip(xy, (date, duration) => {
              return {
                name: item.config.name,
                value: duration + item.config.text,
              };
            })
            .size(2);
        } else if (this.x.chartType == "bar") {
          this.chart
            .interval()
            .position(xy)
            .color(item.color)
            .tooltip(xy, (date, duration) => {
              return {
                name: item.config.name,
                value: duration + item.config.text,
              };
            })
            .size(item.size);
        }
      });
      // Step 4: 渲染图表
      this.chart.render();
      const e = document.createEvent("Event");
      e.initEvent("resize", true, true);
      window.dispatchEvent(e);
    },
  },
  watch: {
    data: {
      deep: true,
      handler(newVal, oldVal) {
        this.g2pie();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.mychart {
  /* padding:0 24px 30px; */
  height: 100%;
  margin: 0 20px;
  padding: 16px 8px;
}
</style>
