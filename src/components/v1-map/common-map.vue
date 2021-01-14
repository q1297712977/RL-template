<template>
  <div class="v1-map-box " ref="v1MapBox">
    <div :id="id" class="v1-map"></div>
    <div class="input-card">
      <div class="input-item">
        <!-- <a-button class="btn" @click="toggle()">显示/隐藏实时路况</a-button> -->
        <a-row type="flex" justify="space-between">
          <a-col :span="24">
            <a-row>
              <a-col>
                <a-input-group compact>
                  <a-select default-value="Zhejiang">
                    <a-select-option value="Zhejiang">
                      终端盒/盒子
                    </a-select-option>
                    <a-select-option value="Jiangsu"> 车牌号 </a-select-option>
                    <a-select-option value="Jiangsu1"> 车队 </a-select-option>
                    <a-select-option value="Jiangsu2"> 车架号 </a-select-option>
                  </a-select>
                  <a-input-search
                    placeholder="请输入终端盒/盒子号"
                    enter-button
                    @change="onChangeInput"
                    @search="onSearch"
                    @focus="onChangeFocus"
                  />
                </a-input-group>
              </a-col>
              <template v-if="config.isShowList">
                <a-col class="search-box">
                  <a-row type="flex" justify="start" class="search-status">
                    <a-col :span="8"
                      ><a-icon type="desktop" class="onLine" /> 在线 :
                      1000</a-col
                    >
                    <a-col :span="8"
                      ><a-icon type="desktop" class="outLine" /> 离线 :
                      1000</a-col
                    >
                    <a-col :span="8"
                      ><a-icon type="desktop" class="allLine" /> 全部 :
                      1111</a-col
                    >
                  </a-row>
                  <a-row
                    type="flex"
                    justify="start"
                    class="search-where"
                    :gutter="[8, { xs: 4, sm: 4, md: 4, lg: 4 }]"
                  >
                    <a-col>查询条件 : </a-col>
                    <a-col v-for="(tag, index) in tags" :key="index">
                      <a-tooltip :key="tag" :title="tag">
                        <a-tag :closable="true" @close="() => handleClose(tag)">
                          {{ `${tag.slice(0, 20)}...` }}
                        </a-tag>
                      </a-tooltip>
                    </a-col>
                  </a-row>
                  <a-row
                    type="flex"
                    justify="space-between"
                    class="search-text"
                  >
                    <a-col>共找到3232辆车 </a-col>
                    <a-col :span="10">
                      <a-input placeholder="过滤条件" />
                    </a-col>
                    <a-col>
                      <a-button>过滤</a-button>
                    </a-col>
                  </a-row>
                  <div class="search-list" v-for="i in 4" :key="i">
                    <a-row type="flex" justify="space-between">
                      <a-col :span="10">车牌号 : 晋ABCDED{{ i }} </a-col>
                      <a-col :span="14">
                        <a-row
                          type="flex"
                          justify="end"
                          :gutter="8"
                          class="search-btn"
                        >
                          <a-col>
                            <a-tag color="#D4D8E1" v-if="i % 2 == 0"> 离线 </a-tag>
                            <a-tag color="#87d068" v-else>在线 </a-tag>
                          </a-col>
                          <a-col>
                            <a-button icon="search"> 轨迹 </a-button>
                            </a-col
                          >
                        </a-row>
                      </a-col>
                    </a-row>
                    <a-row type="flex" justify="space-between">
                      <a-col :span="10">车队 : 大同开沃车队 </a-col>
                      <a-col :span="14">
                        <a-row
                          type="flex"
                          justify="end"
                          :gutter="8"
                          class="search-btn"
                        >
                          <!-- <a-col>
                            <a-button icon="search"> 查轨迹 </a-button></a-col
                          > -->
                        </a-row>
                      </a-col>
                    </a-row>
                  </div>

                  <a-row
                    type="flex"
                    justify="end"
                    :gutter="8"
                    class="search-list-footer"
                  >
                    <a-col>共500条 </a-col>
                    <a-col>
                      <a-pagination
                        size="small"
                        :total="500"
                        simple
                        show-quick-jumper
                        :showLessItems="true"
                        :show-total="total => `共 ${total} 条`"
                      />
                    </a-col>
                  </a-row>
                </a-col>
              </template>
            </a-row>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="input-btn">
      <a-row type="flex" justify="end" :gutter="6">
        <a-col>
          <a-button class="btn" @click="changeHeatMap()"
            >热力图</a-button
          >
        </a-col>
        <a-col>
          <a-button
            class="btn"
            @click="toggle()"
            :disabled="zoom <= 5"
            v-bind:type="toggleShow"
            >卫星</a-button
          >
        </a-col>
        <a-col>
          <a-button
            class="btn"
            @click="road()"
            :disabled="zoom <= 5"
            v-bind:type="roadShow"
            >路况</a-button
          >
        </a-col>
        <a-col>
          <a-button
            class="btn"
            :disabled="isFence"
            @click="useMouseDraw()"
            v-bind:type="mouseShow"
            >围栏</a-button
          >
        </a-col>
      </a-row>
    </div>
    <!-- 组件关键代码 -->
    <infoWindowComponent
      ref="infoWindowComponent"
      v-show="isShowWindow"
      @changeModalStatus="isShowWindow = false"
      @changeReplayStatus="openReplay()"
      @changeParameterStatus="openInformation()"
      :info="info"
    ></infoWindowComponent>

    <modalInfo
      :isShow="modal.infoShow"
      @changeModalStatus="modal.infoShow = false"
      :list="circleList"
    ></modalInfo>
    <!-- 参数详情 -->
    <a-modal
      v-model="modal.parameterInfo"
      title="参数信息"
      :footer="null"
      centered
      dialogClass="mapList"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
    <!-- 轨迹回放 -->
    <a-modal
      v-model="modal.replayShow"
      title="轨迹回放"
      :footer="null"
      centered
      dialogClass="mapList"
      @cancel="handleCancel"
      @ok="handleOk"
      :destroyOnClose="true"
    >
      <replayInfo></replayInfo>
    </a-modal>
    <a-modal
      v-model="modal.parameterInfo"
      title="参数详情"
      :footer="null"
      centered
      dialogClass="mapList"
      @cancel="handleCancel"
      @ok="handleOk"
      :destroyOnClose="true"
    >
      <informationModal></informationModal>
    </a-modal>
  </div>
