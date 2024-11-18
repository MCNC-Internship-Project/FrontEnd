<template>
    <div id="root-container">
        <header class="toolbar">
            <div class="logo-container">
                <img class="logo" src="@/assets/images/icon_logo.svg" alt="logo">
                <div class="title">Survwey</div>
            </div>

            <div class="menu-container">
                <img class="noti-icon" src="@/assets/images/icon_noti.svg" alt="noti icon" @click="routeNoti" />
                <img class="profile-icon" src="@/assets/images/icon_profile_none.svg" alt="profile icon" @click="routeProfile" />
            </div>
        </header>

        <div class="search-container" @click="routeSearch" v-ripple>
            <span class="search-text">설문조사 검색</span>
            <img class="search-icon" src="@/assets/images/icon_search.svg" alt="dropdown icon" />
        </div>

        <!-- 내 설문조사 컴포넌트 -->
        <my-survey />

        <!-- 완료된 설문조사 컴포넌트 -->
        <my-participated-survey />

        <div class="create-survey-conponent">
            <v-fab icon="mdi-plus" color="#7796E8" size="48" absolute @click="routeCreateSurvey" />
        </div>
    </div>
</template>

<script setup>
import MySurvey from './survey-list/MySurvey.vue';
import MyParticipatedSurvey from './survey-list/MyParticipatedSurvey.vue';
import router from '@/router'

const routeSearch = () => {
    router.push({path : "/surveys"});
}

const routeNoti = () => {
    router.push({path : "/noti"});
}

const routeProfile = () => {
    router.push({path : "/profile"});
}

const routeCreateSurvey = () => {
    router.push({path : "/create-survey"});
}
</script>

<style scoped>
.root-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
}

.toolbar {
    position: relative;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
}

.logo-container {
    display: flex;
    align-items: center;
    padding-left: 24px;
}

.logo {
    width: 42px;
}

.title {
    padding-left: 4px;
    font-family: var(--font-mont);
    font-size: 1.25rem;
    color: var(--primary);
}

.menu-container {
    display : flex;
    align-items: center;
    position: absolute;
    right: 0;
    padding-right: 24px;
}

.noti-icon {
    width: 24px;
    height: 24px;
    margin-right: 16px;
    cursor: pointer;
}

.profile-icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
}

.search-container {
    position: relative;
    margin: 16px 24px 40px 24px;
    height: 56px;
    border-radius: 12px;
    background: #F3F3F3;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.search-text {
    position: absolute;
    left: 16px;
    font-size: 1rem;
    color: #C6C6C6;
}

.search-icon {
    position: absolute;
    right: 16px;
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