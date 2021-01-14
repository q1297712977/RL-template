<template>
  <div class="v1-map-box">
    <div :id="id" class="v1-map"></div>
    <div class="input-card">
      <div class="input-item">
        <!-- <a-button class="btn" @click="toggle()">显示/隐藏实时路况</a-button> -->
        <a-row type="flex" justify="space-between">
          <a-col :span="6">
            <a-input-search
              placeholder="请输入车辆VIN码"
              enter-button
              @search="onSearch"
            />
          </a-col>
          <a-col>
            <a-row type="flex" justify="start" :gutter="6">
              <a-col>
                <a-button class="btn" @click="toggle()">卫星</a-button>
              </a-col>
              <a-col>
                <a-button class="btn" @click="road()">路况</a-button>
              </a-col>
              <a-col>
                <a-button
                  class="btn"
                  :disabled="isFence"
                  @click="useMouseDraw()"
                  >围栏</a-button
                >
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
    </div>

    <!-- 组件关键代码 -->
    <infoWindowComponent
      ref="infoWindowComponent"
      v-show="isShowWindow"
      :info="info"
    ></infoWindowComponent>
  </div>
</template>



<script>
import remoteLoad from "@/utils/remoteLoad.js";
import { MapKey, MapCityName } from "@/config/config";
import infoWindowComponent from "@/components/v1-map/common-openInfo";