</template>

<script>
import remoteLoad from "@/utils/remoteLoad.js";
import { MapKey, MapCityName } from "@/config/config";
import infoWindowComponent from "@/components/v1-map/common-openInfo";
import modalInfo from "@/components/v1-map/modal-info";
import replayInfo from "@/components/v1-map/replayInfo";
import informationModal from "@/components/v1-map/information";
import { heatmapData } from "./heatMap.js";
// const debounce = (fn, wait = 500) => {
//   return function() {
//     clearTimeout(fn.timer);
//     console.log(1);
//     fn.timer = setTimeout(fn.bind(this, ...arguments), wait);
//   };
// };
const list = [];

for (let index = 0; index < 100; index++) {
  list.push({
    lat: Math.ceil(Math.random() * 10) + 100,
    lng: Math.ceil(Math.random() * 10) + 35
  });
}
export default {
  components: {
    infoWindowComponent,
    modalInfo,
    replayInfo,
    informationModal
  },
  watch: {
    zoom(n, o) {
      this.computeMarkers();
      console.log(n);
      // this.onSearchMap();
      // console.log(this.overlays);
      if (n <= 17 && o >= 17 && this.overlays.length > 0) {
        // this.delCircle();
        console.log(n, o);
        this.close();
      }
    },
    //获取当前圆的基本信息
    overlays(n, o) {
      // console.log(n, o);
      if (n.length > 0) {
        //获取当前圆的属性
        // console.log(n[0].getOptions())
        this.circleList = [];
        // console.log(this.newList)
        console.log(this.newList);
        this.newList.forEach((item, index) => {
          //  console.log(n[0].contains(item))
          if (n[0].contains(item)) {
            this.circleList.push(this.markers[index].getExtData());
            // this.circleList[index] = this.markers[index].getExtData();
          }
        });
        console.log(this.circleList);
        // if (this.circleList.length > 0) this.modal.InfoShow = true;
      }
    },
    circleList(n, o) {
      // console.log(n)
      if (n.length > 0) {
        this.$set(this.modal, "infoShow", true);
        this.isShowWindow = false;
      }
    }
  },
  computed: {
    isFence() {
      // return this.zoom==19?false:true
      return this.zoom >= 17 ? false : true;
      // return this.zoom >= 18 ? false : true;
      // return false;
    },
    roadShow: function() {
      return this.btnConfig.isRoad ? "" : "primary";
    },
    toggleShow:function(){
      return this.btnConfig.isToggle ? "" : "primary";
    },

    mouseShow:function(){
      return this.btnConfig.isMouse ? "" : "primary";
    },
  },
  data() {
    return {
      tags: ["Unremovable", "Tag 2", "Tag 3Tag 3Tag "],
      mouseTool: null,
      center: [116.42792, 39.902896], //经度+纬度
      config: {
        isShowList: false
      },
      btnConfig: {
        isToggle: true,
        isRoad: true,
        isMouse: true
      },
      lists: [], //地点列表
      search_list: [], //搜索结果列表
      loading: false,
      noSearchShow: false, //无搜索结果提示，无搜索结果时会显示暂无搜索结果
      id: Math.random()
        .toString(36)
        .substr(2),
      layers: {
        trafficLayer: null,
        layerShow: false,
        luShow: false,
        trafficLu: null
      },
      isVisible: false,
      trafficLayer: null,
      zoom: 8,

      //点聚合
      cluster: null,
      list: [
        [116.405467, 39.907761],
        [116.415467, 39.907761],
        [116.415467, 39.917761],
        [116.425467, 39.907761],
        [116.385467, 39.907761],
        [112.1098, 32.05457],
        [112.134834, 32.17836],
        [113.258896, 33.72519],
        [108.340225, 22.714418],
        [118.920555, 31.939259],
        [112.19136, 32.124443],
        [113.711266, 34.53528],
        [113.74946, 34.706554],
        [118.76999, 31.790976],
        [103.97615, 30.54582],
        [113.108215, 23.52326],
        [117.73392, 24.526876],
        [112.142006, 32.033382],
        [112.19437, 32.096485],
        [112.11113, 32.056026],
        [112.361786, 32.16322],
        [112.180466, 32.12207],
        [112.15615, 32.07324],
        [112.21495, 32.087322]
      ],
      //存储当前视野内的marker
      newList: [],
      //info传值
      info: {},
      //坐标点对象
      markers: [],
      //窗体信息
      isShowWindow: false,
      flag: false, //围栏状态
      //存储圆形
      overlays: [],

      //圈中的数据
      circleList: [],

      //弹窗设置
      modal: {
        infoShow: false,
        parameterInfo: false, //参数详情
        replayShow: false
      },

      //热力图图层
      myHeatMap: null,
      heatMapData: heatmapData,
      heatMapStatus: false
    };
  },
  methods: {
    // 实例化地图
    async initMap() {
      // console.log(this.points)
      console.log("实例化地图");
      let AMapUI = (this.AMapUI = window.AMapUI);
      let AMap = (this.AMap = window.AMap);
      // console.log(this.AMap)
      // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分

      let mapConfig = {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zooms: [4, 18], //设置地图级别范围
        showIndoorMap: false, //是否在有矢量底图的时候自动展示室内地图
        mapStyle: "amap://styles/blue" // 地图主题
        // center: [121.498586, 31.239637] //初始地图中心点
      };
      let map = (this.map = new AMap.Map(this.id, mapConfig));
      // console.log(map);
      this.map.clearMap(); //渲染之前先清一下覆盖物，防止覆盖物叠加
      //获取初始中心点并赋值
      var currentCenter = this.map.getCenter(); //此方法是获取当前地图的中心点

      this.center = [currentCenter.lng, currentCenter.lat]; //将获取到的中心点的纬度经度赋值给data的center

      //卫星图层
      this.layers.trafficLayer = new AMap.TileLayer.Satellite({ map: map });
      //路网
      this.layers.trafficLu = new AMap.TileLayer.Traffic({ map: map });
      this.layers.trafficLayer.hide();
      this.layers.trafficLu.hide();

      await this.addMarker();

      map.on("moveend", () => {
        this.computeMarkers();
      });
      map.on("zoomend", () => {
        //获取当前地图级别
        this.zoom = this.map.getZoom();
        this.computeMarkers();
      });
      map.on("resize", () => {
        this.computeMarkers();
      });
      map.on("click", () => {
        // console.log(1111)
        this.config.isShowList = false;
      });
      const _this = this;
      AMap.plugin(
        [
          "AMap.ToolBar",
          "AMap.Scale",
          "AMap.MapType",
          "AMap.MouseTool",
          "AMap.PlaceSearch",
          "AMap.MarkerClusterer"
        ],
        function() {
          //异步加载插件

          // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
          map.addControl(new AMap.ToolBar({ position: "RB" }));
          // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
          map.addControl(new AMap.Scale());

          _this.cluster = new AMap.MarkerClusterer(_this.map, _this.markers, {
            gridSize: 80, //聚合计算时网格的像素大小，默认60
            minClusterSize: 2, //聚合的最小数量。默认值为2，即小于2个点则不能成为一个聚合
            maxZoom: 18 //最大的聚合级别，
          });
        }
      );
      // console.log(AMap);
    },

    //卫星图层
    toggle() {
      if (!this.layers.layerShow) {
        this.layers.trafficLayer.show();
      } else {
        this.layers.trafficLayer.hide();
      }
        this.btnConfig.isToggle=!this.btnConfig.isToggle
      this.layers.layerShow = !this.layers.layerShow;
    },

    //路况
    road() {
      if (!this.layers.luShow) {
        this.layers.trafficLu.show();
      } else {
        this.layers.trafficLu.hide();
      }
        this.btnConfig.isRoad=!this.btnConfig.isRoad

      this.layers.luShow = !this.layers.luShow;
    },

    useMouseDraw() {
      if (!this.flag) {
        this.flag = true;
        const _this = this;
        let map = this.map;
        this.mouseTool = new AMap.MouseTool(map);
        this.btnConfig.isMouse=!this.btnConfig.isMouse

        // 监听draw事件可获取画好的覆盖物
        this.overlays = [];

        this.mouseTool.on("draw", function(e) {
          // console.log(e);
          _this.clear();
          //获取当前圆的属性
          console.log(e.obj.getOptions());
          _this.overlays.push(e.obj);
          // console.log(_this.overlays);
        });
        this.draw("circle", this.mouseTool);
        // };
        // }
        map.on("click", function(e) {
          console.log([e.lnglat.lng, e.lnglat.lat], "click");
        });
      } else {
        this.close();
      }
    },
    //绘制图层

    draw(type, mouseTool) {
      switch (type) {
        case "marker": {
          mouseTool.marker({
            //同Marker的Option设置
          });
          break;
        }
        case "polyline": {
          mouseTool.polyline({
            strokeColor: "#80d8ff"
            //同Polyline的Option设置
          });
          break;
        }
        case "polygon": {
          mouseTool.polygon({
            fillColor: "#00b0ff",
            strokeColor: "#80d8ff"
            //同Polygon的Option设置
          });
          break;
        }
        case "rectangle": {
          mouseTool.rectangle({
            fillColor: "#00b0ff",
            strokeColor: "#80d8ff"
            //同Polygon的Option设置
          });
          break;
        }
        case "circle": {
          mouseTool.circle({
            fillColor: "#00b0ff",
            strokeColor: "#80d8ff"
            //同Circle的Option设置
          });
          console.log(mouseTool);
          break;
        }
      }
    },

    clear() {
      this.map.remove(this.overlays);
      this.overlays = [];
    },
    close() {
      this.mouseTool.close(true); //关闭并清除true/false覆盖物
      this.modal.infoShow = false;
      this.flag = false;
    },

    onSearchMap() {
      let placeSearch = new AMap.PlaceSearch(this.map);
      console.log(placeSearch);
    },
    onSearch(value) {
      //   console.log(value);
    },

    //覆盖物信息窗口
    openInfo(positionResult) {
      this.isShowWindow = true;
      this.modal.infoShow = false;
      // this.info = positionResult.target.w;
      this.info = positionResult.target.w.extData;
    },

    /** 根据当前屏幕范围帅选marker */
    computeMarkers() {
      this.newViewData = {};
      //获取当前视图范围
      let now_bounds = this.map.getBounds();
      //遍历车辆数据，为了减少后台传入的重复数据，我的车辆信息列表一直使用对象保存
      this.newList = [];
      this.list.forEach((item, index) => {
        if (now_bounds.contains(item)) {
          this.newList[index] = item;
        }
      });
      this.renderMarker();
      now_bounds = null;
    },
    /** 将markers渲染到map上 */
    renderMarker() {
      let MarkerAddArr = [];
      this.newList.forEach((item, index) => {
        if (this.markers[index]) {
          // console.log(this.markers[index].getExtData())
          MarkerAddArr.push(this.markers[index]);
        }
      });
      // console.log(MarkerAddArr)
      //超过200个点则开启聚合模式  且在聚合模式下不渲染面板展示点
      if (MarkerAddArr.length >= 1) {
        if (this.cluster) {
          this.cluster.clearMarkers();
          this.cluster.setMarkers(MarkerAddArr);
        } else {
          this.createCluser(MarkerAddArr);
        }
      } else {
        if (this.cluster) {
          this.cluster.clearMarkers();
        }
        this.map.add(MarkerAddArr);
      }
      MarkerAddArr = null;
    },
    /** 创建聚合**/
    createCluser(markerArr) {
      AMap.plugin(["AMap.MarkerClusterer"], () => {
        this.cluster = new AMap.MarkerClusterer(this.map, markerArr, {
          gridSize: 80
          // renderClusterMarker

          // minClusterSize: 1,
          // maxZoom: 18
        });
      });
    },

    // _renderClusterMarker(content){
    //   var factor = Math.pow(context.count/count,1/18)
    //   var div = document.createElement('div');
    //   var Hue = 180 - factor* 180;
    //   var bgColor = 'hsla('+Hue+',100%,50%,0.7)';
    //   var fontColor = 'hsla('+Hue+',100%,20%,1)';
    //   var borderColor = 'hsla('+Hue+',100%,40%,1)';
    //   var shadowColor = 'hsla('+Hue+',100%,50%,1)';
    //   div.style.backgroundColor = bgColor
    //   var size = Math.round(30 + Math.pow(context.count/count,1/5) * 20);
    //   div.style.width = div.style.height = size+'px';
    //   div.style.border = 'solid 1px '+ borderColor;
    //   div.style.borderRadius = size/2 + 'px';
    //   div.style.boxShadow = '0 0 1px '+ shadowColor;
    //   div.innerHTML = context.count;
    //   div.style.lineHeight = size+'px';
    //   div.style.color = fontColor;
    //   div.style.fontSize = '14px';
    //   div.style.textAlign = 'center';
    //   context.marker.setOffset(new AMap.Pixel(-size/2,-size/2));
    //   context.marker.setContent(div)
    // } ,

    /**弹窗开启关闭 */
    handleOk(e) {
      console.log(e);
      this.modal.infoShow = false;
    },
    handleCancel(e) {
      console.log(e);
      // this.$emit("changeModalStatus", false);
      this.modal.infoShow = false;
    },
    //设置地图中心点
    setMapCenter(data) {
      let arr = data.length <= 0 ? this.center : data;
      this.map.panTo(arr);
    },

    //打开轨迹回放
    openReplay() {
      this.modal.replayShow = true;
    },

    //打开轨迹回放
    openInformation() {
      this.modal.parameterInfo = true;
    },

    changeHeatMap() {
      
      if (this.heatmap == null && !this.heatMapStatus) {
        this.onHeatMap();
        console.log(3)
      } else if (!this.heatMapStatus) {
        console.log(1)
        this.heatmap.hide();
        this.heatMapStatus = true;
      } else {
        console.log(2)
        this.heatmap.show();
        this.heatMapStatus = false;
      }
   

    },
    //热力图功能
    onHeatMap() {
      if (!this.isSupportCanvas()) {
        this.$message.error(
          "热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~"
        );
      }
      let _this = this;
      _this.map.plugin(["AMap.Heatmap"], function() {
        //初始化heatmap对象
        _this.heatmap = new AMap.Heatmap(_this.map, {
          radius: 25, //给定半径
          opacity: [0, 0.8]
          /*,
            gradient:{
                0.5: 'blue',
                0.65: 'rgb(117,211,248)',
                0.7: 'rgb(0, 255, 0)',
                0.9: '#ffea00',
                1.0: 'red'
            }
             */
        });
        //设置数据集：该数据为北京部分“公园”数据
        _this.heatmap.setDataSet({
          data: _this.heatMapData,
          max: 100
        });
        _this.heatMapStatus = true;
      });
    },
    //判断浏览区是否支持canvas
    isSupportCanvas() {
      var elem = document.createElement("canvas");
      return !!(elem.getContext && elem.getContext("2d"));
    },

    //关闭tab标签
    handleClose(removedTag) {
      const tags = this.tags.filter(tag => tag !== removedTag);
      console.log(tags);
      this.tags = tags;
    },

    //监听搜索框内容的变化
    onChangeInput(e) {
      console.log(e);
    },

    //获取焦点  有焦点时弹窗  单击地图取消弹窗
    onChangeFocus(e) {
      console.log(e);
      this.config.isShowList = true;
    },

    //轨迹回放
    handleOk(e) {
      console.log(e);
      this.visible = false;
    },

    //首次进入或者搜索将marker加入到地图中
    //将marker加入到地图上
    async addMarker() {
      var image =
        "https://webapi.amap.com/ui/1.1/ui/misc/PathSimplifier/examples/imgs/car.png";
      var icon = new AMap.Icon({
        image: image, // 图像 URL
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90,
        imageSize: new AMap.Size(16, 32) // 设置图标尺寸
      });
      this.list.forEach((item, i) => {
        var marker = new AMap.Marker({
          icon: icon,
          // icon:
          //   "http://webapi.amap.com/theme/v1.3/markers/n/mark_b" +
          //   (i + 1) +
          //   ".png",
          position: item,
          name: "test" + i,
          showPositionPoint: true, //显示定位 地点
          extData: {
            markerId: i,
            markerLng: item[0],
            markerLat: item[1],
            markerName: "vin" + i
          }
        });
        // 绑定点击事件到点标记对象，点击打开上面创建的信息窗体
        marker.on("click", this.openInfo);

        // 将点标记放到数组中
        this.markers.push(marker);
      });
      this.map.add(this.markers);
      //清空所有覆盖物
      // this.map.clearMap();
      //自适应障碍物
      this.map.setFitView();
    }
  },

  async created() {
    await remoteLoad(`http://webapi.amap.com/maps?v=1.4.15&key=${MapKey}`);
    await remoteLoad("http://webapi.amap.com/ui/1.0/main.js");
    //加载热力图插件

    this.initMap();
  }
};
</script>

