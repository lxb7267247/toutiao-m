<template>
  <div class="article-comments">
    <!-- 评论列表 -->

    <van-cell>
      <van-image
        slot="icon"
        round
        width="30"
        height="30"
        style="margin-right: 10px"
        :src="comment.aut_photo"
      />
      <span style="color: #466b9d" slot="title">{{ comment.aut_name }}</span>
      <div slot="label">
        <p style="color: #363636">{{ comment.content }}</p>
        <p>
          <span style="margin-right: 10px">{{
            comment.pubdate | relativeTime
          }}</span>
          <van-button
            size="mini"
            type="default"
            @click="$emit('reply-click', comment)"
            >回复{{ comment.reply_count }}</van-button
          >
        </p>
      </div>
      <van-icon
        slot="right-icon"
        :name="comment.is_liking ? 'like' : 'like-o'"
        :class="{ liked: comment.is_liking }"
        @click="onCommentLike"
      />
    </van-cell>

    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入评论内容">
        <van-button slot="button" size="mini" type="info">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->
  </div>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/api/comment'

export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false // 是否加载结束
    }
  },

  methods: {
    async onCommentLike () {
      try {
        if (this.comment.is_liking) {
          //   已赞，取消点赞
          await deleteCommentLike(this.comment.com_id)
          this.comment.like_count--
        } else {
          //   添加点赞
          await addCommentLike(this.comment.com_id)
          this.comment.like_count++
        }
        this.comment.is_liking = !this.comment.is_liking
      } catch (err) {
        this.$toast.fail('操作失败，请重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
.liked {
  color: #e5645f;
}
</style>
