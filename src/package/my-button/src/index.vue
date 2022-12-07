<template>
    <button @click="handleClick" :disabled='disabled'>
        <slot></slot>
        <img alt="Vue logo" src="@/assets/img/logo.png">
        <div class="iconfont icon-shouji"></div>
    </button>
</template>
<script>
export default {
    name: "MyButton",
    props: {
        disabled: Boolean
    },
    methods: {
        handleClick(evt) {
            this.$emit('click', evt);
        }
    }
};
</script>