<style lang="scss" scoped>
.v1-map {
  // height: 899px;
  height: 100%;
  ::v-deep .amap-scale-text {
    color: #fff;
  }
  ::v-deep .test {
    color: red;
  }
}
.v1-map-box {
  position: relative;
  height: 100%;
  .input-card {
    width: 354px; /*no*/
    padding-left: 16px;
    position: absolute;
    top: 32px;
    .ant-select {
      min-width: 124px; /*no*/
    }
    .ant-input-search {
      width: 210px; /*no*/
    }
    ::v-deep .ant-select-selection--single {
      height: 32px !important;
      .ant-select-selection__rendered {
        line-height: 32px !important;
      }
    }
    .input-item {
      .search-box {
        color: #333;
        padding: 4px 8px;
        // width:99%;
        width: 334px;/*no*/

        background: #fff;
        .search-status {
          height: 28px;
          line-height: 28px;
          margin-bottom: 4px;
          .ant-col {
            padding-left: 4px;
          }
          .onLine {
            font-size: 16px;
            color: rgb(72, 200, 102);
          }
          .allLine {
            font-size: 16px;
            color: #2f7dc0ff;
          }
          .outLine {
            font-size: 16px;
          }
        }
        .search-where {
          height: auto;

          line-height: 24px;
          margin: 4px 0;
        }
        .search-text {
          height: 24px; /*no*/
          line-height: 24px; /*no*/ /*no*/
          margin: 8px 0 16px;

          .ant-btn {
            height: 24px;
            line-height: 24px;
            padding: 0 15px;
          }
          .ant-input {
            height: 24px;
            line-height: 24px;
          }
        }
        .search-list {
          padding-right: 16px;
          padding-left: 4px;
          height: 72px;
          border-left: 4px solid #fff;
          &:hover {
            background: #f0f2f5;
            cursor: pointer;
            border-left: 4px solid #528dc3;
          }
          .ant-col {
            height: 32px;
            line-height: 32px;
            // margin: 4px 0;/*no*/
          }
          .search-btn {
            .ant-col {
              margin: 0px;
            }
            .ant-btn{
              margin-top:4px;
            }
          }
          .ant-tag {
              margin-top:6px;

            height: 28px;
            line-height: 28px;
          }
          .ant-btn {
            height: 28px;
            width: 104px;
            line-height: 28px;
            padding: 0 15px;
          }
        }
        .search-list-footer {
          margin: 8px 0; /*no*/
        }
      }
    }
  }
  .input-btn {
    width: 350px;
    min-width: 280px; /*no*/
    padding: 0 16px;
    position: absolute;
    top: 32px;
    right: 4px;
  }
}
::v-deep .mapList {
  height: 880px;
  margin-top: 64px;
  overflow: auto;

  width: 1800px !important;

  //    background: skyblue;
  .ant-modal-header {
    height: 40px;
    padding: 8px 24px;
    // line-height: 48px;/*no*/
  }
  .ant-modal-close-x {
    height: 40px;
    line-height: 40px;
  }
  .ant-modal-content {
    height: 100%;
    .ant-modal-body {
      background-color: rgb(9, 21, 72);
      height: 816px;
      padding: 0 !important;
      max-height: unset;
      overflow-x: hidden;
      //   height: auto;
    }
  }
  .content-right {
    background: #f5f5f5;
    // height: 100%!important;
  }
  //参数详情css
}
::v-deep .amap-logo {
  display: none !important;
  opacity: 0 !important;
}
::v-deep .amap-copyright {
  opacity: 0 !important;
}
</style>
