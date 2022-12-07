<template>
  <button @click="handleClick" :disabled="disabled">
    <span class="iconfont icon-shouji myiconfont"></span>
    <slot></slot>
    <img alt="Vue logo" src="@/assets/img/logo.png" />
  </button>
</template>
<script>
export default {
  name: "MyButton",
  props: {
    disabled: Boolean,
  },
  methods: {
    handleClick(evt) {
      this.$emit("click", evt);
    },
  },
};
</script>
<style lang="scss" scoped>
.myiconfont {
  font-size: 28px;
  color: red;
}
</style>
