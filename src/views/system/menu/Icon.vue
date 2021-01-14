<template>
  <a-modal
    v-model="show"
    destroyOnClose
    centered
    :footer="null"
    :width="'60%'"
    size="small"
    :closable="false"
    @cancel="handleCancel"
    dialogClass="uploadModelClass"
  >
    <a-tabs v-model="table.tabId" size="small" @change="getIcon">
      <a-tab-pane :key="item.key" :tab="item.name" v-for="item in table.list">
        <ul class="icon-list">
          <li
            v-for="(item, index) in iconList"
            :key="index"
            @click="copy(item)"
          >
            <a-icon :type="item.name" />
          </li>
        </ul>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
import getIconList from "@/utils/Icon";
const list = [
  { key: 0, name: "方向性图标", tab: "tab1" },
  { key: 1, name: "指示性图标", tab: "tab2" },
  { key: 2, name: "编辑类图标", tab: "tab3" },
  { key: 3, name: "数据类图标", tab: "tab4" },
  { key: 4, name: "品牌和标识", tab: "tab5" },
  { key: 5, name: "通用网站图标", tab: "tab6" }
];
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      table: {
        list,
        iconList: [],
        tabId: 0
      }
    };
  },
  computed: {
    show: {
      get: function() {
        return this.isShow;
      },
      set: function() {}
    }
  },
  created() {
    this.getIcon();
  },
  methods: {
    async getIcon(key = 0) {
      this.iconList = getIconList(key);
      // console.log(this.iconList)
    },
    copy(key) {
      // console.log(key)
      this.$emit("changeIconText", key.name);
      this.$emit("changeModalStatus", false);
      this.$message.success("图标已设置");
    },
    handleCancel(e) {
      this.$emit("changeModalStatus", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.icon-list {
  list-style: none;
  margin-bottom: 0px;
  li {
    width: 40px;
    height: 40px;
    float: left;
    text-align: center;
    list-style: none;
    cursor: pointer;
    color: #555;
    transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
    position: relative;
    border-radius: 4px;
    background-color: #fff;
    overflow: hidden;
    padding: 10px 0 0;
    &:hover {
      background-color: #1890ff;
      color: #fff;
    }
    span {
      display: block;
      text-align: center;
      transform: scale(0.83);
      font-family: Lucida Console, Consolas;
      white-space: nowrap;
    }
    .anticon {
      font-size: 24px;
      //   margin: 12px 0 8px;
      transition: transform 0.3s ease-in-out;
      will-change: transform;
    }
  }
}

</style>