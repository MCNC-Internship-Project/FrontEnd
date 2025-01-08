<template>
    <div class="root-container">
        <header class="toolbar">
            <img class="back" src="@/assets/images/icon_arrow_left.svg" alt="back" @click="goBack">
        </header>

        <div class="profile-image-container">
            <img class="proflie-image" src="@/assets/images/icon_profile_default.svg" alt="프로필 사진">
        </div>

        <div class="profile-info-container">
            <div class="profile-container">
                <div class="text">사용자명</div>
                <div class="input-container">
                    <div class="input-value">
                        {{ profileData.name }}
                    </div>
                    <v-divider></v-divider>
                </div>
            </div>

            <div class="profile-container">
                <div class="text">이메일</div>
                <div class="input-container">
                    <div class="input-value">
                        {{ profileData.email }}
                    </div>
                    <v-divider></v-divider>
                </div>
            </div>

            <div class="profile-container">
                <div class="text">아이디</div>
                <div class="input-container">
                    <div class="input-value">
                        {{ profileData.userId }}
                    </div>
                    <v-divider></v-divider>
                </div>
            </div>

            <div class="profile-container">
                <div class="text">생년월일</div>
                <div class="input-container">
                    <div class="input-value">
                        {{ dayjs(profileData.birth).format('YYYY년 M월 D일') }}
                    </div>
                    <v-divider></v-divider>
                </div>
            </div>

            <div class="profile-container">
                <div class="text">성별</div>
                <div class="input-container">
                    <div class="input-value">
                        {{ profileData.gender === 'M' ? '남성' : '여성' }}
                    </div>
                </div>
            </div>
        </div>

        <default-dialog v-model="dialogs.defaultDialog.isVisible" :message="dialogs.defaultDialog.message"
            @confirm="dialogs.defaultDialog.isVisible = false" />

        <default-dialog v-model="dialogs.defaultDialogSuccess.isVisible" :message="dialogs.defaultDialogSuccess.message"
            :isPersistent="true" @confirm="dialogs.defaultDialogSuccess.isVisible = false; goBack()" />

        <default-dialog v-model="dialogs.defaultDialogSessionExpired.isVisible" :message="dialogs.defaultDialogSessionExpired.message" :isPersistent="true"
            @confirm="dialogs.defaultDialogSessionExpired.isVisible = false; goLogin()" />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/utils/axiosInstance';
import dayjs from 'dayjs';
import { decrypt } from '@/utils/crypto';

const router = useRouter();

const dialogs = ref({
    defaultDialog: {
        isVisible: false,
        message: "",
    },
    defaultDialogSuccess: {
        isVisible: false,
        message: "",
    },
    defaultDialogSessionExpired: {
        isVisible: false,
        message: "",
    }
})

const showDialog = (dialog, message) => {
    dialog.message = message
    dialog.isVisible = true
}

const goBack = () => {
    router.go(-1);
    setTimeout(() => {
        router.replace('/profile');
    }, 100);
}

const profileData = ref({
    name: null,
    email: null,
    userId: null,
    birth: null,
    gender: null
});

const originalProfileData = ref({
    name: null,
    email: null
});

onMounted(() => {
    axios.get(`/account/profile`)
        .then((response) => {
            const data = response.data;

            profileData.value = {
                name: data.name,
                email: decrypt(data.email),
                userId: data.userId,
                birth: data.birth,
                gender: data.gender
            }

            originalProfileData.value = {
                name: data.name,
                email: decrypt(data.email)
            }
        })
        .catch((error) => {
            if (error.response.status === 401) {
                showDialog(dialogs.value.defaultDialogSessionExpired, '세션이 만료되었습니다. 로그인 후 다시 시도해주세요.');
                return;
            }

            showDialog(dialogs.value.defaultDialog, '프로필 정보를 불러오는데 실패했습니다.');
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
    flex : 1;
    margin-left: 24px;
}

.v-divider {
    margin-top: 16px;
    width: 100%;
    height: 1px;
    background-color: #D4D6DD;
}
</style>