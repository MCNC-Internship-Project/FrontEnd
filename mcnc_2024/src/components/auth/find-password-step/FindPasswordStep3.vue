<template>
    <div class="root-container">
        <div class="form-container">
            <input type="password" class="form-input" :class="{ 'error': isPasswordError }" placeholder="새로운 비밀번호" v-model="password"
                @focus="isPasswordError = false">
            <input type="password" class="form-input" :class="{ 'error': isPasswordConfirmError }" placeholder="비밀번호 확인"
                v-model="passwordConfirm" @focus="isPasswordConfirmError = false">
            <button class="form-btn" v-ripple @click="changePassword">확인</button>
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
import { ref, defineEmits } from 'vue'

const password = ref("");
const passwordConfirm = ref("");

const isPasswordError = ref(false);
const isPasswordConfirmError = ref(false);

const showDialog = ref(false);
const dialogMessage = ref("");

const emit = defineEmits(["changePassword"]);

const showErrorDialog = (message) => {
    dialogMessage.value = message
    showDialog.value = true
}

const changePassword = () => {
    if (!password.value || password.value.trim() === "") {
        isPasswordError.value = true;
        showErrorDialog('비밀번호를 입력해주세요.');
        return;
    }

    if (!password.value.match(/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{8,}$/)) {
        isPasswordError.value = true;
        showErrorDialog('비밀번호는 최소 8자, 숫자, 특수문자 및 대소문자를 포함해야 합니다.');
        return;
    }

    if (password.value !== passwordConfirm.value) {
        isPasswordConfirmError.value = true;
        showErrorDialog('비밀번호가 일치하지 않습니다.');
        return;
    }

    // TODO: 비밀번호 변경 API 호출
    
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