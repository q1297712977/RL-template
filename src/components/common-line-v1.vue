<template>
  <div :id="id" class="mychart" ref="mychart"></div>
</template>

<script>
import { Chart, Util, registerTheme } from "@antv/g2";
export default {
  props: {
    x: {
      //横坐标
      type: Object,
    },
    y: {
      //纵坐标
      type: Object,
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
      height: 200,
      id: Math.random().toString(36).substr(2),
      data1: [
        { year: "1991", value: 15468 },
        { year: "1992", value: 16100 },
        { year: "1993", value: 15900 },
        { year: "1994", value: 17409 },
        { year: "1995", value: 17000 },
        { year: "1996", value: 31056 },
        { year: "1997", value: 31982 },
        { year: "1998", value: 32040 },
        { year: "1999", value: 33233 },
      ],
    };
  },
  mounted() {
    this.g2pie();
  },

  methods: {
    g2pie() {
      if (this.chart) {
        // 如果存在的话就删除图表再重新生成
        this.chart.destroy();
        this.chart = null;
      }
      this.chart = new Chart({
        container: this.id,
        autoFit: true,
        height: this.height,
        theme: {
          background: "#263139",
        },
      });
      // console.log(this.height);
      this.chart.data(this.data);
       this.chart.axis(false); // 不展示坐标轴
      // console.log(this.data);
      this.chart.scale('duration', {
        min: 0,
        max: 50,
        nice: true,
      });
      this.chart.scale("date", {
        range: [0, 1],
      }); //两侧不留白
      let xy = this.x.name+'*'+this.y.name
      this.chart.area().position(xy).color(this.x.color);
      this.chart.line().position(xy)  .tooltip(xy, (date, duration) => {
              return {
                name: date,
                value: duration+this.y.config.text 
              };
            }) .color(this.y.color);
      //      

      this.chart.render(true);
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
  /* margin-top:20px; */
  /* height: 160px !important; */
  background: #333;
  height: 100%;

  width: 100%;
  padding-bottom: 0px !important;
  /* padding-top: 8px; */
}
</style>
