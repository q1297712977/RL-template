<template>
  <div>
    <a-radio-group :value="theme" @change="handleThemeChange">
      <a-radio-button value="gold">
        <a-icon type="gold" />
        <span style="margin-left:8px">全部</span>
      </a-radio-button>
      <a-radio-button value="outline">
        <a-icon type="outline" />
        <span style="margin-left:8px">线框风格</span>
      </a-radio-button>
      <a-radio-button value="fill">
        <a-icon type="fill" />
        <span style="margin-left:8px">实体分格</span>
      </a-radio-button>
      <a-radio-button value="twotone">
        <a-icon type="twotone" />
        <span style="margin-left:8px">双色风格</span>
      </a-radio-button>
    </a-radio-group>

    <ul class="icon-list">
      <li v-for="(item, index) in iconList" :key="index" @click="copy(item)">
        <a-icon :type="item.name" :theme="getTheme(item)" />
        <span>{{ item.name }}</span>
      </li>
    </ul>
    <a-back-top />
  </div>
</template>
<script>
import VueIcon from '@ant-design/icons-vue'
export default {
  name: 'icons',
  data() {
    return {
      icons: VueIcon.definitions.collection,
      iconList: [],
      theme: 'outline'
    }
  },
  created() {
    this.getThemeIcons()
  },
  methods: {
    copy(icon) {
      let text = this.getContent(icon)
      let message = this.$message
      this.$copyText(text).then(
        function(e) {
          message.success(text + '  复制成功 🎉', 5)
        },
        function(e) {
          message.error(text, 5)
        }
      )
    },
    getContent(icon) {
      let theme = this.getTheme(icon)
      if (theme === 'outlined') return `<a-icon :type="${icon.name}"  />`
      return `<a-icon :type="${icon.name}" :theme="${theme}" />`
    },
    getThemeIcons() {
      if (this.theme == 'gold') this.iconList = Object.values(this.icons).filter(t => t)
      else this.iconList = Object.values(this.icons).filter(t => t.theme == this.theme)
    },
    handleThemeChange(e) {
      this.theme = e.target.value
      this.getThemeIcons()
    },
    getTheme(item) {
      if (item.theme == 'outline') return 'outlined'
      if (item.theme == 'fill') return 'filled'
      if (item.theme == 'twotone') return 'twoTone'
    }
  }
}
</script>

<style lang="scss">
.icon-list {
  margin: 10px 0;
  list-style: none;

  li {
    float: left;
    width: 120px;
    text-align: center;
    list-style: none;
    cursor: pointer;
    height: 100px;
    color: #555;
    transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
    position: relative;
    margin: 3px 0;
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
      font-size: 36px;
      margin: 12px 0 8px;
      transition: transform 0.3s ease-in-out;
      will-change: transform;
    }
  }
}
</style>