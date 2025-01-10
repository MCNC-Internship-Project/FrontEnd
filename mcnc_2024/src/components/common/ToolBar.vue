<!--
    - 툴바
    - @author 김은수
-->
<template>
    <div class="toolbar" :style="{ backgroundColor: backgroundColor || 'transparent', zIndex: zIndex || 1000 }">
        <img class="back" src="../../assets/images/icon_arrow_left.svg" alt="back" @click="$emit('goBack')" />
        <slot></slot>
    </div>
</template>


<script setup>
import { defineProps } from 'vue'
defineProps({
    backgroundColor: {
        type: String,
        default: null,
    },
    zIndex: {
        type: [String, Number],
        default: 1000,
    }
});
</script>

<style scoped>
.toolbar {
    width: 100%;
    height: 64px;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    top: 0;
}

.back-container {
    display: flex;
    align-items: center;
}

.back {
    cursor: pointer;
    margin: 24px;
}
</style>
