<template>
    <div class="root-container">
        <header class="toolbar">
            <div class="back-container">
                <img class="back" src="../../assets/images/icon_arrow_left.svg" alt="back" @click="goBack" />
            </div>
        </header>

        <div class="survey-container">
            <div class="search-box">
                <input type="text" placeholder="설문 제목을 검색해보세요." v-model="searchQuery" @keyup.enter="searchSurvey" />
                <button @click="searchSurvey">
                    <img class="search-btn" src="../../assets/images/icon_search_btn.svg" alt="search icon" />
                </button>
            </div>
            <div class="logo-container">
                <img class="logo" src="../../assets/images/icon_logo.svg" alt="logo" />
                <div class="logo-name">Survwey</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const searchQuery = ref('');

function goBack() {
    router.back();
}

function searchSurvey() {
    // searchQuery의 값을 이용하여 검색 동작 수행
    console.log("Searching for:", searchQuery.value);
    // 검색 로직 추가, 검색 결과 페이지로 이동
}
</script>

<style scoped>
.root-container {
    background-image: url('../../assets/images/background.svg');
    background-size: auto;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.toolbar {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 64px;
}

.back-container {
    display: flex;
    align-items: center;
    padding-left: 24px;
}

.search-box {
    display: flex;
    align-items: center;
    background-color: #f2f6fc;
    border-radius: 8px;
    padding: 8px 12px;
    width: 80%;
}
.search-btn {
    text-indent: -999em;
    background: url("../../assets/images/icon_search_btn.svg") no-repeat center center;
    background-size: contain;
    width: 24px;
    height: 24px;
    cursor: pointer;
    margin-left: auto;
}
.search-box input {
    border: none;
    outline: none;
    background: none;
    width: 100%;
    padding: 8px;
    font-size: 1rem;
}

.search-box button {
    background: none;
    border: none;
    cursor: pointer;
}

.back {
    cursor: pointer;
}

.survey-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 64px;
}

.header {
    width: 90%;
    display: flex;
    align-items: center;
}

.title {
    font-family: var(--font-noto-sans);
    font-size: 1.5rem;
    font-weight: bold;
    color: #464748;
}

.logo-container {
    display: flex;
    align-items: center;
    padding-left: 24px;
}

.logo {
    width: 42px;
    height: 80vh;
}

.logo-name {
    padding-left: 4px;
    font-family: var(--font-mont);
    font-size: 1.25rem;
    color: var(--primary);
}
</style>