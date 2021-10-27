<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSUggestions } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想数据建议列
    }
  },
  watch: {
    searchText: {
      // 当 searchText 发生改变的时候就会调用 handler 函数
      // 注意：handler 函数名称是固定的
      // handler(value) {
      //   this.loadSearchSuggestions(value);
      // },
      // handler: function (value) {
      //   console.log(vaule);
      // },
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 200),
      // 该回调将会在侦听开始之后被立即调用
      immediate: true
    }
  },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSUggestions(q)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    highlight (text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 如果需要根据数据变量动态创建正则表达式，则手动 new RegExp
      // RegExp 正则表达式构造函数
      //  参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      //  参数2：匹配模式，要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    }
  }
}
</script>

<style lang="less" scoped>
.search-suggestion {
  /deep/ span.active {
    color: #3296fa !important;
  }
}
</style>
