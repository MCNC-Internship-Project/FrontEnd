<template>
    <ToolBar @goBack="goBack" backgroundColor="#fff" zIndex="1000" />
    <div id="survey-detail" v-if="survey.title && survey.questions && survey.questions.length">
        <div class="survey-section">
            <div class="survey-title-section">
                <div>
                    <h1 class="survey-title">{{ survey.title }}</h1>
                    <p class="survey-description">{{ survey.description }}</p>
                </div>
                <p class="survey-period">설문기간 &nbsp; {{ formatDate(survey.startDate) }} ~ {{ formatDate(survey.endDate) }}</p>
            </div>

            <div class="survey-item-container">
                <div v-for="question in survey.questions" :key="question.quesId" class="survey-item-section">
                    <div class="question-title">{{ question.body }}</div>
                    <div class="response">
                        <!-- 객관식 단일 선택 (라디오 버튼) -->
                        <template v-if="question.questionType === 'OBJ_SINGLE'">
                            <div class="answer-options">
                                <label v-for="option in question.selectionList" :key="option.selectionId.sequence"
                                    class="option-container">
                                    <div class="btn-container">
                                        <input type="radio" :name="`question-${question.quesId}`"
                                            :value="option.selectionId.sequence"
                                            :checked="question.objAnswerList[0] === option.selectionId.sequence"
                                            disabled />
                                    </div>
                                    <div class="question-text">{{ option.body }}</div>

                                    <div class="answer-text"
                                        v-if="option.isEtc && question.objAnswerList.includes(option.selectionId.sequence)">
                                        {{ question.etcAnswer }}
                                    </div>

                                </label>
                            </div>
                        </template>

                        <!-- 객관식 다중 선택 (체크박스) -->
                        <template v-else-if="question.questionType === 'OBJ_MULTI'">
                            <div class="answer-options">
                                <label v-for="option in question.selectionList" :key="option.selectionId.sequence"
                                    class="option-container">
                                    <div class="btn-container">
                                        <input type="checkbox" :value="option.selectionId.sequence"
                                            :checked="userAnswers[question.quesId]?.includes(option.selectionId.sequence)"
                                            disabled />
                                    </div>
                                    <div class="question-text">{{ option.body }}</div>

                                    <div class="answer-text"
                                        v-if="option.isEtc && question.objAnswerList.includes(option.selectionId.sequence)">
                                        {{ question.etcAnswer }}
                                    </div>
                                </label>

                            </div>
                        </template>

                        <!-- 주관식 -->
                        <template v-else-if="question.questionType === 'SUBJECTIVE'">
                            <div class="answer-text">
                                {{ userAnswers[question.quesId] }}
                            </div>
                        </template>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { decrypt } from '@/utils/crypto';
import ToolBar from '../common/ToolBar.vue';


const router = useRouter();
const baseUrl = process.env.VUE_APP_API_URL;

// id를 props로 받아옴
const props = defineProps({
    id: String,
});

// survey 객체와 사용자 답변 객체
const survey = ref({});
const userAnswers = ref({});

// 컴포넌트가 마운트되면 API 호출
onMounted(async () => {
    await fetchSurveyResponses();
});

