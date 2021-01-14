<template>
  <div class="common-box  common-info">
    <!-- 面包屑 -->
    <a-row type="flex" justify="start" class="content-box">
      <a-col class="content-right">
        <a-row type="flex" justify="space-between" class="content-tool">
          <a-col :span="1">
            <a-button icon="download" @click="onAdd()" :disabled="selectedRowKeys.length <= 0">
              导出
            </a-button>
          </a-col>
          <a-col :span="23">
            <a-row type="flex" justify="end" class="tool-where">
              <a-col >
                <a-select v-model="where.region" placeholder="车队" class="mySelect">
                  <a-select-option value="shanghai">
                    车队测试1
                  </a-select-option>
                  <a-select-option value="beijing">
                    车队测试2
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col >
                <a-select v-model="where.region" placeholder="终端编号" class="mySelect">
                  <a-select-option value="shanghai">
                    终端编号测试1
                  </a-select-option>
                  <a-select-option value="beijing">
                    终端编号测试2
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col >
                <a-select v-model="where.region" placeholder="车架号" class="mySelect">
                  <a-select-option value="shanghai">
                    车架号测试1
                  </a-select-option>
                  <a-select-option value="beijing">
                    车架号测试2
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col >
                <a-select v-model="where.region" placeholder="故障类型" class="mySelect">
                  <a-select-option value="shanghai">
                    故障类型测试1
                  </a-select-option>
                  <a-select-option value="beijing">
                    故障类型测试2
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col >
                <a-select v-model="where.region" placeholder="处理状态" class="mySelect">
                  <a-select-option value="shanghai">
                    处理状态测试1
                  </a-select-option>
                  <a-select-option value="beijing">
                   处理状态测试2
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col >
 <a-date-picker @change="onChangeDate" placeholder="开始时间">
                </a-date-picker>
              </a-col>
              <a-col >
 <a-date-picker @change="onChangeDate" placeholder="结束时间">
                </a-date-picker> 
              </a-col>
              <a-col>
                <a-button type="primary" @click="getList()"
                  >查询</a-button
                ></a-col
              >
              <a-col> <a-button @click="resetForm()">重置</a-button> </a-col>
            </a-row>
          </a-col>
        </a-row>
        <div class="content-table">
          <!-- <a-row type="flex" justify="start">
          <a-col>1</a-col>  
          </a-row> -->
          <a-table
            :columns="columns"
            :data-source="table.data"
            :pagination="false"
            rowKey="id"
            :scroll="{ y: 255 }"
            :customRow="rowClick"
          >
            <a slot="name" slot-scope="text">{{ text }}</a>
            <template slot="operation" slot-scope="text, record">
              <span>
                <a-button
                  type="link"
                  class="status_show"
                  @click="onEdit(record.id)"
                  >查看</a-button
                >
              </span>
              <span>
                <a-popconfirm
                  class="status_del"
                  title="确认删除吗?"
                  @confirm="() => onDel(record.id)"
                  ><a-button type="link">删除</a-button></a-popconfirm
                >
              </span>
            </template>
          </a-table>
          <myPaginate :list="table" @getList="getList"></myPaginate>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import getTime from "@/utils/getTime.js";

import myPaginate from "@/components/layout/layout-paginate";
const columns = [
  {
    title: "车牌号",
    dataIndex: "index",
    key: "index",
    align: "center",
    ellipsis: true
  },
  {
    title: "车架号",
    dataIndex: "index1",
    key: "index1",
    align: "center",
    ellipsis: true
  },
  {
    title: "终端编号",
    dataIndex: "index2",
    key: "index2",
    align: "center",
    ellipsis: true
  },
  {
    title: "报警开始时间",
    dataIndex: "index3",
    key: "index3",
    align: "center",
    ellipsis: true
  },
  {
    title: "处理状态",
    dataIndex: "index4",
    key: "index4",
    align: "center",
    ellipsis: true
  },
  {
    title: "故障类型",
    dataIndex: "index5",
    key: "index5",
    align: "center",
    ellipsis: true
  },
  {
    title: "报警结束时间",
    dataIndex: "index6",
    key: "index6",
    align: "center",
    ellipsis: true
  },
  {
    title: "处理内容",
    dataIndex: "index7",
    key: "index7",
    align: "center",
    ellipsis: true
  },
  {
    title: "处理时间",
    dataIndex: "index8",
    key: "index8",
    align: "center",
    ellipsis: true
  },
  {
    title: "处理人",
    dataIndex: "index9",
    key: "index9",
    align: "center",
    ellipsis: true
  },
  {
    title: "SOC",
    dataIndex: "index10",
    key: "index10",
    align: "center",
    ellipsis: true
  },
  {
    title: "总氢耗",
    dataIndex: "index11",
    key: "index11",
    align: "center",
    ellipsis: true
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    key: "operation",
    width: "10%",
    scopedSlots: { customRender: "operation" }
  }
];
const data = [];

for (let i = 1; i < 30; i++) {
  data.push({
    id:i,
    index: "测试车牌号" + i,
    index1: "测试车架号" + i,
    index2: "测试终端编号"+i,
    index3: getTime.getToday(),
    index4: "测试状态" + i,
    index5: "测试类型" + i,
    index6: getTime.getToday(),
    index7: "测试处理内容" + i,
    index8: getTime.getToday(),
    index9: "测试处理人" + i,
    index10: "测试SOC" + i,
    index11: "测试氢耗" + i,
  });
}
export default {
  components: {
    myPaginate
  },
  data() {
    return {
            rowClick: (record, index) => ({
        on: {
          click: () => {
            // 点击改行时要做的事情
            // ......
            let num = this.selectedRowKeys.indexOf(record.id);
            if (num > -1) {
              this.selectedRowKeys.splice(num, 1);
            } else {
              this.selectedRowKeys.push(record.id);
            }
          }
        }
      }),
      where: {
        fleetName: ""
      },
      selectedRowKeys:[],
      columns,
      table: {
        // data: [],
        data,
        total: 10
      },
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
    async getList(num=null,size=null) {
      // if (num != null) {
      //   this.pageConfig.num = num;
      // }
      // if (size != null) {
      //   this.pageConfig.size = size;
      // }
      // let params = {
      //   modelName: this.where.modelName,
      //   pageNum: this.pageConfig.num,
      //   pageSize: this.pageConfig.size
      // };
      // const data = await this.$api.configuration.getModelList(params);

      // if (data.code == 0) {
      //   this.table.data = data.data.rows;
      //   this.table.total = parseInt(data.data.count);
      // } else {
      //   this.$message.error(data.message);
      // }
    },
    onAdd() {
      this.$router.push({ name: "ConfigurationModelAdd" });
    },
    onEdit(key) {
      // console.log('编辑')
      this.$router.push({
        name: "ConfigurationModelEdit",
        query: { metaDbShow: key }
      });
    },
    async onDel(key) {
      const data = await this.$api.configuration.delModel(key);
      if (data.code == 0) {
        this.getList();
        this.$message.success(data.message);
      } else {
        this.$message.error(data.message);
      }
    },
        onChangeDate(date, dateString) {
      console.log(date, dateString);
    },
    onChangeSize(num, size) {
      this.pageConfig.num = num;
      this.pageConfig.size = size;
      this.getList();
    },
    onShowSizeChange(num, size) {
      this.pageConfig.num = num;
      this.pageConfig.size = size;
      this.getList();
    },
    resetForm() {
      this.where.modelName = "";
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.mySelect{
  width:140px;
  min-width:120px;/*no*/
}
</style>
