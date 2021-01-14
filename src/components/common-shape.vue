<template>
  <div :id="id" class="mychart"></div>
</template>

<script>
import { Chart, registerShape } from "@antv/g2";
const color = ["#0086FA", "#FFBF00", "#F5222D"];
export default {
  props: {},
  data() {
    return {
      chart: null,
      height: 500,
      id: Math.random()
        .toString(36)
        .substr(2),

      data: [{ value: 56 }],
      num: {
        value: 0
      }
    };
  },
  created() {
    this.creatLine();
  },
  mounted() {
    this.g2pie();
    window.onresize = () => {
      this.height =
        document.getElementsByClassName("mychart").clientHeight - 20;
    };
  },
  methods: {
    creatLine() {
      registerShape("point", "pointer", {
        draw(cfg, container) {
          const group = container.addGroup();
          const center = this.parsePoint({ x: 0, y: 0 }); // 获取极坐标系下画布中心点
          // 绘制指针
          group.addShape("line", {
            attrs: {
              x1: center.x,
              y1: center.y,
              x2: cfg.x,
              y2: cfg.y,
              stroke: cfg.color,
              lineWidth: 5,
              lineCap: "round"
            }
          });
          group.addShape("circle", {
            attrs: {
              x: center.x,
              y: center.y,
              r: 9.75,
              stroke: cfg.color,
              lineWidth: 4.5,
              fill: "#fff"
            }
          });

          return group;
        }
      });
    },
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
        height: this.height // 指定图表高度
      });
      this.chart.data(this.data);
      this.chart.scale("value", {
        min: 0,
        max: 300,
        tickInterval: 30
      });
      this.chart.coordinate("polar", {
        startAngle: (-9 / 8) * Math.PI,
        endAngle: (1 / 8) * Math.PI,
        radius: 0.9
      });
      this.chart.axis("1", false);
      this.chart.axis("value", {
        line: null,
        label: {
        //   offset: -36,
          style: {
              fill: "#fff",
            // fontSize: 18,
            // textAlign: "center",
            // textBaseline: "middle"
          }
        },
        subTickLine: {
          count: 4,
          length: -15
        },
        tickLine: {
          length: -24
        },
        grid: null
      });
      this.chart.legend(false);
      this.chart
        .point()
        .position("value*1")
        .shape("pointer")
        .color("#2E4A78")
        .animate({
          appear: {
            animation: "fade-in"
          }
        });

    //   // 绘制仪表盘背景
      this.chart.annotation().arc({
        top: false,
        start: [0, 1],
        end: [300, 1],
        style: {
          // 底灰色
          stroke: "#1890FF",
          lineWidth: 12,
          lineDash: null
        }
      });

      // 绘制指标
      this.chart.annotation().arc({
        start: [0, 1],
        end: [this.data[0].value, 1],
        style: {
          stroke: "#CBCBCB",
          lineWidth: 12,
          lineDash: null
        }
      });
    //   // 绘制指标数字
      this.chart.annotation().text({
        position: ["50%", "85%"],
        content: "km/h",
        style: {
          fontSize: 20,
          fill: "#fff",
          textAlign: "center"
        },
        offsetY: -60

      });
      this.chart.annotation().text({
        position: ["50%", "90%"],
        content: `${this.data[0].value } km/h`,
        style: {
          fontSize: 16,
          fill: "#FFF",
          textAlign: "center"
        },
        // offsetY: 15
      });
          // Step 4: 渲染图表
      this.chart.render();
      const e = document.createEvent("Event");
      e.initEvent("resize", true, true);
      window.dispatchEvent(e);
    }
  },
  watch: {
    data: {
      deep: true,
      handler(newVal, oldVal) {
        this.g2pie();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.mychart {
  /* padding:0 24px 30px; */
  height: 100%;
  margin: 0 20px;
  padding: 20px 8px;
}
</style>