export default {
  components: {
    infoWindowComponent
  },
  watch: {
    // center(n, o) {
    //   if (this.circle != null) {
    //     this.drawCircle();
    //   }
    // },
    zoom(n, o) {
      console.log(n)
      if (n <= 17&&o==18) {
        // this.delCircle();
        this.close()
      }
    },
    //获取当前圆的基本信息
    overlays(n,o){
      console.log(n,o)
    }

  },
  computed: {
    isFence() {
      // return this.zoom==19?false:true
      return this.zoom == 18 ? false : true;
    }
  },
  data() {
    return {
      mouseTool: null,
      center: [116.42792, 39.902896], //经度+纬度
      search_key: "", //搜索值
      lists: [], //地点列表
      search_list: [], //搜索结果列表
      loading: false,
      noSearchShow: false, //无搜索结果提示，无搜索结果时会显示暂无搜索结果
      id: Math.random()
        .toString(36)
        .substr(2),
      layers: [],
      isVisible: false,
      trafficLayer: null,
      zoom: 11,

      list: [
        [116.405467, 39.907761],
        [116.415467, 39.907761],
        [116.415467, 39.917761],
        [116.425467, 39.907761],
        [116.385467, 39.907761]
      ],
      //info传值
      info: {},
      //坐标点对象
      markers: [],
      //窗体信息
      isShowWindow: false,
      //存储圆形
      overlays: []
    };
  },
  methods: {
    // 实例化地图
    async initMap() {
      // console.log(this.points)
      let AMapUI = (this.AMapUI = window.AMapUI);
      let AMap = (this.AMap = window.AMap);
      // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
      let mapConfig = {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: this.zoom, //初始地图级别
        layers: this.layers,
         zooms: [4,18],//设置地图级别范围
        // mapStyle: "amap://styles/blue" // 地图主题
        // center: [121.498586, 31.239637] //初始地图中心点
        // viewMode:'3D'//使用3D视图
      };
      let map = (this.map = new AMap.Map(this.id, mapConfig));

      this.map.clearMap(); //渲染之前先清一下覆盖物，防止覆盖物叠加
      //获取初始中心点并赋值
      var currentCenter = this.map.getCenter(); //此方法是获取当前地图的中心点

      this.center = [currentCenter.lng, currentCenter.lat]; //将获取到的中心点的纬度经度赋值给data的center

      //卫星图层
      this.trafficLayer = new AMap.TileLayer.Traffic({
        zIndex: 10
      });
      this.trafficLayer.setMap(map);
      this.trafficLayer.hide();

      let markers = [];

      // 为每个坐标创建信息窗体
      var infoWindow = (this.infoWindows = new AMap.InfoWindow());
      this.list.forEach((item, i) => {
        var marker = new AMap.Marker({
          map: this.map,
          icon:
            "http://webapi.amap.com/theme/v1.3/markers/n/mark_b" +
            (i + 1) +
            ".png",
          position: item,
          name: "test" + i
        });

        // // var contentString = `<div class="test">test</div>`;
        // var contentString = this.openInfo()
        // marker.content = contentString;
        // console.log(marker)
        // 绑定点击事件到点标记对象，点击打开上面创建的信息窗体
        marker.on("click", this.openInfo);

        // 将点标记放到数组中
        this.markers.push(marker);
      });

      // function mapClick(mapEvent) {
      //   console.log(mapEvent.target);
      //   infoWindow.setContent(mapEvent.target.content);
      //   infoWindow.open(this.getMap(), this.getPosition());
      // }
      var moveendfun = e => {
        // 获取地图中心点
        currentCenter = map.getCenter();
        this.center = [currentCenter.lng, currentCenter.lat];
        //根据地图中心点查附近地点
      };
      var zoomendfun = e => {
        // 获取级别
        this.zoom = this.map.getZoom();
        //根据地图中心点查附近地点
      };
      //绑定移动和缩放事件
      map.on("moveend", moveendfun);
      map.on("zoomend", zoomendfun);

      AMap.plugin(
        ["AMap.ToolBar", "AMap.Scale", "AMap.MapType", "AMap.MouseTool"],
        function() {
          //异步加载插件

          // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
          map.addControl(new AMap.ToolBar());
          // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
          map.addControl(new AMap.Scale());
        }
      );

      // this.useMouseDraw(this.map);
    },

    toggle() {
      if (this.layers.length > 0) {
        this.layers = [];
      } else {
        this.layers = [
          new AMap.TileLayer.Satellite(),
          new AMap.TileLayer.RoadNet()
        ];
      }
      this.initMap();
    },

    //路况
    road() {
      if (this.isVisible) {
        this.trafficLayer.hide();
        this.isVisible = false;
      } else {
        console.log(2);
        this.trafficLayer.show();
        this.isVisible = true;
      }
    },

    useMouseDraw() {
      const _this = this;
      let map = this.map;
      this.mouseTool = new AMap.MouseTool(map);
      // 监听draw事件可获取画好的覆盖物
      this.overlays = [];

      this.mouseTool.on("draw", function(e) {
        // console.log(e)
        _this.clear();
        _this.overlays.push(e.obj);
        console.log(_this.overlays)
      });
      // this.radios = document.getElementsByName("func");
      // for (let i = 0; i < this.radios.length; i++) {
      //   this.radios[i].onchange = e => {
      // this.draw(e.target.value, this.mouseTool);
      this.draw("circle", this.mouseTool);
      // };
      // }
      map.on("click", function(e) {
        console.log([e.lnglat.lng, e.lnglat.lat], "click");
      });
    },
    //绘制图层

    draw(type, mouseTool) {
      console.log(type, "type");
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
    },
    onSearch(value) {
      //   console.log(value);
    },
    // drawCircle() {
    //   this.delCircle();
    //   this.circle = new AMap.Circle({
    //     center: new AMap.LngLat(this.center[0], this.center[1]), // 圆心位置
    //     radius: 100, //半径
    //     strokeColor: "#F33", //线颜色
    //     strokeOpacity: 1, //线透明度
    //     strokeWeight: 3, //线粗细度
    //     fillColor: "#ee2200", //填充颜色
    //     fillOpacity: 0.35 //填充透明度
    //   });
    //   // map.add(marker);
    //   //   this.map.add([marker, circle]);
    //   this.map.add(this.circle);
    //   //   this.map.setFitView(this.circle);
    // },
    // delCircle() {
    //   if (this.circle != null) {
    //     this.map.remove(this.circle);
    //     // this.map.setFitView();
    //   }
    // },
    //覆盖物信息窗口
    openInfo(positionResult) {
      // console.log(positionResult)
      this.isShowWindow = true;
      this.info = positionResult.target.w;
      var that = this;
      let infoWindow = new AMap.InfoWindow({
        isCustom: true,
        content: that.$refs.infoWindowComponent.$el,
        offset: new AMap.Pixel(0, -25)
      });
      infoWindow.open(this.map, positionResult.lnglat);
      this.infoWindow = infoWindow;
      // 调用组件方法，初始化组件页面的infoWindow等数据
      that.$refs.infoWindowComponent.initialize({
        overlay: positionResult.target,
        infoWindow: that.infoWindow
      });
    }
  },

  async created() {
    await remoteLoad(`http://webapi.amap.com/maps?v=1.4.15&key=${MapKey}`);
    await remoteLoad("http://webapi.amap.com/ui/1.0/main.js");
    this.initMap();
  }
};
</script>

<style lang="scss" scoped>
.v1-map {
  height: 100%;
  ::v-deep .amap-scale-text {
    color: #333;
  }
  ::v-deep .test {
    color: red;
  }
}
</style>