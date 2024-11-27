<template>
    <div id="root-container">
        <header class="toolbar">
            <img class="back" src="@/assets/images/icon_arrow_left.svg" alt="back" @click="goBack">
            <div class="search-input-section">
                <input type="text" v-model="searchQuery" class="search-input" placeholder="설문 제목을 검색하세요." @keyup.enter="searchBy(searchQuery)"/>
                <img class="search-icon" src="@/assets/images/icon_search.svg" alt="dropdown icon" @click="searchBy(searchQuery)"/>
            </div>
        </header>

        <div class="search-result-section" ref="scrollContainer" @scroll="handleScroll">
            <div v-if="searchQueryResult === null" class="search-query-none">
                검색어를 입력해주세요.
            </div>

            <div v-else-if="searchQueryResult.length > 0" class="search-query-exist">
                <ul class="search-result-list">
                    <li class="search-result-list-item" v-for="(result, index) in searchQueryResult" :key="result.surveyId"
                    :class="{'last-item' : index === searchQueryResult.length - 1}" @click="goToDetail(result.surveyId)">
                        <div class="result-container" v-ripple>
                            <div class="title-section">
                                {{ result.title }}
                            </div>
                            <div class="description-section">
                                {{ result.description }}
                            </div>
                            <div class="info-section">
                                <span v-html="`&nbsp;&nbsp;~&nbsp;&nbsp;${result.expireDate}`"></span>
                            </div>
                        </div>
                    </li>
                </ul>

                <!-- Loading Indicator -->
                <div v-if="loading" class="loading-indicator">
                    <div class="spinner"></div>
                </div>

                <!-- No More Results Message -->
                <div v-if="!hasMoreResults && searchQueryResult.length > 0">
                </div>
            </div>

            <div v-else class="search-result-none">
                검색 결과가 없습니다.
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const secretKey = process.env.VUE_APP_API_KEY;
const baseUrl = process.env.VUE_APP_API_URL;

const router = useRouter();

const searchQuery = ref("");
const searchQueryResult = ref([]);
const page = ref(0);
const loading = ref(false);
const hasMoreResults = ref(true);
const scrollContainer = ref(null);

const pageSize = 10;

const encryptId = (id) => {
    return CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
}

const goBack = () => {
    router.push("/");
}

const searchBy = (query, resetResults = true) => {
    // If resetResults is true, reset the page and results
    if (resetResults) {
        page.value = 0;
        searchQueryResult.value = [];
        hasMoreResults.value = true;
    }

    // Prevent multiple simultaneous requests
    if (loading.value || !hasMoreResults.value) return;

    loading.value = true;

    axios.get(`${baseUrl}/survey/inquiry/search`, {
        withCredentials: true,
        headers: {
            "Content-type": "application/json"
        },
        params: {
            title: query,
            page: page.value,
            size: pageSize,
        }
    })
    .then((response) => {
        // Update router query for bookmarking/sharing
        router.push({path: "/surveys", query: { title: query }});

        // Append new results
        const newResults = response.data.content;
        searchQueryResult.value = [...searchQueryResult.value, ...newResults];

        // Check if there are more results
        if (newResults.length < pageSize) {
            hasMoreResults.value = false;
        }

        // Increment page for next fetch
        page.value++;
        
        loading.value = false;
    })
    .catch((error) => {
        console.error(error);
        loading.value = false;
        hasMoreResults.value = false;
    });
}

const handleScroll = () => {
    if (!scrollContainer.value) return;

    const { scrollTop, clientHeight, scrollHeight } = scrollContainer.value;
    
    // Check if we're near the bottom (within 200px)
    if (scrollHeight - scrollTop - clientHeight < 200 && !loading.value && hasMoreResults.value) {
        if (searchQuery.value) {
            searchBy(searchQuery.value, false);
        }
    }
}

const goToDetail = (surveyId) => {
    router.push({
        name: "SurveyResult",
        params: { id: encryptId(surveyId) },
    });
}

// Check for initial query from route
onMounted(() => {
    const initialQuery = router.currentRoute.value.query.title;
    if (initialQuery) {
        searchQuery.value = initialQuery;
        searchBy(initialQuery);
    }

    // Add scroll event listener
    if (scrollContainer.value) {
        scrollContainer.value.addEventListener('scroll', handleScroll);
    }
})

// Clean up event listener
onUnmounted(() => {
    if (scrollContainer.value) {
        scrollContainer.value.removeEventListener('scroll', handleScroll);
    }
})
</script>

<style scoped>
#root-container {
    width : 100%;
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
    margin-right : 16px;
}

.search-input-section {
    display : flex;
    align-items: center;
    position : relative;
    width : 100%;
    padding-right : 20px;
    margin-right : 20px;
    border-radius: 12px;
    background-color: #F3F3F3;
}

input::placeholder {
    color : #C6C6C6;
}

.search-input {
    width : 100%;
    line-height : 44px;
    padding : 0 20px;
    outline : none;
}

.search-icon {
    width : 24px;
    height : 24px;
}

.search-result-section {
    position : relative;
    width : 100%;
    padding : 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.search-query-none, .search-result-none {
    position : absolute;
    top : 200px;
    font-weight : bold;
    color : #ABABB6;
}

.search-query-exist {
    width : 100%;
}

.search-result-list {
    list-style : none;
    margin-top : 76px;
}

.result-container {
    width: 100%;
    height : 100px;
    margin-top : 8px;
    padding : 16px 16px;
    background: #FFFFFF;
    border: 1px solid #EFF0F6;
    box-shadow: 0px 5px 16px rgba(8, 15, 52, 0.06);
    border-radius: 12px;
    display : flex;
    flex-direction: column;
}

.title-section {
    width : 100%;
    font-size : 0.8125rem;
    color : #464748;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    white-space: nowrap;
}

.description-section {
    width : 100%;
    margin-top : 4px;
    font-size : 0.6875rem;
    color : #8D8D8D;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    white-space: nowrap;
}

.info-section {
    width : 100%;
    display : flex;
    align-items: center;
    justify-content: end;
    margin-top : 16px;
    font-size : 0.625rem;
    color : #B7B7B7;
}

.response-count-section {
    font-size : 0.625rem;
    color : #7796E8;
}

.last-item {
    margin-bottom : 8px;
}

.loading-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #F3F3F3;
    border-top: 4px solid #464748;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.search-result-section {
    height: 100vh;
    overflow-y: auto;
    position: relative;
    width: 100%;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}
</style>