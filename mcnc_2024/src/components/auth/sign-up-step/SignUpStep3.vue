<!--
    - 회원가입 컴포넌트 내 세 번째 단계 컴포넌트
    
    - @author 반명우
-->

<template>
    <div class="root-container">
        <v-container>
            <div class="form-input" :class="{ 'error': isBirthError }"
                @click="showDatePicker = true; isBirthError = false;">
                <div class="text-container">
                    <span class="placeholder-text" v-if="!birth">생년월일</span>
                    <span class="text" v-if="birth">{{ dayjs(birth).format('YYYY년 MM월 DD일') }}</span>
                </div>
                <div class="img-container">
                    <img src="@/assets/images/icon_calendar.svg" class="icon" alt="calendar icon" />
                </div>
            </div>

            <v-menu v-model="showGenderMenu" :location="'bottom'" offset-y>
                <template v-slot:activator="{ props }">
                    <div class="form-input" :class="{ 'error': isGenderError }" v-bind="props"
                        @click="isGenderError = false;">
                        <div class="text-container">
                            <span class="placeholder-text" v-if="!gender">성별</span>
                            <span class="text">{{ gender }}</span>
                        </div>
                        <div class="img-container">
                            <img src="@/assets/images/icon_dropdown.svg" class="icon" alt="dropdown icon" />
                        </div>
                    </div>
                </template>

                <v-list>
                    <v-list-item v-for="(option, index) in genderOptions" :key="index" @click="selectGender(option)">
                        <v-list-item-title>{{ option }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            <button class="form-btn" v-ripple @click="goToSignUp">회원가입</button>
        </v-container>

        <v-dialog v-model="showDatePicker" width="340" max-width="400">
            <v-card style="background-color: #FFF;">
                <v-date-picker hide-header v-model="birth" width="320" max-width="400"
                    @update:model-value="showDatePicker = false; isBirthError = false;" color="#1088E3"
                    :max="today"></v-date-picker>
            </v-card>
        </v-dialog>

        <default-dialog v-model="dialogs.defaultDialog.isVisible" :message="dialogs.defaultDialog.message"
            :isPersistent="dialogs.defaultDialog.isPersistent" @confirm="dialogConfirm(dialogs.defaultDialog)" />
    </div>
</template>

<script setup>
import { ref, defineEmits, watch } from 'vue'
import { useSignUpStore } from '@/stores/SignUpStore';
import { encrypt } from '@/utils/crypto';
import axios from '@/utils/axiosInstance';
import dayjs from 'dayjs'

const store = useSignUpStore();

const birth = ref(store.birth);
const gender = ref(store.gender);

const isBirthError = ref(false);
const isGenderError = ref(false);

const genderOptions = ['남성', '여성'];

const showDatePicker = ref(false);
const showGenderMenu = ref(false);

const today = new Date();
today.setDate(today.getDate() - 1);

const emit = defineEmits("signUp");

const dialogs = ref({
    defaultDialog: {
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

const selectGender = (value) => {
    gender.value = value;
    showGenderMenu.value = false;
    isGenderError.value = false;
}

const goToSignUp = () => {
    if (!birth.value) {
        isBirthError.value = true;
        showDialog(dialogs.value.defaultDialog, "생년월일을 선택해주세요.", false, null);
        return;
    }

    if (!gender.value) {
        isGenderError.value = true;
        showDialog(dialogs.value.defaultDialog, "성별을 선택해주세요.", false, null);
        return;
    }

    // 서버 요청 형식에 맞게 데이터 형식 변경
    const birthFormatted = dayjs(birth.value).format('YYYY-MM-DD');
    const genderFormatted = gender.value === '남성' ? 'M' : 'F'

    const requestBody = {
        userId: store.userId,       
        email: encrypt(store.email),
        password: encrypt(store.password),
        gender: genderFormatted,
        birth: birthFormatted,
        name: store.name
    };

    // 회원가입 API 호출
    axios.post(`/account/join`, JSON.stringify(requestBody), { withCredentials: false })
        .then(() => {
            emit("signUp");
        })
        .catch((error) => {
            if (error.status === 403) {
                showDialog(dialogs.value.defaultDialog, "유효시간이 만료되었습니다. 다시 시도해주세요.", true, () => {
                    store.stepTo1();
                });
            }

            if (error?.response?.data?.errorMessage) {
                showDialog(dialogs.value.defaultDialog, error.response.data.errorMessage, false, null);
            } else {
                showDialog(dialogs.value.defaultDialog, "오류가 발생했습니다. 잠시 후 다시 시도해주세요.", false, null);
            }
        });
}

watch([birth, gender], ([newBirth, newGender]) => {
    store.setBirth(newBirth);
    store.setGender(newGender);
});
</script>

<style scoped>
.root-container {
    width: 100%;
}

.v-container {
    display: flex;
    flex-direction: column;
    padding: 0 24px;
}

.form-input {
    display: flex;
    align-items: center;
    width: 100%;
    height: 56px;
    margin-bottom: 12px;
    padding: 0 16px;
    border: solid 2px var(--primary);
    border-radius: 12px;
    font-size: 0.875rem;
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

.text-container {
    width: 100%;
    margin: 0 auto;
    text-align: left;
}

.placeholder-text {
    color: #C6C6C6;
}

.text {
    color: #757575;
}

.img-container {
    width: 20px;
    height: 20px;
}

.icon {
    width: 20px;
    height: 20px;
}

.v-picker {
    margin: 12px;
}

.error {
    border-color: var(--accent);
}
</style>