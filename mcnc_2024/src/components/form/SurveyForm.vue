<template>
    <div v-if="isExpiredValid">
        <ToolBar @goBack="goBack" backgroundColor="#fff" zIndex="1000" />
        <div id="survey-participation">
            <div class="survey-section">
                <div class="survey-title-section">
                    <div>
                        <!-- 제목이 없으면 기본 메시지 표시 -->
                        <h1 class="survey-title">{{ survey.title }}</h1>

                        <!-- 설명이 없으면 빈칸으로 표시 -->
                        <p class="survey-description">{{ survey.description || "" }}</p>
                    </div>
                    <p class="survey-period">설문기간 &nbsp; {{ formattedDate }}</p>
                </div>

                <div class="survey-item-container">
                    <div v-for="question in survey.questionList" :key="question.quesId"
                        class="survey-item-section" :class="{ error: question.hasError }">
                        <!-- 에러 메시지: 주관식 제외 -->
                        <div v-if="question.hasError && question.questionType !== 'SUBJECTIVE'" class="error-message">
                            *입력되지 않은 항목이 있습니다.
                        </div>

                        <div class="question-title">{{ question.body }}</div>

                        <!-- 다중 선택 -->
                        <div v-if="question.questionType === 'OBJ_MULTI'" class="answer-options">
                            <!-- 일반 선택지 -->
                            <label v-for="option in question.selectionList.filter(option => !option.isEtc)"
                                :key="option.selectionId.sequence" class="answer-options-item">
                                <input type="checkbox" :value="option.selectionId.sequence"
                                    :checked="question.response.includes(option.selectionId.sequence)"
                                    @change="handleCheckboxChange(question.quesId, option.selectionId.sequence)" />
                                <div class="answer-options-content">{{ option.body }}</div>
                            </label>

                            <!-- "기타" 항목 -->
                            <label v-for="option in question.selectionList.filter(option => option.isEtc)"
                                :key="option.selectionId.sequence">
                                <input type="checkbox" :checked="question.isEtcChecked"
                                    @change="toggleEtcCheckbox(question.quesId)" class="etc-text"/> 기타
                                    <div class="textarea-container">
                                <template v-if="question.isEtcChecked">
                                        <textarea
                                        v-model="question.etcAnswer"
                                        placeholder="기타 내용을 입력하세요."
                                        :class="{ error: question.hasEtcError }"
                                        maxlength="2000"
                                        @focus="question.hasEtcError = false; question.hasError = false"
                                        @input="handleEtcInputChange(question.quesId, option.selectionId.sequence)"
                                        ></textarea>
                                        <p class="char-counter">{{ question.etcAnswer.length }}/2000</p>
                                    </template>
                                </div>
                            </label>
                            
                        </div>

                        <!-- 단일 선택 -->
                        <div v-if="question.questionType === 'OBJ_SINGLE'" class="answer-options">
                            <!-- 일반 선택지 -->
                            <label v-for="option in question.selectionList.filter(option => !option.isEtc)"
                                :key="option.selectionId.sequence" class="answer-options-item">
                                <input type="radio" :name="`question_${question.quesId}`"
                                    :value="option.selectionId.sequence"
                                    :checked="answers[question.quesId] === option.selectionId.sequence"
                                    @change="handleRadioChange(question.quesId, option.selectionId.sequence)" />
                                <div class="answer-options-content">{{ option.body }}</div>
                            </label>

                            <!-- "기타" 항목 -->
                            <label v-for="option in question.selectionList.filter(option=> option.isEtc)"
                                :key="option.selectionId.sequence"  >
                                <input type="radio" :name="`question_${question.quesId}`" :checked="question.isEtcChecked"
                                    @change="toggleEtcCheckbox(question.quesId)" class="etc-text"/> 기타
                                    <template v-if="question.isEtcChecked">
                                    <textarea
                                        v-model="question.etcAnswer"
                                        :class="{ error: question.hasEtcError }"
                                        placeholder="기타 내용을 입력하세요."
                                        maxlength="2000"
                                        @input="handleEtcInputChange(question.quesId, option.selectionId.sequence)"
                                        @focus="question.hasEtcError = false; question.hasError = false"
                                    ></textarea>
                                    <p class="char-counter">{{ question.etcAnswer.length }}/2000</p>
                                </template>
                            </label>
                        </div>
                        <!-- 주관식 -->
                        <div v-if="question.questionType === 'SUBJECTIVE'" class="answer-options">
                            <textarea v-model="answers[question.quesId]" :placeholder="'답변을 입력해주세요.'"
                                :class="{ 'error-placeholder': question.hasError }" ref="textAreaRef"
                                    maxlength="2000"
                                    @input="(event) => {
                                    if (textAreaRef.value) autoResize();
                                    handleTextInputChange(question.quesId);}"
                                    @focus="question.hasEtcError = false; question.hasError = false"
                                    ></textarea>
                                    <p class="char-counter">{{ answers[question.quesId]?.length || 0 }}/2000</p>
                        </div>
                    </div>
                </div>
                <!-- 메뉴 컨테이너를 section 외부로 이동 -->
            <div class="menu-container">
                <!-- 제출 버튼 비활성화 -->
                <button class="submit-btn" @click="submitSurvey">제출</button>
            </div>
            </div>

            

            <default-dialog v-model="dialogs.showSuccessDialog.isVisible" :message="dialogs.showSuccessDialog.message"
                @confirm="redirectionToSubmit" :isPersistent="true" />

            <default-dialog v-model="dialogs.showDefaultDialog.isVisible" :message="dialogs.showDefaultDialog.message"
                @confirm="dialogs.showDefaultDialog.isVisible = false"/>
        </div>
    </div>
    <survey-expired v-else />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router"; // 라우터 추가
