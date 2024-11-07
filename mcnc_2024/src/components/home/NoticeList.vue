<template>
    <div id="root-container">
        <div class="header">
            <router-link to="/" class="back_btn">back</router-link>
            <div class="title">알림</div>
        </div>

        <div class="notice-list-section">
            <ul>
                <li class="notice-list-item">설문0이 종료되었습니다.</li>
                <li class="notice-list-item">설문0이 종료되었습니다.</li>
                <li class="notice-list-item">설문0이 종료되었습니다.</li>
                <li class="notice-list-item">설문0이 종료되었습니다.</li>
                <li class="notice-list-item">설문0이 종료되었습니다.</li>
                <li class="notice-list-item">설문0이 종료되었습니다.</li>
                <li class="notice-list-item">설문0이 종료되었습니다.</li>
                <li class="notice-list-item">설문0이 종료되었습니다.</li>
                <li class="notice-list-item">설문0이 종료되었습니다.</li>
                <li class="notice-list-item">설문0이 종료되었습니다.</li>
                <li class="notice-list-item">설문0이 종료되었습니다.</li>
                <li class="notice-list-item">설문0이 종료되었습니다.</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
    
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

.back_btn {
    text-decoration: none;
    display: inline-block;
    width: 32px;
    height: 32px;
    margin : 16px 16px;
    background: url('../../common/back_btn_icon.png') no-repeat;
    background-size: contain;
    color: transparent; /* 텍스트 색상을 투명으로 설정 */
    font-size: 0;       /* 폰트 크기를 0으로 설정하여 텍스트 숨기기 */
    line-height: 64px;
}

.title {
    font-weight : bold;
    font-size : 1.25rem;
}

.notice-list-section {
    display : flex;
    align-items: center;
    justify-content: center;
}

ul {
    width : calc(100% - 16px);
    display : flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    list-style: none;
}

.notice-item-list {
    line-height : 60px;
}
</style>