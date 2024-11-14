<template>
    <div class="root-container">
        <header class="toolbar">
            <img class="back" src="@/assets/images/icon_arrow_left.svg" alt="back" @click="goBack">
        </header>

        <div class="profile-container">
            <img class="proflie-image" src="@/assets/images/icon_profile_default.svg" alt="프로필 사진">
        </div>

        <div class="profile-edit-container">
            
        </div>
    </div>
</template>

<script setup>
import router from '@/router';

const goBack = () => {
    router.push('/profile');
}
</script>

<style scoped>
.root-container {
    position: relative;
    width: 100%;
    height: calc(var(--vh, 1vh) * 100);
}

.toolbar {
    position: relative;
    display: flex;
    align-items: center;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 64px;
}

.back {
    padding-left: 24px;
    cursor: pointer;
}

.profile-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px 0;
}

.proflie-image {
    width: 80px;
    height: 80px;
}
</style>