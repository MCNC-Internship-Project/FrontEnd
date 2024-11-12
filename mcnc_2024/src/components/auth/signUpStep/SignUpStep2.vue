<template>
    <div class="root-container">
        <div class="form-container">
            <input type="text" class="form-input" placeholder="사용자명" v-model="userName">
            <input type="password" class="form-input" placeholder="비밀번호" autocomplete="new-password" v-model="password">
            <input type="password" class="form-input" placeholder="비밀번호 확인" autocomplete="new-password">
            <button class="form-btn" @click="stepTo3">다음</button>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const userName = ref("")
const password = ref("")

const props = defineProps({
    step : Number,
})

const emit = defineEmits(["nextStep"])

function stepTo3() {
    emit("nextStep", {userName: userName.value, password: password.value, step: props.step + 1})
}
    
</script>

<style scoped>
.root-container {
    width: 100%;
}

.form-container {
    padding: 0 24px;
}

.form-input,
.form-btn {
    width: 100%;
    height: 56px;
    margin-bottom: 20px;
    padding: 0 16px;
    border: solid 2px var(--primary);
    border-radius: 12px;
    outline: none;
    font-size: 0.875rem;
}

.form-input {
    margin-bottom: 12px;
}

.form-input::placeholder {
    color: #C6C6C6;
}

.form-btn {
    background-color: var(--primary);
    border: none;
    color: white;
    transition: all 0.2s ease;
    margin-top: 8px;
}

.form-btn:hover {
    background-color: #0d6db7;
}
</style>