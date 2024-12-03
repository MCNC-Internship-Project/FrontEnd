<template>
    <v-dialog v-model="isVisible" max-width="400">
        <v-card class="dialog-background">
            <div class="dialog-container">
                <div class="dialog-message">
                    {{ message }}<br>
                    <span v-if="warning" class="warning">{{ warning }}</span>
                </div>
            </div>
            <v-card-actions>
                <!-- 취소 버튼 -->
                <v-btn class="dialog-cancel-btn" @click="cancel">{{ cancelText }}</v-btn>
                <!-- 확인 버튼 -->
                <v-btn class="dialog-confirm-btn" @click="confirm">{{ confirmText }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script setup>
import { ref, defineEmits, defineProps, isVisible, watch } from 'vue';

const show = ref(false);
const emit = defineEmits(['cancel', 'confirm']);

// 취소 버튼
function cancel() {
    emit('cancel'); // 취소 이벤트 전달
    show.value = false; // 모달 닫기
}

// 삭제 버튼
function confirm() {
    emit('confirm'); // 삭제 이벤트 전달
    show.value = false; // 모달 닫기
}

defineProps({
    isVisible: Boolean,
    message: String,
    warning: String,
    cancelText: {
        type: String,
        default: '취소',
    },
    confirmText: {
        type: String,
        default: '확인',
    },
});

watch(() => isVisible, (newVal) => {
    show.value = newVal;
});
</script>

<style scoped>
.dialog-background {
    background-color: #FFFFFF;
    border: 1px solid #EFF0F6;
    border-radius: 16px !important;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    padding: 24px;
}

.dialog-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px; /* 메시지와 경고 텍스트 사이 간격 */
}

.dialog-message {
    font-size: 1rem;
    font-weight: bold;
    color: #464748;
    margin-bottom: 4px; /* 메시지와 경고 텍스트 사이 간격 */
}

.warning {
    font-size: 0.875rem;
    color: #F77D7D;
    font-weight: bold;
}

.v-card-actions {
    display: flex;
    justify-content: center !important; /* 버튼 수평 가운데 정렬 */
    gap: 16px; /* 버튼 간 간격 */
    margin-top: 12px; 
    margin-bottom: -4px;
}

.dialog-cancel-btn {
    color: #757576;
    background-color: #FFFFFF;
    border: 1px solid #EFF0F6;
    border-radius: 15px;
    min-width: 120px; /* 버튼 크기 통일 */
    padding: 8px 16px;
    font-size: 0.875rem;
    font-weight: bold;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
}

.dialog-cancel-btn:hover {
    background-color: #F8F8F8;
}

.dialog-confirm-btn {
    color: #FFFFFF;
    background-color: #F77D7D;
    border: none;
    border-radius: 15px;
    min-width: 120px; /* 버튼 크기 통일 */
    padding: 8px 16px;
    font-size: 0.875rem;
    font-weight: bold;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
}

.dialog-confirm-btn:hover {
    background-color: #FF5D5D;
}

</style>