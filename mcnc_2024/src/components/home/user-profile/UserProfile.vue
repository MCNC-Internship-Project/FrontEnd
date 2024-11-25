<template>
    <div class="root-container">
        <header class="toolbar">
            <img class="back" src="@/assets/images/icon_arrow_left.svg" alt="back" @click="goBack">
        </header>

        <div class="profile-container">
            <img class="proflie-image" src="@/assets/images/icon_profile_default.svg" alt="프로필 사진">
            <div class="username">{{ name }}</div>
            <div class="email">{{ email }}</div>
        </div>

        <div class="list-container">
            <v-list>
                <template v-for="(item, index) in items" :key="index">
                    <v-list-item @click="onItemClick(item)">
                        <template v-slot:title>
                            <span class="item-title">{{ item.title }}</span>
                        </template>
                        <template v-slot:append>
                            <v-icon v-if="item.title !== '로그아웃'">mdi-chevron-right</v-icon>
                        </template>
                    </v-list-item>
                    <v-divider v-if="index < items.length - 1"></v-divider>
                </template>
            </v-list>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter();

const goBack = () => {
    router.back();
}

const name = ref("username");
const email = ref("email@email.com");
const items = ref([
    { title: '프로필 수정' },
    { title: '생성한 설문 보기' },
    { title: '참여한 설문 보기' },
    { title: '로그아웃' }
]);

const onItemClick = (item) => {
    switch (item.title) {
        case '프로필 수정':
            router.push({path : "/profile/update"});
            break;
        case '생성한 설문 보기':
            router.push({path : "/my-survey"});
            break;
        case '참여한 설문 보기':
            router.push({path : "/joined-survey"});
            break;
        case '로그아웃':
            console.log('로그아웃');
            break;
    }
};
</script>

<style scoped>
.root-container {
    width: 100%;
}

.toolbar {
    display: flex;
    align-items: center;
    width: 100%;
    height: 64px;
}

.back {
    width: 20px;
    height: 20px;
    margin-left: 24px;
    cursor: pointer;
}

.profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    text-align: center;
    padding: 20px 0;
}

.proflie-image {
    width: 80px;
    height: 80px;
}

.username {
    margin-top: 16px;
    font-size: 1.25rem;
    font-weight: bold;
    color: #1F2024;
}

.email {
    margin-top: 4px;
    font-size: 1rem;
    color: #71727A;
}

.list-container {
    display: flex;
    justify-content: center;
    padding: 24px 16px 48px 16px;
}

.v-list {
    width: 100%;
    max-width: 400px;
    padding: 0;
}

.v-list-item {
    min-height: 60px;
}

.item-title {
    font-size: 1rem;
    color: #1F2024;
}
</style>