import axios from "axios";
import { encrypt, decrypt } from "@/utils/crypto";
import ToolBar from "../common/ToolBar.vue";
import SurveyExpired from "./SurveyExpired.vue";

// 라우터 사용
const router = useRouter();
const route = useRoute(); // 현재 URL 파라미터에서 surveyId 가져오기

// Constants
const baseUrl = process.env.VUE_APP_API_URL;

// survey 데이터
const survey = ref({ title: "", description: "", questionList: [] });

// survey.questionList에 답변을 설정
const answers = ref({});
const etcAnswers = ref({});
const dialogs = ref({
    showSuccessDialog: {
        isVisible: false,
        message: "",
    },
    showDefaultDialog: {
        isVisible: false,
        message: "",
    },
})

const isExpiredValid = ref(true);

const showDialog = (dialog, message) => {
    dialog.message = message
    dialog.isVisible = true
}

// 이전 페이지로 이동
const goBack = () => {
    router.back();
};

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
        textAreaRef.value.style.height = "auto"; // 높이를 auto로 리셋
        textAreaRef.value.style.height = `${textAreaRef.value.scrollHeight}px`; // scrollHeight로 높이 설정
    }
};

// 설문 데이터 불러오기
const fetchSurveyData = async (surveyId) => {
    try {
        const response = await axios.get(
            `${baseUrl}/survey/inquiry/detail/${surveyId}`,
            { withCredentials: true }
        );
        const data = response.data;

        isExpiredValid.value = data.expireDateValid;

        survey.value = {
            title: data.title,
            description: data.description,
            createDate: data.createDate,
            expireDate: data.expireDate,
            questionList: data.questionList.map((question) => {
                if (question.questionType === "OBJ_MULTI" || question.questionType === "OBJ_SINGLE") {
                    return {
                        ...question,
                        selectionList: question.selectionList,
                        response: [], // 다중 선택은 배열로 초기화
                        isEtcChecked: false,
                        etcAnswer: "", // 기타 답변 초기화
                    };
                }
                if (question.questionType === "SUBJECTIVE") {
                    return {
                        ...question,
                        response: "", // 주관식은 문자열로 초기화
                    };
                }
                return question;
            }),
        };
    } catch (error) {
        console.error("설문 데이터를 불러오는 데 오류가 발생했습니다.", error);
    }

    console.log(survey.value)
};



// 날짜 포맷팅
const formattedDate = computed(() => {
    const startDate = new Date(survey.value.createDate);
    const endDate = new Date(survey.value.expireDate);

    if (isNaN(startDate) || isNaN(endDate)) {
        return "날짜가 유효하지 않습니다";
    }

    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const formattedStartDate = startDate.toLocaleDateString("ko-KR", options);
    const formattedEndDate = endDate.toLocaleDateString("ko-KR", options);

    return `${formattedStartDate} ~ ${formattedEndDate}`;
});

