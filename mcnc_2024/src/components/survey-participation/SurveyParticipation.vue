<template>
    <div id="survey-participation">
      <header class="toolbar">

      </header>
  
      <div class="survey-section">
        <div class="survey-title-section">
          <div class="">

            <h1 class="survey-title">
              {{ survey.title }}
              <!-- <span class="underline"></span> -->
            </h1>
            <p class="survey-description">{{ survey.description }}</p>
          </div>
          <p class="survey-period">2024-11-13 ~ 2024-11-26</p>
        </div>
  
        <div class="survey-item-container">
          <!-- 설문 질문 리스트 -->
          <div v-for="question in survey.questions" :key="question.id" :class="['survey-item-section', { error: question.hasError }]">
            <!-- 에러 메시지 -->
            <div v-if="question.hasError && question.type === 'obj_radio'" class="error-message">
                * 항목을 선택해주세요!
            </div>

            <div v-if="question.hasError && question.type === 'obj_check'" class="error-message">
                * 항목을 선택해주세요!
            </div>


            <div class="question-title">{{ question.title }}</div>

            <!-- 질문 유형에 따라 답변 옵션 렌더링 (라디오, 체크박스 등) -->
            <!-- 라디오 버튼 (단일 선택) -->
            <div v-if="question.type === 'obj_radio'" class="answer-options">
                <label v-for="option in question.options" :key="option.id">
                <input type="radio" :name="`question_${question.id}`" :value="option.value" v-model="answers[question.id]" />
                {{ option.label }}
                </label>
            </div>

            <!-- 주관식 -->
            <div v-if="question.type === 'subj'" class="answer-options">
              <textarea 
                  v-model="answers[question.id]" 
                  :placeholder="question.hasError ? '답변을 입력해주세요.' : '답변을 입력해주세요.'" 
                  :class="{ 'error-placeholder': question.hasError }"
                  @input="autoResize">
              </textarea>
            </div>

            <!-- 체크박스 (다중 선택) -->
            <div v-if="question.type === 'obj_check'" class="answer-options">
                <label v-for="option in question.options" :key="option.id">
                <input type="checkbox" :value="option.value" v-model="answers[question.id]" :name="`question_${question.id}`" />
                {{ option.label }}
                </label>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 메뉴 컨테이너를 survey-section 외부로 이동 -->
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
  import { ref } from 'vue';
  import router from '@/router';
  import { mockSurveyData, mockEndDate } from '../mock/MockParticipationSurveys'; // 목데이터 가져오기
  
  const survey = ref(mockSurveyData); // 목데이터 참조
  const answers = ref({});
  survey.value.questions.forEach(question => {
    if (question.type === 'obj_check') {
      answers.value[question.id] = [];  // 체크박스 질문에 빈 배열을 할당
    }
  }); 

  const showAlert = ref(false);
  const alertMessage = ref("");
  
  const submitSurvey = () => {
    console.log("응답 데이터:", answers.value);

    const currentDate = new Date();
    const endDate = new Date(mockEndDate); 

    if (currentDate > endDate) {
      router.push('/survey-expired');
      return;
    }

    let hasUnanswered = false;

    survey.value.questions.forEach(question => {
        const answer = answers.value[question.id];

        if (
        (question.type === 'obj_radio' && !answer) || // 단일 선택 미응답
        (question.type === 'subj' && !answer) || // 주관식 미응답
        (question.type === 'obj_check' && (!answer || answer.length === 0)) // 다중 선택 미응답
        ) {
        question.hasError = true; // 미응답한 질문에 에러 표시
        hasUnanswered = true;
        } else {
        question.hasError = false; // 응답된 질문의 에러 해제
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
    textarea.style.height = 'auto'; // 현재 높이를 초기화하여 새로 계산하도록 함
    textarea.style.height = `${textarea.scrollHeight}px`; // content에 맞게 높이를 설정
  };
  </script>
  
  <style scoped>
  #survey-participation {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center;
    width: 100%;
    min-height: 100vh; /* 화면 높이에 맞게 */
  }

  .toolbar {
    width: 100%;
    height: 30px;
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
    flex-grow: 1; /* 설문 내용이 화면을 차지하게 */
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
    border: 2px solid #F77D7D; /* 빨간색 테두리 */
  }

  .error-message {
    color: #F77D7D;
    font-size: 0.875rem;
    margin-bottom: 8px;
    font-weight: bold;
  }

  .error-placeholder::placeholder {
    color: #F77D7D; /* Red color for placeholder */
    font-weight: bold;
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
    display: flex;
    align-items: center;
    margin-bottom: 7px;
    padding-left: 12px;
    padding-right: 12px;
  }
  
  .answer-options input[type="radio"],
  .answer-options input[type="checkbox"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid #D9D9D9;
    margin-top: 2px;
    margin-right: 8px;
    background-color: white;
    outline: none;
    cursor: pointer;
    position: relative;
    transition: border-color 0.2s ease-in-out;
  }

  /* 라디오 버튼 스타일 */
  .answer-options input[type="radio"] {
      border-radius: 50%;
  }

  .answer-options input[type="radio"]:checked {
      background-color: white;
  }

  .answer-options input[type="radio"]:checked::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 10px;
      height: 10px;
      background-color: #374957;
      border-radius: 50%;
  }

  /* 체크박스 스타일 */
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
      background-color: #7796E8; /* 파란색 배경 */
      color: white; /* 흰색 글자 */
      border: none;
      padding: 8px 35px;
      border-radius: 15px;
      cursor: pointer;
      font-size: 1rem;
      margin-top: 30px;
  }

  .alert-button:hover {
      background-color: #7796E8; /* 버튼에 마우스를 올렸을 때 조금 더 짙은 파란색 */
  }

  </style>