<template>
    <div class="root-container">
        <form class="form-container" novalidate @submit.prevent="changePassword">
            <input type="password" class="form-input" :class="{ 'error': isPasswordError }" placeholder="새로운 비밀번호"
                v-model="password" @focus="isPasswordError = false" v-focus>
            <input type="password" class="form-input" :class="{ 'error': isPasswordConfirmError }" placeholder="비밀번호 확인"
                v-model="passwordConfirm" @focus="isPasswordConfirmError = false">
            <button class="form-btn" v-ripple>확인</button>
        </form>

        <default-dialog v-model="dialogs.defaultDialog.isVisible" :message="dialogs.defaultDialog.message"
            @confirm="changePasswordSuccess" />
        <default-dialog v-model="dialogs.errorDialog.isVisible" :message="dialogs.errorDialog.message"
            @confirm="dialogs.errorDialog.isVisible = false" />
    </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useFindPasswordStore } from '@/stores/FindPasswordStore';
import axios from 'axios';

const baseUrl = process.env.VUE_APP_API_URL;
const store = useFindPasswordStore();

const password = ref("");
const passwordConfirm = ref("");

const isPasswordError = ref(false);
const isPasswordConfirmError = ref(false);

const emit = defineEmits("changePassword");

const dialogs = ref({
    defaultDialog: {
        isVisible: false,
        message: "",
    },
    errorDialog: {
        isVisible: false,
        message: "",
    }
})

const showDialog = (type, message) => {
    dialogs.value[type].message = message;
    dialogs.value[type].isVisible = true;
}

const changePassword = () => {
    if (!password.value || password.value.trim() === "") {
        isPasswordError.value = true;
        showDialog('errorDialog', '비밀번호를 입력해주세요.');
        return;
    }

    if (!password.value.match(/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{8,}$/)) {
        isPasswordError.value = true;
        showDialog('errorDialog', '비밀번호는 최소 8자, 숫자, 특수문자 및 대소문자를 포함해야 합니다.');
        return;
    }

    if (password.value !== passwordConfirm.value) {
        isPasswordConfirmError.value = true;
        showDialog('errorDialog', '비밀번호가 일치하지 않습니다.');
        return;
    }

    const jsonData = {
        userId: store.userId,
        password: password.value
    }

    // 비밀번호 변경 API 호출
    axios.post(`${baseUrl}/account/modify/password`, JSON.stringify(jsonData), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            showDialog('defaultDialog', '비밀번호가 변경되었습니다.');
        })
        .catch((error) => {
            showDialog('errorDialog', error.response.data.errorMessage);
        });
}

// 비밀번호 변경 성공
const changePasswordSuccess = () => {
    dialogs.value.defaultDialog.isVisible = false;
    emit("changePassword");
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