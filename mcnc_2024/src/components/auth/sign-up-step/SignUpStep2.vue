<template>
    <div class="root-container">
        <form class="form-container" novalidate @submit.prevent="nextStep">
            <input type="text" class="form-input" :class="{ 'error': isUserNameError }" placeholder="사용자명"
                v-model="userName" @focus="isUserNameError = false" v-focus>
            <input type="password" class="form-input" :class="{ 'error': isPasswordError }" placeholder="비밀번호"
                autocomplete="new-password" v-model="password" @focus="isPasswordError = false">
            <input type="password" class="form-input" :class="{ 'error': isPasswordConfirmError }" placeholder="비밀번호 확인"
                autocomplete="new-password" v-model="passwordConfirm" @focus="isPasswordConfirmError = false">
            <button class="form-btn" v-ripple>다음</button>
        </form>

        <default-dialog v-model="dialog.isVisible" :message="dialog.message" @confirm="dialog.isVisible = false" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSignUpStore } from '@/stores/SignUpStore';

const store = useSignUpStore();

const userName = ref(store.name);
const password = ref(store.password);
const passwordConfirm = ref(store.passwordConfirm);

const isUserNameError = ref(false);
const isPasswordError = ref(false);
const isPasswordConfirmError = ref(false);

const dialog = ref({
    isVisible: false,
    message: ""
});

const showDialog = (message) => {
    dialog.value.message = message;
    dialog.value.isVisible = true;
}

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