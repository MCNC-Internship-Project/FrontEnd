<template>
    <div class="root-container">
        <div class="form-container">
            <div class="email-hint">{{ hideEmail(store.email) }}</div>
            <div class="email-container">
                <input type="email" class="form-input" :class="{ 'error': isEmailError }" placeholder="이메일"
                    autocomplete="userEmail" v-model="email" @focus="isEmailError = false" v-focus>
                <button class="verify-btn" v-ripple @click="verifyCode" :disabled="isEmailSending">인증</button>
            </div>
            <input type="text" class="form-input" :class="{ 'error': isCodeError }" placeholder="인증번호" v-model="code"
                @focus="isCodeError = false">
            <button class="form-btn" v-ripple @click="nextStep">다음</button>
        </div>

        <default-dialog v-model="dialogs.defaultDialog.isVisible" :message="dialogs.defaultDialog.message"
            :isPersistent=true @confirm="dialogs.defaultDialog.isVisible = false" />
        <progress-dialog v-model="dialogs.progressDialog.isVisible" :message="dialogs.progressDialog.message" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFindPasswordStore } from '@/stores/FindPasswordStore';
import axios from 'axios';
import { encrypt } from '@/utils/crypto';

const baseUrl = process.env.VUE_APP_API_URL;
const store = useFindPasswordStore();

const email = ref("");
const code = ref("");

const isEmailError = ref(false);
const isCodeError = ref(false);

const dialogs = ref({
    defaultDialog: {
        isVisible: false,
        message: "",
    },
    progressDialog: {
        isVisible: false,
        message: "",
    }
})

const showDialog = (type, message) => {
    dialogs.value[type].message = message;
    dialogs.value[type].isVisible = true;
}

const isEmailSending = ref(false);

const verifyCode = () => {
    if (!email.value || email.value.trim() === "") {
        isEmailError.value = true;
        showDialog('defaultDialog', '이메일을 입력해주세요.');
        return;
    }

    if (!email.value.match(/^[_A-Za-z0-9-+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/)) {
        isEmailError.value = true;
        showDialog('defaultDialog', '이메일 형식이 올바르지 않습니다.');
        return;
    }

    const requestBody = {
        userId: store.userId,
        email: encrypt(email.value)
    }

    isEmailSending.value = true;
    showDialog('progressDialog', '인증번호 발송 중...');

    // 인증번호 발송 API 호출
    axios.post(`${baseUrl}/auth/password/send`, JSON.stringify(requestBody), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            showDialog('defaultDialog', '인증번호가 발송되었습니다.');
        })
        .catch((error) => {
            showDialog('defaultDialog', error.response.data.errorMessage);
        })
        .finally(() => {
            isEmailSending.value = false;
            dialogs.value.progressDialog.isVisible = false;
        });
}

const nextStep = () => {
    if (!code.value || code.value.trim() === "") {
        isCodeError.value = true;
        showDialog('defaultDialog', '인증번호를 입력해주세요.');
        return;
    }

    const requestBody = {
        userId: store.userId,
        tempAuthCode: code.value
    }

    // 인증번호 확인 API 호출
    axios.post(`${baseUrl}/auth/password/check`, JSON.stringify(requestBody), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            store.nextStep();
        })
        .catch((error) => {
            showDialog('defaultDialog', error.response.data.errorMessage);
        });
}

// 이메일 주소 가리기
const hideEmail = (email) => {
    if (!email)
        return '';

    const [id, domain] = email.split('@');
    const formattedId = id.charAt(0) + '****';
    const formattedDomain = domain.charAt(0) + '****';
    return `${formattedId}@${formattedDomain}`;
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

.email-hint {
    margin-left: 8px;
    color: #666666;
    font-size: 1rem;
}

.email-container {
    display: flex;
    margin: 12px 0;
}

.form-input {
    width: 100%;
    height: 56px;
    padding: 0 16px;
    border: solid 2px var(--primary);
    border-radius: 12px;
    outline: none;
    font-size: 0.875rem;
}

.form-input::placeholder {
    color: #C6C6C6;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
}

.verify-btn {
    width: 80px;
    height: 56px;
    border-radius: 12px;
    font-size: 0.875rem;
    background-color: var(--primary);
    color: white;
    margin-left: 8px;
    flex-shrink: 0;
}

.form-btn {
    width: 100%;
    height: 56px;
    margin-top: 20px;
    border-radius: 12px;
    font-size: 0.875rem;
    background-color: var(--primary);
    color: white;
}

.error {
    border-color: var(--accent);
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

.verify-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.progress-dialog-container {
    display: flex;
    align-items: center;
    padding: 32px 16px 32px 32px;
}

.progress-dialog-message {
    margin-left: 32px;
    font-size: 1.125rem;
    font-weight: bold;
    color: #757576;
}
</style>