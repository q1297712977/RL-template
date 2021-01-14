<template>
  <a-modal
    v-model="show"
    title="轨迹回放"
    :footer="null"
    centered
    dialogClass="mapList"
    @cancel="handleCancel"
    @ok="handleOk"
    :destroyOnClose="true"
  >
    <a-row type="flex" justify="start" :gutter="16" class="replay-box">
      <a-col :span="6" class="replay-left">
        <!-- <div class="replay-left-title">车辆回放</div> -->
        <div class="replay-left-where">
          <div class="replay-left-label">车辆名称:</div>
          <div class="replay-left-input">
            <a-input placeholder="请输出车辆名称"
              ><a-icon slot="prefix" type="car"
            /></a-input>
          </div>
          <div class="replay-left-label">开始时间:</div>
          <div class="replay-left-input">
            <a-range-picker
              :show-time="{ format: 'HH:mm' }"
              format="YYYY-MM-DD HH:mm"
              :placeholder="['开始时间', '结束时间']"
              @change="onChange"
              @ok="onOk"
            />
          </div>
          <div class="replay-left-label">出发位置:</div>
          <div class="replay-left-input">
            <a-input :disabled="true">
              <a-icon slot="prefix" type="car"
            /></a-input>
          </div>
          <div class="replay-left-label">终点位置:</div>
          <div class="replay-left-input">
            <a-input :disabled="true">
              <a-icon slot="prefix" type="car"
            /></a-input>
          </div>
        </div>
        <a-row class="replay-left-button" type="flex" justify="center">
          <a-col>
            <a-button type="primary" v-show="isStart" @click="onStart(true)"
              >开始回放</a-button
            >
            <a-button v-show="!isStart" @click="onStart(false)"
              >回放中···</a-button
            >
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="18" class="replay-right">
        <div class="replay-map" :id="id"></div>
        <div class="replay-tootle">
          <a-row type="flex" justify="start"  class="replay-row">
            <a-col>
              <a-button type="link" icon="fast-backward" />
            </a-col>
            <a-col>
              <a-button
                type="link"
                icon="caret-right"
                v-show="!replayData.isPlay"
              />
              <a-button type="link" icon="paulse" v-show="replayData.isPlay" />
            </a-col>
            <a-col>
              <a-button type="link" icon="fast-forward" />
            </a-col>
            <a-col>
              <a-button type="link" icon="minus" />
            </a-col>
            <a-col class="replay-speed-red"> 1 </a-col>
            <a-col>
              <a-button type="link" icon="plus" />
            </a-col>
            <a-col class="replay-speed-green">
              {{ replayData.speed }} km/h
            </a-col>
            <a-col >
              {{ replayData.vin }}
            </a-col>
            <a-col > 开始时间--结束时间 </a-col>
            <a-col > 总行驶距离 100km </a-col>
          </a-row>
          <a-row type="flex" justify="start" :gutter="8">
            <a-col :span="24">
                 <a-slider :default-value="30" @change="onChangeSlider" @afterChange="onAfterChange" v-bind:class="{sliderStyle:navg!=null}" />
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" class="replay-down">
            <a-col>
              <a-button type="link" icon="down" />
            </a-col>
          </a-row>
        </div>
        <div class="replay-list">
             <a-table
              :columns="columns"
              :data-source="data"
              :pagination="false"
              rowKey="index"
              :rowClassName="rowClassName"
              :scroll="{ y: 245 }"
            >
              <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script>
const columns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    align: "center",
    width: 80,
    ellipsis: true,
  },
  {
    title: "时间",
    dataIndex: "index1",
    key: "index1",
    align: "center",
    ellipsis: true,
  },
  {
    title: "经纬度",
    dataIndex: "index2",
    key: "index2",
    align: "center",
    ellipsis: true,
  },
  {
    title: "方向",
    dataIndex: "index3",
    key: "index3",
    align: "center",
    ellipsis: true,
  },
  {
    title: "车速",
    dataIndex: "index4",
    key: "index4",
    align: "center",
    ellipsis: true,
  },
  {
    title: "位置",
    dataIndex: "index5",
    key: "index5",
    align: "center",
    ellipsis: true,
  },
  {
    title: "报警信息",
    dataIndex: "index6",
    key: "index6",
    align: "center",
    ellipsis: true,
  },
];
const data = [];

