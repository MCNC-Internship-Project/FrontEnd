<template>
    <div class="root-container">
        <div class="form-container">
            <input type="text" class="form-input" :class="{ 'error': isUserIdError }" placeholder="아이디" v-model="userId"
                @focus="isUserIdError = false">
            <input type="email" class="form-input" :class="{ 'error': isEmailError }" placeholder="이메일"
                autocomplete="userEmail" v-model="email" @focus="isEmailError = false">
            <button class="form-btn" v-ripple @click="stepTo2">다음</button>
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
import axios from 'axios';
import { ref, defineProps, defineEmits } from 'vue'

const baseUrl = process.env.VUE_APP_API_URL;

const userId = ref("")
const email = ref("")

const isUserIdError = ref(false);
const isEmailError = ref(false);

const showDialog = ref(false)
const dialogMessage = ref("")

const props = defineProps({
    step: Number,
})

const emit = defineEmits(["nextStep"]);

const showErrorDialog = (message) => {
    dialogMessage.value = message
    showDialog.value = true
}

const stepTo2 = () => {
    if (!userId.value || userId.value.trim() === "") {
        isUserIdError.value = true;
        showErrorDialog('아이디를 입력해주세요.');
        return;
    }

    if (!userId.value.match(/^[a-zA-Z0-9-]{5,20}$/)) {
        isUserIdError.value = true;
        showErrorDialog('아이디는 영문과 숫자 조합 5~20자로 입력해주세요.');
        return;
    }

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

    const jsonData = {
        userId: userId.value,
        email: email.value
    }

    axios.post(`${baseUrl}/account/join/check`, JSON.stringify(jsonData), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            if (response.data.id == true && response.data.email == true) {
                showErrorDialog('아이디와 이메일이 이미 사용 중입니다.');
                return;
            }

            if (response.data.id == true) {
                showErrorDialog('아이디가 이미 사용 중입니다.');
                return;
            }

            if (response.data.email == true) {
                showErrorDialog('이메일이 이미 사용 중입니다.');
                return;
            }

            emit("nextStep", { userId: userId.value, email: email.value, step: props.step + 1 })
        })
        .catch((error) => {
            console.log(error);
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