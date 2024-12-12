<template>
    <div class="item-container" v-ripple>
        <div class="item-header-container">
            <div class="item-title">{{ survey.title }}</div>
            <div v-if="showStatusBadge" class="item-expire" :class="{ 'expired': !survey.expireDateValid }">{{ survey.expireDateValid ? '진행중' :
                '종료' }}</div>
            <div v-else-if="showProfile" class="item-footer-container">
                <img class="item-img-profile" src="@/assets/images/icon_profile_default.svg" alt="profile icon" />
                <div class="item-userid">{{ survey.creatorId }}</div>
            </div>
        </div>
        <div class="item-description">{{ survey.description }}</div>
        <div v-if="createDate && expireDate" class="item-date">{{ formatDate(survey.createDate, survey.expireDate) }}
        </div>
        <div v-else-if="respondDate" class="item-date">{{ formatDate(survey.respondDate) }}</div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import dayjs from 'dayjs'

defineProps({
    survey: {
        type: Object,
    },
    respondDate: {
        type: String,
    },
    createDate: {
        type: String,
    },
    expireDate: {
        type: String,
    },
    showStatusBadge: {
        type: Boolean,
        default: false
    },
    showProfile: {
        type: Boolean,
        default: false
    }
});

const formatDate = (date1, date2 = null) => {
    if (date2) {
        return dayjs(date1).format('YYYY.MM.DD') + ' ~ ' + dayjs(date2).format('YYYY.MM.DD');
    } else {
        return dayjs(date1).format('YYYY.MM.DD');
    }
}
</script>

<style scoped>
.item-container {
    display: flex;
    flex-direction: column;
    height: 160px;
    padding: 20px;
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
    font-size: 1rem;
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
    margin-top: 8px;
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

.item-date {
    margin-top: auto;
    font-size: 0.875rem;
    color: #8D8D8D;
}


.item-footer-container {
    display: flex;
    align-items: center;
    margin-top: auto;
}

.item-userid {
    margin-left: 8px;
    font-size: 0.875rem;
    color: #919191;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    white-space: nowrap;
}

.item-img-profile {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
}
</style>
