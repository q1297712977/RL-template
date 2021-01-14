<template>
  <div class="common-box  common-info">
    <!-- 面包屑 -->
    <a-row type="flex" justify="start" class="content-box">
      <a-col class="content-right">
        <!-- <a-row type="flex" justify="space-between" class="content-tool">
          <a-col :span="10">
            <a-button icon="plus" type="primary" @click="onAdd()">
              添加车队
            </a-button>
          </a-col>
          <a-col>
            <a-row type="flex" justify="start" class="tool-where">
              <a-col>
                <a-input
                  placeholder="请输入车队名称"
                  v-model="where.fleetName"
                />
              </a-col>
              <a-col>
                <a-button type="primary" @click="getList()"
                  >查询</a-button
                ></a-col
              >
              <a-col> <a-button @click="resetForm()">重置</a-button> </a-col>
            </a-row>
          </a-col>
        </a-row> -->
        <div class="content-table">
          <div class="v1-map-box">
            <div :id="id" class="area-map"></div>
          </div>
          <div class="alarm-box" v-show="!modal.isShowWindow">
            <a-row type="flex" class="alarm-box-title" justify="center">
              <a-col>报警车辆 : 333</a-col>
              <a-col>报警次数 : 456</a-col>
            </a-row>
            <a-row
              type="flex"
              justify="space-between"
              class="alarm-box-search"
              :gutter="8"
            >
              <a-col :span="20">
                <a-select
                  show-search
                  placeholder="请搜索车队"
                  option-filter-prop="children"
                  style="width: 100%"
                  :filter-option="filterOption"
                  @change="handleChange"
                  size="small"
                >
                  <a-select-option value="jack"> 车队测试1 </a-select-option>
                  <a-select-option value="lucy"> 车队测试2 </a-select-option>
                  <a-select-option value="tom"> 车队测试3 </a-select-option>
                </a-select>
              </a-col>
              <a-col :span="4">
                <a-button type="primary" icon="search"> </a-button>
              </a-col>
            </a-row>
            <template>
              <a-row
                type="flex"
                justify="start"
                class="alarm-box-list"
                v-for="i in 5"
                :key="i"
              >
                <a-col :span="24"> 车队 : 大同开沃车队 </a-col>
                <a-col :span="12"> 报警车辆 : 3333 </a-col>
                <a-col :span="12"> 报警次数 : 3333333 </a-col>
              </a-row>
            </template>
            <a-row
              type="flex"
              justify="end"
              :gutter="8"
              class="alarm-box-footer"
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
          </div>
        </div>
      </a-col>
    </a-row>
    <!-- 组件关键代码 -->
    <infoWindowComponent
      ref="infoWindowComponent"
      v-show="modal.isShowWindow"
      @changeModalStatus="modal.isShowWindow = false"
      @changeReplayStatus="openReplay()"
      :info="info"
    ></infoWindowComponent>
    <!-- 轨迹回放 -->
    <!-- <replayInfo
      :isShow="modal.replayShow"
      @changeModalStatus="modal.replayShow = false"
    ></replayInfo> -->
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
  </div>
</template>

<script>
import remoteLoad from "@/utils/remoteLoad.js";
import { MapKey, MapCityName } from "@/config/config";
import infoWindowComponent from "@/components/v1-map/common-openInfo";
import replayInfo from "@/components/v1-map/replayInfo";
export default {
  components: {
    infoWindowComponent,
    replayInfo
  },
  data() {
    return {
      pageConfig: {
        num: 1,
        size: 10
      },
      mouseTool: null,
      center: [116.42792, 39.902896], //经度+纬度
      config: {
        isShowList: false
      },
      modal: {
        isShowWindow: false,
        replayShow: false
      },
      infoWindows: null, //单击车辆详情
      lists: [], //地点列表
      id: Math.random()
        .toString(36)
        .substr(2),
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
      markers: [] //存储所有车辆对象
    };
  },
  async created() {
    await remoteLoad(`http://webapi.amap.com/maps?v=1.4.15&key=${MapKey}`);
    await remoteLoad("http://webapi.amap.com/ui/1.0/main.js");
    this.$nextTick(() => {
      this.initMap();
    });
  },
  methods: {
    // 实例化地图
    async initMap(status = false) {
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

      let markers = [];

      // // 为每个坐标创建信息窗体

      //添加障碍物
      this.addMarker();
      // var infoWindow = (this.infoWindows = new AMap.InfoWindow());

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
        console.log(1111);
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
          map.addControl(new AMap.ToolBar());
          // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
          map.addControl(new AMap.Scale());

          _this.cluster = new AMap.MarkerClusterer(_this.map, _this.markers, {
            gridSize: 80, //聚合计算时网格的像素大小，默认60
            minClusterSize: 2, //聚合的最小数量。默认值为2，即小于2个点则不能成为一个聚合
            maxZoom: 18 //最大的聚合级别，
          });
        }
      );
    },

    //将marker加入到地图上
    addMarker() {
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
      //自适应障碍物
      this.map.setFitView();
    },
    //覆盖物信息窗口
    openInfo(positionResult) {
      this.modal.isShowWindow = true;
      // this.info = positionResult.target.w;
      this.info = positionResult.target.w.extData;
    },
    //打开轨迹回放
    openReplay() {
      this.modal.replayShow = true;
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
    },

    /**弹窗开启关闭 */
    handleOk(e) {
      console.log(e);
      this.modal.replayShow = false;
    },
    handleCancel(e) {
      console.log(e);
      // this.$emit("changeModalStatus", false);
      this.modal.replayShow = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.content-table {
  height: 96% !important;
  position: relative;
  .v1-map-box {
    height: 100%;
    width: 100%;
    .area-map {
      height: 100%;
      width: 100%;
    }
  }
  .alarm-box {
    position: absolute;
    top: 24px;
    right: 16px;
    width: 320px;/*no*/
    background: #fff;
    color: #333;
    border-radius: 4px;
    .alarm-box-title {
      height: 32px;
      line-height: 32px;
      border-bottom: 1px solid #666;
      margin: 0 8px 8px;
      .ant-col {
        padding: 0 8px;
      }
    }
    .alarm-box-search {
      padding: 0 4px;
      .ant-btn {
        width: 100%;
      }
    }
    .alarm-box-list {
      //  padding:0 4PX;
      border-left: 4px solid #fff;
      .ant-col {
        height: 24px;/*no*/
        line-height: 24px;/*no*/
        padding-left: 8px;
      }
      &:hover {
        cursor: pointer;
        border-left: 4px solid #528dc3;
        background: #f0f2f5;
      }
    }
    .alarm-box-footer {
      margin: 8px 0;
    }
  }
}
::v-deep .mapList {
  height: 90%;
  margin-top: 40px;
  overflow: auto;
  padding-bottom:0px!important;
  width: 1800px !important;

  //    background: skyblue;
  .ant-modal-header {
    // height: 40px;
    padding: 8px 24px;/*no*/
    // line-height: 40px;
  }
  .ant-modal-close-x {
    height: 40px;/*no*/
    line-height: 40px;/*no*/
  }
  .ant-modal-content {
    height: 100%;
    .ant-modal-body {
      // background-color: rgb(9, 21, 72);
      height: 90%;
      padding: 0 !important;
      max-height: unset;
      overflow-x: hidden;
      //   height: auto;
    }
  }
}
//隐藏高德地图logo
::v-deep .amap-logo {
  display: none !important;
  opacity: 0 !important;
}
::v-deep .amap-scale-text{
  color:#fff;
}
::v-deep .amap-copyright {
  opacity: 0 !important;
}
</style>
