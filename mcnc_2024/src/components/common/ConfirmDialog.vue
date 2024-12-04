<template>
    <v-dialog v-model="isVisible" :persistent="isPersistent" max-width="400" @keydown.enter="onConfirm">
        <v-card>
            <div class="message">{{ message }}</div>
                <div class="dialog-actions">
                    <v-btn class="cancel-btn" @click="isVisible = false">취소</v-btn>
                    <v-btn class="confirm-btn" :color="confirmButtonColor" @click="onConfirm">확인</v-btn>
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
    },
    isPersistent: {
        type: Boolean,
        default: false
    },
    confirmButtonColor: {
        type: String,
        default: '#7796E8'
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
    padding: 36px 32px 20px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.message {
    margin: 0 16px 28px 16px;
    font-size: 1.125rem;
    font-weight: bold;
    color: #757576;
}

.dialog-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    margin: 0 8px;
}

.v-btn {
    flex-grow: 1;
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

.confirm-btn {
    color: #FFFFFF;
}
</style>