<template>
    <div class="item-container" v-ripple>
        <div class="item-header-container">
            <div class="item-title">{{ survey.title }}</div>
            <div class="item-expire" :class="{ 'expired': !survey.expireDateValid }">{{ survey.expireDateValid ? '진행중' : '종료' }}</div>
        </div>
        <div class="item-description">{{ survey.description }}</div>
        <div class="item-footer-container">
            <div class="item-date">{{ formatDate(survey.createDate, survey.expireDate) }}</div>
            <div class="item-count" v-if="survey.respondCount >= 0">{{ survey.respondCount }}명 참여</div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import dayjs from 'dayjs'

defineProps({
    survey: {
        type: Object,
    },
});

const formatDate = (createDate, expireDate) => {
    return dayjs(createDate).format('YYYY.MM.DD') + ' ~ ' + dayjs(expireDate).format('YYYY.MM.DD');
}
</script>

<style scoped>
.item-container {
    display: flex;
    flex-direction: column;
    height: 160px;
    padding: 20px;
    margin-bottom: 12px;
    border-radius: 12px;
    background-color: #FFF;
    border: 1px solid #EFF0F6;
    box-shadow: 0px 5px 16px rgba(8, 15, 52, 0.06);
    cursor: pointer;
    min-width: 0;
}

.item-header-container {
    display: flex;
    align-items: center;
}

.item-title {
    width: 100%;
    margin-right: 12px;
    font-size: 1.125rem;
    font-weight: bold;
    color: #464748;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    white-space: nowrap;
}

.item-expire {
    margin-left: auto;
    flex-shrink: 0;
    font-size: 1rem;
    font-weight: bold;
    color: var(--primary);
}

.expired {
    color: #757575;
}

.item-description {
    display: -webkit-box;
    width: 100%;
    margin-top: 4px;
    font-size: 1rem;
    color: #8D8D8D;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    white-space: normal;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.item-footer-container {
    display: flex;
    align-items: center;
    margin-top: auto;
    font-size: 0.875rem;
}

.item-date {
    color: #8D8D8D;
}

.item-count {
    margin-left: auto;
    color: var(--primary);
}
</style>
