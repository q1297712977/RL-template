<template>
  <a-layout>
    <a-layout-header>
      <a-row type="flex" justify="space-between">
        <a-col :span="4">
          <a-row type="flex" justify="start" :gutter="8">
            <a-col><a-icon type="insurance" class="header-icon" /></a-col>
            <a-col class="header-title">雄韬伟略 从氢出发</a-col>
          </a-row>
        </a-col>
        <a-col :span="16">
          <a-row type="flex" justify="center" class="common-menu">
            <a-col class="header-menu"
              ><a-menu mode="horizontal" :selectedKeys="routePath">
                <a-menu-item :key="item.path" v-for="item in Menus">
                  <router-link :to="item.path">{{ item.name }}</router-link>
                </a-menu-item>
                <!-- <a-menu-item key="/quality">
                  <router-link :to="'/quality'">数据质量</router-link>
                </a-menu-item>
                <a-menu-item key="/metadata">
                  <router-link :to="'/metadata'">元数据</router-link>
                </a-menu-item>
                <a-menu-item key="/standard">
                  <router-link :to="'/standard'">数据标准</router-link>
                </a-menu-item>
                <a-menu-item key="/basic">
                  <router-link :to="'/basic'">基础数据</router-link>
                </a-menu-item>
                <a-menu-item key="/system">
                  <router-link :to="'/system'">系统管理</router-link>
                </a-menu-item> -->
              </a-menu></a-col
            >
          </a-row>
        </a-col>
        <a-col :span="4" class="header-info">
          <a-row type="flex" justify="end" :gutter="16">
            <a-col>
                  <a-button type="link" class="warn-icon" @click="goMessage">
                  <a-badge :count="this.$store.state.messageCount" dot>
                    <a-icon
                      type="bell"
                      :style="{ fontSize: '20px', color: '#fff' }"
                    />
                  </a-badge>
                </a-button>
            </a-col>
            <!-- <a-col> <a-avatar>USER</a-avatar></a-col> -->
            <!-- <a-col>   <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /></a-col> -->
            <a-col>{{
                  this.$store.state.userInfo.nickName
                }}</a-col>
                <a-col>
                                    <a-dropdown>
                    <a-icon
                      type="caret-down"
                      @click="(e) => e.preventDefault()"
                    />
                    <a-menu slot="overlay">
                      <a-menu-item key="0">
                        <span @click="logout()">退出</span>
                      </a-menu-item>
                      <!-- <a-menu-item key="1">
                        <span>个人中心</span>
                      </a-menu-item>-->
                    </a-menu>
                  </a-dropdown>
                </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-layout-header>
      <!-- <a-layout-content> -->
    <router-view></router-view>
      <!-- </a-layout-content> -->
    <a-layout-footer></a-layout-footer>
  </a-layout>
</template>

<script>
import { mapMutations, Store } from "vuex";

export default {
  data() {
    return {
      // userInfo: {},
      collapsed: false,
      backstyle: {
        backgroundImage: "url(" + require("@/assets/img/homeLogo.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      },
      messageCount: 0,
      routePath: ["/"],
      form: {},
      menuList: {},
      // Roles:''
      // menuList: JSON.parse(this.$store.state.Roles)
    };
  },
  computed: {
    Menus() {
      return this.$store.state.menus
        ? JSON.parse(this.$store.state.menus)
        : this.menuList;
    },
  },
  mounted() {
    // this.getMenu();
  },
  created() {
    this.getUserRouter();
    this.getUser();
    this.getMessageCount();
    this.routePath = [];
    this.routePath.push("/" + this.$route.path.split("/")[1]);
    // console.log(this.Menus)
  },
  watch: {
    $route(to, from) {
      if (to.path != from.path) {
        this.routePath = [];
        this.routePath.push("/" + this.$route.path.split("/")[1]);
      }
    },
  },
  methods: {
    // ...mapMutations(["changeMenus", "UserList"]),
    async getUser() {
      let _this = this;
      const data = await this.$api.system.getUser();
      // console.log(data);
      if (data.data.code == 0) {
        // this.form = data.data.data;
        this.$store.dispatch("UserList", data.data.data);
        this.form = this.$store.state.userInfo;
      } else {
        this.$message.error(data.data.message);
      }
    },
    async getMessageCount() {
      const data = await this.$api.system.getMessageCount();
      if (data) {
        // this.messageCount=data.data
        this.$store.dispatch("MessageCount", data.data);
      }
    },
    logout() {
      // localStorage.removeItem("Authorization");
      // let data =  this.$api.login.logout()

      localStorage.clear();
      this.$router.push("/login");
      this.$message.success("退出成功");
    },
    goMessage() {
      console.log(this.$route.name)
      if (this.$route.name != "MessageIndex") {
        this.$router.push({ name: "MessageIndex" });
      }
    },
    async getUserRouter() {
      let _this = this;
      // console.log(this);
      let data = await this.$api.system.getUserRouter();
      if (data.data.code == 0) {
        let arr = data.data.data.routes;
        arr.pop();
        this.menuList = arr;
        // console.log(this.menuList)
        // console.log(arr)
        // let menus = data.data.data.routes;
        _this.$store.dispatch("changeMenus", JSON.stringify(arr));
        _this.$store.dispatch("changeRoles", data.data.data.permissions);
        // console.log(JSON.parse(localStorage.getItem("menus")));
      } else {
        this.logout();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.header-menu {
  ::v-deep .ant-menu-horizontal {
    border-bottom: none !important;
    line-height: 64px !important;
  }
}
</style>