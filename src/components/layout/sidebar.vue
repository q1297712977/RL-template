<template>
  <div class="myMenu">
    <a-tree
      :tree-data="menuList"
      @select="onSelectTree"
      :replace-fields="treeConfig.replaceFields"
      :blockNode="true"
    >
      <template slot="custom" slot-scope="item">
        <a-row type="flex" justify="space-between" class="isTreeClass">
          <a-col :span="18" @mouseenter.stop="tcolor($event,item)" @mouseleave="lcolor($event,item)">
            <span>{{
              item.label
            }}</span>
          </a-col>
          <a-col class="tree-icon-right" :span="6" v-show="config.seen && item.id == config.current">


             <a-button type="link" icon="edit"  size="small"  @click="(e) => onEdit(item)" />
            <a-popconfirm
              class="common-operation "
              title="确认删除该组织"
              @confirm="(e) => onDel(item)"
            >
             <a-button type="link" icon="delete" size="small"/>
            </a-popconfirm>
          </a-col>
        </a-row>
      </template>
    </a-tree>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
    },
  },
  computed: {
    menuList: {
      get: function () {
        // console.log(this.list);
        return this.list;
      },
      set: function () {},
    },
  },
  data() {
    return {

      config: {
        seen: false,
        current: 0,
        status: false,
        num: 1,
      },
      treeConfig: {
        treeData: [],
        treeData1: [],
        orgTreeEditShow: false,
        selectedKey: "",
        value: [],
        replaceFields: {
          key: "id",
          title: "label",
          children: "children",
          value: "id",
        },
        form: {
          deptName: "",
        },
      },
    };
  },
  methods: {
    handleClick(e) {
      console.log("click", e);
    },
    titleClick(e) {
      console.log("titleClick", e);
    },
    tcolor: function (e, v) {
      console.log(e, v);
      this.config.seen = true;
      this.config.current = v.id;
    },
    lcolor: function (e) {},
    //单击组织结构
    onSelectTree(selectedKeys, info) {
      console.log(selectedKeys, info);
      // if (selectedKeys[0] != undefined) {
      //   this.where.deptId = selectedKeys[0];
      // }
      //调用接口人员接口
      // this.getUserByDept();
    },
  },
};
</script>

<style lang="scss" scoped>
.tree-icon-right{
  // background: red;
  .ant-btn{
    color:#181B31
  }

}
</style>