<template>
    <div class="root-container">
        <form class="form-container" novalidate @submit.prevent="changePassword">
            <div class="password-container" :class="{ 'error': isPasswordError }">
                <input v-model="password" :type="passwordInputType" class="form-input-password" placeholder="비밀번호"
                    autocomplete="new-password" maxlength="100" @focus="isPasswordError = false">
                <img class="form-input-icon" :src="passwordIcon" @click="changePasswordInputType" />
            </div>

            <div class="password-container" :class="{ 'error': isPasswordConfirmError }">
                <input v-model="passwordConfirm" :type="passwordConfirmInputType" class="form-input-password" placeholder="비밀번호 확인" 
                    autocomplete="new-password" maxlength="100" @focus="isPasswordConfirmError = false">
                <img class="form-input-icon" :src="passwordConfirmIcon" @click="changePasswordConfirmInputType" />
            </div>
            <button class="form-btn" v-ripple>확인</button>
        </form>

        <default-dialog v-model="dialogs.defaultDialog.isVisible" :message="dialogs.defaultDialog.message"
            @confirm="changePasswordSuccess" />
        <default-dialog v-model="dialogs.errorDialog.isVisible" :message="dialogs.errorDialog.message"
            @confirm="dialogs.errorDialog.isVisible = false" />
    </div>
</template>

<script setup>
import { ref, defineEmits, computed } from 'vue'
import { useFindPasswordStore } from '@/stores/FindPasswordStore';
import { encrypt } from '@/utils/crypto';
import axios from '@/utils/axiosInstance';
import imgEyeClose from '@/assets/images/icon_eye_close.svg';
import imgEyeOpen from '@/assets/images/icon_eye_open.svg';

const store = useFindPasswordStore();

const password = ref("");
const passwordConfirm = ref("");

const isPasswordError = ref(false);
const isPasswordConfirmError = ref(false);

const passwordInputType = ref("password");
const passwordConfirmInputType = ref("password");

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

    const requestBody = {
        userId: store.userId,
        password: encrypt(password.value)
    }

    // 비밀번호 변경 API 호출
    axios.post(`/account/modify/password`, JSON.stringify(requestBody))
        .then(() => {
            showDialog('defaultDialog', '비밀번호가 변경되었습니다.');
        })
        .catch((error) => {
            if (error?.response?.data?.errorMessage) {
                showDialog('errorDialog', error.response.data.errorMessage);
            } else {
                showDialog('errorDialog', "오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            }
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

.form-input-password::placeholder {
    color: #C6C6C6;
}

.form-input-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
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