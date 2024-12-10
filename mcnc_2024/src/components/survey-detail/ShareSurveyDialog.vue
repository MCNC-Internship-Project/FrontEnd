<template>
    <v-dialog v-model="isVisible" persistent max-width="400" min-width="300">
        <v-card>
            <div class="dialog-container">
                <div class="dialog-title">이메일 초대</div>
                <input class="dialog-input" :class="{ 'error': isEmailError }" type="email"
                    placeholder="example@email.com" v-model="email" maxlength="255" @keyup.enter="addEmail(email)"
                    @input="isEmailError = false" @click="isEmailError = false" v-focus />
                <div class="error-message" v-if="isEmailError">{{ errorMessage }}</div>
                <div class="list-container" v-if="emailList.length > 0">
                    <div class="item-container" v-for="(item, index) in emailList" :key="item">
                        <div class="email">{{ item }}</div>
                        <img class="img-delete" src="@/assets/images/icon_x_accent.svg" alt="delete icon"
                            @click="deleteEmail(index)" />
                    </div>
                </div>
            </div>
            <div class="dialog-actions">
                <v-btn v-if="!isEmailSending" class="cancel-btn" @click="isVisible = false">취소</v-btn>
                <v-btn class="confirm-btn" color="var(--primary)" @click="sendEmail" :disabled="isEmailSending">
                    <div class="confirm-btn-container">
                        <div v-if="!isEmailSending" class="confirm-btn-txt">보내기</div>
                        <div v-else class="progress-container">
                            <v-progress-circular class="progress" indeterminate color="var(--primary)"></v-progress-circular>
                            <div class="progress-text">이메일 전송 중...</div>
                        </div>
                    </div>
                </v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, nextTick, watch } from 'vue';
import axios from 'axios';
import { encrypt } from '@/utils/crypto';

const baseUrl = process.env.VUE_APP_API_URL;

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    surveyId: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const isVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const onConfirm = () => {
    emit('confirm');
    emit('update:modelValue', false);
};

const email = ref('');
const emailList = ref([]);
const isEmailError = ref(false);
const errorMessage = ref('');
const isEmailSending = ref(false);

const addEmail = (inputEmail) => {
    isEmailError.value = false;

    const trimmedEmail = inputEmail.trim();

    if (!trimmedEmail) {
        showErrorMessage('*이메일을 입력해주세요.');
        return;
    }

    if (!trimmedEmail.match(/^(?=.{1,255}$)[_A-Za-z0-9-+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/)) {
        showErrorMessage('*이메일 형식이 올바르지 않습니다.');
        return;
    }

    if (emailList.value.includes(trimmedEmail)) {
        showErrorMessage('*이미 추가된 이메일입니다.');
        return;
    }

    emailList.value.push(trimmedEmail);
    email.value = '';

    scrollToBottom();
};

// index에 해당하는 위치의 항목 삭제
const deleteEmail = (index) => {
    emailList.value.splice(index, 1);
};

// 이메일이 추가되면 아래로 스크롤
const scrollToBottom = () => {
    nextTick(() => {
        const listContainer = document.querySelector('.list-container');
        listContainer.scrollTop = listContainer.scrollHeight;
    });
};

const showErrorMessage = (message) => {
    isEmailError.value = true;
    errorMessage.value = message;
};

const sendEmail = () => {
    if (emailList.value.length === 0) {
        showErrorMessage('*이메일을 추가해주세요.');
        return;
    }

    const encryptedEmailList = emailList.value.map((email) => encrypt(email));

    isEmailSending.value = true;

    axios.post(`${baseUrl}/mail/send/${props.surveyId}`, JSON.stringify(encryptedEmailList), {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            onConfirm();
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            isEmailSending.value = false;
        });
}

watch(isVisible, (newValue) => {
    if (!newValue) {
        emailList.value = [];
        email.value = '';
        isEmailError.value = false;
        errorMessage.value = '';
        isEmailSending.value = false;
    }
});
</script>

<style scoped>
.v-card {
    background-color: #FAF8F8;
    border: 1px solid #EFF0F6;
    border-radius: 16px !important;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.dialog-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 24px 24px 0 24px;
}

.dialog-title {
    font-size: 1.25rem;
    font-weight: bold;
    color: #757576;
    margin-left: 12px;
}

.dialog-input {
    width: 100%;
    height: 60px;
    margin-top: 16px;
    font-size: 1.125rem;
    background-color: #FFF;
    border-radius: 12px;
    padding: 0 24px;
    outline: none;
    border: 1px solid #EFF0F6;
    box-shadow: 0px 5px 16px rgba(8, 15, 52, 0.04);
}

.dialog-input::placeholder {
    color: #D0CACA;
}

.error-message {
    color: var(--accent);
    font-size: 0.875rem;
    margin: 4px 0 0 12px;
}

.list-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
    margin-top: 12px;
    padding: 4px 4px 12px 4px;
    max-height: 160px;
    overflow-y: auto;
}

.item-container {
    display: flex;
    height: 40px;
    padding: 0 12px 0 16px;
    border: 1px solid #757576;
    border-radius: 20px;
    background-color: #FFF;
    box-shadow: 0px 5px 16px rgba(8, 15, 52, 0.04);
    align-items: center;
    max-width: 100%;
}

.email {
    font-size: 1rem;
    color: #757576;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    white-space: nowrap;
}

.img-delete {
    width: 20px;
    height: 20px;
    margin-left: 12px;
    cursor: pointer;
}

.dialog-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 20px 40px;
}

.v-btn {
    flex: 1;
    height: 48px;
    font-size: 1rem;
    font-weight: bold;
    border: 1px solid #EFF0F7;
    border-radius: 16px;
    box-shadow: 0px 5px 16px rgba(8, 15, 52, 0.06);
}

.cancel-btn {
    background-color: #FFFFFF;
    color: #757576;
}

.confirm-btn-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.confirm-btn-txt {
    color: #FFFFFF;
}

.confirm-btn:disabled {
    background-color: #F5F5F5 !important;
    cursor: not-allowed;
}

.progress-container {
    display: flex;
    align-items: center;
}

.progress-text {
    color: #757576;
    margin-left: 12px;
}

.error {
    border: 2px solid var(--accent);
    animation: shake 0.3s ease-in-out;

}

@keyframes shake {
    0% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    50% {
        transform: translateX(5px);
    }

    75% {
        transform: translateX(-5px);
    }

    100% {
        transform: translateX(0);
    }
}
</style>