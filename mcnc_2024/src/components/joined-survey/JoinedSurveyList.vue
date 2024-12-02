<template>
    <div class="root-container">
        <div class="background"></div>

        <ToolBar @goBack="goBack" backgroundColor="#FFE6EB" zIndex="1000">
            <SurveyHeader title="참여한 설문조사" @goSearch="goSearch" />
        </ToolBar>

        <div class="list-container">
            <v-infinite-scroll v-if="!noResult" :items="surveyList" :onLoad="load" color="var(--primary)">
                <template v-for="(item, index) in surveyList" :key="item">
                    <SurveyCard :survey="item" :class="{ 'last-item': index === surveyList.length - 1 }"/>
                </template>
                <template v-slot:empty>
                </template>
            </v-infinite-scroll>
            <div class="list-none" v-else>
                <p>아직 참여한 설문이 없습니다.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios';
import { useRouter } from 'vue-router';

import ToolBar from '@/components/common/ToolBar.vue'
import SurveyHeader from '@/components/common/SurveyHeader.vue';
import SurveyCard from '@/components/common/SurveyCard.vue';

const baseUrl = process.env.VUE_APP_API_URL;

const router = useRouter();

const currentPage = ref(0);
const size = 10;

const surveyList = ref([]);
const noResult = ref(false);

const goBack = () => {
    router.back();
}

const goSearch = () => {
    router.push("/joined-survey/search");
}

async function api() {
    try {
        const response = await axios.get(`${baseUrl}/survey/inquiry/respond`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                page: currentPage.value,
                size: size,
            }
        });

        noResult.value = response.data.content.length === 0;
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function load({ done }) {
    try {
        const res = await api();
        surveyList.value.push(...res.content);

        console.log(surveyList.value);

        if (res.totalPages !== currentPage.value + 1) {
            currentPage.value++;
            done('ok');
        } else {
            done('empty');
        }
    } catch (error) {
        console.error(error);
        done('error');
    }
}
</script>

<style scoped>
.root-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/images/background_pink.svg');
    background-repeat: repeat-x;
    transform: translateZ(0);
    will-change: transform;
    z-index: -1;
}

.v-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
}

.list-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 64px;
    padding: 4px 0;
}

.v-infinite-scroll {
    width: 100%;
    overflow: hidden;
}

:deep(.v-infinite-scroll__side:first-child) {
    display: none;
}

.list-none {
    width: 100%;
    height: calc(var(--vh, 1vh) * 100 - 72px);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.125remrem;
    font-weight: bold;
    color: #A2A2A3;
}

.last-item {
    margin-bottom: 0;
}
</style>