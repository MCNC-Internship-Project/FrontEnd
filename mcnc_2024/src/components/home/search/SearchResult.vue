<template>
    <div id="root-container">
        <div class="header">
            <div class="back-btn" @click="goBack">back</div>
            <div class="search-input-section">
                <input type="text" v-model="searchQuery" class="search-input" placeholder="설문 제목을 검색하세요." @keyup.enter="searchBy(searchQuery)"/>
                <img class="search-icon" src="@/assets/images/icon_search.svg" alt="dropdown icon" @click="searchBy(searchQuery)"/>
            </div>
        </div>

        
        <div class="search-result-section">
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
                                <span class="response-count-section">
                                    {{ result.responseCount }}명 참여
                                </span>
                                <span v-html="`&nbsp;&nbsp;~&nbsp;&nbsp;${result.expireDate}`"></span>
                            </div>
                            
                        </div>
                    </li>
                </ul>
            </div>

            <div v-else class="search-result-none">
                검색 결과가 없습니다.
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, watch } from 'vue';

const mock = [
{
        surveyId: 1,
        title: "2024 온라인 쇼핑 경험 조사",
        description: "온라인 쇼핑 경험과 선호하는 서비스를 조사합니다.",
        createDate: "2024-01-01",
        expireDate: "2024-12-31",
        responseCount: 320,
    },
    {
        surveyId: 2,
        title: "2024 온라인 쇼핑 경험 조사",
        description: "온라인 쇼핑 경험과 선호하는 서비스를 조사합니다.",
        createDate: "2024-01-01",
        expireDate: "2024-12-31",
        responseCount: 320,
    },
    {
        surveyId: 3,
        title: "2024 온라인 쇼핑 경험 조사",
        description: "온라인 쇼핑 경험과 선호하는 서비스를 조사합니다.",
        createDate: "2024-01-01",
        expireDate: "2024-12-31",
        responseCount: 320,
    },
    {
        surveyId: 4,
        title: "2024 온라인 쇼핑 경험 조사",
        description: "온라인 쇼핑 경험과 선호하는 서비스를 조사합니다.",
        createDate: "2024-01-01",
        expireDate: "2024-12-31",
        responseCount: 320,
    },
    {
        surveyId: 5,
        title: "2024 온라인 쇼핑 경험 조사",
        description: "온라인 쇼핑 경험과 선호하는 서비스를 조사합니다.",
        createDate: "2024-01-01",
        expireDate: "2024-12-31",
        responseCount: 320,
    },
    {
        surveyId: 6,
        title: "2024 온라인 쇼핑 경험 조사",
        description: "온라인 쇼핑 경험과 선호하는 서비스를 조사합니다.",
        createDate: "2024-01-01",
        expireDate: "2024-12-31",
        responseCount: 320,
    },
    {
        surveyId: 7,
        title: "2024 온라인 쇼핑 경험 조사",
        description: "온라인 쇼핑 경험과 선호하는 서비스를 조사합니다.",
        createDate: "2024-01-01",
        expireDate: "2024-12-31",
        responseCount: 320,
    },
    {
        surveyId: 8,
        title: "2024 온라인 쇼핑 경험 조사",
        description: "온라인 쇼핑 경험과 선호하는 서비스를 조사합니다.",
        createDate: "2024-01-01",
        expireDate: "2024-12-31",
        responseCount: 320,
    },
]

const route = useRoute();
const router = useRouter();

const searchQuery = ref("");
const searchQueryResult = ref(null);

const goBack = () => {
    router.push("/");
}

const searchBy = (searchQuery) => {
    router.push({
        path : "/surveys",
        query : {search : searchQuery},
    });
}

watch(route, (newRoute) => {
    // 여기서 newRoute.query.search 에 대한 설문 리스트 post 요청
    if(newRoute.query.search.length < 2) {
        // 검색어가 두글자 이하일 때, 알림 다이얼로그로 전환해야됨
        alert("두 글자 이상 입력해주세요.")
        return;
    }
    searchQueryResult.value = mock.filter((query) => query.title.includes(newRoute.query.search))
})

const goToDetail = (surveyId) => {
    console.log(surveyId + "번 설문 클릭");
}
</script>

<style scoped>
#root-container {
    width : 100%;
}

.header {
    width : 100%;
    height : 64px;
    display : flex;
    align-items: center;
}

.back-btn {
    text-decoration: none;
    display: inline-block;
    width: 20px;
    height: 20px;
    margin : 16px 24px;
    background: url('../../../assets/images/icon_arrow_left.svg') no-repeat;
    background-size: contain;
    color: transparent; /* 텍스트 색상을 투명으로 설정 */
    font-size: 0;       /* 폰트 크기를 0으로 설정하여 텍스트 숨기기 */
}

.search-input-section {
    position : relative;
    width : 100%;
    padding-right : 20px;
}

input::placeholder {
    color : #C6C6C6;
}

.search-input {
    width : 100%;
    line-height : 44px;
    padding-left : 16px;
    border-radius: 12px;
    background-color: #F3F3F3;
    outline : none;
}

.search-icon {
    position: absolute;
    top : 12px;
    right: 32px;
    width: 20px;
    height: 20px;
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
    margin-top : 24px;
}

.result-container {
    width: 100%;
    height : 100px;
    margin-top : 12px;
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
}

.description-section {
    width : 100%;
    margin-top : 4px;
    font-size : 0.6875rem;
    color : #8D8D8D;
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
    margin-bottom : 24px;
}
</style>