<template>
  <a-col class="content-left">
    <a-row class="content-left-where" type="flex" justify="start">
      <a-col :span="24">
        <a-input-search placeholder="请输入" v-model="selectDeptName" />
      </a-col>
      <a-col :span="24">
        <a-button type="primary" icon="usergroup-add" @click="onFatherAdd">
          新增组织
        </a-button>
      </a-col>
    </a-row>
    <div class="content-left-list">
      <!-- <mySideBar :list="treeConfig.treeData"></mySideBar> -->
      <a-tree
        :tree-data="treeData"
        @select="onSelectTree"
        :replace-fields="treeConfig.replaceFields"
        :blockNode="true"
      >
        <template slot="custom" slot-scope="item">
          <a-row type="flex" justify="space-between" class="isTreeClass">
            <a-col
              @mouseenter.stop="tcolor($event, item)"
              @mouseleave.stop="lcolor($event, item)"
              class="isTreeLable"
            >
              <a-tooltip placement="top">
                <template slot="title">
                  <span>{{ item.label }}</span>
                </template>
                <span>{{ item.label }}</span>
              </a-tooltip>
            </a-col>
            <a-col
              class="tree-icon-right"
              @mouseenter.stop="tcolor($event, item)"
              @mouseleave.stop="lcolor($event, item)"
            >
              <a-button
                type="link"
                icon="edit"
                size="small"
                @click.stop="e => onEdit(item)"
                v-show="config.seen && item.id == config.current"
              />
              <a-popconfirm
                class="common-operation"
                title="确认删除该组织"
                @confirm.stop="e => onDel(item)"
                v-show="config.seen && item.id == config.current"
              >
                <a-button type="link" icon="delete" size="small" />
              </a-popconfirm>
            </a-col>
          </a-row>
        </template>
      </a-tree>
    </div>
  </a-col>
</template>

<script>
// import mySideBar from "@/components/layout/sidebar";
import orgTree from "@/utils/orgTree";
export default {
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      config: {
        seen: false,
        current: 0,
        status: false,
        num: 1
      },
      selectDeptName: "",
      treeConfig: {
        treeData1: [],
        orgTreeEditShow: false,
        selectedKey: "",
        value: [],
        replaceFields: {
          key: "id",
          title: "label",
          children: "children",
          value: "id"
        },
        form: {
          deptName: ""
        }
      }
    };
  },
  watch: {
    selectDeptName: {
      deep: true,
      handler(newVal, oldVal) {
        // this.getDept();
        this.$emit("fatherGetDept", newVal);
      }
    }
  },
  computed: {
    treeData: {
      get: function() {
        return this.list;
      },
      set: function() {}
    }
  },
  methods: {
    onFatherAdd() {
      this.$emit("changeModalStatus", true);
    },
    onEdit(info, v) {
      // console.log(info);
      this.$emit("changeEditModalStatus", info.dataRef);
    },
    onDel(info) {
      let params = [];
      params.push(info.id);
      this.$api.system.delDept(params).then(data => {
        if (data.code == 0) {
          //  this.$parent.getDept();
          this.getFatherDept();
          this.$message.success(data.message);
        } else {
          this.$message.error(data.message);
        }
      });
    },
    handleClick(e) {
      console.log("click", e);
    },
    titleClick(e) {
      console.log("titleClick", e);
    },
    tcolor: function(e, v) {
      console.log(e, v);
      this.config.seen = true;
      this.config.current = v.id;
    },
    lcolor: function(e) {
      this.config.current = 0;
    },
    //单击组织结构
    onSelectTree(selectedKeys, info) {
      if (selectedKeys[0] != undefined) {
      }
      this.$emit("deptId", selectedKeys[0]);
      //调用接口人员接口
    },
    getFatherDept() {
      this.$emit("fatherGetDept");
    }
  }
};
</script>

<style lang="scss" scoped>
.isTreeClass {
  .isTreeLable {
    // background:red;
    // max-width: 80px;
    // width:80px;
    flex: 1;
    overflow: hidden;
  }
  .tree-icon-right {
    // background: skyblue;
    width: 48px;
    height: 24px;
    text-align: right;
    line-height: 24px;
    .ant-btn {
      color: #181b31;
    }
  }
  .ant-col {
    height: 24px; /*no*/
  }
}
</style>