// 체크박스 변경 처리
const handleCheckboxChange = (quesId, sequence) => {
    // 해당 질문을 찾아오기
    const question = survey.value.questionList.find((q) => q.quesId === quesId);

    if (question) {
        if (!Array.isArray(question.response)) {
            question.response = [];
        }
        // 선택 여부 확인
        const isChecked = question.response.includes(sequence);

        if (isChecked) {
            // 이미 선택된 경우, 배열에서 제거
            question.response = question.response.filter((item) => item !== sequence);
        } else {
            // 선택되지 않은 경우, 배열에 추가
            question.response = [...question.response, sequence];
        }

        // `answers`에 업데이트된 응답 반영
        answers.value[quesId] = question.response;
        
        // 체크박스를 선택할 때 에러 상태 해제
        if (question.hasError) {
            question.hasError = false;
        }
    }
};

// 라디오 버튼 변경 처리
const handleRadioChange = (quesId, sequence) => {
    // 라디오 입력을 변경할 때 에러 상태를 없앰
    const question = survey.value.questionList.find((q) => q.quesId === quesId);
    if (question.hasError) {
        question.hasError = false;
    }
    console.log("question, ", JSON.stringify(question, null, 2))
    if (question) {
        // 기타 항목 체크 상태 초기화
        if (question.isEtcChecked) {
            question.isEtcChecked = false;
            question.etcAnswer = ""; // 기타 입력 초기화
        }

        // 선택된 값 저장
        answers.value[quesId] = sequence; // 선택한 항목의 sequence 저장
        console.log("Updated answers:", answers.value);

         // 기타 항목 체크되었을 경우 내용 입력되지 않으면 오류 표시
         if (question.isEtcChecked && !question.etcAnswer) {
            question.etcAnswer = '';
            question.hasEtcError = true;
        } else {
            question.hasEtcError = false;
        }
    }
};


// 주관식 입력 변경 처리
const handleTextInputChange = (quesId) => {
    const inputText = answers.value[quesId];
    answers.value[quesId] = inputText || "";

    // 주관식 입력을 변경할 때 에러 상태를 없앰
    const question = survey.value.questionList.find((q) => q.quesId === quesId);
    if (question.hasError) {
        question.hasError = false;
    }
};

