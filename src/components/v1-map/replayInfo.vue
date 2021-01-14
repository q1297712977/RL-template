<template>
  <!-- <a-modal
    v-model="show"
    title="轨迹回放"
    :footer="null"
    centered
    dialogClass="mapList"
    @cancel="handleCancel"
    @ok="handleOk"
    :destroyOnClose="destroyOnClose"
  > -->
  <a-row type="flex" justify="start" :gutter="16" class="replay-box">
    <a-col :span="6" class="replay-left">
      <!-- <div class="replay-left-title">车辆回放</div> -->
      <div class="replay-left-where">
        <a-row type="flex" justify="space-between" :gutter="8" align="middle">
          <a-col :span="7" class="replay-left-where-label">终端识别码: </a-col>
          <a-col :span="16">
            <a-select
              show-search
              placeholder="请选择终端识别码"
              option-filter-prop="children"
              style="width: 100%"
              :filter-option="filterOption"
              @change="handleChange"
            >
              <a-icon slot="prefix" type="car" />
              <a-select-option value="jack"> Jack </a-select-option>
              <a-select-option value="lucy"> Lucy </a-select-option>
              <a-select-option value="tom"> Tom </a-select-option>
            </a-select>

            <!-- <a-input placeholder="请输出终端识别码"
                ><a-icon slot="prefix" type="car" /></a-input
            > -->
          </a-col>
        </a-row>
        <a-row type="flex" justify="space-between" :gutter="8" align="middle">
          <a-col :span="7" class="replay-left-where-label">车牌号: </a-col>
          <a-col :span="16"
            ><a-input placeholder="请输出车牌号"
              ><a-icon slot="prefix" type="car"/></a-input
          ></a-col>
        </a-row>
        <a-row type="flex" justify="space-between" :gutter="8" align="middle">
          <a-col :span="7" class="replay-left-where-label">开始时间: </a-col>
          <a-col :span="16">
            <a-date-picker
              v-model="dateConfig.startValue"
              :disabled-date="disabledStartDate"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="开始时间"
              @openChange="handleStartOpenChange"
          /></a-col>
        </a-row>
        <a-row type="flex" justify="space-between" :gutter="8" align="middle">
          <a-col :span="7" class="replay-left-where-label">结束时间: </a-col>
          <a-col :span="16">
            <a-date-picker
              v-model="dateConfig.endValue"
              :disabled-date="disabledEndDate"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="结束时间"
              :open="dateConfig.endOpen"
              @openChange="handleEndOpenChange"
          /></a-col>
        </a-row>
      </div>
      <a-row class="replay-left-button" type="flex" justify="space-between">
        <a-col :span="7"></a-col>
        <a-col :span="16">
          <a-button
            type="primary"
            v-show="!replayData.isPlay"
            @click="onStart(replayData.playIcon)"
            >开始回放/暂停</a-button
          >
          <a-button v-show="replayData.isPlay" @click="onStart('pause')"
            >回放中···</a-button
          >
        </a-col>
      </a-row>
      <template>
        <a-row type="flex" class="line-title-time">
          <a-col :span="24">2020年11月</a-col>
        </a-row>
        <a-row type="flex" justify="start" class="lineLists">
          <a-col :offset="4" :span="20">
            <a-timeline>
              <a-timeline-item
                v-for="k in 10"
                :key="k"
                v-bind:class="{ checkLineCircle: k == config.current }"
              >
                <div class="time-box">
                  <div class="time-title" @click="onCheckList(k)">
                    21日 行程5段总里程30公里
                  </div>
                  <div
                    class="time-list"
                    v-show="config.seen && k == config.current"
                  >
                    <div
                      class="time-item"
                      v-for="i in 5"
                      :key="i"
                      @click="onClick(i)"
                    >
                      行程{{ i + 1 }} : {{ i }}:0{{ i }}
                    </div>
                  </div>
                </div>
              </a-timeline-item>
            </a-timeline>
          </a-col>
        </a-row>
      </template>
    </a-col>
    <a-col :span="18" class="replay-right">
      <div class="replay-map" id="replayMap" :style="mapHeight"></div>
      <div class="replay-tootle">
        <a-row type="flex" justify="start" class="replay-row">
          <a-col>
            <a-button type="link" icon="step-backward" />
          </a-col>
          <a-col>
            <a-button
              type="link"
              icon="caret-right"
              v-show="!replayData.isPlay"
              @click="onStart(replayData.playIcon)"
            />
            <a-button
              type="link"
              icon="pause"
              v-show="replayData.isPlay"
              @click="onStart('pause')"
            />
          </a-col>
          <a-col>
            <a-button type="link" icon="step-forward" />
          </a-col>
          <a-col>
            <a-button type="link" icon="border" class="resetBtn" @click="onReset()" />
          </a-col>
          <a-col>
            <a-button
              type="link"
              icon="minus"
              @click="replayData.multiple > 1 ? replayData.multiple-- : 1"
            />
          </a-col>
          <a-col class="replay-speed-red"> {{ replayData.multiple }} </a-col>
          <a-col>
            <a-button
              type="link"
              icon="plus"
              @click="replayData.multiple < 8 ? replayData.multiple++ : 8"
            />
          </a-col>
          <a-col class="replay-speed-green">
            {{ replayData.speed }} km/h
          </a-col>
          <a-col>
            {{ replayData.vin }}
          </a-col>
          <a-col> 开始时间--结束时间 </a-col>
          <a-col> 总行驶距离 100km </a-col>
        </a-row>
        <a-row type="flex" justify="start" :gutter="8">
          <a-col :span="24">
            <a-slider
              v-model="replayData.sliderVal"
              :step="sliderStep"
              @afterChange="onAfterChange"
              :tipFormatter="null"
              v-bind:class="{ sliderStyle: navg != null }"
            />
          </a-col>
        </a-row>
        <a-row type="flex" justify="center" class="replay-down">
          <a-col>
            <a-button type="link" icon="down" @click="changeMapHight" />
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

      <!-- 切换卫星 -->
      <div class="input-card">
        <div class="input-item">
          <!-- <a-button class="btn" @click="toggle()">显示/隐藏实时路况</a-button> -->
          <a-row type="flex" justify="end">
            <a-col>
              <a-button-group>
                <a-button class="btn" @click="toggle()" v-bind:type="toggleShow">卫星</a-button>
                <a-button class="btn" @click="road()" v-bind:type="roadShow">路况</a-button>
              </a-button-group>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-col>
  </a-row>
  <!-- </a-modal> -->
