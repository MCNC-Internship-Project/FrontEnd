<template>
    <div id="root-container">
        <header class="toolbar">
            <div class="logo-container">
                <img class="logo" src="../../common/homeLogo.png" alt="logo">
                <div class="title">Survwey</div>
            </div>

            <div class="menu-container">
                <router-link to="/notice">
                    <img class="noti-icon" src="../../common/icon_alarm.png" alt="noti icon" />
                </router-link>

                <!-- 로그인 창으로 가고싶으면 /profile을 /login으로 변경 -->
                <!-- 나중에 라우터 가드로 세션 값 없으면 자동으로 /login으로 보낼거임 -->
                <router-link to="/profile">
                    <img class="profile-icon" src="../../common/icon_account.png" alt="profile icon" />
                </router-link>
            </div>
        </header>

        <div class="search-container" @click="search">
            <span class="search-text">설문조사 검색</span>
            <img class="search-icon" src="../../assets/icon_search.svg" alt="dropdown icon" />
        </div>


        <!-- 진행중인 설문조사 컴포넌트 -->
        <in-progress-survey />

        <!-- 완료된 설문조사 컴포넌트 -->
        <completed-survey />

        <div class="create-survey-conponent">
            <router-link to="/create-survey" class="create_btn">
                <v-fab icon="mdi-plus" color="#7796E8" size="48" absolute></v-fab>
            </router-link>
        </div>
        
    </div>
</template>

<script setup>
import InProgressSurvey from './ChildComponent/InProgressSurvey.vue';
import CompletedSurvey from './ChildComponent/CompletedSurvey.vue';
// import router from '@/router'
// import { ref } from 'vue';

// const searchQuery = ref("");

/**
 * search 버튼 클릭 or 엔터키 누르면 /surveys?search=searchQuery로 탐색
 */
const search = () => {
    // router.push({path : "/surveys", query : {search : searchQuery.value}});
}
</script>

<style scoped>
@font-face {
    font-family: 'Mont';
    src: url('../../assets/MontserratAlternates-Bold.ttf') format('truetype');
    font-weight: bold;
    font-style: normal;
}

.root-container {
    position: relative;
    height: 100vh;
    width : 100%;
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
    font-family: 'Mont';
    font-size: 1.25rem;
    color: #7796E8;
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
}

.profile-icon {
    width: 24px;
    height: 24px;
}

.search-container {
    position: relative;
    margin: 32px 24px 0;
    height: 56px;
    border-radius: 12px;
    background: #F3F3F3;
    display: flex;
    align-items: center;
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

.v-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
}
</style>