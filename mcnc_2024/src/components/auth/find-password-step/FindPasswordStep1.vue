<template>
    <div class="root-container">
        <div class="form-container">
            <input type="text" class="form-input" :class="{ 'error': isUserIdError }" placeholder="아이디" v-model="userId"
                @focus="isUserIdError = false">
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
import { ref, defineProps, defineEmits } from 'vue'
import axios from 'axios';

const baseUrl = process.env.VUE_APP_API_URL;

const userId = ref("")

const isUserIdError = ref(false);

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

    axios.get(`${baseUrl}/account/modify/password/email/${userId.value}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            emit("nextStep", { step: props.step + 1, userId: userId.value, email: response.data.email });
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