</template>
<script>
const columns = [
  {
    title: "序号",
    dataIndex: "index",
    key: "index",
    align: "center",
    width: 80,
    ellipsis: true
  },
  {
    title: "时间",
    dataIndex: "index1",
    key: "index1",
    align: "center",
    ellipsis: true
  },
  {
    title: "经纬度",
    dataIndex: "index2",
    key: "index2",
    align: "center",
    ellipsis: true
  },
  {
    title: "方向",
    dataIndex: "index3",
    key: "index3",
    align: "center",
    ellipsis: true
  },
  {
    title: "车速",
    dataIndex: "index4",
    key: "index4",
    align: "center",
    ellipsis: true
  },
  {
    title: "位置",
    dataIndex: "index5",
    key: "index5",
    align: "center",
    ellipsis: true
  },
  {
    title: "报警信息",
    dataIndex: "index6",
    key: "index6",
    align: "center",
    ellipsis: true
  }
];
const data = [];

for (let i = 10; i > 0; i--) {
  data.push({
    index: i,
    index1: "测试时间" + i,
    index2: "测试经纬度" + i,
    index3: "测试方向" + i,
    index4: "测试车速" + i,
    index5: "测试位置" + i,
    index6: "测试报警信息" + i
  });
}
import remoteLoad from "@/utils/remoteLoad.js";
import { MapKey } from "@/config/config";

import { linePath, marks } from "./index.js";