const submitSurvey = async () => {
    const surveyId = decrypt(route.params.id);

    if (isSurveyExpired.value) {
        console.warn("설문 기간이 만료되었습니다.");
        return;
    }

    let hasUnanswered = false;

    // 응답 검증
    survey.value.questionList.forEach((question) => {
        let answer = answers.value[question.quesId];
        let etcAnswer = etcAnswers.value[question.quesId];
        console.log(etcAnswer)
        console.log("answer", answer)
        if(etcAnswer === undefined) {
            etcAnswer = "";
        }

        if(answer === undefined) {
            answer = "";
        }

        if (
            (question.questionType === "OBJ_SINGLE" && (answer === undefined || answer.length === 0)) ||
            (question.questionType === "OBJ_MULTI" &&
                (!answer || answer.length === 0)) ||
                (question.questionType === "SUBJECTIVE" && (answer !== undefined && (!answer || answer.trim() === ""))) ||
                (question.isEtcChecked && (etcAnswer !== undefined && (!etcAnswer || etcAnswer.trim() === ""))) // 기타 선택 시 내용 확인
        ) {
            question.hasError = true;
            hasUnanswered = true;
            
            // 라디오 버튼의 경우 answers를 초기화하지 않음
            if (question.questionType !== "OBJ_SINGLE") {
                answers.value[question.quesId] = "";
            }
            
            if (question.isEtcChecked && !etcAnswer.trim()) {
                question.hasEtcError = true; // 기타 에러 플래그 설정
                question.etcAnswer = "";
            }
        } else {
            question.hasError = false;
            question.hasEtcError = false; // 기타 에러 플래그 해제
        }
    });

    if (hasUnanswered) {
        showDialog(dialogs.value.showDefaultDialog, "미응답 항목이 있습니다.")
        return;
    }

    try {
        const payload = {
            surveyId: surveyId,
            responseList: survey.value.questionList.flatMap((question) => {
                const response = answers.value[question.quesId];
                const etcAnswer = etcAnswers.value[question.quesId];
                console.log("response: ", response)
                const baseResponse = {
                    quesId: question.quesId,
                    questionType: question.questionType,
                };

                // 주관식(SUBJECTIVE)
                if (question.questionType === "SUBJECTIVE") {
                    return {
                        ...baseResponse,
                        response: response || "", // 응답만 포함
                        selectionId: null, // 주관식은 SelectionId 없음
                    };
                }

                // 단일 선택(OBJ_SINGLE)
                if (question.questionType === "OBJ_SINGLE") {
                    const selectedOption = question.selectionList.find(
                        (opt) => opt.selectionId.sequence === response
                    );
                    return {
                        ...baseResponse,
                        response: selectedOption.isEtc ? etcAnswer : null,
                        selectionId: selectedOption
                            ? {
                                quesId: question.quesId,
                                sequence: selectedOption.selectionId.sequence,
                            }
                            : null,
                    };
                }

                // 다중 선택 (OBJ_MULTI)
                if (question.questionType === "OBJ_MULTI") {
                    return response.map((selectedAnswer) => {
                        const selectedOption = question.selectionList.find(
                            (opt) => opt.selectionId.sequence === selectedAnswer
                        );
                        return {
                            ...baseResponse,
                            response: selectedOption.isEtc ? etcAnswer : null, // 개별 응답
                            selectionId: selectedOption
                                ? {
                                    quesId: question.quesId,
                                    sequence: selectedOption.selectionId.sequence,
                                }
                                : null,
                        };
                    });
                }
                // 기본 처리
                return {
                    ...baseResponse,
                    response: response || "",
                };
            }),
        };

        console.log("Submitting payload:", JSON.stringify(payload, null, 2));

        // 설문 응답 전송
        await axios.post(`${baseUrl}/survey/response`, payload, {
            withCredentials: true,
        });

        showDialog(dialogs.value.showSuccessDialog, "제출되었습니다.")

    } catch (error) {
        console.error("설문 제출 중 오류 발생:", error);
        showDialog(dialogs.value.showDefaultDialog, "설문 제출 중 오류가 발생했습니다.")
    }
};

const redirectionToSubmit = () => {
    dialogs.value.showSuccessDialog.isVisible = false;

    router.replace({
        name: "Submit"
    });
}

const toggleEtcCheckbox = (quesId) => {
    const question = survey.value.questionList.find((q) => q.quesId === quesId);
    if (question) {
        question.isEtcChecked = !question.isEtcChecked;

        if (question.questionType === 'OBJ_SINGLE') {
            if (question.isEtcChecked) {
                answers.value[quesId] = null; // 기타 체크되면 기존 선택 해제
            }
        } else if (question.questionType === 'OBJ_MULTI') {
            if (!question.isEtcChecked) {
                question.response = question.response.filter(
                    item => !question.selectionList.find(opt => opt.isEtc && opt.selectionId.sequence === item)
                );
                answers.value[quesId] = question.response;
            }
        }

        if (!question.isEtcChecked) {
            question.etcAnswer = ""; // 체크 해제 시 기타 답변 초기화
            delete etcAnswers.value[quesId];
        }
    }
};

const handleEtcInputChange = (quesId, sequence) => {
    const question = survey.value.questionList.find((q) => q.quesId === quesId);
    if (question) {
        if (question.questionType === 'OBJ_SINGLE') {
            answers.value[quesId] = sequence;
        } else if (question.questionType === 'OBJ_MULTI') {
            // 다중 선택의 경우 기존 로직 유지
            if (!question.response.includes(sequence)) {
                question.response.push(sequence);
            }
            answers.value[quesId] = question.response;
        }
        etcAnswers.value[quesId] = question.etcAnswer || "";
    }
};

// mounted 시 surveyId로 데이터 불러오기
onMounted(() => {
    const id = decrypt(route.params.id);

    axios.get(`${baseUrl}/survey/response/verify/${id}`,{
        withCredentials : true,
        headers: {
                'Content-Type': 'application/json'
        }
    })
        .then(() => {
            fetchSurveyData(id);
        })
        .catch((error) => {
            if(error.response.status === 400) {
                //
            } else if(error.response.status === 409) {
                router.push({
                    name: "RespondDetail",
                    params: { id: encrypt(id) }
                })
            } else if(error.response.status === 410) {
                // 종료창으로
            }
        })

    
});
</script>