for (let i = 10; i >0; i--) {
  data.push({
    index:  i,
    index1: "测试车厂" + i,
    index2: "测试车型" + i,
    index3: "测试目的地服务器" + i,
    index4: "测试目的地服务器" + i,
    index5: "测试目的地服务器" + i,
    index6: "测试目的地服务器" + i
  });
}
import remoteLoad from "@/utils/remoteLoad.js";
import { MapKey } from "@/config/config";

import { linePath, marks } from "./index.js";

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    
    return {
            rowClassName: (record, index) => {
        let className = "dark-row";
        if (index % 2 === 1) className = "light-row";
        return className;
      },
      rowClick: (record, index) => ({
        on: {
          click: () => {
            // 点击改行时要做的事情
            // ......
            if (record.index != this.selectedRowKeys) {
              this.selectedRowKeys = [record.index];
            } else {
              this.selectedRowKeys = [];
            }
          },
          mouseenter: event => {
            // console.log(event);
          }
        }
      }),
      columns,data,
      AMapUI: null,
      AMap: null,
      map: null,
      center: [116.42792, 39.902896], //经度+纬度
      search_key: "", //搜索值
      search_list: [], //搜索结果列表
      loading: false,
      noSearchShow: false, //无搜索结果提示，无搜索结果时会显示暂无搜索结果
      layers: [],
      isVisible: false,
      trafficLayer: null,
      zoom: 11,
      marker: null,
      //开始暂停
      isStart: true,
      id: "replayMap",
      //marker 和line的坐标
      markers: [
        [116.478935, 39.997761],
        [116.478939, 39.997825],
        [116.478912, 39.998549],
        [116.478912, 39.998549],
        [116.478998, 39.998555],
        [116.478998, 39.998555],
        [116.479282, 39.99856],
        [116.479658, 39.998528],
        [116.480151, 39.998453],
        [116.480784, 39.998302],
        [116.480784, 39.998302],
        [116.481149, 39.998184],
        [116.481573, 39.997997],
        [116.481863, 39.997846],
        [116.482072, 39.997718],
        [116.482362, 39.997718],
        [116.483633, 39.998935],
        [116.48367, 39.998968],
        [116.484648, 39.999861],
      ],

      //绘制轨迹线  行驶轨迹线
      pathSimplifierIns: null,
      PathSimplifier: null,
      //轨迹线
      navg: null,
      timer: null, //定时器

      replayData: {
        vin: "粤A006667",
        speed: 0, //初始速度
        multiple: 1, //倍数
        idx: 1, //走到了第几个点
        tail: Number, //至下一个节点的比例位置
        passedTime: String, //当前时间
        totalTime: String, //总时间
        isPlay: false, //是否为播放
        playIcon: "resume", //开始按钮为重新开始回升继续
        isOnSlider: false, //是否为手动鼠标拖动进度条
        sliderVal: 0, //进度条位置
      },
    };
  },
  computed: {
    show: {
      get: function () {
        // console.log(this.isShow);
        return this.isShow;
      },
      set: function () {},
    },
    lineList: function () {
      return this.markers;
    },
  },
  watch: {
    isShow(n, o) {
      if (n) {
        this.$nextTick(() => {
          this.initMap();
        });
      }
    },
  },
  created() {},
  methods: {
    // 实例`化地图
    async initMap() {
      let AMapUI = (this.AMapUI = window.AMapUI);
      let AMap = (this.AMap = window.AMap);
      // // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
      let mapConfig = {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: this.zoom, //初始地图级别
        layers: this.layers,
        zooms: [4, 18], //设置地图级别范围
        showIndoorMap: false, //是否在有矢量底图的时候自动展示室内地图
        mapStyle: "amap://styles/blue", // 地图主题
        // center: this.markers[0], //初始地图中心点
      };
      let map = (this.map = new AMap.Map(this.id, mapConfig));
      //卫星图层
      this.trafficLayer = new AMap.TileLayer.Traffic({
        zIndex: 10,
      });
      this.trafficLayer.setMap(map);
      this.trafficLayer.hide();
      // 为每个坐标创建信息窗体
      var infoWindow = (this.infoWindows = new AMap.InfoWindow());

      //获取地图中心点
      var currentCenter = this.map.getCenter(); //此方法是获取当前地图的中心点
      // console.log(currentCenter);
      this.center = [currentCenter.lng, currentCenter.lat]; //将获取到的中心点的纬度经度赋值给data的center
      AMap.plugin(
        [
          "AMap.ToolBar",
          "AMap.Scale",
          "AMap.MapType",
          "AMap.MouseTool",
          "AMap.MarkerClusterer",
        ],
        function () {
          //异步加载插件
          // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
          map.addControl(new AMap.ToolBar());
          // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
          // map.addControl(new AMap.Scale());
        }
      );

      //暂时初始化调用
      await this.drawLine(this.lineList);

      // this.map.setFitView();
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    },
    handleCancel(e) {
      // console.log(e);
      this.$emit("changeModalStatus", false);
      this.show = false;
    },
    onChange(value, dateString) {
      // console.log("Selected Time: ", value);
      // console.log("Formatted Selected Time: ", dateString);
      //时间掉后台接口后,展示轨迹线
      this.drawLine(this.lineList);
    },
    onOk(value) {
      console.log("onOk: ", value);
    },
    onStart(key) {
      this.isStart = !this.isStart;
      let speedList = [];
      this.markers.forEach((item, i) => {
        speedList.push({ speed: i * 4 + 50, lnglat: item });
      });
      // if (key) {
      //   this.marker.moveAlong(this.lineList, 200);
      // } else {
      //   this.marker.pauseMove();
      // }
      let status = this.navg.getNaviStatus();
      // console.log(status);
      if (status == "stop") {
        this.navg.start();
      } else if (status == "moving") {
        this.navg.pause();
      } else if (status == "pause") {
        this.navg.resume();
      }
      this.timer = setInterval(() => {
        this.map.setFitView();
        console.log(this.navg.getMovedDistance()); //获取距起点的距离 单位米
        //定时器需要提前声明
        //当移动到最后一个点位时清除定时器
        //navg0.getCursor() 获取小车移动到具体点位的信息
        if (this.navg.getCursor().idx == speedList.length - 1) {
          this.$set(this, "isStart", true);
          this.navg.stop();
          clearInterval(this.timer);
        }
        //this.navg.setSpeed()  设置小车移动速度,*10是我的数据不正常
        //将获取的位置index=this.navg.getCursor().idx  取出速度steep数组的对应当前速度
        this.navg.setSpeed(speedList[this.navg.getCursor().idx].speed);
        //改变播放进度条
        // this.setState({
        // 	inputValue:Math.round((this.navg.getCursor().idx)/speedList.length*100)
        // })
        //设置小车信息窗口内容
        //this.navg.marker.setContent()
        this.navg.marker.setContent(
          `<div  class='replay-speed'>当前速度 : ${
            speedList[this.navg.getCursor().idx].speed
          }Km/h</div>`
        );
      }, 1000);
    },
    async drawLine(data) {
      // console.log(data)
      // console.log(this.AMapUI)
      let AMapUI = this.AMapUI;
      let _this = this;

      //组件实例化
      this.AMapUI.load(["ui/misc/PathSimplifier"], function (PathSimplifier) {
        if (!PathSimplifier.supportCanvas) {
          _this.$message.error("当前环境不支持 Canvas！");
          return;
        }
        //回调存储
        _this.PathSimplifier = PathSimplifier;
        //创建组件实例
        var pathSimplifierIns = (_this.pathSimplifierIns = new PathSimplifier({
          zIndex: 100,
          map: _this.map, //所属的地图实例
          getPath: function (pathData, pathIndex) {
            // console.log(pathData,pathIndex)
            //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
            return pathData.path;
          },
          getHoverTitle: function (pathData, pathIndex, pointIndex) {
            //返回鼠标悬停时显示的信息
            // if (pointIndex >= 0) {
            //   //鼠标悬停在某个轨迹节点上
            //   return (
            //     pathData.name +
            //     "，点:" +
            //     pointIndex +
            //     "/" +
            //     pathData.path.length
            //   );
            // }
            // //鼠标悬停在节点之间的连线上
            // return pathData.name + "，点数量" + pathData.path.length;
          },
          renderOptions: {
            //轨迹线的样式
            pathLineStyle: {
              strokeStyle: "red",
              lineWidth: 6,
              dirArrowStyle: true,
            },
          },
          //绘制路线节点
          renderOptions: {
            renderAllPointsIfNumberBelow: 100, //绘制路线节点，如不需要可设置为-1
          },
        }));

        //设置数据
        _this.setLineData(_this.lineList);
      });
    },

    async setLineData(data) {
      //设置数据
      this.pathSimplifierIns.setData([
        {
          name: "路线0",
          path: data,
        },
      ]);

      let _this = this;
      this.navg = this.pathSimplifierIns.createPathNavigator(
        0, //关联第1条轨迹
        {
          loop: false, //循环播放
          speed: 5, //形式速度
          pathNavigatorStyle: {
            width: 16,
            height: 32,
            //使用图片
            autoRotate: true, //禁止调整方向
            // content: PathSimplifier.Render.Canvas.getImageContent('./img/xc1.png'),//图片的引入路径是打包后的路径,也就是index.html的图片引入路径
            content: this.PathSimplifier.Render.Canvas.getImageContent(
              "https://webapi.amap.com/ui/1.1/ui/misc/PathSimplifier/examples/imgs/car.png"
            ), //图片的引入路径是打包后的路径,也就是index.html的图片引入路径
            strokeStyle: null,
            fillStyle: null,
            //经过路径的样式
            pathLinePassedStyle: {
              lineWidth: 6,
              strokeStyle: "black",
              dirArrowStyle: {
                stepSpace: 15,
                strokeStyle: "red",
              },
            },
          },
        }
      );
      //创建一个点
      // console.log(data);
      var image =
        "https://webapi.amap.com/ui/1.1/ui/misc/PathSimplifier/examples/imgs/car.png";
      var icon = new AMap.Icon({
        image: image, // 图像 URL
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90,
        // imageSize: new AMap.Size(19, 33) // 设置图标尺寸
      });
      this.navg.marker = new AMap.Marker({
        position: data[0],
        icon: icon,
        offset: new AMap.Pixel(12, -10),
        content: `<div  class='replay-speed'>当前速度 : 100Km/h</div>`, //设置当前点信息窗口显示内容
        map: this.map,
      });
      this.navg.on("move", function (e) {
        _this.navg.marker.setPosition(_this.navg.getPosition());
      });
      this.pathSimplifierIns.setFitView(-1)
      this.navg.pause()
    },
    //进度条事件
        onChangeSlider(value) {
      console.log('change: ', value);
    },
    onAfterChange(value) {
      console.log('afterChange: ', value);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .mapList {
  height: 880px;
  margin-top: 80px;
  overflow: auto;
  width: 1800px !important;
  //    background: skyblue;
  .ant-modal-content {
    height: 100%;
    .ant-modal-body {
    background-color: rgb(9, 21, 72);

      padding: 0 !important;
      height: 95%;
      max-height: unset;
      overflow-x: hidden;
      //   height: auto;
    }
  }
}
::v-deep .replay-box {
  height: 100%;
  .replay-left {
    height: 100%;
    background:#fff;
    padding-left: 16px !important;
    .ant-calendar-picker {
      width: 100% !important;
    }
    .replay-left-title {
      height: 40px;
      line-height: 40px;
      font-weight: 600;
      font-size: 16px;
    }
    .replay-left-where {
      .replay-left-label {
        height: 24px;
        margin: 8px 0;
        line-height: 24px;
      }
      .replay-left-input {
        margin: 8px 0;
      }
    }
    .replay-left-button {
      margin-top: 24px;
      .ant-btn {
        width: 300px;
      }
    }
  }
  .replay-right {
    height: 100%;
    background-color: rgb(9, 21, 72);
    .replay-map {
      height: 376px;
      width: 100%;
      background: skyblue;
      margin-top: 8px;
    }
    .replay-speed {
      background: rgba(255, 255, 255, 0.7);
      padding: 2px 5px;
      color: #3e3e3e;
      font-size: 12px;
      border: 1px solid #ccc;
      border-radius: 10px;
      white-space: nowrap;
    }
    .replay-tootle {
      margin-top: 8px;
      background:#373c46;
      .replay-row {
        background: #155a96;
        .ant-col{
          height:40px;
          line-height: 40px;
          color:#fff;
          margin-right: 8px;
        }
        .replay-speed-red{
          color:tomato;
        }
        .replay-speed-green{
          color:#7df977;
        }
      }
      .ant-btn {
          color: #fff;
          height:32px;
          margin: 4px 0;
          line-height: 32px;
          // margin: 4px 0;
        }
        .replay-down{
          .ant-btn{
            margin:0px
          }
        }
        .ant-slider{
          margin:8px 4px;
        }
    }
  }
}

::v-deep .amap-logo {
  display: none !important;
  opacity: 0 !important;
}
::v-deep .amap-copyright {
  opacity: 0 !important;
}
::v-deep .ant-table-body{
  max-height: 266px!important;
}
</style>