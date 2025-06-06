<template>
    <div class="root-container" v-if="isValid">
        <ToolBar @goBack="goBack" backgroundColor="#fff" zIndex="1000">
            <v-menu v-if="expireDateBoolean && !isLoading">
                <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, i) in items" :key="i" @click="item.action">
                        <v-list-item-title :class="{ deleteTitle: item.action === remove }">{{ item.title
                            }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

            <button v-if="!expireDateBoolean && !isLoaing" class="delete-btn" @click="remove"
                v-ripple>삭제</button>
        </ToolBar>

        <div v-if="surveyData" class="survey-container">
            <div class="header-container">
                <h1 class="survey-title">{{ surveyData.title }}</h1>
                <p class="description">{{ surveyData.description }}</p>
                <p class="period">설문 기간 {{ formatPeriod(surveyData.createDate, surveyData.expireDate) }}</p>
            </div>
            <div class="result-info">
                <div class="total-response">
                    <img src="../../assets/images/icon_total_response.svg" class="icon-total" alt="total response" />
                    총 응답자 {{ surveyData.responseCount }}명
                </div>
                <button type="button" @click="downloadExcel" class="download">
                    <img src="../../assets/images/icon_download.svg" class="icon-download" alt="download" />
                </button>
            </div>
            <div class="result-container">
                <div class="text">응답자 성별</div>
                <GenderChart :genderCountList="surveyData.genderCountList" />
            </div>
            <div class="result-container">
                <div class="text">응답자 연령</div>
                <AgeChart :ageCountList="surveyData.ageCountList" />
            </div>
            <div v-for="(question, index) in surveyData.questionList" :key="question.quesId" class="question-container"
                :class="{'last-item' : index === surveyData.questionList.length - 1}">
                <ResultRenderer :question="question" />
            </div>
        </div>
    </div>

    <survey-removed v-else />

    <default-dialog v-model="dialogs.defaultDialog.isVisible" :message="dialogs.defaultDialog.message"
        :isPersistent="dialogs.defaultDialog.isPersistent" @confirm="defaultDialogConfirm" />

    <confirm-dialog v-model="dialogs.confirmDialog.isVisible" :message="dialogs.confirmDialog.message"
        :isPersistent="dialogs.confirmDialog.isPersistent" @confirm="confirmDialogConfirm" 
        :subMessage="dialogs.confirmDialog.subMessage" :confirmButtonText="dialogs.confirmDialog.confirmButtonText" 
        :confirmButtonColor="dialogs.confirmDialog.confirmButtonColor" />

    <share-survey-dialog v-model="dialogs.showShareDialog.isVisible" :surveyId="decrypt(props.id)"
        @confirm="showDialog(dialogs.defaultDialog, '이메일 전송이 완료되었습니다.')" />
</template>

<script setup>
/**
 * @fileoverview 설문통계 화면 컴포넌트
 * @author 김은수 (kimeunsu@mcnc.co.kr)
 * @date 2024-12-10
 * @lastModified 2024-12-20
 * @description 설문 통계를 성별, 연령, 질문별 결과로 구분하여 시각화하고, Excel 다운로드 및 설문 관리 기능을 제공하는 화면 컴포넌트.
 */

import { useRouter } from 'vue-router';
import { ref, defineProps, onMounted } from 'vue';
import { decrypt, encrypt } from '@/utils/crypto';
import axios from '@/utils/axiosInstance';
import * as XLSX from 'xlsx-js-style';
import ToolBar from '@/components/common/ToolBar.vue'
import AgeChart from './AgeChart.vue';
import GenderChart from './GenderChart.vue';
import ResultRenderer from './ResultRenderer.vue';
import ShareSurveyDialog from './ShareSurveyDialog.vue';
import SurveyRemoved from '../form/SurveyRemoved.vue';

const router = useRouter();
const surveyData = ref("");
const isValid = ref(true);
const isLoading = ref(true);
const expireDateBoolean = ref(true);

const props = defineProps({
    id: String,
})

const dialogs = ref({
    showShareDialog: {
        isVisible: false,
    },
    defaultDialog: {
        isVisible: false,
        message: "",
        isPersistent: false,
        callback: null
    },
    confirmDialog: {
        isVisible: false,
        message: "",
        isPersistent: false,
        callback: null,
        subMessage: "",
        confirmButtonText: "",
        confirmButtonColor: "",
    }
})

const showDialog = (dialog, message, isPersistent = false, callback = null,
                    subMessage = null, confirmButtonText = null, confirmButtonColor = null) =>
                    {
    dialog.message = message;
    dialog.isPersistent = isPersistent;
    dialog.callback = callback;
    dialog.isVisible = true;
    dialog.subMessage = subMessage;
    dialog.confirmButtonText = confirmButtonText;
    dialog.confirmButtonColor = confirmButtonColor;
}

const defaultDialogConfirm = () => {
    if (dialogs.value.defaultDialog.callback) {
        dialogs.value.defaultDialog.callback();
    }

    dialogs.value.defaultDialog.isVisible = false;
}

const confirmDialogConfirm = () => {
    if (dialogs.value.confirmDialog.callback) {
        dialogs.value.confirmDialog.callback();
    }

    dialogs.value.confirmDialog.isVisible = false;
}

const handleError = (error) => {
    switch (error.status) {
        case 400: // 해당 설문이 존재하지 않음
            showDialog(dialogs.value.defaultDialog, error.response.data.errorMessage, true, goBack)
            break;
        case 401: // 세션이 만료됨
            showDialog(dialogs.value.defaultDialog, "세션이 만료되었습니다. 다시 로그인 해주세요.", true, redirectionToLogin)
            break;
        case 403: // 내 설문이 아님
            showDialog(dialogs.value.defaultDialog, error.response.data.errorMessage, true, redirectionToHome)
            break;
        case 404: // 해당 설문이 존재하지 않음
            isValid.value = false;
            break;
        case 410: // 이미 종료된 설문
            showDialog(dialogs.value.defaultDialog, error.response.data.errorMessage, true, goReplace)
            break;
        default: // 그 외
            if (error?.response?.data?.errorMessage)
                showDialog(dialogs.value.defaultDialog, error?.response?.data?.errorMessage, false, null);
            else
                showDialog(dialogs.value.defaultDialog, "오류가 발생했습니다.", false, null);
    }
};

onMounted(() => {
    fetchSurveyData();
});

// 설문 데이터 가져오기 api
const fetchSurveyData = async () => {
    try {
        const decryptedId = decrypt(props.id);
        const response = await axios.get(`/survey/response/result/${decryptedId}`);
        surveyData.value = response.data;
        expireDateBoolean.value = surveyData.value.expireDateValid;
    } catch (error) {
        handleError(error);
    } finally {
        isLoading.value = false;
    }
}

// 공유 버튼 클릭
const share = () => {
    showDialog(dialogs.value.showShareDialog, '', false, null);
}

// 수정 버튼 클릭
const edit = () => {
    const decryptedId = decrypt(props.id)

    router.push({
        name: "Update",
        params: { id: encrypt(decryptedId) },
    });
}

// 종료 버튼 클릭
const close = () => {
    showDialog(dialogs.value.confirmDialog, "설문을 종료하시겠습니까?", false, handleCloseConfirm, null, "종료", "#F77D7D")
}

// 설문 종료 api
const handleCloseConfirm = async () => {
    try {
        const decryptedId = decrypt(props.id);
        await axios.patch(`/survey/manage/expire/${decryptedId}`, null);
        showDialog(dialogs.value.defaultDialog, "설문이 종료되었습니다.", true, confirm);
    } catch (error) {
        handleError(error);
    }
}

// 삭제 버튼 클릭
const remove = () => {
    showDialog(dialogs.value.confirmDialog, "설문을 삭제하시겠습니까?", false, handleDeleteConfirm, "*삭제 후에는 복구가 불가능합니다!", "삭제", "#F77D7D")
}

const redirectionToHome = () => {
    dialogs.value.defaultDialog.isVisible = false;

    router.replace({ path: '/' })
}

const redirectionToLogin = () => {
    dialogs.value.defaultDialog.isVisible = false;
    const currentPath = router.currentRoute.value.path

    router.push({ path: '/login', query: { redirect: currentPath } })
}

const goReplace = () => {
    dialogs.value.defaultDialog.isVisible = false;
    window.location.reload();
}

function confirm() {
    dialogs.value.defaultDialog.value = false;
    router.go(-1);
    setTimeout(() => {
        const currentPath = router.currentRoute.value.path

        if (currentPath === '/') {
            router.replace({ path: '/' });
        } else if (currentPath === '/my-survey') {
            router.replace({ name: 'MySurvey' });
        }
    }, 100);
}

// 설문 삭제 api
const handleDeleteConfirm = async () => {
    try {
        const decryptedId = decrypt(props.id);
        await axios.delete(`/survey/manage/delete/${decryptedId}`);
        showDialog(dialogs.value.defaultDialog, "설문이 삭제되었습니다.", true, confirm);
    } catch (error) {
        handleError(error);
    }
}

// 메뉴 버튼 리스트
const items = [
    { title: '공유', action: share },
    { title: '수정', action: edit },
    { title: '종료', action: close },
    { title: '삭제', action: remove }
];

// excel 다운로드
const downloadExcel = async () => {
    try {
        // 설문 데이터를 API로부터 가져오기
        const decryptedId = decrypt(props.id);
        const response = await axios.get(`/survey/response/result/${decryptedId}`);

        const data = response.data;

        // 엑셀 워크북 생성
        const workbook = XLSX.utils.book_new();

        // 헤더 스타일 설정
        const headerStyle = {
            font: { bold: true },
            border: {
                top: { style: 'thin', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } },
                left: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'thin', color: { rgb: '000000' } },
            },
        };

        // 데이터 스타일 설정
        const dataStyle = {
            border: {
                top: { style: 'thin', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } },
                left: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'thin', color: { rgb: '000000' } },
            },
            alignment: { vertical: 'center' },
        };

        // 설문 개요 시트
        const summaryData = [
            ['설문 제목', '설문 설명', '작성자 ID', '생성일', '종료일', '총 응답자'],
            [data.title, data.description, data.creatorId, formatDateToYMD(data.createDate), formatDateToYMD(data.expireDate), data.responseCount]
        ];
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        summarySheet['!cols'] = [
            { wch: 20 },
            { wch: 40 },
            { wch: 15 },
            { wch: 15 },
            { wch: 15 },
            { wch: 10 }
        ];
        applyHeaderStyle(summarySheet, summaryData[0].length, headerStyle);
        applyDataStyle(summarySheet, 1, summaryData.length - 1, summaryData[0].length, dataStyle);
        XLSX.utils.book_append_sheet(workbook, summarySheet, '설문 개요');

        // 성별 통계 시트
        const genderData = [['성별', '응답자 수']];
        const translateGender = (gender) => {
            if (gender === 'FEMALE') return '여성';
            if (gender === 'MALE') return '남성';
        };
        data.genderCountList.forEach((item) => {
            genderData.push([translateGender(item.gender), item.count]);
        });
        const genderSheet = XLSX.utils.aoa_to_sheet(genderData);
        applyHeaderStyle(genderSheet, genderData[0].length, headerStyle);
        applyDataStyle(genderSheet, 1, genderData.length - 1, genderData[0].length, dataStyle);
        XLSX.utils.book_append_sheet(workbook, genderSheet, '성별 통계');

        // 연령 통계 시트
        const ageData = [['연령대', '응답자 수']];
        data.ageCountList.forEach((item) => {
            ageData.push([item.age, item.count]);
        });
        const ageSheet = XLSX.utils.aoa_to_sheet(ageData);
        applyHeaderStyle(ageSheet, ageData[0].length, headerStyle);
        applyDataStyle(ageSheet, 1, ageData.length - 1, ageData[0].length, dataStyle);
        XLSX.utils.book_append_sheet(workbook, ageSheet, '연령 통계');

        // 질문 및 답변 시트
        const questionData = [];
        const mergeRanges = [];

        questionData.push(['질문유형', '질문', '보기', '응답', '응답자수']);
        data.questionList.forEach((question) => {
            const startRow = questionData.length;
            const questionType =
                question.questionType === 'OBJ_SINGLE' ? '객관식(단일선택)'
                    : question.questionType === 'OBJ_MULTI' ? '객관식(다중선택)'
                        : '주관식';

            // 객관식 질문 처리
            if (question.questionType === 'OBJ_SINGLE' || question.questionType === 'OBJ_MULTI') {
                question.selectionList.forEach((selection, selectionIndex) => {
                    const isEtcOption = selection.etc;
                    if (isEtcOption && selection.etcAnswer.length > 0) {
                        const etcStartRow = questionData.length;
                        selection.etcAnswer.forEach((etcAnswer, etcIndex) => {
                            questionData.push([
                                etcIndex === 0 && selectionIndex === 0 ? questionType : '',
                                etcIndex === 0 && selectionIndex === 0 ? question.body : '',
                                selection.body,
                                etcAnswer,
                                selection.responseCount,
                            ]);
                        });
                        const etcEndRow = questionData.length - 1;

                        // 병합 범위 추가
                        mergeRanges.push({ s: { r: etcStartRow, c: 2 }, e: { r: etcEndRow, c: 2 } }); // "보기" 병합
                        mergeRanges.push({ s: { r: etcStartRow, c: 4 }, e: { r: etcEndRow, c: 4 } }); // "응답자수" 병합
                    } else {
                        questionData.push([
                            selectionIndex === 0 ? questionType : '',
                            selectionIndex === 0 ? question.body : '',
                            selection.body,
                            '',
                            selection.responseCount,
                        ]);
                    }
                });
            }

            // 주관식 질문 처리
            if (question.questionType === 'SUBJECTIVE') {
                const subjStart = questionData.length;
                if (question.subjAnswerList.length > 0) {
                    question.subjAnswerList.forEach((answer, answerIndex) => {
                        questionData.push([
                            answerIndex === 0 ? questionType : '',
                            answerIndex === 0 ? question.body : '',
                            '',
                            answer,
                            question.subjAnswerList.length,
                        ]);
                    });
                } else {
                    questionData.push([
                        questionType,
                        question.body,
                        '',
                        '',
                        0,
                    ]);
                }
                const subjEnd = questionData.length - 1;
                mergeRanges.push({ s: { r: subjStart, c: 4 }, e: { r: subjEnd, c: 4 } });
            }
            const endRow = questionData.length - 1; // 현재 질문 종료 행 번호

            mergeRanges.push({ s: { r: startRow, c: 0 }, e: { r: endRow, c: 0 } }); // 질문유형 병합
            mergeRanges.push({ s: { r: startRow, c: 1 }, e: { r: endRow, c: 1 } }); // 질문 병합
        });

        const questionSheet = XLSX.utils.aoa_to_sheet(questionData);
        questionSheet['!merges'] = mergeRanges;
        questionSheet['!cols'] = [
            { wch: 15 },
            { wch: 40 },
            { wch: 25 },
            { wch: 25 },
            { wch: 15 }
        ];
        applyHeaderStyle(questionSheet, questionData[0].length, headerStyle);
        applyDataStyle(questionSheet, 1, questionData.length - 1, questionData[0].length, dataStyle);
        XLSX.utils.book_append_sheet(workbook, questionSheet, '질문 및 답변');

        // 파일 다운로드
        const fileName = `${data.title}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    } catch (error) {
        console.error('엑셀 다운로드 실패:', error);
        showDialog(dialogs.value.showDefaultDialog, "다운로드 중 오류가 발생했습니다.");
    }
}

// 헤더 스타일 적용 함수
const applyHeaderStyle = (sheet, headerRowLength, headerStyle) => {
    for (let col = 0; col < headerRowLength; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (sheet[cellAddress]) {
            sheet[cellAddress].s = headerStyle;
        }
    }
}

// 데이터 스타일 적용 함수
const applyDataStyle = (sheet, dataStartRow, dataEndRow, dataColumnLength, dataStyle) => {
    for (let row = dataStartRow; row <= dataEndRow; row++) {
        for (let col = 0; col < dataColumnLength; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (sheet[cellAddress]) {
                sheet[cellAddress].s = dataStyle;
            }
        }
    }
}

const goBack = () => {
    if (window.history.length > 1) {
        router.back(); // 히스토리가 있으면 뒤로가기
    } else {
        router.replace('/'); // 히스토리가 없으면 홈으로 이동
    }
}

// YYYY.MM.DD 형식으로 변환하는 함수
const formatDateToYMD = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
}

// 설문 기간 포맷 함수
const formatPeriod = (startDate, endDate) => {
    return `${formatDateToYMD(startDate)} - ${formatDateToYMD(endDate)}`;
}
</script>

<style scoped>
.root-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.delete-btn {
    width: 56px;
    height: 32px;
    border-radius: 8px;
    background-color: var(--accent);
    font-size: 0.8125rem;
    color: white;
    margin: 0 24px 0 auto;
}

.v-list-item-title {
    font-size: 0.875rem;
}

.deleteTitle {
    color: #F77D7D !important;
}

.survey-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    padding: 0 24px;
    margin-top: 68px;
    max-width: 800px;
}

.header-container {
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
    word-break: break-all;
    white-space: pre-wrap;
}

.description {
    font-size: 1rem;
    color: #868686;
    margin: 12px 16px 0px;
    font-weight: bold;
    word-break: break-all;
    white-space: pre-wrap;
}

.period {
    font-size: 0.875rem;
    color: #757575;
    margin: 32px 12px 0 12px;
    padding: 0 4px;
    height: 32px;
    font-weight: bold;
    font-size: 0.8175rem;
    color: #757575;
}

.result-info {
    width: 100%;
    padding: 12px;
    padding-bottom: 0px;
    display: flex;
    justify-content: space-between;
}

.total-response {
    font-size: 1rem;
    font-weight: bold;
    color: #464748;
}

.icon-total {
    width: 20px;
    height: 20px;
    position: relative;
    top: 4px;
}

.download {
    width: 20px;
}

.result-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #FAF8F8;
    border: solid 1px #EFF0F6;
    border-radius: 16px;
    box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.15);
    margin-bottom: 16px;
    padding: 20px 16px 0px 16px;
}

.question-container.last-item {
    margin-bottom : 4px;
}

.text {
    color: #2C2B2B;
    font-weight: bold;
    font-size: 1rem;
    padding-left: 4px;
}
</style>