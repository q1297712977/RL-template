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
         
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>

export default {

  data() {
    return {
      pageConfig: {
        num: 1,
        size: 10
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList(num = null, size = null) {
      if (num != null) {
        this.pageConfig.num = num;
      }
      if (size != null) {
        this.pageConfig.size = size;
      }
      let params = {
        fleetName: this.where.fleetName,
        pageNum: this.pageConfig.num,
        pageSize: this.pageConfig.size
      };
      const data = await this.$api.configuration.getFleetList(params);
      if (data.code == 0) {
        this.table.data = data.data.rows;
        this.table.total = parseInt(data.data.count);
      } else {
        this.$message.error(data.message);
      }
    },
    resetForm() {
      this.where.fleetName = "";
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.content-table{
  height:91%!important;
}

</style>
