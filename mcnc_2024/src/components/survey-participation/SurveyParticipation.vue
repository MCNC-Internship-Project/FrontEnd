<template>
  <div id="survey-participation">
    <header class="toolbar"></header>

    <div class="survey-section">
      <div class="survey-title-section">
        <div>
          <!-- 제목이 없으면 기본 메시지 표시 -->
          <h1 class="survey-title">{{ survey.title || '설문 제목이 없습니다.' }}</h1>

          <!-- 설명이 없으면 빈칸으로 표시 -->
          <p class="survey-description">{{ survey.description || '' }}</p>
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
              ref="textAreaRef"
              @input="(event) => { if (textAreaRef.value) autoResize(); handleTextInputChange(question.quesId); }">
            </textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- 메뉴 컨테이너를 section 외부로 이동 -->
    <div class="menu-container">
      <!-- 제출 버튼 비활성화 -->
      <button 
        class="submit-btn" 
        @click="submitSurvey" 
        :disabled="isSurveyExpired"
      >
        제출
      </button>
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
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import router from '@/router';

// Constants
const baseUrl = process.env.VUE_APP_API_URL;
const surveyId = 44; // 설문 ID를 하드코딩 또는 동적으로 설정 가능
const API_URL = `${baseUrl}/survey/inquiry/detail/${surveyId}`;

// survey 데이터
const survey = ref({ title: '', description: '', questionList: [] });

// survey.questionList에 답변을 설정
const answers = ref({});


const showAlert = ref(false);
const alertMessage = ref('');

// 텍스트 영역 참조
const textAreaRef = ref(null);

// 설문 만료 여부 확인
const isSurveyExpired = computed(() => {
  const now = new Date();
  const expireDate = new Date(survey.value.expireDate);
  return expireDate < now;
});

// 자동 크기 조정 함수
const autoResize = () => {
  if (textAreaRef.value) {
    textAreaRef.value.style.height = 'auto'; // 높이를 auto로 리셋
    textAreaRef.value.style.height = `${textAreaRef.value.scrollHeight}px`; // scrollHeight로 높이 설정
  }
};

// 설문 데이터 불러오기
const fetchSurveyData = async () => {
  try {
    const response = await axios.get(API_URL, { withCredentials: true });
    const data = response.data;

    // survey 데이터 업데이트
    survey.value = {
      title: data.title,
      description: data.description,
      createDate: data.createDate,  // API 응답에서 받은 createDate
      expireDate: data.expireDate,  // API 응답에서 받은 expireDate
      questionList: data.questionList,
    };

    // 설문 문항에 대한 초기 답변 세팅
    survey.value.questionList.forEach((question) => {
      if (question.questionType === 'OBJ_MULTI') {
        answers.value[question.quesId] = [];
      } else {
        answers.value[question.quesId] = '';
      }
    });
  } catch (error) {
    console.error('설문 데이터를 불러오는 데 오류가 발생했습니다.', error);
  }
};

// 날짜 포맷팅
const formattedDate = computed(() => {
  // survey.createDate와 survey.expireDate가 유효한 날짜인지 확인
  const startDate = new Date(survey.value.createDate);
  const endDate = new Date(survey.value.expireDate);

  // 유효한 날짜인지 확인
  if (isNaN(startDate) || isNaN(endDate)) {
    return '날짜가 유효하지 않습니다'; // 날짜가 유효하지 않으면 에러 메시지 반환
  }

  // 로컬 시간으로 변환 후 날짜 포맷팅
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const formattedStartDate = startDate.toLocaleDateString('ko-KR', options);
  const formattedEndDate = endDate.toLocaleDateString('ko-KR', options);

  return `${formattedStartDate} ~ ${formattedEndDate}`;
});

// 체크박스 변경 처리
const handleCheckboxChange = (quesId) => {
  // 다중 선택 질문의 경우 선택된 값들을 업데이트
  const selectedAnswers = answers.value[quesId];
  if (!selectedAnswers) {
    answers.value[quesId] = [];
  }
  // 선택한 항목을 추가 또는 제거
  answers.value[quesId] = [...new Set(selectedAnswers)];
};

// 라디오 버튼 변경 처리
const handleRadioChange = (quesId) => {
  // 단일 선택 질문의 경우 답변을 해당 값으로 설정
  const selectedAnswer = answers.value[quesId];
  answers.value[quesId] = selectedAnswer || '';
};

// 주관식 입력 변경 처리
const handleTextInputChange = (quesId) => {
  const inputText = answers.value[quesId];
  answers.value[quesId] = inputText || '';
};

// 에러 메시지 반환
const getErrorMessage = (type) => {
  if (type === 'OBJ_MULTI') return '항목을 선택해주세요!';
  if (type === 'OBJ_SINGLE') return '항목을 선택해주세요!';
  if (type === 'SUBJECTIVE') return '답변을 입력해주세요.';
  return '';
};

// 설문 제출
const submitSurvey = async () => {
  // 설문 만료 여부 확인
  if (isSurveyExpired.value) {
    console.warn('설문 기간이 만료되었습니다.');
    router.push('/survey-expired');
    return;
  }

  let hasUnanswered = false;

  // 설문 문항별로 응답 확인
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

  // 응답하지 않은 질문이 있다면 알림 표시
  if (hasUnanswered) {
    alertMessage.value = '미응답 설문이 있습니다.';
    showAlert.value = true;
    return;
  }

  try {
    const payload = {
      surveyId: surveyId, // 설문 ID
      answers: answers.value, // 사용자가 입력한 답변들
    };

    await axios.post(`${baseUrl}/POST /survey/response`, payload, { withCredentials: true });

    alertMessage.value = '설문이 제출되었습니다.';
    showAlert.value = true;
  } catch (error) {
    console.error('설문 제출 중 오류 발생:', error);
    alertMessage.value = '설문 제출 중 오류가 발생했습니다.';
    showAlert.value = true;
  }
};

// 마운트 후 설문 데이터 불러오기
onMounted(() => {
  fetchSurveyData();
});
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