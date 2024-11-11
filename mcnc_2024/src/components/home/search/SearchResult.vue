<template>
    <div id="root-container">
        <div class="header">
            <router-link to="/" class="back_btn">back</router-link>
            <input type="text" :value="searchResult" placeholder="검색어를 입력하세요" />
        </div>

        
        <div class="search-result-section">

        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue';

const route = useRoute();
const searchResult = ref(route.query.search);
</script>

<style scoped>
#root-container {
    width : 100%;
}

.header {
    width : 100%;
    height : 64px;
    display : flex;
    align-items: center;
}

.back_btn {
    text-decoration: none;
    display: inline-block;
    width: 32px;
    height: 32px;
    margin : 16px 16px;
    background: url('../../../assets/images/icon_arrow_left.svg') no-repeat;
    background-size: contain;
    color: transparent; /* 텍스트 색상을 투명으로 설정 */
    font-size: 0;       /* 폰트 크기를 0으로 설정하여 텍스트 숨기기 */
    line-height: 64px;
}
</style>