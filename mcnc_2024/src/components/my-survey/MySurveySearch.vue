<template>
    <div class="root-container">
        <div class="background"></div>
        <ToolBar @goBack="goBack" backgroundColor="#E6F4FF" zIndex="1000">
            <div class="search-box">
                <input type="text" placeholder="설문 제목을 검색해보세요." v-model="searchQuery" @keyup.enter="searchSurvey" />
                <button class="search-btn-section" @click="searchSurvey">
                    <img class="search-btn" src="../../assets/images/icon_search_btn.svg" alt="search icon" />
                </button>
            </div>
        </ToolBar>

        <SearchResult :surveys="surveys" :isFirstLoad="isFirstLoad" :noResult="noResult" :loadSurveys="loadSurveys"
            :goToDetail="goToDetail" />
    </div>
</template>


<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import ToolBar from '../common/ToolBar.vue';
import SearchResult from '../common/SearchResult.vue';

const baseUrl = process.env.VUE_APP_API_URL;
const secretKey = process.env.VUE_APP_API_KEY;

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

watch(searchQuery, (newValue) => {
    if (!newValue.trim()) {
        surveys.value = []; // 검색 결과 초기화
        noResult.value = false; // '검색 결과 없음' 메시지 숨기기
        isFirstLoad.value = true; // 초기 로고 상태로 되돌리기
    }
});

async function searchSurvey() {
    if (!searchQuery.value.trim()) {
        return;
    }
    isFirstLoad.value = false;
    noResult.value = false;
    surveys.value = [];
    currentPage.value = 0;

    router.replace({
        query: { query: searchQuery.value },
    });

    await loadSurveys({ done: () => { } });
}

async function loadSurveys({ done }) {
    try {
        const response = await axios.get(`${baseUrl}/survey/inquiry/search/created`, {
            params: {
                title: searchQuery.value,
                page: currentPage.value,
                size,
            },
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
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

const encryptId = (id) => {
    return CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
};

// 설문 상세로 가기
function goToDetail(surveyId) {
    router.push({
        name: "SurveyResult",
        params: { id: encryptId(surveyId) },
    });
}

function goBack() {
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
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/images/background_sky.svg');
    background-repeat: repeat-x;
    transform: translateZ(0);
    will-change: transform;
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

.search-box {
    width: 80%;
    display: flex;
    flex: 1;
    align-items: center;
    background-color: #f2f6fc;
    border-radius: 8px;
    padding: 4px 12px;
    margin-right: 20px;
    margin-left: -12px;
}

.search-btn-section {
    display: flex;
    align-items: center;
    justify-content: center;
}

.search-btn {
    text-indent: -999em;
    width: 24px;
    height: 24px;
    background: url("../../assets/images/icon_search_btn.svg") no-repeat center center;
    background-size: contain;
    cursor: pointer;
    margin-left: auto;
}

.search-box input {
    width: 100%;
    border: none;
    outline: none;
    background: none;
    padding: 8px;
    font-size: 1rem;
}

.search-box button {
    background: none;
    border: none;
    cursor: pointer;
}

.logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(var(--vh, 1vh) * 100 - 65px);
}

.logo {
    width: 42px;
    height: 80vh;
}

.logo-name {
    padding-left: 4px;
    color: var(--primary);
    font-family: var(--font-mont);
    font-size: 1.25rem;
}

.v-infinite-scroll {
    width: 100%;
    overflow: hidden;
}

:deep(.v-infinite-scroll__side:first-child) {
    display: none;
}

.search-result-text {
    text-align: center;
    color: #a2a2a2;
    margin-top: 16px;
}
</style>