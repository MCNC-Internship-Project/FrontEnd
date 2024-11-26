<template>
  <div id="survey-participation">
    <header class="toolbar"></header>

    <div class="survey-section">
      <div class="survey-title-section">
        <div>
          <h1 class="survey-title">{{ survey.title }}</h1>
          <p class="survey-description">{{ survey.description }}</p>
        </div>
        <p class="survey-period">{{ formattedDate }}</p>
      </div>

      <div class="survey-item-container">
        <div v-for="question in survey.questionList" 
            :key="question.quesId" 
            :class="['survey-item-section', { error: question.hasError }]">

          <!-- 에러 메시지: 주관식 제외 -->
          <div v-if="question.hasError && question.questionType !== 'SUBJECTIVE'" class="error-message">
            * {{ getErrorMessage(question.questionType) }}
          </div>

          <div class="question-title">{{ question.body }}</div>

          <!-- 다중 선택 -->
          <div v-if="question.questionType === 'OBJ_MULTI'" class="answer-options">
            <label v-for="option in question.selectionList" :key="option.selectionId.sequence">
              <input
                type="checkbox"
                :value="option.body"
                v-model="answers[question.quesId]"
                @change="handleCheckboxChange(question.quesId)"
              />
              {{ option.body }}
            </label>
          </div>

          <!-- 단일 선택 -->
          <div v-if="question.questionType === 'OBJ_SINGLE'" class="answer-options">
            <label v-for="option in question.selectionList" :key="option.selectionId.sequence">
              <input
                type="radio"
                :name="`question_${question.quesId}`"
                :value="option.body"
                v-model="answers[question.quesId]"
                @change="handleRadioChange(question.quesId)"
              />
              {{ option.body }}
            </label>
          </div>

            <!-- 주관식 -->
            <div v-if="question.questionType === 'SUBJECTIVE'" class="answer-options">
              <textarea
                v-model="answers[question.quesId]"
                :placeholder="'답변을 입력해주세요.'"
                :class="{ 'error-placeholder': question.hasError }"
                @input="(event) => { autoResize(event); handleTextInputChange(question.quesId); }">
              </textarea>
            </div>
          </div>
        </div>
      </div>

    <!-- 메뉴 컨테이너를 isection 외부로 이동 -->
    <div class="menu-container">
      <button class="submit-btn" @click="submitSurvey">제출</button>
    </div>

    <!-- 중앙에 표시되는 알림 모달 -->
    <div v-if="showAlert" class="alert-modal">
      <div class="alert-content">
        <p>{{ alertMessage }}</p>
        <button @click="showAlert = false" class="alert-button">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import router from '@/router';
import { surveyData } from '../mock/MockParticipationSurveys'; // surveyData import

// surveyData.js에서 가져온 데이터로 survey 설정
const survey = ref(surveyData);

// survey.questionList에 답변을 설정
const answers = ref({});
survey.value.questionList.forEach((question) => {
  if (question.questionType === 'OBJ_MULTI') {
    answers.value[question.quesId] = [];
  }
});

// 에러 메시지 반환
const getErrorMessage = (type) => {
  if (type === 'OBJ_MULTI') return '항목을 선택해주세요!';
  if (type === 'OBJ_SINGLE') return '항목을 선택해주세요!';
  if (type === 'SUBJECTIVE') return '답변을 입력해주세요.';
  return '';
};

// 날짜 포맷팅
const formattedDate = computed(() => {
  const startDate = new Date(survey.value.createDate).toLocaleDateString();
  const endDate = new Date(survey.value.expireDate).toLocaleDateString();
  return `${startDate} ~ ${endDate}`;
});

const showAlert = ref(false);
const alertMessage = ref('');

const handleRadioChange = (questionId) => {
  const question = survey.value.questionList.find((q) => q.quesId === questionId);
  if (question) question.hasError = false;
};

const handleCheckboxChange = (questionId) => {
  const question = survey.value.questionList.find((q) => q.quesId === questionId);
  if (question) question.hasError = false;
};

const handleTextInputChange = (questionId) => {
  const question = survey.value.questionList.find((q) => q.quesId === questionId);
  if (question) question.hasError = false;
};

