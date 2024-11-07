<template>
    <div id="root-container">

        <div class="title-section">
            <div class="title">
                진행중인 설문조사
            </div>

            <div class="list">
                모두보기
            </div>
        </div>

        <div class="survey-section">
            <!-- li 항목은 v-for로 돌릴 컴포넌트 -->
            <ul>
                <li class="survey-item">설문조사</li>
                <li class="survey-item">설문조사</li>
                <li class="survey-item">설문조사</li>
            </ul>
        </div>

    </div>
</template>

<script setup>
    
</script>

<style scoped>
#root-container {
    width : 100%;
    margin-top : 40px;
}

.title-section {
    width : 100%;
    display : flex;
    justify-content: space-around;
}

.title {
    font-weight : bold;
    font-size : 1rem;
}

.list {
    font-size : 0.875rem;
    color : #B4B4B4;
}

.survey-section {
    width : 100%;
    overflow-x: scroll;
    scrollbar-width: none;
}

ul {
    display : flex;
    padding : 0;
    margin : 0;
    flex-wrap: nowrap;
}

.survey-item {
    list-style: none;
    margin : 16px 0 40px 24px;
    width : 200px;
    height : 140px;
    border-radius: 12px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3);
    flex-shrink: 0;
}
</style>