const fetchSurveyResponses = async () => {
    try {
        const decryptedId = decrypt(props.id);
        const response = await axios.get(`${baseUrl}/survey/response/${decryptedId}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = response.data;

        // 설문 데이터 매핑
        survey.value = {
            title: data.title,
            description: data.description,
            startDate: data.createDate,
            endDate: data.expireDate,
            creatorId: data.creatorId,
            isExpired: !data.expireDateValid,
            questions: data.questionList.map((question) => ({
                quesId: question.quesId,
                body: question.body,
                questionType: question.questionType,
                subjAnswer: question.subjAnswer,
                etcAnswer: question.etcAnswer,
                objAnswerList: question.objAnswerList,
                selectionList: question.selectionList.map((selection, seqIdx) => ({
                    selectionId: {
                        quesId: question.quesId,
                        sequence: seqIdx,
                    },
                    body: selection.body,
                    isEtc: selection.isEtc || false,
                })) || [], // selectionList가 없으면 빈 배열로 처리
            })),
        };

        // 사용자 답변 매핑
        data.questionList.forEach((question) => {
            if (question.questionType === 'OBJ_MULTI') {
                userAnswers.value[question.quesId] = question.objAnswerList || [];
            } else if (question.questionType === 'OBJ_SINGLE') {
                userAnswers.value[question.quesId] = question.objAnswerList?.[0] || null;
            } else if (question.questionType === 'SUBJECTIVE') {
                userAnswers.value[question.quesId] = question.subjAnswer || '';
            }
        });
    } catch (error) {
        console.error('설문 데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
};



// 뒤로 가기 함수
const goBack = () => {
    router.back(); // 홈 페이지로 이동
};

// 날짜 포맷 함수
const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
};
</script>

<style scoped>
#survey-detail {
    width: 100%;
    margin-top: 68px;
    display: flex;
    flex-direction: column;
}

.survey-section {
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.survey-title-section {
    width: 100%;
    background-color: #F8FBFF;
    border: solid 1px #EFF0F6;
    border-radius: 15px;
    margin-bottom: 20px;
    padding: 8px 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    max-width: 800px;
    min-height: 126px;
    justify-content: space-between;
    box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.15);
}

.survey-title {
    text-decoration: underline;
    text-underline-position: under;
    font-size: 1.25rem;
    font-weight: bold;
    color: #464748;
    margin-top: 12px;
    position: relative;
    display: inline-block;
    white-space: pre-wrap; /* 줄바꿈 허용 */
    word-break: break-word; /* 긴 단어 줄바꿈 */
    overflow-wrap: break-word; /* 줄바꿈 처리 */
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
    margin-top: 12px;
    font-size: 1rem;
    font-weight: bold;
    color: #868686;
    white-space: pre-wrap; /* 줄바꿈 허용 */
    word-break: break-word; /* 긴 단어 줄바꿈 */
    overflow-wrap: break-word; /* 줄바꿈 처리 */
}

.survey-period {
    margin-top: 25px;
    font-size: 0.75rem;
    font-weight: bold;
    color: #8c8c8c;
    margin-bottom: 12px;
}

.survey-item-container {
    width: 100%;
    max-width: 800px;
}

.survey-item-section {
    background-color: #FAF8F8;
    margin-bottom: 12px;
    padding: 16px;
    border: solid 1px #eff0f6;
    border-radius: 15px;
    box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.15);
}

.question-title {
    font-size: 1rem;
    font-weight: bold;
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
    margin-top: 18px;
}

.answer-options label {
    font-size: 0.875rem;
    color: #464748;
    margin-bottom: 12px;
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
    border: 2px solid #8C8C8C;
    border-radius: 50%;
    outline: none;
    margin-right: 8px;
    position: relative;
    vertical-align: middle;
}

input[type="radio"]:checked {
    background-color: white;
    border: 2px solid #8C8C8C;
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
    border: 2px solid #8C8C8C;
    border-radius: 3px;
    outline: none;
    margin-right: 8px;
    position: relative;
    vertical-align: middle;
}

input[type="checkbox"]:checked {
    background-color: #374957;
    border: 1px solid #374957;
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

textarea:focus {
    background-color: white;
    /* 포커스 시 배경색을 흰색으로 유지 */
    outline: none;
    /* 포커스 시 테두리 스타일을 없앰 */
}

textarea::-webkit-scrollbar {
    width: 0px;
}

.option-container {
    display: flex;
    flex-direction: row;
    width: 100%;
}

.btn-container {
    display: flex;
    align-items: center;
}

.etc-answer {
    width: 100%;
    min-height: 80px;
    height: auto;
    resize: none;
    background-color: white;
    border: 1px solid #D9D9D9;
    border-radius: 8px;
    padding: 10px;
    box-sizing: border-box;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;
}

.answer-text {
    background-color: #fff;
    border-radius: 8px;
    padding : 8px 12px;
    font-size: 0.875rem;
}
</style>
