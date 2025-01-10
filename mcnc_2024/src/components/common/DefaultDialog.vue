<!--
    - 확인 버튼이 있는 다이얼로그 컴포넌트
    
    - @author 반명우
-->

<template>
    <v-dialog v-model="isVisible" :persistent="isPersistent" max-width="400" @keydown.enter="onConfirm">
        <v-card>
            <div class="container">
                <div class="message">{{ message }}</div>
            </div>
            <v-card-actions>
                <v-btn color="primary" text @click="onConfirm">
                    확인
                </v-btn>
            </v-card-actions>
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
    },
    isPersistent: {
        type: Boolean,
        default: false
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 36px 32px 8px 32px;
}

.message {
    font-size: 1.125rem;
    font-weight: bold;
    color: #757576;
}

.v-card-actions {
    padding: 20px;
}

.v-btn {
    width: 100%;
    height: 48px;
    background-color: var(--primary);
    color: #FFFFFF !important;
    border-radius: 16px;
    font-size: 0.875rem;
    box-shadow: 0px 5px 16px rgba(8, 15, 52, 0.06);
}
</style>