<template>
    <div id="root-container">
        <header class="toolbar">
            <img class="back" src="@/assets/images/icon_arrow_left.svg" alt="back" @click="showCancelDialog = true">
        </header>

        <div class="content-container">
            <div class="expire-date-continer">
                <div class="date-section">
                    2024.01.01 ~ 2024.12.31
                </div>
            </div>

            <div class="title-section">
                설문조사 제목
            </div>

            <div class="description-section">
                설문지 설명
            </div>

            <div class="participate-btn-container">
                <div class="participate-btn">
                    설문 참여하기
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    
</script>

<style scoped>
#root-container {
    width : 100%;
    display : flex;
    flex-direction: column;
    align-items: center;
}

.toolbar {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 64px;
    background-color: #fff;
    z-index: 50;
    top: 0;
    left: 0;
    right: 0;
}

.back {
    width: 20px;
    height: 20px;
    margin-left: 24px;
    cursor: pointer;
}

.content-container {
    width : 100%;
    padding : 0 32px;
}

.expire-date-continer {
    margin-top : 88px;
    display : flex;
}

.date-section {
    padding : 4px 12px;
    background-color : #DFE8FF;
    border-radius : 8px;
    font-size : 0.8125rem;
    font-weight : bold;
    color : #7796E8;
}

.title-section {
    margin-top : 40px;
    font-size : 1.5rem;
    font-weight : bold;
    color : #464748;
}

.description-section {
    margin-top : 16px;
    font-size : 1.25rem;
    font-weight : bold;
    color : #C1C3C5;
}

.participate-btn-container {
    width : 100%;
    margin-top : 240px;
    display : flex;
    justify-content: center;
}

.participate-btn {
    display : inline-block;
    padding : 12px 24px;
    border : none;
    border-radius : 16px;
    font-size : 1rem;
    font-weight : bold;
    color : #fff;
    background-color: #7796E8;
}
</style>