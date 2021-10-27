<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfim"
    />

    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field
        v-model="localname"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateName',
  data () {
    return {
      localname: this.value
    }
  },
  props: {
    value: {
      type: String,
      require: true
    }
  },
  methods: {
    async onConfim () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const localname = this.localname
        if (!localname.length) {
          this.$$toast('昵称不能为空')
          return
        }
        await updateUserProfile({
          name: localname
        })
        // 更新视图，关闭弹层，提示成功
        this.$emit('input', localname)
        this.$emit('close')
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.field-wrap {
  padding: 20px;
}
</style>
