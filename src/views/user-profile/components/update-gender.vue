<template>
  <div class="update-gender">
    <van-picker
      title="标题"
      show-toolbar
      :default-index="value"
      :columns="columns"
      @confirm="onConfirm"
      @cancel="$emit('close')"
      @change="onChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: Number,
      require: true
    }
  },
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.value
    }
  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const localGender = this.localGender
        await updateUserProfile({
          gender: localGender
        })
        // 更新视图，关闭弹层，提示成功
        this.$emit('input', localGender)
        this.$emit('close')
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    },
    onChange (picker, value, index) {
      this.localGender = index
    }
  }
}
</script>

<style>
</style>
