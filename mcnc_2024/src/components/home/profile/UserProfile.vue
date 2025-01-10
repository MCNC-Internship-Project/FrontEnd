<!--
    - 프로필 컴포넌튼
    
    - @author 반명우
-->

<template>
    <div class="root-container">
        <header class="toolbar">
            <img class="back" src="@/assets/images/icon_arrow_left.svg" alt="back" @click="goBack">
        </header>

        <div class="profile-container">
            <img class="proflie-image" src="@/assets/images/icon_profile_default.svg" alt="프로필 사진">
            <div class="username">{{ name }}</div>
            <div class="email">{{ email }}</div>
        </div>

        <div class="list-container">
            <v-list>
                <template v-for="(item, index) in items" :key="index">
                    <v-list-item @click="onItemClick(item)">
                        <template v-slot:title>
                            <span class="item-title">{{ item.title }}</span>
                        </template>
                        <template v-slot:append>
                            <v-icon v-if="item.title !== '로그아웃'">mdi-chevron-right</v-icon>
                        </template>
                    </v-list-item>
                    <v-divider v-if="index < items.length - 1"></v-divider>
                </template>
            </v-list>
        </div>
    </div>

    <default-dialog v-model="dialog.isVisible" :message="dialog.message" @confirm="dialog.isVisible = false" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/utils/axiosInstance';
import { decrypt } from '@/utils/crypto';

const router = useRouter();

const goBack = () => {
    router.back();
}

const dialog = ref({
    isVisible: false,
    message: ""
});

const showDialog = (message) => {
    dialog.value.message = message;
    dialog.value.isVisible = true;
}

const name = ref("ㅤ");
const email = ref("ㅤ");
const items = ref([
    { title: '내 정보' },
    { title: '생성한 설문 보기' },
    { title: '참여한 설문 보기' },
    { title: '로그아웃' }
]);

const onItemClick = (item) => {
    switch (item.title) {
        case '내 정보':
            router.push({path : "/profile/info"});
            break;
        case '생성한 설문 보기':
            router.push({path : "/my"});
            break;
        case '참여한 설문 보기':
            router.push({path : "/respond"});
            break;
        case '로그아웃':
            axios.post(`/auth/logout`, null)
                .then((response) => {
                    if (response.status === 200) {
                        sessionStorage.setItem(btoa('isLoggedIn'), btoa(false));
                        router.replace("/login");
                    }
                })
                .catch((error) => {
                    if (error?.response?.data?.errorMessage) {
                        showDialog(error.response.data.errorMessage);
                    } else {
                        showDialog("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                    }
                })
            break;
    }
};

onMounted(() => {
    axios.get(`/account/profile`)
        .then((response) => {
            name.value = response.data.name;
            email.value = decrypt(response.data.email);
        })
        .catch(() => {
            name.value = "알 수 없음";
            email.value = "알 수 없음";
        });
})
</script>

<style scoped>
.root-container {
    width: 100%;
}

.toolbar {
    display: flex;
    align-items: center;
    width: 100%;
    height: 64px;
}

.back {
    width: 20px;
    height: 20px;
    margin-left: 24px;
    cursor: pointer;
}

.profile-container {
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

.username {
    margin-top: 24px;
    font-size: 1.25rem;
    font-weight: bold;
    color: #1F2024;
}

.email {
    font-size: 1rem;
    color: #71727A;
}

.list-container {
    display: flex;
    justify-content: center;
    padding: 24px 16px 48px 16px;
}

.v-list {
    width: 100%;
    max-width: 400px;
    padding: 0;
}

.v-list-item {
    min-height: 60px;
}

.item-title {
    font-size: 1rem;
    color: #1F2024;
}

.dialog-background {
    background-color: #FAF8F8;
    border: 1px solid #EFF0F6;
}

.v-card {
    padding: 0;
    border-radius: 16px !important;
}

.dialog-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 32px 20px 32px;
}

.dialog-error-message {
    margin: 32px 0 0 0;
    font-size: 1.125rem;
    font-weight: bold;
    color: #757576;
}


.dialog-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    margin: 16px 8px 0 8px;
}

.v-dialog .v-btn {
    height: 44px;
    flex-grow: 1;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 16px;
    border: 1px solid #EFF0F7;
    box-shadow: 0px 5px 16px rgba(8, 15, 52, 0.06);
}

.dialog-close-btn {
    width: 100%;
    margin: 0;
    color: #FFFFFF !important;
    background-color: var(--primary);
    border-radius: 16px;
    height: 48px;
    font-size: 0.875rem;
}

.dialog-message {
    margin: 32px 0 16px 0;
    font-size: 1.125rem;
    font-weight: bold;
    color: #757576;
}

.v-card-actions {
    padding: 20px;
}
</style>