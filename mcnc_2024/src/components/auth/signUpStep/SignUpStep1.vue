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

.form-input,
.form-btn {
    width: 100%;
    height: 56px;
    margin-bottom: 20px;
    padding: 0 16px;
    border: solid 2px #7796E8;
    border-radius: 12px;
    outline: none;
    font-size: 0.875rem;
}

.form-input::placeholder {
    color: #C6C6C6;
}

.form-btn {
    background-color: #7796E8;
    border: none;
    color: white;
    transition: all 0.2s ease;
}

.form-btn:hover {
    background-color: #0d6db7;
}
</style>