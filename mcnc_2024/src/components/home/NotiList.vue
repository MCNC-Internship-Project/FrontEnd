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
                <li class="notice-list-item">설문0이 종료asdfasdfasdf되었습니다.</li>
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
    background: url('../../assets/images/icon_arrow_left.svg') no-repeat;
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
    width : 100%;
    padding : 0;
    display : flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    list-style: none;
}

.notice-list-item {
    width: calc(100% - 32px);
    height : 60px;
    margin : 4px 16px;
    padding : 20px 16px;
    display : flex;
    align-items: center;
    border-bottom : solid 2px #D4D6DD;
    box-sizing: border-box;
}
</style>