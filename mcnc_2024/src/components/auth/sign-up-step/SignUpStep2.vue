<template>
    <div class="root-container">
        <form class="form-container" novalidate @submit.prevent="nextStep">
            <input type="text" class="form-input" :class="{ 'error': isUserNameError }" placeholder="사용자명"
                v-model="userName" @focus="isUserNameError = false" v-focus>

            <div class="password-container" :class="{ 'error': isPasswordError }">
                <input v-model="password" :type="passwordInputType" class="form-input-password" placeholder="비밀번호"
                    autocomplete="new-password" @focus="isPasswordError = false">
                <img class="form-input-icon" :src="passwordIcon" @click="changePasswordInputType" />
            </div>

            <div class="password-container" :class="{ 'error': isPasswordConfirmError }">
                <input v-model="passwordConfirm" :type="passwordConfirmInputType" class="form-input-password"
                    placeholder="비밀번호 확인" autocomplete="new-password" @focus="isPasswordConfirmError = false">
                <img class="form-input-icon" :src="passwordConfirmIcon" @click="changePasswordConfirmInputType" />
            </div>

            <button class="form-btn" v-ripple>다음</button>
        </form>

        <default-dialog v-model="dialog.isVisible" :message="dialog.message" @confirm="dialog.isVisible = false" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSignUpStore } from '@/stores/SignUpStore';

import imgEyeClose from '@/assets/images/icon_eye_close.svg';
import imgEyeOpen from '@/assets/images/icon_eye_open.svg';

const store = useSignUpStore();

const userName = ref(store.name);
const password = ref(store.password);
const passwordConfirm = ref(store.passwordConfirm);

const isUserNameError = ref(false);
const isPasswordError = ref(false);
const isPasswordConfirmError = ref(false);

const passwordInputType = ref("password");
const passwordConfirmInputType = ref("password");

const dialog = ref({
    isVisible: false,
    message: ""
});

const showDialog = (message) => {
    dialog.value.message = message;
    dialog.value.isVisible = true;
}

const changePasswordInputType = () => {
    passwordInputType.value = passwordInputType.value === "password" ? "text" : "password";
}

const changePasswordConfirmInputType = () => {
    passwordConfirmInputType.value = passwordConfirmInputType.value === "password" ? "text" : "password";
}

const passwordIcon = computed(() => {
    return passwordInputType.value === "password" ? imgEyeClose : imgEyeOpen;
});

const passwordConfirmIcon = computed(() => {
    return passwordConfirmInputType.value === "password" ? imgEyeClose : imgEyeOpen;
});

const nextStep = () => {
    if (!userName.value || userName.value.trim() === "") {
        isUserNameError.value = true;
        showDialog('사용자명을 입력해주세요.');
        return;
    }

    if (!userName.value.match(/^[a-zA-Z가-힣 ]{2,50}$/)) {
        isUserNameError.value = true;
        showDialog('사용자명은 특수문자를 제외한 2~50자로 입력해주세요.');
        return;
    }

    if (!password.value || password.value.trim() === "") {
        isPasswordError.value = true;
        showDialog('비밀번호를 입력해주세요.');
        return;
    }

    if (!password.value.match(/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{8,}$/)) {
        isPasswordError.value = true;
        showDialog('비밀번호는 최소 8자, 숫자, 특수문자 및 대소문자를 포함해야 합니다.');
        return;
    }

    if (password.value !== passwordConfirm.value) {
        isPasswordConfirmError.value = true;
        showDialog('비밀번호가 일치하지 않습니다.');
        return;
    }

    store.setName(userName.value);
    store.setPassword(password.value);
    store.setPasswordConfirm(passwordConfirm.value);
    store.nextStep();
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

.password-container {
    width: 100%;
    height: 56px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    border: 2px solid var(--primary);
    border-radius: 12px;
    font-size: 0.875rem;
    outline: none;
}

.form-input-password {
    width: 100%;
    height: 100%;
    padding-right: 16px;
    font-size: 0.875rem;
    outline: none;
}

.form-input {
    width: 100%;
    height: 56px;
    margin-bottom: 12px;
    padding: 0 52px 0 16px;
    border: 2px solid var(--primary);
    border-radius: 12px;
    font-size: 0.875rem;
    outline: none;
}

.form-input-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.form-input::placeholder,
.form-input-password::placeholder {
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