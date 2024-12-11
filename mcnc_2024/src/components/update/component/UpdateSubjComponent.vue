<template>
    <div class="root-container">
        <textarea class="textarea" disabled>답변을 입력해주세요.</textarea>
    </div>
</template>

<script setup>
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