<style scoped>
#survey-participation {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 68px;
}

.submit-btn {
    display: inline-block;
    width: 65px;
    height: 36px;
    border: none;
    border-radius: 8px;
    background-color: #7796E8;
    color: white;
    font-size: 0.8125rem;
}

.menu-container {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding: 0 0 12px 0;
}

.survey-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    padding: 0 24px;
    max-width: 800px;
}

.survey-title-section {
    background-color: #F8FBFF;
    border: solid 1px #EFF0F6;
    box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.15);
    border-radius: 15px;
    padding: 8px 8px;
    box-sizing: border-box;
}

.survey-title {
    font-size: 1.25rem;
    font-weight: bold;
    color: #464748;
    text-decoration: underline;
    text-underline-position: under;
    margin: 12px 16px 0px;
    word-break: break-word; /* 긴 단어 줄바꿈 */
    overflow-wrap: break-word; /* 긴 단어 줄바꿈 */
    white-space: pre-wrap; /* 줄바꿈 허용 */
}

.survey-description {
    font-size: 1rem;
    font-weight: bold;
    color: #C1C3C5;
    margin: 12px 16px 0px;
    word-break: break-word; /* 긴 단어 줄바꿈 */
    overflow-wrap: break-word; /* 긴 단어 줄바꿈 */
    white-space: pre-wrap; /* 줄바꿈 허용 */
}

.survey-period {
    font-size: 0.8rem;
    color: #757575;
    margin: 32px 12px 0 12px;
    padding: 0 4px;
    height: 26px;
    font-weight: bold;
}

.survey-item-container {
    width: 100%;
}

.survey-item-section {
    margin-top: 12px;
    background-color: #faf8f8;
    margin-bottom: 12px;
    padding: 16px;
    border: solid 1px #eff0f6;
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.survey-item-section.error {
    border: 2px solid #f77d7d;
}

.error-message {
    color: #f77d7d;
    font-size: 0.875rem;
    margin-bottom: 8px;
    margin-left: 10px;
}

.error-placeholder::placeholder {
    color: #f77d7d;
}

.survey-item-section.error .answer-options textarea {
    border-color: #f77d7d;
    /* 주관식 입력창의 테두리는 기존 색상 */
}

.question-title {
    font-size: 1rem;
    font-weight: bold;
    margin-top: 3px;
    color: #2c2b2b;
    margin-bottom: 8px;
    background-color: white;
    padding: 8px 12px;
    border-radius: 8px;
    white-space: pre-wrap; /* 줄바꿈 허용 */
    word-break: break-word; /* 긴 단어 줄바꿈 */
    overflow-wrap: break-word; /* 줄바꿈 처리 */
}

.answer-options {
    margin-top: 16px;
    display : flex;
    flex-direction: column;
}

.answer-options .answer-options-item {
    display : flex;
    flex-direction: row;
    margin-bottom : 8px;
}

.answer-options-content {
    margin-left : 8px;
}

.etc-text {
    margin-right : 4px;
}

.textarea-container {
    display : flex;
    flex-direction: column;
}

textarea {
    width: 100%;
    min-height: 80px;
    height: auto;
    resize: none;
    background-color: white;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    padding: 10px;
    box-sizing: border-box;
    margin-top : 4px;
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
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.alert-content p {
    margin-top: 18px;
}

.alert-button {
    background-color: #7796e8;
    color: white;
    border: none;
    padding: 8px 35px;
    border-radius: 15px;
    cursor: pointer;
    font-size: 1rem;
    margin-top: 30px;
}

.alert-button:hover {
    background-color: #7796e8;
}

.answer-options textarea {
    display: block;
    width: 100%;
    min-height: 80px;
    height: auto;
    resize: vertical;
    background-color: white;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    padding: 10px;
    box-sizing: border-box;
    font-size: 0.875rem;
    color: #464748;
    outline: none;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-break: break-word;
}

.answer-options textarea:focus {
    border-color: #7796e8;
    box-shadow: 0 0 0 3px rgba(119, 150, 232, 0.2);
}

.answer-options textarea.error {
    border-color: #f77d7d;
}

.answer-options textarea.error::placeholder {
    color: #f77d7d !important;
}
</style>