const submitSurvey = () => {
  let hasUnanswered = false;

  survey.value.questionList.forEach((question) => {
    const answer = answers.value[question.quesId];

    if (
      (question.questionType === 'OBJ_SINGLE' && !answer) ||
      (question.questionType === 'OBJ_MULTI' && (!answer || answer.length === 0)) ||
      (question.questionType === 'SUBJECTIVE' && !answer)
    ) {
      question.hasError = true;
      hasUnanswered = true;
    } else {
      question.hasError = false;
    }
  });

  if (hasUnanswered) {
    alertMessage.value = '미응답 설문이 있습니다.';
    showAlert.value = true;
    return;
  }

  router.push('/survey-completion');
};

const autoResize = (event) => {
  const textarea = event.target;
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
};
</script>

<style scoped>
/* 기존의 스타일 그대로 유지 */
#survey-participation {
width: 100%;
display: flex;
flex-direction: column;
justify-content: center; 
align-items: center;
width: 100%;
min-height: 100vh;
}

.toolbar {
width: 100%;
height: 35px;
display: flex;
align-items: center;
justify-content: space-between;
padding: 0 12px;
}

.menu-container {
width: 100%;
max-width: 800px;
display: flex;
align-items: center;
justify-content: end;
padding-right: 24px;
margin-top: auto;
margin-bottom: 12px;
}

.submit-btn {
display: inline-block;
width: 65px;
height: 36px;
border: none;
border-radius: 8px;
background-color: #8C8C8C;
color: white;
font-size: 0.8125rem;
}

.survey-section {
width: 100%;
max-width: 800x;
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

.survey-description {
font-size: 1rem;
font-weight: bold;
color: #C1C3C5;
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

.survey-item-section.error {
border: 2px solid #F77D7D;
}

.error-message {
color: #F77D7D;
font-size: 0.875rem;
margin-bottom: 8px;
font-weight: bold;
margin-left: 10px;
}

.error-placeholder::placeholder {
color: #F77D7D;
font-weight: bold;
}

.survey-item-section.error .answer-options textarea {
  border-color: #D9D9D9; /* 주관식 입력창의 테두리는 기존 색상 */
}

.question-title {
font-size: 1rem;
font-weight: bold;
margin-top: 3px;
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
display: flex;
align-items: center;
margin-bottom: 7px;
padding-left: 12px;
padding-right: 12px;
}

.answer-options input[type="radio"],
.answer-options input[type="checkbox"] {
appearance: none;
width: 16px;
height: 16px;
border: 1px solid #8C8C8C;
margin-top: 2px;
margin-right: 8px;
background-color: white;
outline: none;
cursor: pointer;
position: relative;
transition: border-color 0.2s ease-in-out;
}

.answer-options input[type="radio"] {
border-radius: 50%;
}

.answer-options input[type="radio"]:checked {
background-color: white;
border: 1px solid #8C8C8C;
width: 16px;
height: 16px;
}

.answer-options input[type="radio"]:checked::after {
content: '';
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
width: 9px;
height: 9px;
background-color: #374957;
border-radius: 50%;
}

.answer-options input[type="checkbox"] {
border-radius: 4px;
}

.answer-options input[type="checkbox"]:checked {
border-color: #374957;
background-color: #374957;
}

.answer-options input[type="checkbox"]:checked::after {
content: '';
position: absolute;
top: 40%;
left: 50%;
transform: translate(-50%, -50%) rotate(45deg);
width: 5px;
height: 10px;
border: solid white;
border-width: 0 2px 2px 0;
}

.answer-options label {
display: flex;
align-items: center;
gap: 10px;
margin-bottom: 12px;
font-size: 0.875rem;
color: #464748;
cursor: pointer;
padding-left: 12px;
padding-right: 12px;
}

.answer-options label:hover {
color: #374957;
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

.alert-modal {
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
display: flex;
align-items: center;
justify-content: center;
color: #757576;
background-color: rgba(0, 0, 0, 0.5);
z-index: 999;
padding: 374px 23px;
font-weight: 600;
}

.alert-content {
background-color: white;
padding: 20px;
border-radius: 8px;
text-align: center;
width: 315px;
height:150px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: flex-start;
}

.alert-content p {
margin-top: 18px;
}

.alert-button {
background-color: #7796E8;
color: white;
border: none;
padding: 8px 35px;
border-radius: 15px;
cursor: pointer;
font-size: 1rem;
margin-top: 30px;
}

.alert-button:hover {
background-color: #7796E8;
}
</style>