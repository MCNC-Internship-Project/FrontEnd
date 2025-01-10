<!--
    - 내 설문조사 검색
    - @author 김은수
-->
<template>
    <div class="root-container">
        <div class="background"></div>
        <ToolBar @goBack="goBack" backgroundColor="#FFFFFF" zIndex="1000">
            <div class="search-container">
                <input type="text" class="search-input" placeholder="설문 제목을 검색해보세요." v-model.trim="searchQuery"
                    @keyup.enter="searchSurvey" maxlength="255" v-focus />
                <img class="search-icon" src="@/assets/images/icon_search_btn.svg" alt="dropdown icon" @click="searchSurvey"/>
            </div>
        </ToolBar>

        <SearchResult :surveys="surveys" :isFirstLoad="isFirstLoad" :noResult="noResult" :loadSurveys="loadSurveys"
            :goToDetail="goToDetail" :isMySurvey="true" />
    </div>
</template>


<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { encrypt } from '@/utils/crypto';
import axios from '@/utils/axiosInstance';
import ToolBar from '../common/ToolBar.vue';
import SearchResult from '../common/SearchResult.vue';

const router = useRouter();
const searchQuery = ref('');
const surveys = ref([]);
const isFirstLoad = ref(true);
const noResult = ref(false);
const currentPage = ref(0);
const size = 10;

onMounted(() => {
    const query = router.currentRoute.value.query.query;

    if (query) {
        searchQuery.value = query; // 이전 검색어 설정
        searchSurvey(); // 검색 결과 로드
    }
});

const searchSurvey = async () => {
    if (!searchQuery.value) {
        return;
    }
    isFirstLoad.value = false;
    noResult.value = false;
    surveys.value = [];
    currentPage.value = 0;

    router.replace({
        query: { q: searchQuery.value },
    });

    await loadSurveys({ done: () => { } });
}

const loadSurveys = async ({ done }) => {
    try {
        const response = await axios.get(`/survey/inquiry/search/created`, {
            params: {
                title: searchQuery.value,
                page: currentPage.value,
                size,
            }
        });

        const { content, totalPages } = response.data;
        if (content.length === 0 && currentPage.value === 0) {
            noResult.value = true;
            done('empty');
            return;
        }

        const uniqueSurveys = content.filter(
            (item) => !surveys.value.some((survey) => survey.id === item.id)
        );
        surveys.value.push(...uniqueSurveys);

        if (currentPage.value + 1 < totalPages) {
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
        name: "Result",
        params: { id: encrypt(surveyId) },
    });
}

const goBack = () => {
    router.back();
}
</script>

<style scoped>
.root-container {
    width: 100%;
    height: 100%;
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
    background-image: url('@/assets/images/background_sky.svg');
    background-repeat: repeat-x;
    background-position: bottom;
    z-index: -1;
}

.survey-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 64px;
}

.search-container {
    flex: 1;
    display: flex;
    align-items: center;
    margin: 0 20px 0 -4px;
    border-radius: 12px;
    background-color: #F3F3F3;
}

.search-input {
    width: 100%;
    height: 44px;
    padding-left: 16px;
    outline: none;
}

.search-icon {
    width: 20px;
    height: 20px;
    margin: 0 16px;
    cursor: pointer;
}
</style>