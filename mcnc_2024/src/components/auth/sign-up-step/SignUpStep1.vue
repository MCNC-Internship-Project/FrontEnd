<template>
    <div class="root-container">
        <div class="form-container">

            <div class="input-container">
                <input type="text" class="form-input" :class="{ 'error': isUserIdError }" placeholder="아이디"
                    v-model.trim="userId" maxlength="20" :disabled="isUserIdVerified" @focus="isUserIdError = false" v-focus>
                <button class="verify-btn" :disabled="isUserIdVerified" @click="verifyId" v-ripple>중복확인</button>
            </div>

            <div class="input-container">
                <input type="email" class="form-input" :class="{ 'error': isEmailError }" placeholder="이메일"
                    v-model.trim="email" autocomplete="new-password" maxlength="255" :disabled="isEmailVerified" @focus="isEmailError = false">
                <button class="verify-btn" :disabled="isEmailSending || isEmailVerified" @click="verifyEmail" v-ripple>인증</button>
            </div>

            <input type="text" class="form-input" :class="{ 'error': isCodeError }" placeholder="인증번호"
                v-model.trim="code" maxlength="8" :disabled="isEmailVerified" @focus="isCodeError = false">

            <button class="form-btn" @click="verifyCode" v-ripple>다음</button>
        </div>

        <default-dialog v-model="dialogs.defaultDialog.isVisible" :message="dialogs.defaultDialog.message"
            :isPersistent="dialogs.defaultDialog.isPersistent" @confirm="dialogConfirm(dialogs.defaultDialog)" />

        <confirm-dialog v-model="dialogs.confirmDialog.isVisible" :message="dialogs.confirmDialog.message"
            :isPersistent="dialogs.confirmDialog.isPersistent" @confirm="dialogConfirm(dialogs.confirmDialog)" />

        <progress-dialog v-model="dialogs.progressDialog.isVisible" :message="dialogs.progressDialog.message" />
    </div>
</template>

<script setup>
/**
 * @fileoverview 회원가입 1단계 컴포넌트
 * @author 김원재 (kimwonjae@mcnc.co.kr)
 * @author 반명우 (banmyungwoo@mcnc.co.kr)
 * @date 2024-11-06
 * @lastModified 2024-12-19
 * @description 회원가입 1단계
 * @details
 * - 아이디 중복 확인
 * - 이메일 인증
 */

import { ref, computed } from 'vue'
import { useSignUpStore } from '@/stores/SignUpStore';
import { encrypt } from '@/utils/crypto';
import axios from '@/utils/axiosInstance';

const store = useSignUpStore();

const userId = ref(store.userId);
const email = ref(store.email);
const code = ref(store.code);

const isUserIdError = ref(false);
const isEmailError = ref(false);
const isCodeError = ref(false);
const isEmailSending = ref(false);

const isUserIdVerified = computed(() => store.userIdVerified);
const isEmailVerified = computed(() => store.emailVerified);

const dialogs = ref({
    defaultDialog: {
        isVisible: false,
        message: "",
        isPersistent: false,
        callback: null
    },
    confirmDialog: {
        isVisible: false,
        message: "",
        isPersistent: false,
        callback: null
    },
    progressDialog: {
        isVisible: false,
        message: "",
        isPersistent: false,
        callback: null
    }
})

const showDialog = (dialog, message, isPersistent = false, callback = null) => {
    dialog.isVisible = true
    dialog.message = message;
    dialog.isPersistent = isPersistent;
    dialog.callback = callback;
}

const dialogConfirm = (dialog) => {
    if (dialog.callback) {
        dialog.callback();
    }

    dialog.isVisible = false;
}

