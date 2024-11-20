<template>
    <div class="header">
        <div class="title">설문지 목록</div>
        <button class="search-btn" @click="$emit('goSearch')">검색</button>
    </div>
</template>

<script setup>
import { defineEmits } from 'vue';

defineEmits(["goSearch"]);
</script>

<style scoped>
.header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1;
}

.title {
    font-family: var(--font-noto-sans);
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
