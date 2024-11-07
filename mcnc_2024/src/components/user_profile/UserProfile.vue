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
    </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref("username");
const email = ref("email");

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
    background: url('../../common/back_btn_icon.png') no-repeat;
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
    background: url("../../common/icon_user_basic_profile.png") no-repeat;
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
</style>