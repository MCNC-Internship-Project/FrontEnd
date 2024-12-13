<template>
    <div class="root-container">
        <form class="form-container" novalidate @submit.prevent="nextStep">
            <input type="text" class="form-input" :class="{ 'error': isUserIdError }" placeholder="아이디" v-model="userId"
                @focus="isUserIdError = false" maxlength="20" v-focus>
            <button class="form-btn" v-ripple>다음</button>
        </form>

        <default-dialog v-model="dialog.isVisible" :message="dialog.message" @confirm="dialog.isVisible = false" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFindPasswordStore } from '@/stores/FindPasswordStore';
import { decrypt } from '@/utils/crypto';
import axios from '@/utils/axiosInstance';

const store = useFindPasswordStore();

const userId = ref("");

const isUserIdError = ref(false);

const dialog = ref({
    isVisible: false,
    message: ""
});

const showDialog = (message) => {
    dialog.value.message = message;
    dialog.value.isVisible = true;
}

const nextStep = () => {
    if (!userId.value || userId.value.trim() === "") {
        isUserIdError.value = true;
        showDialog('아이디를 입력해주세요.');
        return;
    }

    // 아이디 확인 API 호출
    axios.get(`/account/modify/password/email/${userId.value}`)
        .then((response) => {
            // store에 아이디 이메일 저장
            store.userId = userId.value;
            store.email = decrypt(response.data.email);
            store.nextStep();
        })
        .catch((error) => {
            if (error?.response?.data?.errorMessage) {
                showDialog(error.response.data.errorMessage);
            } else {
                showDialog("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            }
        });
}
</script>

<style scoped>
.root-container {
    width: 100%;
}

.form-container {
    display: flex;
    flex-direction: column;
    padding: 0 24px;
}

.form-input {
    width: 100%;
    height: 56px;
    margin-bottom: 12px;
    padding: 0 16px;
    border: solid 2px var(--primary);
    border-radius: 12px;
    outline: none;
    font-size: 0.875rem;
}

.form-input::placeholder {
    color: #C6C6C6;
}

.form-btn {
    width: 100%;
    height: 56px;
    margin-top: 8px;
    border-radius: 12px;
    font-size: 0.875rem;
    background-color: var(--primary);
    color: white;
}

.error {
    border-color: var(--accent);
}
</style>