<template>
    <div class="root-container">
        <div class="form-container">
            <div class="email-hint">{{ formatEmail(props.email) }}</div>
            <div class="email-container">
                <input type="email" class="form-input" :class="{ 'error': isEmailError }" placeholder="이메일"
                    autocomplete="userEmail" v-model="email" @focus="isEmailError = false">
                <button class="verify-btn" v-ripple @click="verifyCode">인증</button>
            </div>
            <input type="number" class="form-input" :class="{ 'error': isCodeError }" placeholder="인증번호" v-model="code"
                @focus="isCodeError = false" @input="preventInvalidInput">
            <button class="form-btn" v-ripple @click="stepTo3">다음</button>
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
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const email = ref("");
const code = ref("");
const isEmailError = ref(false);
const isCodeError = ref(false);
const verified = ref(false);

const showDialog = ref(false)
const dialogMessage = ref("")

const props = defineProps({
    step: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

const emit = defineEmits(["nextStep"])

const showErrorDialog = (message) => {
    dialogMessage.value = message
    showDialog.value = true
}

const verifyCode = () => {
    if (!email.value || email.value.trim() === "") {
        isEmailError.value = true;
        showErrorDialog('이메일을 입력해주세요.');
        return;
    }

    if (!email.value.match(/^[_A-Za-z0-9-+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/)) {
        isEmailError.value = true;
        showErrorDialog('이메일 형식이 올바르지 않습니다.');
        return;
    }

    // TODO: 이메일 인증 코드 전송 API 호출
}

const stepTo3 = () => {
    if (!code.value || code.value.trim() === "") {
        isCodeError.value = true;
        showErrorDialog('인증번호를 입력해주세요.');
        return;
    }

    if (code.value.length !== 6) {
        isCodeError.value = true;
        showErrorDialog('인증번호는 6자리로 입력해주세요.');
        return;
    }

    if (!verified.value) {
        isCodeError.value = true;
        showErrorDialog('이메일 인증이 완료되지 않았습니다.');
        // return;
    }

    emit("nextStep", { step: props.step + 1 })
}

const preventInvalidInput = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    value = value.slice(0, 6);
    e.target.value = value;
    code.value = value;
}

const formatEmail = (email) => {
    if (!email) 
        return '';

    const [id, domain] = email.split('@');
    const formattedId = id.charAt(0) + '****';
    return `${formattedId}@${domain}`;
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
</style>