<template>
    <div id="root-container">

        <div class="header">

            <div class="logo-container">
                <div class="logo">
                    <img src="../../common/homeLogo.png" width="42px" height="32px" class="logo" alt="logo">
                    <div class="logo-font">
                        survwey
                    </div>
                </div>
            </div>

            <div class="menu-container">
                <router-link to="/notice" class="alarm-btn">알림</router-link>

                <!-- 로그인 창으로 가고싶으면 /profile을 /login으로 변경 -->
                <!-- 나중에 라우터 가드로 세션 값 없으면 자동으로 /login으로 보낼거임 -->
                <router-link to="/login" class="login-btn">로그인</router-link>
            </div>

        </div>

        <div class="input-section">
            <input class="survey-input" type="text" name="search" id="search" placeholder="설문조사 검색"/>
            <div class="survey-search">search</div>
        </div>

        <!-- 진행중인 설문조사 컴포넌트 -->
        <in-progress-survey />

        <!-- 완료된 설문조사 컴포넌트 -->
        <completed-survey />

        <div class="create-survey-conponent">
            <router-link to="/create-survey" class="create_btn">설문 생성</router-link>
        </div>

    </div>
</template>

<script setup>
import InProgressSurvey from './ChildComponent/InProgressSurvey.vue';
import CompletedSurvey from './ChildComponent/CompletedSurvey.vue';
    
</script>

<style scoped>
#root-container {
    width : 100%;
    height : 100vh;
    display : flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
}

.header {
    width : 100%;
    height : 64px;
    margin : 16px 0;
    display : flex;
    align-items: center;
    justify-content: space-between;
    padding : 0 24px;
}

.logo-container {
    width : 100%;
    display : flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    display : flex;
    align-items: center;
    justify-content: center;
}

@font-face {
    font-family: 'Mont';
    src: url('../../assets/MontserratAlternates-Bold.ttf') format('truetype');
    font-weight: bold;
    font-style: normal;
}

/* 폰트를 사용할 스타일 정의 */
.logo-font {
    font-family: 'Mont', sans-serif;
    font-size : 1.25rem;
    color : #7796E8;
    padding-left : 3px;
}

.menu-container {
    display : flex;
    gap : 16px;
}

.login-btn {
    text-decoration: none;
    display: inline-block;
    width: 24px;
    height: 24px;
    background: url('../../common/icon_account.png') no-repeat;
    background-size: contain;
    color: transparent; /* 텍스트 색상을 투명으로 설정 */
    font-size: 0;       /* 폰트 크기를 0으로 설정하여 텍스트 숨기기 */
    line-height: 64px;
}

.alarm-btn {
    text-decoration: none;
    display: inline-block;
    width: 24px;
    height: 24px;
    background: url('../../common/icon_alarm.png') no-repeat;
    background-size: contain;
    color: transparent; /* 텍스트 색상을 투명으로 설정 */
    font-size: 0;       /* 폰트 크기를 0으로 설정하여 텍스트 숨기기 */
    line-height: 64px;
}

.input-section {
    width : 100%;
    position : relative;
}

.survey-input {
    width : calc(100% - 48px);
    height : 56px;
    border-radius : 12px;
    margin : 32px 24px 0 24px;
    padding-left : 16px;
    padding-right : 40px;
    background-color: #F3F3F3;
}

.survey-search {
    position : absolute;
    right : 40px;
    bottom : 16px;
    text-indent : -999em;
    background: url("../../common/icon_search.png") no-repeat;
    width : 24px;
    height : 24px;
    background-size: contain;
}


.create_btn {
    position : fixed;
    background: url("../../common/icon_create_button.png") no-repeat;
    background-size: contain;
    width : 60px;
    height : 60px;
    right : 24px;
    bottom : 24px;
    color : transparent;
    font-size : 0;
}
</style>