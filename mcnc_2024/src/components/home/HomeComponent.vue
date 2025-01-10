<!--
    - 홈 컴포넌트
    
    - @author 반명우
-->

<template>
    <div class="root-container">
        <header class="toolbar">
            <img class="logo" src="@/assets/images/icon_logo.svg" alt="logo">
            <div class="title">Survwey</div>
            <img class="profile-icon" src="@/assets/images/icon_profile_none.svg" alt="profile icon" @click="routeProfile" />
        </header>

        <div class="search-container" @click="routeSearch" v-ripple>
            <span class="search-text">참여 가능한 설문조사 검색</span>
            <img class="search-icon" src="@/assets/images/icon_search.svg" alt="dropdown icon" />
        </div>

        <my-survey />

        <respond-survey />

        <v-fab icon="mdi-plus" color="#7796E8" size="48" absolute @click="routeCreateSurvey" />
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import MySurvey from './survey-list/MySurvey.vue';
import RespondSurvey from './survey-list/RespondSurvey.vue';

const router = useRouter();

const routeSearch = () => {
    router.push("/search");
}

const routeProfile = () => {
    router.push("/profile");
}

const routeCreateSurvey = () => {
    router.push("/create");
}
</script>

<style scoped>
.root-container {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.toolbar {
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 24px;
}

.logo {
    width: 40px;
}

.title {
    margin-left: 4px;
    font-family: var(--font-mont);
    font-size: 1.25rem;
    color: var(--primary);
}

.profile-icon {
    width: 24px;
    height: 24px;
    margin-left: auto;
    cursor: pointer;
}

.search-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    margin: 16px 24px 40px;
    padding: 0 16px;
    border-radius: 12px;
    background: #F3F3F3;
    cursor: pointer;
}

.search-text {
    font-size: 1rem;
    color: #C6C6C6;
}

.search-icon {
    width: 24px;
    height: 24px;
}

img > a {
    font-size: 0;
}

.v-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
}
</style>