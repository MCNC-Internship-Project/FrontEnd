<template>
    <div class="root-container">
        <div class="form-container">
            <input type="text" class="form-input" :class="{ 'error': isUserNameError }" placeholder="사용자명"
                v-model="userName" @input="isUserNameError = false">
            <input type="password" class="form-input" :class="{ 'error': isPasswordError }" placeholder="비밀번호"
                autocomplete="new-password" v-model="password" @input="isPasswordError = false">
            <input type="password" class="form-input" :class="{ 'error': isPasswordConfirmError }" placeholder="비밀번호 확인"
                autocomplete="new-password" v-model="passwordConfirm" @input="isPasswordConfirmError = false">
            <button class="form-btn" v-ripple @click="stepTo3">다음</button>
        </div>

        <v-dialog v-model="showDialog" max-width="400">
            <v-card>
                <v-card-text>
                    {{ dialogMessage }}
                </v-card-text>
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

const userName = ref("")
const password = ref("")
const passwordConfirm = ref("")

const isUserNameError = ref(false);
const isPasswordError = ref(false);
const isPasswordConfirmError = ref(false);

const showDialog = ref(false)
const dialogMessage = ref("")

const props = defineProps({
    step: Number,
})

const emit = defineEmits(["nextStep"])

const showErrorDialog = (message) => {
    dialogMessage.value = message
    showDialog.value = true
}

const stepTo3 = () => {
    if (!userName.value || userName.value.trim() === "") {
        isUserNameError.value = true;
        showErrorDialog('사용자명을 입력해주세요.');
        return;
    }

    if (!userName.value.match(/^[a-zA-Z가-힣 ]{2,50}$/)) {
        isUserNameError.value = true;
        showErrorDialog('사용자명은 특수문자를 제외한 2~50자로 입력해주세요.');
        return;
    }

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

    emit("nextStep", { userName: userName.value, password: password.value, step: props.step + 1 })
}

</script>

<style scoped>
.root-container {
    width: 100%;
}

.form-container {
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
    background-color: #FAF8F8;
    border-radius: 16px !important;
    border: 1px solid #EFF0F6;
    padding: 16px 12px 12px 12px;
}

.v-card-text {
    font-size: 1rem !important;
    color: #757576;
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