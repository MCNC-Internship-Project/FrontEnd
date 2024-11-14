<template>
    <div class="root-container">
        <header class="toolbar">
            <img class="back" src="@/assets/images/icon_arrow_left.svg" alt="back" @click="goBack">
        </header>

        <div class="list-container">
            <v-list lines="two">
                <template v-for="(item, index) in items" :key="index">
                    <v-list-item @click="onItemClick(item)">
                        <template v-slot:prepend>
                            <v-avatar>
                                <v-icon :icon="getIcon(item.type)" color="#464748" class="item-icon"></v-icon>
                            </v-avatar>
                        </template>
                        <template v-slot:title>
                            <span class="item-title">{{ item.title }}</span>
                        </template>
                        <template v-slot:subtitle>
                            <span class="item-subtitle">{{ item.subtitle }}</span>
                        </template>
                    </v-list-item>
                    <v-divider v-if="index < items.length - 1" inset></v-divider>
                </template>
            </v-list>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import router from '@/router';

const goBack = () => {
    router.push('/');
}

const items = ref([
    {
        surveyId: 1,
        type: 'closed',
        title: '설문 종료',
        subtitle: '<설문제목> 설문이 종료되었습니다.'
    },
    {
        surveyId: 2,
        type: 'completed',
        title: '설문 완료',
        subtitle: '<사용자명>님이 <설문제목> 설문을 완료했습니다.'
    },
    {
        surveyId: 3,
        type: 'completed',
        title: '설문 완료',
        subtitle: '<사용자명>님이 <설문제목> 설문을 완료했습니다.'
    },
    {
        surveyId: 4,
        type: 'closed',
        title: '설문 종료',
        subtitle: '<설문제목> 설문이 종료되었습니다.'
    },
    {
        surveyId: 5,
        type: 'completed',
        title: '설문 완료',
        subtitle: '<사용자명>님이 <설문제목> 설문을 완료했습니다.'
    },
    {
        surveyId: 6,
        type: 'completed',
        title: '설문 완료',
        subtitle: '<사용자명>님이 <설문제목> 설문을 완료했습니다.'
    },
    {
        surveyId: 7,
        type: 'closed',
        title: '설문 종료',
        subtitle: '<설문제목> 설문이 종료되었습니다.'
    },
    {
        surveyId: 8,
        type: 'completed',
        title: '설문 완료',
        subtitle: '<사용자명>님이 <설문제목> 설문을 완료했습니다.'
    },
    {
        surveyId: 9,
        type: 'completed',
        title: '설문 완료',
        subtitle: '<사용자명>님이 <설문제목> 설문을 완료했습니다.'
    }
]);

const getIcon = (type) => {
    switch (type) {
        case 'closed':
            return 'mdi-clock-alert-outline';
        case 'completed':
            return 'mdi-check-circle-outline';
        default:
            return '';
    }
};

const onItemClick = (item) => {
    console.log(item.surveyId);
};
</script>

<style scoped>
.root-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(var(--vh, 1vh) * 100);
}

.toolbar {
    position: fixed;
    display: flex;
    align-items: center;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 64px;
    background-color: white;
    z-index: 1000;
}

.back {
    padding-left: 24px;
    cursor: pointer;
}

.list-container {
    flex: 1;
    margin-top: 64px;
    padding: 0 0 24px 0;
    overflow-y: auto;
}

.v-list {
    padding: 0;
}

.item-icon {
    width: 24px;
    height: 24px;
}

.item-title {
    font-size: 1rem;
}

.item-subtitle {
    font-size: 0.875rem;
    color: #575757;
    line-height: 1.2;
}
</style>