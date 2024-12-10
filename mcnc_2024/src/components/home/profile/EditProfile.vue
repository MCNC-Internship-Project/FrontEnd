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
                    <input class="input" type="text" placeholder="사용자명" v-model="profileData.name" />
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
                <div class="text">아이디</div>
                <div class="input-container">
                    <input class="input" type="text" placeholder="아이디" v-model="profileData.userId" disabled />
                    <v-divider></v-divider>
                </div>
            </div>

            <div class="profile-container">
                <div class="text">생년월일</div>
                <div class="input-container">
                    <input class="input" type="text" placeholder="생년월일"
                        :value="dayjs(profileData.birth).format('YYYY년 M월 D일')" disabled />
                    <v-divider></v-divider>
                </div>
            </div>

            <div class="profile-container">
                <div class="text">성별</div>
                <div class="input-container">
                    <input class="input" type="text" placeholder="성별" :value="profileData.gender === 'M' ? '남성' : '여성'"
                        disabled />
                </div>
            </div>
        </div>

        <v-dialog v-model="showDialog" max-width="400">
            <v-card>
                <div class="dialog-container">
                    <div class="dialog-error-message">{{ dialogMessage }}</div>
                </div>
                <v-card-actions>
                    <v-btn color="primary" text @click="showDialog = false">
                        확인
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="showCompleteDialog" max-width="400">
            <v-card>
                <div class="dialog-container">
                    <div class="dialog-error-message">{{ dialogMessage }}</div>
                </div>
                <v-card-actions>
                    <v-btn color="primary" text @click="showCompleteDialog = false; goBack()">
                        확인
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import dayjs from 'dayjs';
import { encrypt, decrypt } from '@/utils/crypto';

const baseUrl = process.env.VUE_APP_API_URL;
const router = useRouter();

const showDialog = ref(false)
const showCompleteDialog = ref(false)
const dialogMessage = ref("")

const showErrorDialog = (message) => {
    dialogMessage.value = message
    showDialog.value = true
}

const showCompletedDialog = (message) => {
    dialogMessage.value = message
    showCompleteDialog.value = true
}

const goBack = () => {
    router.back();
}

const profileData = ref({
    name: null,
    email: null,
    userId: null,
    birth: null,
    gender: null
});

const editComplete = () => {
    if (!profileData.value.name || profileData.value.name.trim() === "") {
        showErrorDialog('사용자명을 입력해주세요.');
        return;
    }

    if (!profileData.value.name.match(/^[a-zA-Z가-힣 ]{2,50}$/)) {
        showErrorDialog('사용자명은 특수문자를 제외한 2~50자로 입력해주세요.');
        return;
    }

    if (!profileData.value.email || profileData.value.email.trim() === "") {
        showErrorDialog('이메일을 입력해주세요.');
        return;
    }

    if (!profileData.value.email.match(/^[_A-Za-z0-9-+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/)) {
        showErrorDialog('이메일 형식이 올바르지 않습니다.');
        return;
    }

    const requestBody = {
        name: profileData.value.name,
        email: encrypt(profileData.value.email)
    }

    axios.post(`${baseUrl}/account/modify/profile`, JSON.stringify(requestBody), {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            showCompletedDialog("프로필 수정이 완료되었습니다.");
        })
        .catch(() => {
            showErrorDialog("프로필 수정에 실패했습니다.");
        });
}

onMounted(() => {
    axios.get(`${baseUrl}/account/profile`, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            const data = response.data;

            profileData.value = {
                name: data.name,
                email: decrypt(data.email),
                userId: data.userId,
                birth: data.birth,
                gender: data.gender
            }

        })
        .catch((error) => {
            console.error(error);
        });
});
</script>

<style scoped>
.root-container {
    width: 100%;
}

.toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 64px;
}

.back {
    width: 20px;
    height: 20px;
    margin-left: 24px;
    cursor: pointer;
}

.complete {
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    color: var(--primary);
    margin-right: 24px;
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

.v-card {
    padding: 0;
    border-radius: 16px !important;
}

.dialog-background {
    background-color: #FAF8F8;
    border: 1px solid #EFF0F6;
}

.dialog-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 32px 20px 32px;
}

.dialog-error-message {
    margin: 32px 0 16px 0;
    font-size: 1.125rem;
    font-weight: bold;
    color: #757576;
}

.v-card-actions {
    padding: 20px;
}

.v-btn {
    width: 100%;
    margin: 0;
    color: #FFFFFF !important;
    background-color: var(--primary);
    border-radius: 16px;
    height: 48px;
    font-size: 0.875rem;
}
</style>