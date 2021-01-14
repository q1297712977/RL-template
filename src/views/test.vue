<template>
  <div>

    <a-range-picker @change="onChange" v-model="date" />

  </div>
</template>
<script>
export default {
  data() {
    return {
      date: ["2020-12-03", "2021-01-15"]
    }
  },
  methods: {
    onChange(date, dateString) {
      console.log(date, dateString);
    },
  },
};
</script>