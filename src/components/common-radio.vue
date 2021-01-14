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
    space: {
      type: Boolean,
      default: true,
    },
    Count: {
      type: Number,
      default: 10,
    },
    // height: {
    //   //图表高度
    //   type: Number,
    //   default:500
    // }
  },
  data() {
    return {
      chart: null,

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
        forceFit: true,
        // width: "100%", // 指定图表宽度
        height: this.height, // 指定图表高度
      });
      this.chart.data(this.data);
      //配置间距

      this.chart.tooltip({
        showMarkers: true,
      });
      if (this.data.length > 0) {
        if (this.space) {
          this.chart.coordinate("theta", {
            radius: 0.75,
            innerRadius: 0.5,
          });
          //辅助文本
          this.chart.annotation().text({
            position: ["50%", "50%"],
            content: this.y[0].config.name,
            style: {
              fontSize: 14,
              fill: "#4B535E",
              textAlign: "center",
            },
            // offsetY: -20,
          });
          // .text({
          //   position: ["50%", "50%"],
          //   content: this.Count,
          //   style: {
          //     fontSize: 24,
          //     fill: "#000000",
          //     textAlign: "center",
          //   },
          //   offsetX: -10,
          //   offsetY: 20,
          // })
          // .text({
          //   position: ["50%", "50%"],
          //   content: "条",
          //   style: {
          //     fontSize: 14,
          //     fill: "#8c8c8c",
          //     textAlign: "center",
          //   },
          //   offsetY: 20,
          //   offsetX: 20,
          // });
        } else {
          this.chart.coordinate("theta", {
            radius: 0.75,
          });
        }
      }
      this.chart.scale(this.y[0].name, {
        formatter: (val) => {
          val = (val * this.Count).toFixed(0) + " 条";
          return val;
        },
      });
      if (this.x.legend != undefined && this.x.legend) {
        this.chart.legend(false);
      }
      // console.log(this.y);
      // Step 3: 创建图形语法，绘制折线图
      this.chart
        .interval()
        .adjust("stack")
        .position("duration")
        .color("date", [
          "#7BA5FB",
          "#7BE0B7",
          "#4080F4",
          "#7C8CA7",
          "#E23B48",
          "#E3B936",
        ])
        .style({ opacity: 0.4 })
        .state({
          active: {
            style: (element) => {
              const shape = element.shape;
              return {
                matrix: Util.zoom(shape, 1.1),
              };
            },
          },
        })
        .label(this.x.name, (val) => {
          // const opacity = val === '四线及以下' ? 1 : 0.5;
          return {
            layout: { type: "pie-spider" },
            labelHeight: 20,
            labelLine: {
              style: {
                lineWidth: 0.5,
              },
            },
            content: (obj) => {
              if (obj.duration == 0) {
                return null;
              }

              return obj.date + " : " + (obj.duration * 100).toFixed(2) + "%";
            },
          };
        });
      //   this.chart.legend(this.x.name, {
      //   position: 'right',
      // });
      // Step 4: 渲染图表
      this.chart.interaction("element-single-selected");

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
  padding-bottom: 20px;
}
</style>
