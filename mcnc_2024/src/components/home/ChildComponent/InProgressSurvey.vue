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
                
                <li class="survey-item">
                    <div class="survey-item-detail">
                        <div class="item-title">설문조사 제목</div>
                        <div class="item-description">설문조사내용설문조사내용설문조사내용</div>
                        <div class="participant">10명 참여</div>

                        <progress class="survey-progress" value="50" max="100"></progress>
                        <div class="deadline-container">
                            <div class="start">11.06</div>
                            <div class="end">11.13</div>
                        </div>
                    </div>
                </li>

                <li class="survey-item">
                    <div class="survey-item-detail">
                        <div class="item-title">설문조사 제목</div>
                        <div class="item-description">설문조사내용설문조사내용설문조사내용</div>
                        <div class="participant">10명 참여</div>

                        <progress class="survey-progress" value="50" max="100"></progress>
                        <div class="deadline-container">
                            <div class="start">11.06</div>
                            <div class="end">11.13</div>
                        </div>
                    </div>
                </li>

                <li class="survey-item">
                    <div class="survey-item-detail">
                        <div class="item-title">설문조사 제목</div>
                        <div class="item-description">설문조사내용설문조사내용설문조사내용</div>
                        <div class="participant">10명 참여</div>

                        <progress class="survey-progress" value="50" max="100"></progress>
                        <div class="deadline-container">
                            <div class="start">11.06</div>
                            <div class="end">11.13</div>
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
    margin-top : 40px;
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
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
    flex-shrink: 0;
}

.survey-item-detail {
    padding : 20px 20px;
    display : flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
}

.item-title {
    font-weight : bold;
    font-size : 0.875rem;
}

.item-description {
    margin-top : 2px;
    font-size : 0.75rem;
}

.participant {
    margin-top : 8px;
    font-size : 0.625rem;
    color : #7796E8;
}

.survey-progress {
    width : 100%;
}

.deadline-container {
    width : 100%;
    display : flex;
    justify-content: space-between;
    font-size : 0.625rem;
    color : #B7B7B7;
}
</style>