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
/**
 * @fileoverview 프로그레스바 다이얼로그 컴포넌트
 * @author 반명우 (banmyungwoo@mcnc.co.kr)
 * @date 2024-12-03
 * @lastModified 2024-12-03
 * @description 프로그레스바로 로딩 중임을 보여주는 다이얼로그
 */

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