// 아이디 중복 여부 확인
const verifyId = () => {
    if (!userId.value) {
        isUserIdError.value = true;
        showDialog(dialogs.value.defaultDialog, "아이디를 입력해주세요.", false, null);
        return;
    }

    if (!userId.value.match(/^[a-zA-Z0-9]{5,20}$/)) {
        isUserIdError.value = true;
        showDialog(dialogs.value.defaultDialog, "사용자 아이디는 5~20자의 영문과 숫자로 입력해주세요.", false, null);
        return;
    }

    const requestBody = {
        userId: userId.value
    }

    // 아이디 중복 체크 API 호출
    axios.post(`/account/join/check`, requestBody, { withCredentials: false })
        .then((response) => {
            if (response.data.isDuplicated) {
                isUserIdError.value = true;
                showDialog(dialogs.value.defaultDialog, "해당 아이디가 이미 사용 중입니다.", false, null);
                return;
            }

            showDialog(dialogs.value.confirmDialog, "사용 가능한 아이디입니다. 사용하시겠습니까?", true, () => {
                store.setUserId(userId.value);
                store.setUserIdVerified(true);
            });
        })
        .catch((error) => {
            if (error?.response?.data?.errorMessage) {
                showDialog(dialogs.value.defaultDialog, error.response.data.errorMessage, false, null);
            } else {
                showDialog(dialogs.value.defaultDialog, "오류가 발생했습니다. 잠시 후 다시 시도해주세요.", false, null);
            }
        });
}

// 이메일 인증번호 발송
const verifyEmail = () => {
    if (!isUserIdVerified.value) {
        isUserIdError.value = true;
        showDialog(dialogs.value.defaultDialog, "아이디 중복 여부를 확인해주세요.", false, null);
        return;
    }

    if (!email.value) {
        isEmailError.value = true;
        showDialog(dialogs.value.defaultDialog, "이메일을 입력해주세요.", false, null);
        return;
    }

    if (!email.value.match(/^(?=.{1,255}$)[_A-Za-z0-9-+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/)) {
        isEmailError.value = true;
        showDialog(dialogs.value.defaultDialog, "이메일 형식이 올바르지 않습니다.", false, null);
        return;
    }

    isEmailSending.value = true;
    showDialog(dialogs.value.progressDialog, "이메일 인증번호 발송 중...", true, null);

    const requestBody = {
        email: encrypt(email.value)
    }

    // 이메일 인증번호 발송 API 호출
    axios.post(`/auth/email/send`, requestBody, { withCredentials: false })
        .then(() => {
            showDialog(dialogs.value.defaultDialog, "인증번호가 발송되었습니다.", false, null);
        })
        .catch((error) => {
            if (error?.response?.data?.errorMessage) {
                isEmailError.value = true;
                showDialog(dialogs.value.defaultDialog, error.response.data.errorMessage, false, null);
            } else {
                showDialog(dialogs.value.defaultDialog, "오류가 발생했습니다. 잠시 후 다시 시도해주세요.", false, null);
            }
        })
        .finally(() => {
            isEmailSending.value = false;
            dialogs.value.progressDialog.isVisible = false;
        });
}

// 이메일 인증번호 확인
const verifyCode = () => {
    if (isUserIdVerified.value && isEmailVerified.value) {
        store.nextStep();
        return;
    }

    if (!isUserIdVerified.value) {
        isUserIdError.value = true;
        showDialog(dialogs.value.defaultDialog, "아이디 중복 여부를 확인해주세요.", false, null);
        return;
    }

    if (!code.value) {
        isCodeError.value = true;
        showDialog(dialogs.value.defaultDialog, "인증번호를 입력해주세요.", false, null);
        return;
    }

    const requestBody = {
        email: encrypt(email.value),
        tempAuthCode: code.value
    }

    // 인증번호 확인 API 호출
    axios.post(`/auth/email/check`, requestBody, { withCredentials: false })
        .then(() => {
            showDialog(dialogs.value.defaultDialog, "이메일 인증이 완료되었습니다.", true, () => {
                store.setEmailVerified(true);
                store.setEmail(email.value);
                store.setCode(code.value);
                store.nextStep();
            });
        })
        .catch((error) => {
            if (error?.response?.data?.errorMessage) {
                isCodeError.value = true;
                showDialog(dialogs.value.defaultDialog, error.response.data.errorMessage, false, null);
            } else {
                showDialog(dialogs.value.defaultDialog, "오류가 발생했습니다. 잠시 후 다시 시도해주세요.", false, null);
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

.input-container {
    display: flex;
    margin-bottom: 12px;
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

.form-input:disabled {
    border-color: #cccccc;
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

.verify-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
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
</style>