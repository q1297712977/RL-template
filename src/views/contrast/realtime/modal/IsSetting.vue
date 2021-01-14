<template>
  <a-modal
    v-model="show"
    title="选择参数"
    centered
    :footer="null"
    @cancel="handleCancel"
    dialogClass="isAddClass"
  >
    <a-row type="flex" justify="start" class="isConfigClass">
      <a-col :span="24">
        <a-checkbox-group @change="onChange">
          <a-row type="flex" justify="start" :gutter="8">
            <a-col :span="8" v-for="(item, i) in configList" :key="i">
              <a-checkbox :value="item"> {{ item }} </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-col>
    </a-row>
    <a-row type="flex" justify="space-between" class="isModalBtn">
      <a-col>
        <a-button type="primary" @click="onSubmit()">提交</a-button>
      </a-col>
      <a-col>
        <a-button @click="handleCancel()">取消</a-button>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
const configList = [
  "参数1",
  "参数2",
  "参数3",
  "参数4",
  "参数5",
  "参数6",
  "参数7",
  "参数8",
  "参数9"
];
export default {
  props: {
    isShow: {
      //横坐标
      type: Boolean,
      default: false
    },
    list: {
      type: Array
    }
  },

  data() {
    return {
      configList,
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      checkedList: []
    };
  },
  computed: {
    show: {
      get: function() {
        return this.isShow;
      },
      set: function() {}
    },
    treeData: {
      get: function() {
        return this.list;
      },
      set: function() {}
    }
  },
  watch: {
    checkedKeys(val) {
      // console.log("onCheck", val);
    },
    list(v, o) {}
  },
  methods: {
    handleCancel(e) {
      // console.log(e);
      // this.visible = false;
      //清空表单
      this.$emit("changeModalStatus", false);
    },

    onChange(checkedValues) {
      // console.log("checked = ", checkedValues);
      this.checkedList = checkedValues;
    },
    onSelect(selectedKeys, info) {
      console.log("onSelect", info);
      console.log("onSelect", selectedKeys);
      this.form.title = info.node.dataRef.title;

      this.selectedKeys = selectedKeys;
    },

    onSubmit() {
      // console.log(this.checkedList)
      this.$emit("changeModalStatus", false);
      this.$emit("getChildrenList", this.checkedList);
      // this.$message.success("选择成功");
    }
  }
};
</script>

<style lang="scss" scoped>
.isConfigClass {
  margin-bottom: 24px;
}
</style>
