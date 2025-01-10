<!--
    - 설문 목록 타이틀 헤더 컴포넌트
    - @author 김은수
-->
<template>
    <div class="header">
        <div class="title">{{ title }}</div>
        <button class="search-btn" @click="$emit('goSearch')">검색</button>
    </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';

defineProps({
    title: {
        type: String,
    },
});

defineEmits(["goSearch"]);
</script>

<style scoped>
.header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1;
    height: 64px;
}

.title {
    color: #464748;
    font-size: 1.25rem;
    font-weight: bold;
    flex: 1;
    text-align: center
}

.search-btn {
    width: 24px;
    height: 24px;
    text-indent: -999em;
    background: url("../../assets/images/icon_search_btn.svg") no-repeat center center;
    background-size: contain;
    cursor: pointer;
    margin: 24px;
}

</style>
