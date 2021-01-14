<template>
  <a-layout-content>
    <a-row type="flex" justify="center" class="my-sub-menu" v-show="isShow">
      <a-col class="header-menu"
        ><a-menu :selectedKeys="[menuPath]" mode="horizontal">
          <template v-for="item in list">
            <a-menu-item :key="item.path" v-if="item.children == undefined">
              <router-link :to="item.path">{{ item.name }}</router-link>
            </a-menu-item>
            <a-sub-menu v-else :key="item.path">
              <span slot="title" class="submenu-title-wrapper"
                >{{ item.name }} <a-icon type="down"
              /></span>
              <a-menu-item :key="child.path" v-for="child in item.children">
                <router-link :to="child.path">{{ child.name }}</router-link>
              </a-menu-item>
            </a-sub-menu>
          </template>
        </a-menu></a-col
      >
    </a-row>
    <router-view></router-view>
  </a-layout-content>
</template>

<script>
export default {
    data() {
        return {
                  menuPath: "",
      list: [],
      openkey: [],
        }
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
  computed: {
    isShow() {
      return this.list.length>0 
    }
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
      if (this.$store.state.menus == "") {
        if (localStorage.getItem("menus") == null) {
          arr = await this.getUserRouter();
        } else {
          arr = localStorage.getItem("menus");
        }
      } else {
        arr = this.$store.state.menus;
      }
      let menus = JSON.parse(this.$store.state.menus);
      this.list = menus.find((item) => item.path == "/" + path[1]).children;
      if(this.list!=undefined){
        this.list.forEach((item) => {
          if (item.children != undefined) {
            this.openkey.push(item.path);
          }
        });
      }else{
        this.list=[]
      }
      // console.log(this.list)
      // console.log(this.openkey);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>