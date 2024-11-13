<template>
    <div class="root-container">
        <div class="form-container">
            <input type="email" class="form-input" placeholder="아이디(이메일)" autocomplete="userId" v-model="userId">
            <button class="form-btn" @click="stepTo2">다음</button>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
    step: Number,
})

const userId = ref("")

const emit = defineEmits(["nextStep"]);

function stepTo2() {
    emit("nextStep", { userId: userId.value, step: props.step + 1 })
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
    margin-bottom: 20px;
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
    border-radius: 12px;
    font-size: 0.875rem;
    background-color: var(--primary);
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
}

.form-btn:hover {
    background-color: var(--secondary);
}
</style>