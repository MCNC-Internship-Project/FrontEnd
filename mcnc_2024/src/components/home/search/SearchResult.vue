<template>
    <div class="root-container">
        <header class="toolbar">
            <img class="back" src="@/assets/images/icon_arrow_left.svg" alt="back" @click="goBack">
            <div class="search-container">
                <input type="text" class="search-input" placeholder="설문 제목을 검색해보세요." v-model="searchQuery"
                    @keyup.enter="search" v-focus />
                <img class="search-icon" src="@/assets/images/icon_search_btn.svg" alt="dropdown icon" />
            </div>
        </header>

        <div class="search-result-container">
            <div v-if="isFirstLoad" class="search-result-text">
                <img class="logo" src="@/assets/images/icon_logo.svg" alt="Survwey Logo" />
                <div class="logo-name">Survwey</div>
            </div>
            <v-infinite-scroll class="list-container" v-if="surveyList.length > 0" :items="surveyList" :onLoad="load" color="var(--primary)">
                <template v-for="(item) in surveyList" :key="item">
                    <div class="search-result-item-container" v-ripple @click="goToDetail(item.surveyId)">
                        <div class="item-header-container">
                            <div class="item-title">{{ item.title }}</div>
                            <div class="item-expire" :class="{ 'expired': !item.expireDateValid }">{{
                                remainTime(item.expireDate) }}</div>
                        </div>
                        <div class="item-description">{{ item.description }}</div>
                        <div class="item-footer-container">
                            <img class="item-img-profile" src="@/assets/images/icon_profile_default.svg"
                                alt="profile icon" />
                            <div class="item-userid">{{ item.creatorId }}</div>
                        </div>
                    </div>
                </template>
                <template v-slot:empty>
                </template>
            </v-infinite-scroll>
            <div v-if="onLoading" class="skeleton-container">
                <v-skeleton-loader v-for="n in 12" :key="n" type="image" class="skeleton" />
            </div>
            <div v-if="noResult" class="search-result-text">검색 결과가 없습니다.</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios';
import { useRouter } from 'vue-router';
import { getCurrentInstance } from "vue";
import { encrypt } from '@/utils/crypto';

const { appContext } = getCurrentInstance();
const $axios = appContext.config.globalProperties.$axios;

const router = useRouter();

const baseUrl = process.env.VUE_APP_API_URL;

const searchQuery = ref('');
const currentPage = ref(0);
const size = 10;

const surveyList = ref([]);
const isFirstLoad = ref(true);
const noResult = ref(false);
const onLoading = ref(true);

const goBack = () => {
    router.push("/");
}

const search = async () => {
    if (!searchQuery.value.trim()) {
        return;
    }

    router.push({
        path: "/surveys",
        query: {
            title: searchQuery.value
        }
    });

    isFirstLoad.value = false;
    currentPage.value = 0;
    surveyList.value = [];
    noResult.value = false;
    onLoading.value = true;

    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });

    axios.get(`${baseUrl}/survey/inquiry/search`, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
        params: {
            title: searchQuery.value,
            page: currentPage.value,
            size: size,
        }
    })
        .then((response) => {
            if (response.data.content.length === 0) {
                noResult.value = true;
                return;
            }

            surveyList.value.push(...response.data.content);

            if (response.data.totalPages !== currentPage.value + 1) {
                currentPage.value++;
            }
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            onLoading.value = false;
        });
}

async function api() {
    try {
        const response = await axios.get(`${baseUrl}/survey/inquiry/search`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                title: searchQuery.value,
                page: currentPage.value,
                size: size,
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function load({ done }) {
    if (!searchQuery.value.trim() || currentPage.value === 0) {
        done('empty');
        return;
    }

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

const goToDetail = (surveyId) => {
    $axios.get(`/survey/inquiry/detail/${surveyId}`)
        .then(() => {
            router.push({
                name: "survey-participation",
                params: { id: encrypt(surveyId) }
            })
        })
        .catch((error) => {
            console.error(error);
            if (error.response.status === 401) {
                alert("세션이 만료되었습니다.");
                router.push({
                    name: "Login",
                    query: { redirect: router.currentRoute.value.fullPath },
                })
            }
        })
}

const remainTime = (date) => {
    const now = new Date();
    const expireDate = new Date(date);

    const diff = expireDate - now;
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (years > 0) {
        return `${years}년 남음`;
    } else if (months > 0) {
        return `${months}개월 남음`;
    } else if (days > 0) {
        return `${days}일 남음`;
    } else if (hours > 0) {
        return `${hours}시간 남음`;
    } else if (minutes > 0) {
        return `${minutes}분 남음`;
    } else {
        return '설문 종료';
    }
}

onMounted(() => {
    const initialQuery = router.currentRoute.value.query.title;
    if (initialQuery) {
        searchQuery.value = initialQuery;
        search(); // 초기 쿼리로 검색 실행
    }
});
</script>

<style scoped>
.root-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

.toolbar {
    position: fixed;
    display: flex;
    align-items: center;
    width: 100%;
    height: 64px;
    background-color: #FFF;
    z-index: 1000;
}

.back {
    width: 20px;
    height: 20px;
    margin-left: 24px;
    cursor: pointer;
}

.search-container {
    flex: 1;
    display: flex;
    align-items: center;
    margin: 0 20px;
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
}

.search-result-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 64px;
    padding: 4px 0;
}

.search-result-text {
    height: calc(var(--vh, 1vh) * 100 - 72px);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.125rem;
    font-weight: bold;
    color: #ABABB6;
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

:deep(.v-infinite-scroll__side) {
    grid-column: 1 / -1;
}

:deep(.v-infinite-scroll__side:first-child) {
    display: none;
}

.search-result-item-container {
    display: flex;
    flex-direction: column;
    height: 160px;
    padding: 20px;
    background-color: #FFF;
    border: 1px solid #EFF0F6;
    box-shadow: 0px 5px 16px rgba(8, 15, 52, 0.08);
    border-radius: 12px;
    background-color: #FFF;
    cursor: pointer;
    min-width: 0;
}

.list-container {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
    padding: 0 20px 20px 20px;
}

.item-header-container {
    display: flex;
    align-items: center;
}

.item-img-profile {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
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
    font-size: 0.875rem;
    font-weight: bold;
    color: var(--primary);
}

.expired {
    color: #B0B0B0;
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

.skeleton-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    width: 100%;
    padding: 0 20px 12px 20px;

}

:deep(.v-skeleton-loader__image) {
    width: 100%;
    height: 160px;
    border-radius: 12px;
}

@media screen and (min-width: 768px) {
    .list-container {
        grid-template-columns: repeat(2, 1fr);
    }

    .skeleton-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media screen and (min-width: 1200px) {
    .list-container {
        grid-template-columns: repeat(3, 1fr);
    }

    .skeleton-container {
        grid-template-columns: repeat(3, 1fr);
    }
}
</style>