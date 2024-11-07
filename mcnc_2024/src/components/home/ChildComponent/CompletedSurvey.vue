<template>
    <div id="root-container">

        <div class="title-section">
            <div class="title">
                완료된 설문조사
            </div>

            <div class="list">
                모두보기
            </div>
        </div>

        <div class="survey-section">
            <!-- li 항목은 v-for로 돌릴 컴포넌트 -->
            <ul>
                <li class="survey-item">
                    <div class="survey-item-detail">
                        <div class="item-title">설문조사 제목</div>
                        <div class="item-description">설문조사 설명 설문조사 설명 설문조사 설명</div>

                        <div class="footer-container">
                            <div class="participant">10명 참여</div>
                            <div class="deadline">2024.11.13</div>
                        </div>
                    </div>
                </li>
                
                <li class="survey-item">
                    <div class="survey-item-detail">
                        <div class="item-title">설문조사 제목</div>
                        <div class="item-description">설문조사 설명 설문조사 설명 설문조사 설명</div>

                        <div class="footer-container">
                            <div class="participant">10명 참여</div>
                            <div class="deadline">2024.11.13</div>
                        </div>
                    </div>
                </li>

                <li class="survey-item">
                    <div class="survey-item-detail">
                        <div class="item-title">설문조사 제목</div>
                        <div class="item-description">설문조사 설명 설문조사 설명 설문조사 설명</div>

                        <div class="footer-container">
                            <div class="participant">10명 참여</div>
                            <div class="deadline">2024.11.13</div>
                        </div>
                    </div>
                </li>
                
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

.title-section {
    width : 100%;
    display : flex;
    justify-content: space-between;
    padding : 0 24px;
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
    height : 230px;
    overflow-y: scroll;
    scrollbar-width: none;
}

ul {
    display : flex;
    flex-direction: column;
    padding : 0;
    margin : 0;
    flex-wrap: nowrap;
}

.survey-item {
    list-style: none;
    margin : 16px 24px;
    width : calc(100%-48px);
    height : 100px;
    border-radius: 12px;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3);
    flex-shrink: 0;
}

.survey-item-detail {
    padding : 16px 16px;
    display : flex;
    flex-direction: column;
}

.item-title {
    font-size : 0.8125rem;
    color : #464748;
}

.item-description {
    font-size : 0.6875rem;
    color : #8D8D8D;
}

.footer-container {
    margin-top : 24px;
    display : flex;
    justify-content: space-between;
}

.participant {
    font-size : 0.625rem;
    color : #7796E8;
}

.deadline {
    font-size : 0.625rem;
    color : #B7B7B7;
}
</style>