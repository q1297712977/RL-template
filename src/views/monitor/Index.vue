<template>
  <div class="common-box  common-info">
    <!-- 面包屑 -->
    <a-row type="flex" justify="start" class="content-box">
      <a-col class="content-right">
        <a-row type="flex" justify="center" class="content-tool">
          <a-col >
              <a-radio-group v-model="config.value" @change="onChange">
              <a-radio :value="24">
                1屏
              </a-radio>
              <a-radio :value="12">
                2屏
              </a-radio>
            </a-radio-group>
          </a-col>
          <!-- <a-col>
            <a-row type="flex" justify="start" class="tool-where">
              <a-col>
                <a-select
                  show-search
                  placeholder="终端编号"
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
                <a-select
                  show-search
                  placeholder="车架号"
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
                <a-date-picker
                  v-model="startValue"
                  :disabled-date="disabledStartDate"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="开始时间"
                  @openChange="handleStartOpenChange"
                />
              </a-col>
              <a-col>
                <a-date-picker
                  v-model="endValue"
                  :disabled-date="disabledEndDate"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="结束时间"
                  :open="endOpen"
                  @openChange="handleEndOpenChange"
                />
              </a-col>

              <a-col>
                <a-button type="primary" @click="getList()"
                  >查询</a-button
                ></a-col
              >
              <a-col> <a-button @click="resetForm()">重置</a-button> </a-col>
            </a-row>
          </a-col> -->
        </a-row>
        <div class="content-table">
               <a-row class="map-box" :gutter="16">
        <a-col :span="config.value" class="v1-map-1" v-for="v in list" :key="v">
            <myMap></myMap>
        </a-col>
      </a-row>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import myMap from "@/components/v1-map/common-map";

export default {
  components: {
    myMap
  },
    computed: {
    list() {
      return this.config.value==12?2:1
    }
  },
  data() {
    return {
      config: {
        value: 24,
        mapZoom: 11
      },
    };
  },
  methods: {
    

    delMap() {
      map && map.destroy();
      log.info("地图已销毁");
    },
    //切屏幕
    onChange(e) {
      // console.log("radio checked", e.target.value);
      console.log(e.target.value)
      
      console.log(this.config.value)
      // this.initMap();
    },

  }
};
</script>

<style lang="scss" scoped>
.common-box{
  height:100%!important;
}
.content-table {
  height: 89.1% !important;
  .map-box{

    height:100%;
    .v1-map-1{
      height:100%;
    }
  }
}
.myselect {
  width: 150px; /*no*/
}

</style>