export default {
  data() {
    return {
      rowClassName: (record, index) => {
        let className = "dark-row";
        if (index % 2 === 1) className = "light-row";
        return className;
      },

      columns,
      data,
      btnConfig:{
        isToggle:true,
        isRoad:true
      },
      isClick: true,
      mapConfig: {
        zoom: null,
        layers: null
      },
      config: {
        seen: false,
        current: 0
      },
      dateConfig: {
        startValue: null,
        endValue: null,
        endOpen: false
      },
      layers: {
        trafficLayer: null,
        layerShow: false,
        luShow: false,
        trafficLu: null
      },
      setMapTimer: null, //中心点定时器
      destroyOnClose: true,
      pathList: [], //坐标点数据
      trackList: [], //轨迹数据
      navg: null, //巡航器
      pathSimplifierIns: null, //轨迹线
      lineListData: {
        key: 2
      },
      replayData: {
        vin: "粤A006667",
        speed: 0, //初始速度
        multiple: 1, //倍数
        idx: 0, //走到了第几个点
        tail: Number, //至下一个节点的比例位置
        passedTime: String, //当前时间
        totalTime: String, //总时间
        totalDistance: 0, //总距离
        isPlay: false, //是否为播放
        playIcon: "start", //开始按钮为重新开始回升继续
        isOnSlider: false, //是否为手动鼠标拖动进度条
        sliderVal: 0 //进度条位置
      }
    };
  },
  computed: {
    show: {
      get: function() {
        // console.log(this.isShow);
        return this.isShow;
      },
      set: function() {}
    },
    lineList: function() {
      return this.markers;
    },
    sliderStep: function() {
      return 0.0001;
    },
    mapHeight: function() {
      if (this.isClick) {
        return { height: "calc(50% - 10px)" };
      } else {
        return { height: "calc(100% - 150px)" };
      }
    },
    tableHeight: function() {
      if (this.isClick) {
        return "240px";
      } else {
        return "100px";
      }
    },
    roadShow:function(){
      return this.btnConfig.isRoad ? "" : "primary";
    },
    toggleShow:function(){
      return this.btnConfig.isToggle ? "" : "primary";
    }
  },

  async created() {
    await remoteLoad(`http://webapi.amap.com/maps?v=1.4.15&key=${MapKey}`);
    await remoteLoad("http://webapi.amap.com/ui/1.0/main.js");
    this.$nextTick(() => {
      this.initMap();
    });
  },
  methods: {
    changeMapHight() {
      var div = document.getElementsByClassName("ant-table-body");
      this.isClick = !this.isClick;
      div[0].style.setProperty("max-height", this.tableHeight, "important");
    },
    // 实例`化地图
    async initMap() {
      // console.log("初始化地图");
      // console.log(window.AMap);
      let AMapUI = (this.AMapUI = window.AMapUI);
      let AMap = (this.AMap = window.AMap);
      let mapConfig = {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: this.mapConfig.zoom, //初始地图级别
        zooms: [4, 18], //设置地图级别范围
        showIndoorMap: false, //是否在有矢量底图的时候自动展示室内地图
        mapStyle: "amap://styles/blue" // 地图主题
        // center: this.markers[0], //初始地图中心点
      };
      this.map = new AMap.Map("replayMap", mapConfig);
      //缺少卫星图层切换
      //卫星图层
      this.layers.trafficLayer = new AMap.TileLayer.Satellite({
        map: this.map
      });
      //路网
      this.layers.trafficLu = new AMap.TileLayer.Traffic({ map: this.map });
      this.layers.trafficLayer.hide();
      this.layers.trafficLu.hide();

      let _this = this;
      //添加工具缩放组件
      AMap.plugin(["AMap.ToolBar"], function() {
        //异步加载插件
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        _this.map.addControl(new AMap.ToolBar());
        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        // map.addControl(new AMap.Scale());
      });

      // let trackList = linePath;
      // let len = trackList.length;
      // let startPoint = trackList[0];
      // let endPoint = trackList[len - 1];
      // this.pathList.splice(0, this.pathList.length);
      // // console.log(trackList)
      // //数据解析
      // trackList.forEach((item, index) => {
      //   this.pathList.push([item.longitude, item.latitude]);
      //   item.stampTime = new Date(item.time).getTime();
      //   // 下一段路程经历了多少s,intervalTime,nextDistance:下一段路程：m,nextDistance:下一段路速度：km/h
      //   let next = trackList[index + 1];
      //   if (next) {
      //     item.intervalTime = next.stampTime - item.stampTime;
      //     item.nextDistance = this.distanceFun(
      //       [item.longitude, item.latitude],
      //       [next.longitude, next.latitude]
      //     );
      //     this.replayData.totalDistance += item.nextDistance;
      //     // console.log(this.replayData.totalDistance)
      //     // item.speed = index * 40 + 30;
      //     item.speed = 40 + index;
      //   } else {
      //     item.speed = 0;
      //     item.intervalTime = 0;
      //   }
      // });
      // // console.log("解析成功");
      // //总时长

      // this.replayData.totalTime =
      //   (endPoint.stampTime - startPoint.stampTime) / 1000; //秒

      // // console.log(endPoint.stampTime - startPoint.stampTime)
      // this.trackList = trackList;
      //绘制轨迹
      // await this.drawLine(this.trackList);
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    },
    handleCancel(e) {
      // console.log(e);
      clearInterval(this.timer);
      (this.replayData.isPlay = false), //是否为播放
        (this.replayData.playIcon = "start"), //开始按钮为重新开始回升继续
        (this.replayData.sliderVal = 0), //开始按钮为重新开始回升继续
        (this.replayData.idx = 0), //初始轨迹位置
        this.$emit("changeModalStatus", false);
      if (this.navg != null) this.navg.destroy();
      //清空时间
      this.dateConfig.endValue = null;
      this.dateConfig.startValue = null;
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
      console.log(key);
      console.log(this.replayData.playIcon);
      if (key == "start") {
        this.replayData.isPlay = true;
        this.navg.start(this.replayData.idx);
        this.replayData.sliderVal = 0;
        this.replayData.multiple = 1;
        this.replayData.playIcon = "resume";
        this.setTimer();
      } else if (key == "pause") {
        this.replayData.isPlay = false;
        this.navg.pause();
        // this.replayData.multiple = 4;
        clearInterval(this.timer);
      } else if (key == "resume") {
        this.replayData.isPlay = true;

        this.navg.resume();
        this.setTimer();
      }
    },
    async drawLine(data) {
      // console.log(this.AMapUI)
      // let AMapUI = this.AMapUI;
      let _this = this;
      // console.log(AMapUI)
      //组件实例化
      _this.AMapUI.load(["ui/misc/PathSimplifier"], function(PathSimplifier) {
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
          autoSetFitView: true, ///绘制后自动调整地图视野以适合全部轨迹
          getPath: function(pathData, pathIndex) {
            //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
            return pathData.path;
          },
          getHoverTitle: function(pathData, pathIndex, pointIndex) {
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
              // strokeStyle: "red",
              lineWidth: 8,
              dirArrowStyle: true
            },
            renderAllPointsIfNumberBelow: 100 //绘制路线节点，如不需要可设置为-1
          }
          // //绘制路线节点
          // renderOptions: {
          // },
        }));

        //设置数据
        _this.setLineData(_this.pathList);
      });
      console.log(_this.pathSimplifierIns);
    },

    async setLineData(key) {
      let data = key ? key : this.pathList;
      //设置数据
      console.log(this.pathSimplifierIns);
      this.pathSimplifierIns.setData([
        {
          name: "路线0",
          path: data
        }
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
            strokeStyle: true,
            fillStyle: true,
            //经过路径的样式
            pathLinePassedStyle: {
              lineWidth: 8,
              strokeStyle: "black",
              dirArrowStyle: {
                stepSpace: 15,
                strokeStyle: "white"
              }
            }
          }
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
        angle: -90
        // imageSize: new AMap.Size(19, 33) // 设置图标尺寸
      });

      this.navg.marker = new AMap.Marker({
        position: [this.trackList[0].longitude, this.trackList[0].latitude],
        icon: icon,
        offset: new AMap.Pixel(12, -10),
        content: `<div  class='replay-speed'>当前速度 : 0Km/h</div>`, //设置当前点信息窗口显示内容
        map: this.map
      });

      this.navg.on("move", function(e) {
        _this.navg.marker.setPosition(_this.navg.getPosition());
        _this.map.panTo([
          _this.navg.getPosition().lng,
          _this.navg.getPosition().lat
        ]);
      });
      this.pathSimplifierIns.setFitView(-1);
      // this.map.setFitView();
      this.navg.start();
      this.navg.setSpeed(0);
      // this.navg.pause();
    },
    // 格式化时间
    getTime(sTime) {
      let ss;
      let mm = "00";
      let hh = "00";
      if (sTime > 60) {
        let s = sTime % 60;
        ss = s > 9 ? s : "0" + s;
        let mTime = parseInt(sTime / 60);
        if (mTime > 60) {
          let m = mTime % 60;
          mm = m > 9 ? m : "0" + m;
          hh = parseInt(mTime / 60);
        } else {
          mm = mTime > 9 ? mTime : "0" + mTime;
        }
      } else {
        ss = sTime > 9 ? sTime : "0" + sTime;
      }
      return hh + ":" + mm + ":" + ss;
    },
    // 计算两个坐标点之间的距离
    distanceFun(point1, point2) {
      let p1 = new AMap.LngLat(point1[0], point1[1]);
      let p2 = new AMap.LngLat(point2[0], point2[1]);
      let distance = Math.round(p1.distance(p2));
      return distance;
    },

    //设置定时器(倍数)
    setTimer() {
      this.navg.setSpeed(0);
      //multiple 倍数
      // this.map.on("moveend", () => {
      //   // this.computeMarkers();
      //   this.map.setFitView();
      // });
      this.timer = setInterval(() => {
        // this.map.setFitView(this.navg.marker,false,null);

        // console.log(this.navg.getMovedDistance()); //获取距起点的距离 单位米
        //定时器需要提前声明
        //当移动到最后一个点位时清除定时器
        //navg0.getCursor() 获取小车移动到具体点位的信息
        if (this.navg.isCursorAtPathEnd()) {
          this.$set(this.replayData, "isPlay", false);
          this.replayData.playIcon = "start";
          this.$set(this.replayData, "sliderVal", 100);
          this.navg.stop();
          clearInterval(this.timer);
          return;
        }
        //this.navg.setSpeed()  设置小车移动速度,*10是我的数据不正常
        //将获取的位置index=this.navg.getCursor().idx  取出速度steep数组的对应当前速度

        this.navg.setSpeed(
          this.trackList[this.navg.getCursor().idx].speed *
            this.replayData.multiple
        );
        //改变播放进度条
        let idx = this.navg.getCursor().idx; //走到了第几个点
        let tail = this.navg.getCursor().tail; //至下一个节点的比例位置
        let str = tail >= 0.5 ? idx + 1 : idx;

        this.replayData.sliderVal = Math.round(
          (str / this.trackList.length) * 100
        );

        //设置小车信息窗口内容
        //this.navg.marker.setContent()
        this.navg.marker.setContent(
          `<div  class='replay-speed'>当前速度 : ${
            this.trackList[this.navg.getCursor().idx].speed
          }Km/h </br>${this.replayData.multiple}倍速播放</div>`
        );
      }, 1000);
      // this.setMapTimer = setInterval(() => {
      //   //  this.map.setFitView(this.navg.marker);
      //   this.map.panTo([
      //     this.navg.getPosition().lng,
      //     this.navg.getPosition().lat,
      //   ]);
      // }, 500);
    },
    //进度条事件
    onAfterChange(value) {
      this.replayData.idx = ((this.pathList.length / 100) * value).toFixed();
      this.navg.moveToPoint(this.replayData.idx);
      if (this.replayData.playIcon == "start" && !this.replayData.isPlay) {
        this.onStart(this.replayData.playIcon);
      } else if (
        this.replayData.playIcon == "resume" &&
        this.replayData.isPlay
      ) {
        this.onStart(this.replayData.playIcon);
      } else {
        this.onStart("resume");
      }
      console.log(this.replayData.playIcon);
    },
    //重置
    onReset() {
      clearInterval(this.timer);
      this.navg.moveToPoint(0);
      this.replayData.speed = 0;
      this.replayData.multiple = 1;
      this.replayData.idx = 0;
      this.replayData.isPlay = false;
      this.replayData.playIcon = "start";
      this.replayData.sliderVal = 0;
      this.navg.marker.setContent(
        `<div  class='replay-speed'>当前速度 : 0Km/h </br>1倍速播放</div>`
      );
      // this.map.setFitView();
      this.navg.stop();
    },

    //加载卫星图层
    //卫星图层
    //卫星图层
    toggle() {
      this.btnConfig.isToggle=!this.btnConfig.isToggle
      if (!this.layers.layerShow) {
        this.layers.trafficLayer.show();
      } else {
        this.layers.trafficLayer.hide();
      }
      this.layers.layerShow = !this.layers.layerShow;
    },

    //路况
    road() {
      this.btnConfig.isRoad=!this.btnConfig.isRoad

      if (!this.layers.luShow) {
        this.layers.trafficLu.show();
      } else {
        this.layers.trafficLu.hide();
      }
      this.layers.luShow = !this.layers.luShow;
    },

    //时间搜索组件
    disabledStartDate(startValue) {
      const endValue = this.dateConfig.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.dateConfig.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.dateConfig.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.dateConfig.endOpen = open;
    },

    //点击获取linelist显示
    onCheckList(v) {
      console.log(v);
      this.config.seen = true;
      this.config.current = this.config.current == v ? 0 : v;
    },
    // tcolor (e) {
    //   e.target.style.backgroundColor = " #f0f2f5";
    //   e.target.style.cursor = "pointer";
    // },
    // lcolor (e) {
    //   e.target.style.backgroundColor = "";
    // },
    async onClick(e) {
      console.log(11);
      this.$message.success("选中第" + e + "条行程");
      this.getMapList();
      await this.drawLine(this.trackList);
    },
    getMapList() {
      let trackList = linePath;
      let len = trackList.length;
      let startPoint = trackList[0];
      let endPoint = trackList[len - 1];
      this.pathList.splice(0, this.pathList.length);
      // console.log(trackList)
      //数据解析
      trackList.forEach((item, index) => {
        this.pathList.push([item.longitude, item.latitude]);
        item.stampTime = new Date(item.time).getTime();
        // 下一段路程经历了多少s,intervalTime,nextDistance:下一段路程：m,nextDistance:下一段路速度：km/h
        let next = trackList[index + 1];
        if (next) {
          item.intervalTime = next.stampTime - item.stampTime;
          item.nextDistance = this.distanceFun(
            [item.longitude, item.latitude],
            [next.longitude, next.latitude]
          );
          this.replayData.totalDistance += item.nextDistance;
          // console.log(this.replayData.totalDistance)
          // item.speed = index * 40 + 30;
          item.speed = 40 + index;
        } else {
          item.speed = 0;
          item.intervalTime = 0;
        }
      });
      // console.log("解析成功");
      //总时长

      this.replayData.totalTime =
        (endPoint.stampTime - startPoint.stampTime) / 1000; //秒

      // console.log(endPoint.stampTime - startPoint.stampTime)
      this.trackList = trackList;
    },
    //搜索框
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
.replay-box {
  height: 100%;
  width: 100%;
  margin-left: 0px !important;
  margin-right: 0px !important;
  .replay-left {
    height: 100%;
    background: #fff;
    padding-left: 16px !important;
    .ant-calendar-picker {
      width: 100% !important;
    }
    ::v-deep .ant-select-selection--single {
      height: 32px;
      .ant-select-selection__rendered {
        line-height: 32px;
      }
    }
    .replay-left-title {
      height: 40px;
      line-height: 40px;
      font-weight: 600;
      font-size: 16px;
    }
    ::v-deep .replay-left-where {
      .ant-row-flex {
        margin: 8px 0;
        height: 32px;
        line-height: 32px;
        .ant-input {
          height: 32px;
          line-height: 32px;
        }
      }

      .replay-left-where-label {
        text-align: right;
      }
    }
    .replay-left-button {
      margin-top: 24px;
      .ant-btn {
        height: 32px;
        line-height: 32px;
        padding: 0 15px;
        width: 100%;
      }
    }
    .line-title-time {
      height: 24px;
      line-height: 24px;
      margin: 4px 0;
    }
    ::v-deep .lineLists {
      height: 62%;
      overflow: auto;
      overflow-x: hidden;
      .ant-timeline-item-content {
        color: #fff;
        padding-right: 8px;
        .ant-collapse {
          background: none;
          border: none;
          .ant-collapse-item {
            // border-color:;

            border: 2px solid #528dc3;
            background: #fff;
            border-radius: 8px 8px 8px 8px;
          }
        }
      }
      .ant-timeline-item {
        margin-top: 8px;

        &:hover {
          .time-box {
            border: 3px solid #1890ff;
            :before {
              // border-color:  red;
              border-right: 10px solid #1890ff;
            }
            // background: green;
          }
          .ant-timeline-item-head {
            background: #1890ff;
          }
        }
        .time-box {
          background: #fff;
          padding: 4px 16px;
          color: #333;
          border-radius: 8px;
          border: 3px solid skyblue;
          :before {
            content: "";
            border-right: 10px solid skyblue;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            border-left: 0;
            position: absolute;
            left: 0px;
            top: 14px;
            margin-left: -8px;
            margin-top: -8px;
          }
          :after {
            content: "";
            border-right: 10px solid #fff;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            border-left: 0;
            position: absolute;
            left: 4px;
            top: 14px;
            margin-left: -8px;
            margin-top: -8px;
          }
          .time-title {
            margin: 4px 0;
          }
          .time-list {
            border-top: 1px solid grey;
            .time-item {
              height: 20px;
              line-height: 20px;
              margin: 4px 0;
              &:hover {
                background: #f0f2f5;
              }
            }
          }
        }
      }

      .checkLineCircle {
        .ant-timeline-item-head {
          background: #1890ff;
        }
        .time-box {
          border: 3px solid #1890ff;
          :before {
            border-right: 10px solid #1890ff;
          }
        }
      }
    }
  }
  .replay-right {
    // height: 100%;
    overflow: auto;
    background: #fff;

    // background-color: rgb(9, 21, 72);
    position: relative;
    .replay-map {
      // height: 387px;
      // height: calc(50% - 10px);
      width: 100%;
      background: skyblue;
      // margin-top: 8px;
    }
    ::v-deep .replay-speed {
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
      // background: #373c46;
      background-color: rgb(9, 21, 72);

      .replay-row {
        .ant-btn {
          padding: 0px !important;
        }
        background: #155a96;
        .ant-col {
          height: 40px;
          line-height: 40px;
          color: #fff;
          margin-right: 8px;
        }
        .replay-speed-red {
          width: 20px;
          color: tomato;
          text-align: center;
          margin-right: 0px !important;
        }
        .replay-speed-green {
          color: #7df977;
        }
      }
      .ant-btn {
        color: #fff;
        height: 32px;
        margin: 4px 0;
        line-height: 32px;
        // margin: 4px 0;
        .anticon-border {
         
          font-size: 12px;
          width: 12px;
          height: 12px;
        }
      }
        .resetBtn{
          ::v-deep svg{
            font-size: 12px;/*no*/
            background:#fff!important;
          }
        }
      .replay-down {
        .ant-btn {
          margin: 0px;
        }
      }
      .ant-slider {
        margin: 8px 12px 8px 8px;
        .ant-slider-step {
          background: -webkit-linear-gradient(#61bd12, #61bd12) no-repeat, #ddd;
        }
      }
    }
    .input-card {
      position: absolute;
      top: 24px;
      right: 24px;
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
::v-deep .ant-table {
  .ant-table-body {
    max-height: 241px !important;
  }
}
/*没有固定行的表格个样式*/
// ::v-deep .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
//   background-color: skyblue !important;
// }
</style>
