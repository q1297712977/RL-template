<template>
 
    <!-- 面包屑 -->
    <myInformation></myInformation>

</template>

<script>
import myInformation from '@/components/v1-map/information';
export default {
  components: {
    myInformation
  },

  methods: {
    onSelectChange(selectedRowKeys, info) {
      console.log(selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },

    handleChange(value) {
      console.log(`selected ${value}`);
    },
    filterOption(input, option) {
      console.log(input, option);
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    //时间组件
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    resetForm() {
      this.endValue = null;
      this.startValue = null;
      this.getList();
    }
  }
};
</script>

// <style lang="scss" scoped>
// @import "@/assets/css/common-color.scss";
// .common-box {
//   height: 100% !important;
//   .content-table {
//     height: 89.2% !important;
//     overflow: auto;
//     .information-box {
//       background: $bg-color;
//       position: relative;
//       height: 100%;
//       width: 100%;
//       padding: 0 10%;
//       .information-text {
//         height: 100%;
//         z-index: 999;
//         .ant-col {
//           color: #fed800;
//           font-size: 14px;
//         }
//         .information-row {
//           height: 100%;
//         }
//         .text_1 {
//           position: absolute;
//           top: 20%;
//           .text_1_left {
//             padding-left: 15%;
//           }
//           .text_1_right {
//             padding-right: 18%;
//           }
//         }
//         .text_2 {
//           position: absolute;
//           top: 32%;
//           left: 4%;
//         }
//         .text_3 {
//           position: absolute;
//           top: 34%;
//           right: 10%;
//         }
//         .text_4 {
//           position: absolute;
//           top: 47%;
//         }
//         .text_5 {
//           position: absolute;
//           top: 63%;
//           right:8%;
//         }
//         .text_6 {
//           position: absolute;
//           top: 66%;
//           right:8%;
//           // background:red;
//         }
//         .text_7 {
//           position: absolute;
//           top: 67%;
//           left:6%;
//         }
//         .text_8 {
//           position: absolute;
//           top: 71%;
//           left:6%;
//         }
//         .text_9 {
//           position: absolute;
//           top: 75%;
//           left:6%;
//         }
//         .text_10 {
//           position: absolute;
//           top: 83%;
//           right:6%;
//         }
//         .text_11 {
//           position: absolute;
//           top: 91%;
//           right:24%;
//         }
//         .text_12 {
//           position: absolute;
//           top: 94%;
//           left:37%;
//         }
//       }
//     }
//   }
// }
// </style>
