<template>
  <div class="paginate-footer">
    <a-row type="flex" justify="space-between">
      <a-col> 共 : {{ table.total }} 条 </a-col>
      <a-col>
        <a-pagination
          show-size-changer
          @change="onChangeSize"
          :total="table.total"
          @showSizeChange="onShowSizeChange"
          show-quick-jumper
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /**
       * 分页设置
       */
      pageConfig: {
        num: 1,
        size: 10
      }
    };
  },
  props: {
    list: Object
  },
  computed: {
    table: {
      get: function() {
        return this.list;
      },
      set: function() {}
    }
  },
  methods: {
    onChangeSize(num, size) {
        console.log(num,size)
      this.pageConfig.num = num;
      this.pageConfig.size = size;
      this.$emit("getList", num, size);
      //   this.getList();
    },
    onShowSizeChange(num, size) {
      this.pageConfig.num = num;
      this.pageConfig.size = size;
      this.$emit("getList", num, size);
      //   this.getList();
    }
  }
};
</script>

<style lang="scss" scoped></style>
