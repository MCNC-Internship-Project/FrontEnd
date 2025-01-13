<template>
    <div class="root-container">
        <textarea class="textarea" disabled>답변을 입력해주세요.</textarea>
    </div>
</template>

<script setup>
/**
 * @fileoverview  설문 항목의 타입별(주관식) 질문 항목 컴포넌트
 * @author 김원재 (kimwonjae@mcnc.co.kr)
 * @date 2024-11-08
 * @lastModified 2024-12-10
 * @description 질문 항목에 대한 화면 구현.
 */
import { defineExpose } from 'vue';

const getValue = () => {
    return []
};

defineExpose({
    getValue,
})
</script>

<style scoped>
.root-container {
    width: 100%;
    padding: 12px 4px;
}

.textarea {
    width : 100%;
    height : 64px;
    resize : none;
    border : solid 1px #D9D9D9;
    color : #D9D9D9;
    border-radius : 12px;
    padding : 12px;
    background-color: #FFF;
    font-size: 0.9375rem;
}
</style>