<template>
  <div class="comment-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
    >
      <comment-item
        v-for="(item, index) in list"
        :key="index"
        :comment="item"
        @reply-click="$emit('reply-click', $event)"
      />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item.vue'

export default {
  name: 'CommentList',
  props: {
    source: {
      type: [Number, String, Object],
      require: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义 Prop 数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  components: {
    CommentItem
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10
    }
  },
  created () {
    this.loading = true
    this.onLoad()
  },
  methods: {
    async onLoad () {
      this.loading = true
      try {
        //  1.请求获取数据
        const { data } = await getComments({
          type: this.type,
          source: this.source,
          offset: this.offset,
          limit: this.limit
        })
        // 2.将数据添加到列表中
        const { results } = data.data
        this.list.push(...results)

        // 把文章评论的总数量传递到外部
        this.$emit('onload-success', data.data)

        // 3.将 loading 设置为 false
        this.loading = false
        // 4.判断是否还有数据
        if (results.length) {
          //  有就更新获取下一页数据页码
          this.offset = data.data.last_id
        } else {
          // 没有就将 finshed 设置结束
          this.finished = true
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style>
</style>
