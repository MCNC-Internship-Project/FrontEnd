<template>
    <div class="toolbar" :style="{ backgroundColor: backgroundColor || 'transparent', zIndex: zIndex || 1000 }">
        <img class="back" src="../../assets/images/icon_arrow_left.svg" alt="back" @click="$emit('goBack')" />
        <slot></slot>
    </div>
</template>

<script setup>
/**
 * @fileoverview 툴바 컴포넌트
 * @author 김은수 (kimeunsu@mcnc.co.kr)
 * @date 2024-11-20
 * @lastModified 2024-11-26
 * @description 고정된 툴바로 뒤로가기 버튼과 콘텐츠 슬롯을 제공하는 컴포넌트.
 */

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
