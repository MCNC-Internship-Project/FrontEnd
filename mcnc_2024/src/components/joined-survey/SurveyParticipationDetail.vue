<template>
  <div id="survey-detail" v-if="survey.title && survey.questions && survey.questions.length">
    <header class="toolbar">
      <div class="back-container">
        <img
          class="back"
          src="../../assets/images/icon_arrow_left.svg"
          alt="back"
          @click="goBack"
        />
      </div>
    </header>

    <div class="survey-section">
      <div class="survey-title-section">
        <div>
          <h1 class="survey-title">{{ survey.title }}</h1>
          <p class="survey-description">{{ survey.description }}</p>
        </div>
        <p class="survey-period">{{ formatDate(survey.startDate) }} ~ {{ formatDate(survey.endDate) }}</p>
      </div>

      <div class="survey-item-container">
        <div v-for="question in survey.questions" :key="question.quesId" class="survey-item-section">
          <div class="question-title">{{ question.body }}</div>
          <div class="response">
            <template v-if="question.questionType === 'OBJ_SINGLE'">
              <div class="answer-options">
                <label v-for="option in question.selectionList" :key="option.selectionId.sequence">
                  <input type="radio" :name="`question-${question.quesId}`" :value="option.body" disabled v-model="userAnswers[question.quesId]" />
                  {{ option.body }}
                </label>
              </div>
            </template>
            <template v-else-if="question.questionType === 'OBJ_MULTI'">
              <div class="answer-options">
                <label v-for="option in question.selectionList" :key="option.selectionId.sequence">
                  <input type="checkbox" :value="option.body" disabled v-model="userAnswers[question.quesId]" />
                  {{ option.body }}
                </label>
              </div>
            </template>
            <template v-else-if="question.questionType === 'SUBJECTIVE'">
              <textarea disabled v-model="userAnswers[question.quesId]" placeholder="답변을 입력하세요."></textarea>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { surveyData } from '../mock/MockUserSurveyData'; // 데이터 임포트

const router = useRouter();

// 초기값 설정
const survey = ref({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  questions: [],
});

const userAnswers = ref({});

// 설문 데이터 가져오기
const fetchSurveyData = () => {
  // surveyData는 mock 데이터로 직접 설정
  const fetchedSurvey = surveyData;

  // survey와 userAnswers를 맞게 설정
  survey.value = {
    title: fetchedSurvey.title,
    description: fetchedSurvey.description,
    startDate: fetchedSurvey.createDate,
    endDate: fetchedSurvey.expireDate,
    questions: fetchedSurvey.questionList, // questionList를 질문 배열로 사용
  };

  // userAnswers를 설정 (사용자가 답변한 항목)
  userAnswers.value = fetchedSurvey.questionList.reduce((acc, question) => {
    acc[question.quesId] = question.userResponse || (question.questionType === 'OBJ_MULTI' ? [] : '');
    return acc;
  }, {});
};

// 뒤로 가기 함수
const goBack = () => {
  router.push('/');
};

// 날짜 포맷 함수
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
};

// 컴포넌트 마운트 시 데이터 가져오기
fetchSurveyData();
</script>

<style scoped>
#survey-detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.toolbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
}

.back-container {
  display: flex;
  align-items: center;
  padding-left: 24px;
}

.survey-section {
  width: 100%;
  max-width: 800px;
  padding: 0 24px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.survey-title-section {
  background-color: #F8FBFF;
  border-radius: 15px;
  margin-bottom: 20px;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 126px;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.survey-title {
  text-decoration: underline;
  text-underline-position : under;
  font-size: 1.25rem;
  font-weight: bold;
  color: #464748;
  margin-bottom: 4px;
  position: relative;
  display: inline-block;
}

.underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0.5px;
  background-color: black;
}

.survey-description {
  font-size: 1rem;
  font-weight: bold;
  color: #C1C3C5;
  margin-bottom: 12px;
}

.survey-period {
  font-size: 0.75rem;
  font-weight: bold;
  color: #8c8c8c;
}

.survey-item-container {
  width: 100%;
}

.survey-item-section {
  background-color: #FAF8F8;
  margin-bottom: 12px;
  padding: 16px;
  border: solid 1px #eff0f6;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.question-title {
  font-size: 1rem;
  font-weight: bold;
  color: #8C8C8C;
  margin-bottom: 8px;
  background-color: white;
  padding: 8px 12px;
  border-radius: 8px;
}



.answer-options {
  margin-top: 18px;
}

.answer-options label {
  font-size: 0.875rem;
  color: #464748;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  padding-left: 12px;
  padding-right: 12px;
}

.answer-options label:hover {
  color: #374957;
}

/* 라디오 버튼 커스텀 스타일 */
input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid #8C8C8C;
  border-radius: 50%;
  outline: none;
  margin-right: 8px;
  position: relative;
}

input[type="radio"]:checked {
  background-color: white;
  border: 1px solid #8C8C8C;
  width: 16px;
  height: 16px;
}

input[type="radio"]:checked::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: #374957;
}

/* 체크박스 커스텀 스타일 */
input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid #8C8C8C;
  border-radius: 3px;
  outline: none;
  margin-right: 8px;
  position: relative;
}

input[type="checkbox"]:checked {
  background-color: #374957;
}

input[type="checkbox"]:checked::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

textarea {
  width: 100%;
  min-height: 80px;
  height: auto;
  resize: none;
  background-color: white;
  border: 1px solid #D9D9D9;
  border-radius: 8px;
  padding: 10px;
  box-sizing: border-box;
}

textarea::-webkit-scrollbar {
  width: 0px;
}

</style>
