<template>
    <div id="root-container">

        <div class="header">
            <router-link to="/" class="back_btn">back</router-link>
        </div>

        <div class="profile-container">
            <div class="proflie">User Profile</div>
            <div class="user-container">
                <div class="username">{{ name }}</div>
                <div class="email">{{ email }}</div>
            </div>
        </div>

        <div class="profile-list-container">
            <ul>
                <li class="profile-list-item">
                    <div class="list-item-container">
                        <div class="item-title">프로필 수정</div>
                        <router-link to="#" class="detail_btn">Go</router-link>
                    </div>
                </li>
                <li class="profile-list-item">
                    <div class="list-item-container">
                        <div class="item-title">생성한 설문 보기</div>
                        <router-link to="#" class="detail_btn">Go</router-link>
                    </div>
                </li>
                <li class="profile-list-item">
                    <div class="list-item-container">
                        <div class="item-title">참여한 설문 보기</div>
                        <router-link to="#" class="detail_btn">Go</router-link>
                    </div>
                </li>
                <li class="profile-list-item">
                    <div class="list-item-container">
                        <div class="item-title">로그아웃</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref("username");
const email = ref("email@email.com");

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
    width: 20px;
    height: 20px;
    margin : 16px 16px;
    background: url('../../../assets/images/icon_arrow_left.svg') no-repeat;
    background-size: contain;
    color: transparent; /* 텍스트 색상을 투명으로 설정 */
    font-size: 0;       /* 폰트 크기를 0으로 설정하여 텍스트 숨기기 */
    line-height: 64px;
}

.profile-container {
    width : 100%;
    display : flex;
    flex-direction : column;
    align-items: center;
    justify-content: center;
}

.proflie {
    text-indent : -999em;
    background: url("../../../assets/images/icon_profile_default.svg") no-repeat;
    width : 80px;
    height : 80px;
    margin : 8px 0 16px 0;
    background-size: contain;
}

.user-container {
    display : flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.username {
    font-weight : bold;
    font-size : 1rem;
    color : #1F2024;
}

.email {
    font-size : 0.75rem;
    color : #71727A;
}

.profile-list-container {
    width : 100%;
    margin-top : 16px;
}

ul {
    width : 100%;
    list-style: none;
    display : flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.profile-list-item {
    width : calc(100% - 32px);
    border-bottom : solid 2px #D4D6DD;
    margin-top : 4px;
    height : 60px;
}

.list-item-container {
    padding : 20px 24px 20px 16px;
    display : flex;
    align-items: center;
    justify-content: space-between;
}

.item-title {
    font-size : 0.875rem;
}

.detail_btn {
    color : transparent;
    font-size : 0;
    background: url("../../../assets/images/icon_arrow_right.svg") no-repeat;
    background-size: contain;
    width : 12px;
    height : 12px;
}
</style>