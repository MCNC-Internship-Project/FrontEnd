<template>
    <div class="survey-card">
        <div class="survey-header">
            <p class="survey-title">{{ survey.title }}</p>
            <p :class="['status', survey.status === '진행중' ? 'status-active' : 'status-ended']">
                {{ survey.status }}
            </p>
        </div>
        <p class="description">{{ survey.description }}</p>
        <p class="creation-info">{{ survey.creationInfo }}</p>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
    survey: {
        type: Object,
    },
});
</script>

<style scoped>
.survey-card {
    width: 100%;
    background-color: #fff;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0px 5px 16px rgba(8, 15, 52, 0.06);
    border: 1px solid #EFF0F6;
}

.survey-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.survey-title {
    font-size: 1.25rem;
    font-weight: bold;
}

.status-active {
    color: #7796E8;
    font-size: 1rem;
    font-weight: bold;
}

.status-ended {
    color: #757575;
    font-weight: bold;
    font-size: 1rem;
}

.description {
    margin-bottom: 20px;
    font-family: var(--font-mont);
    font-size: 1rem;
}

.date-range {
    font-size: 0.75rem;
}
</style>
