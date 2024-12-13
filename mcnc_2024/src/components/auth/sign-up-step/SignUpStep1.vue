<template>
    <div class="root-container">
        <form class="form-container" novalidate @submit.prevent="nextStep">
            <input type="text" class="form-input" :class="{ 'error': isUserIdError }" placeholder="아이디" v-model="userId"
                @focus="isUserIdError = false" maxlength="20" v-focus>
            <input type="email" class="form-input" :class="{ 'error': isEmailError }" placeholder="이메일" v-model="email"
                autocomplete="new-password" maxlength="255" @focus="isEmailError = false">
            <button class="form-btn" v-ripple>다음</button>
        </form>

        <default-dialog v-model="dialog.isVisible" :message="dialog.message" @confirm="dialog.isVisible = false" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSignUpStore } from '@/stores/SignUpStore';
import axios from '@/utils/axiosInstance';

const store = useSignUpStore();

const userId = ref(store.userId);
const email = ref(store.email);

const isUserIdError = ref(false);
const isEmailError = ref(false);

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

    if (!userId.value.match(/^[a-zA-Z0-9-]{5,20}$/)) {
        isUserIdError.value = true;
        showDialog('아이디는 영문과 숫자 조합 5~20자로 입력해주세요.');
        return;
    }

    if (!email.value || email.value.trim() === "") {
        isEmailError.value = true;
        showDialog('이메일을 입력해주세요.');
        return;
    }

    if (!email.value.match(/^(?=.{1,255}$)[_A-Za-z0-9-+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/)) {
        isEmailError.value = true;
        showDialog('이메일 형식이 올바르지 않습니다.');
        return;
    }

    const requestBody = {
        userId: userId.value,
        email: email.value
    }

    // 아이디 이메일 중복 체크 API 호출
    axios.post(`/account/join/check`, JSON.stringify(requestBody), { withCredentials: false })
        .then((response) => {
            if (response.data.id == true && response.data.email == true) {
                showDialog('아이디와 이메일이 이미 사용 중입니다.');
                return;
            }

            if (response.data.id == true) {
                showDialog('아이디가 이미 사용 중입니다.');
                return;
            }

            if (response.data.email == true) {
                showDialog('이메일이 이미 사용 중입니다.');
                return;
            }

            // pinia store에 아이디, 이메일 임시 저장 후 2단계로 이동
            store.setUserId(userId.value);
            store.setEmail(email.value);
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