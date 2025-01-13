<template>
    <div class="root-container">
        <div class="background"></div>

        <ToolBar @goBack="goBack" backgroundColor="#FFFFFF" zIndex="1000">
            <SurveyHeader title="참여한 설문조사" @goSearch="goSearch" />
        </ToolBar>

        <div class="list-container">
            <v-infinite-scroll v-if="!noResult" :items="surveyList" :onLoad="load" color="var(--primary)">
                <template v-for="(item) in surveyList" :key="item">
                    <SurveyCard :survey="item" :class="{ 'last-item': index === surveyList.length - 1 }" :isMySurvey="false" @click="goToDetail(item.surveyId)" />
                </template>
                <template v-slot:empty>
                </template>
            </v-infinite-scroll>
            <div class="list-none" v-else>
                <p>아직 참여한 설문이 없습니다.<br>설문에 참여해 의견을 남겨보세요!</p>
            </div>
        </div>
    </div>
</template>

<script setup>
/**
 * @fileoverview 참여한 설문조사 리스트 조회 화면 컴포넌트
 * @author 김은수 (kimeunsu@mcnc.co.kr)
 * @date 2024-12-10
 * @lastModified 2024-12-20
 * @description 사용자가 참여한 설문조사를 조회할 수 있는 화면 컴포넌트.
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { encrypt } from '@/utils/crypto';
import axios from '@/utils/axiosInstance';
import ToolBar from '@/components/common/ToolBar.vue'
import SurveyHeader from '@/components/common/SurveyHeader.vue';
import SurveyCard from '@/components/common/SurveyCard.vue';

const router = useRouter();
const currentPage = ref(0);
const surveyList = ref([]);
const noResult = ref(false);
const size = 10;

const goBack = () => {
    router.back();
}

const goSearch = () => {
    router.push("/respond/search");
}

const api = async () => {
    try {
        const response = await axios.get(`/survey/inquiry/respond`, {
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

const load = async ({ done }) => {
    try {
        const res = await api();
        surveyList.value.push(...res.content);

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

// 설문 상세로 가기
const goToDetail = (surveyId) => {
    router.push({
        name: "RespondDetail",
        params: { id: encrypt(surveyId) },
    });
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
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/images/background_ash.svg');
    background-repeat: repeat-x;
    background-position: bottom;
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
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    column-gap: 12px;
    padding: 0 20px;
}

:deep(.v-infinite-scroll__side) {
    grid-column: 1 / -1;
}

:deep(.v-infinite-scroll__side:first-child) {
    display: none;
}

.last-item {
    margin-bottom: 0;
}

.list-none {
    width: 100%;
    height: calc(var(--vh, 1vh) * 100 - 116px);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 1.125rem;
    font-weight: bold;
    color: #6D6D6D;
}

@media screen and (min-width: 768px) {
    .v-infinite-scroll {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media screen and (min-width: 1200px) {
    .v-infinite-scroll {
        grid-template-columns: repeat(3, 1fr);
    }
}
</style>