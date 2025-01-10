<!--
    - 프로그레스바가 있는 다이얼로그 컴포넌트
    
    - @author 반명우
-->

<template>
    <v-dialog v-model="isVisible" max-width="400" persistent>
        <v-card>
            <div class="container">
                <v-progress-circular indeterminate color="var(--primary)"></v-progress-circular>
                <div class="message">{{ message }}</div>
            </div>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const emit = defineEmits('update:modelValue');

const isVisible = computed({
    get: () => props.modelValue,
    set: () => emit('update:modelValue')
});
</script>

<style scoped>
.v-card {
    background-color: #FAF8F8;
    border: 1px solid #EFF0F6;
    border-radius: 16px !important;
    padding: 0;
}

.container {
    display: flex;
    align-items: center;
    padding: 32px 16px 32px 32px;
}

.message {
    margin-left: 32px;
    font-size: 1.125rem;
    font-weight: bold;
    color: #757576;
}
</style>