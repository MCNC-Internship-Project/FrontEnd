<template>
    <div class="root-container">
        <div class="error-container">
            <div class="title-section">
                <div class="error-message">
                    해당 설문이<br>
                    존재하지 않습니다.
                </div>
            </div>

            <div class="icon-section">
                <img src="@/assets/images/icon_labtop.svg" alt="Not Found" class="error-icon">
            </div>

            <div class="message-section">
                존재하지 않는 주소를 입력하셨거나,<br>
                해당 설문이 삭제되어 찾을 수 없습니다.
            </div>

            <div class="btn-section">
                <button class="confirm-btn" @click="goHome" v-ripple>홈으로 이동</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
    router.replace("/");
}
</script>

<style scoped>
.root-container {
    width: 100%;
    height: calc(var(--vh, 1vh) * 100 - 12px);
    padding: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.error-container {
    width: 100%;
    max-width: 400px;
}

.title-section {
    font-family: var(--font-recipekorea);
    font-size: 1.25rem;
    color: #21374F;
}

.error-message {
    margin-top: -8px;
    font-size: 1.5rem;
}

.icon-section {
    margin: 48px 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.message-section {
    width: 100%;
    font-size: 1rem;
    text-align: center;
    font-weight: bold;
    color: #6D6D6D;
}

.btn-section {
    width: 100%;
    margin-top: 48px;
}

.confirm-btn {
    width: 100%;
    height: 60px;
    border: none;
    border-radius: 8px;
    background-color: #7796E8;
    color: #fff;
}
</style>