<template>
    <div class="root-container">
        <header class="toolbar">
            <img class="back" src="@/assets/images/icon_arrow_left.svg" alt="back" @click="goBack">
            <div class="complete" @click="editComplete">완료</div>
        </header>

        <div class="profile-image-container">
            <img class="proflie-image" src="@/assets/images/icon_profile_default.svg" alt="프로필 사진">
        </div>

        <div class="profile-info-container">
            <div class="profile-container">
                <div class="text">사용자명</div>
                <div class="input-container">
                    <input class="input" type="text" placeholder="사용자명" v-model="profileData.username" />
                    <v-divider></v-divider>
                </div>
            </div>

            <div class="profile-container">
                <div class="text">이메일</div>
                <div class="input-container">
                    <input class="input" type="text" placeholder="이메일" v-model="profileData.email" />
                    <v-divider></v-divider>
                </div>
            </div>

            <div class="profile-container">
                <div class="text">생년월일</div>
                <div class="input-container">
                    <input class="input" type="text" placeholder="생년월일" :value="formatDate(profileData.birthDate)" disabled />
                    <v-divider></v-divider>
                </div>
            </div>

            <div class="profile-container">
                <div class="text">성별</div>
                <div class="input-container">
                    <input class="input" type="text" placeholder="성별" :value="profileData.gender" disabled />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import router from '@/router';

const goBack = () => {
    router.push('/profile');
}

const editComplete = () => {
    router.push('/profile');
}

const profileData = ref({
    username: '홍길동',
    email: 'email@email.com',
    birthDate: '2000-01-01',
    gender: '남성'
});

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());
    return `${year}년 ${month}월  ${day}일`;
}
</script>

<style scoped>
.root-container {
    position: relative;
    width: 100%;
    height: calc(var(--vh, 1vh) * 100);
}

.toolbar {
    position: relative;
    display: flex;
    align-items: center;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 64px;
}

.back {
    padding-left: 24px;
    cursor: pointer;
}

.complete {
    position: absolute;
    display: flex;
    align-items: center;
    right: 24px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    color: var(--primary);
}

.profile-image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    text-align: center;
    padding: 20px 0;
}

.proflie-image {
    width: 80px;
    height: 80px;
}

.profile-info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 60px;
    text-align: center;
    padding: 0 32px;
    box-sizing: border-box;
}

.profile-container {
    display: flex;
    width: 100%;
    min-width: 280px;
    max-width: 400px;
    margin-bottom: 16px;
}

.text {
    width: 4em;
    flex-shrink: 0;
    text-align: left;
    font-size: 1rem;
    color: #707070;
}

.input-container {
    position: relative;
    flex: 1;
    margin-left: 24px;
}

.input {
    width: 100%;
    padding-right: 12px;
    background: none;
    border: none;
    box-shadow: none;
    outline: none;
    font-size: 1rem;
    color: #464748;
}

.input::placeholder {
    color: #D4D6DD;
}

.input:disabled {
    color: #a6a6a6;
}

.v-divider {
    margin-top: 16px;
    width: 100%;
    height: 1px;
    background-color: #D4D6DD;
}
</style>