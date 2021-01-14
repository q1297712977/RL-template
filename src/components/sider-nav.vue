<template>
  <a-layout class="sider-memu">
    <a-menu
      mode="inline"
      :selectedKeys="[menuPath]"
      :default-open-keys="openkey"
      style="height: 100%"
      :inlineCollapsed="collapsed"
    >
      <template v-for="item in list">
        <a-menu-item
          class="sider-menu-first"
          v-if="item.children == undefined"
          :key="item.path"
        >
          <router-link :to="item.path">
            <span>
              <a-icon  :type="item.meta.icon" />
              {{ item.name }}
            </span>
          </router-link>
        </a-menu-item>
        <a-sub-menu  :key="item.path" v-else>
          <span slot="title" class="layout-sider-text">
            <a-icon :type="item.meta.icon"/>
            {{ item.name }}
          </span>
          <template v-for="o in item.children">
            <a-menu-item :key="o.path">
              <router-link :to="o.path">
                <span>
                  {{ o.name }}
                </span>
              </router-link>
            </a-menu-item>
          </template>
        </a-sub-menu>
      </template>
    </a-menu>
  </a-layout>
</template>

<script>
export default {
  props: {
    // openkey: {
    //   type: String,
    //   default: "",f
    // },
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      menuPath: "",
      list: [],
      openkey: [],
    };
  },
  watch: {

    $route: {
      handler(to, from) {
        // console.log(to,from)
        this.getPath();
        if (from != undefined) {
          let toPath = to.path.split("/")[1];
          let fromPath = from.path.split("/")[1];
          if (toPath != fromPath) {
            this.getMenus();
          }
        } else {
          this.getMenus();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    
    // this.getPath();
    // this.getMenus()
  },
  methods: {
    getPath() {
      let path = this.$route.path.split("/");
      // console.log(path)
      if (Object.keys(path).length >= 3) {
        //  console.log(1)
        this.menuPath = "/" + path[1] + "/" + path[2];
      } else {
        // console.log(2)
        this.menuPath = this.$route.path;
      }
      // console.log(this.menuPath)
    },
    async getMenus() {
      // console.log(1);
      this.openkey = [];
      let path = this.$route.path.split("/");
      let arr = [];
      // console.log(arr,typeof(arr));
      if(this.$store.state.menus==''){
        if(localStorage.getItem('menus')==null){
            arr=await this.getUserRouter()
        }else{
          arr=localStorage.getItem('menus')
        }
      }else{
        arr = this.$store.state.menus
      }
      let menus = JSON.parse(this.$store.state.menus);
      this.list = menus.find((item) => item.path == "/" + path[1]).children;
      // console.log(this.list)
      this.list.forEach((item) => {
        if (item.children != undefined) {
          this.openkey.push(item.path);
        }
      });
      // console.log(this.openkey);
    },
    async getUserRouter() {
      let _this = this;
      // console.log(this);
      let data = await this.$api.system.getUserRouter();
      if (data.data.code == 0) {
        let arr = data.data.data.routes;
        arr.pop();
        // this.menuList = arr;
       
        // let menus = data.data.data.routes;
        _this.$store.dispatch("changeMenus", JSON.stringify(arr));
        // console.log(JSON.parse(localStorage.getItem("menus")));
        return arr
      } else {
        this.logout();
      }
    },
      logout() {
      // localStorage.removeItem("Authorization");
      localStorage.clear()
      this.$router.push("/login");
      this.$message.success("退出成功");
    },
  },
};
</script>

<style lang="scss" scoped>
.sider-memu {
  height: 100%;
  .ant-menu-inline .ant-menu-item::after {
    left: 0;
    right: auto;
  }
  .ant-menu-item-selected {
    background: rgba(230, 240, 255, 1) !important;
    color: #2c68ff;
  }
  .ant-menu-item {
    color: #333333;
    font-size: 14px;
    text-align: left;
    margin-bottom: 0;
  }
  .ant-menu-item-active {
    background: rgba(230, 240, 255, 1) !important;
  }
  .ant-menu-submenu .ant-menu-submenu-title {
    padding-left: 12px !important;
  }
}
</style>
