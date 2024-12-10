<template>
    <div class="root-container">
        <header class="toolbar">
            <img class="back" src="@/assets/images/icon_arrow_left.svg" alt="back"
            @click="stepBack">
            <button class="submit-btn" @click="showDialog(dialogs.showSaveDialog, '수정하시겠습니까?')" v-ripple>수정</button>
        </header>

        <div class="survey-container">
            <div class="survey-title-section">
                <div class="input-section" :class="{ 'title-error': titleError }">
                    <input type="text" name="survey-title" class="survey-title" v-model="surveyTitle"
                        :placeholder="titleError ? '(제목 없음)' : '설문조사 제목'" maxlength="255" @focus="titleError = false" />
                </div>

                <div class="input-section">
                    <input type="text" name="survey-description" class="survey-description" v-model="surveyDescription"
                        placeholder="설문조사 설명" maxlength="512">
                </div>

                <div class="select-deadline-section">
                    <div class="deadline">설문 기간</div>

                    <div class="datetime-container" @click="showDatePickerDialog = true; dateError = false" :class="{ 'date-error': dateError }">
                        <span class="datetime-text"
                            v-html="date === null && time === null ? (dateError ? '마감 기한을 설정해주세요.' : '미설정') : ` ~&nbsp;${dayjs(date).format('YYYY.MM.DD')}&nbsp;&nbsp;${time}`"></span>
                        <img src="@/assets/images/icon_calendar3.svg" class="datetime-icon" alt="calendar icon" />
                    </div>

                </div>
            </div>

            <div>
                <transition-group name="survey-delete" tag="div" class="survey-items-wrapper">
                    <div class="survey-item-container" v-for="(com, index) in totalComponent" :key="com.id">
                        <update-survey-item ref="surveyItems" @delete-item="removeComponent(com.id)"
                            :is-single="totalComponent.length === 1"
                            :item-number="index + 1"
                            :questionList="totalComponent[index].data"/>
                    </div>
                </transition-group>
            </div>
        </div>

        <div class="create-btn-container">
            <div class="create-btn-section" @click="addComponent" v-ripple>
                <img class="add-icon" src="@/assets/images/icon_add.svg" alt="add icon" />
                <div class="add-text">질문 추가하기</div>
            </div>
        </div>

        <v-dialog v-model="showDatePickerDialog" max-width="400" persistent>
            <v-card class="dialog-background">
                <div class="dialog-container">
                    <div class="dialog-title">종료 날짜 설정</div>

                    <v-menu v-model="isDateMenuOpen" :close-on-content-click="false" location="bottom center"
                        :offset="5">
                        <template v-slot:activator="{ props }">
                            <v-card class="dialog-item" v-bind="props" :class="{ 'error': isDateError }">
                                <div class="dialog-item-container">
                                    <img src="@/assets/images/icon_calendar2.svg" class="dialog-item-icon"
                                        alt="calendar icon" />
                                    <div class="dialog-item-text" :class="{ 'selected': selectedDate }"
                                        v-if="selectedDate">
                                        {{ dayjs(selectedDate).format('YYYY.MM.DD') }}
                                    </div>
                                    <div class="dialog-item-text" v-else>날짜 선택</div>
                                    <img src="@/assets/images/icon_x.svg" alt="delete icon" class="dialog-item-icon"
                                        :class="{ 'hidden': !selectedDate }"
                                        @click.stop="selectedDate = null; isDateMenuOpen = false; isTimeBeforeNowError = false" />
                                </div>
                            </v-card>
                        </template>

                        <template v-slot:default>
                            <v-card>
                                <v-date-picker hide-header v-model="selectedDate" width="100%" min-width="256"
                                    max-width="336" @update:model-value="isDateMenuOpen = false" color="#1088E3"
                                    :min="dayjs(new Date()).format('YYYY-MM-DD')"></v-date-picker>
                            </v-card>
                        </template>
                    </v-menu>

                    <v-menu v-model="isTimeMenuOpen" :close-on-content-click="false" location="bottom center"
                        :offset="5" @update:model-value="onTimePickerClose">
                        <template v-slot:activator="{ props }">
                            <v-card class="dialog-item" v-bind="props" :class="{ 'error': isTimeError }">
                                <div class="dialog-item-container">
                                    <img src="@/assets/images/icon_clock.svg" class="dialog-item-icon"
                                        alt="calendar icon" />
                                    <div class="dialog-item-text" :class="{ 'selected': selectedTime }"
                                        v-if="selectedTime">
                                        {{ selectedTime }}
                                    </div>
                                    <div class="dialog-item-text" v-else>시간 선택</div>
                                    <img src="@/assets/images/icon_x.svg" alt="delete icon" class="dialog-item-icon"
                                        :class="{ 'hidden': !selectedTime }"
                                        @click.stop="selectedTime = null; selectedAmPm = '오전'; selectedHour = 12; selectedMinute = 0; isTimeMenuOpen = false; isTimeBeforeNowError = false" />
                                </div>
                            </v-card>
                        </template>

                        <template v-slot:default>
                            <v-card>
                                <div class="picker-container">
                                    <div class="highlight"></div>
                                    <time-picker-component :items="ampmList" v-model:value="selectedAmPm"
                                        :initial-value="selectedAmPm" />
                                    <time-picker-component :items="hourList" v-model:value="selectedHour"
                                        :initial-value="selectedHour" />
                                    <img src="@/assets/images/icon_colon.svg" alt=":" class="time-separator" />
                                    <time-picker-component :items="minuteList" v-model:value="selectedMinute"
                                        :initial-value="selectedMinute" />
                                </div>
                            </v-card>
                        </template>
                    </v-menu>

                    <div class="error-text" v-if="isDateError || isTimeError">*날짜와 시간을 모두 선택해주세요.</div>
                    <div class="error-text" v-if="isTimeBeforeNowError">*종료 시간은 현재보다 이전으로 설정할 수 없습니다.</div>

                    <div class="dialog-actions">
                        <v-btn class="dialog-cancel-btn" @click="cancel">취소</v-btn>
                        <v-btn class="dialog-confirm-btn" color="#7796E8" @click="confirm">확인</v-btn>
                    </div>
                </div>
            </v-card>
        </v-dialog>

        <default-dialog v-model="dialogs.showDefaultDialog.isVisible" :message="dialogs.showDefaultDialog.message"
        @confirm="dialogs.showDefaultDialog.isVisible = false" />
        
        <confirm-dialog v-model="dialogs.showSaveDialog.isVisible" :message="dialogs.showSaveDialog.message"
        @confirm="handleSubmit" />

        <default-dialog v-model="dialogs.showSuccessDialog.isVisible" :message="dialogs.showSuccessDialog.message"
        @confirm="redirectionToMySurvey" :isPersistent="true"/>
    </div>
</template>

<script setup>
import DefaultDialog from '../common/DefaultDialog.vue';
import ConfirmDialog from '../common/ConfirmDialog.vue';
import { useRouter } from 'vue-router'
import { ref, nextTick, watch, onMounted, defineProps } from 'vue';
import axios from 'axios';
import { decrypt, encrypt } from '@/utils/crypto';

import dayjs from 'dayjs'

import { checkEmptyValues } from '@/utils/checkEmptyValues';

import UpdateSurveyItem from './update-survey-item/UpdateSurveyItem.vue';
import TimePickerComponent from './update-survey-item/component/TimePickerComponent.vue';
import { useSaveStatusStore } from '@/stores/saveStatusStore';

const saveStatusStore = useSaveStatusStore();

const props = defineProps({
    id: String,
})

const baseUrl = process.env.VUE_APP_API_URL;
const router = useRouter();

const totalComponent = ref([]);
const surveyItems = ref([]);
const surveyId = ref("");
const createDate = ref("");

const surveyTitle = ref("");
const titleError = ref(false);

const surveyDescription = ref("")

const dateError = ref(false);
const isDateError = ref(false);
const isTimeError = ref(false);
const isTimeBeforeNowError = ref(false);

const showSuccessDialog = ref(false);
const showDatePickerDialog = ref(false);
const isDateMenuOpen = ref(false);
const isTimeMenuOpen = ref(false);

const dialogs = ref({
    showDefaultDialog : {
        isVisible : false,
        message : "",
    },
    showSuccessDialog : {
        isVisible : false,
        message : "",
    },
    showSaveDialog : {
        isVisible : false,
        message : "",
    },
})

const showDialog = (dialog, message) => {
    dialog.message = message
    dialog.isVisible = true
}

const ampmList = ref(['오전', '오후']);
const hourList = ref(['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']);
const minuteList = ref(['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']);

const selectedDate = ref(null);
const selectedTime = ref(null);
const selectedAmPm = ref('오전');
const selectedHour = ref('12');
const selectedMinute = ref('00');

const date = ref(null);
const time = ref(null);

let apiResponse = null;

onMounted(() => {
    surveyId.value = decrypt(props.id);

    axios.get(`${baseUrl}/survey/inquiry/detail/${surveyId.value}`, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
        if (response.status === 200) {
            apiResponse = response.data;
            createDate.value = apiResponse.createDate;

            surveyTitle.value = apiResponse.title;
            surveyDescription.value = apiResponse.description;

            for(let i=0; i<apiResponse.questionList.length; i++){
                totalComponent.value.push({id : i, data:apiResponse.questionList[i]})
            }

            if (!apiResponse.expireDate) return;

            const expireDate = dayjs(apiResponse.expireDate);
            date.value = new Date(apiResponse.expireDate);
            const hours = expireDate.hour();
            const ampm = hours >= 12 ? '오후' : '오전';
            const hourIn12 = hours % 12 === 0 ? 12 : hours % 12;
            time.value = `${ampm} ${String(hourIn12).padStart(2, '0')}:${String(expireDate.minute()).padStart(2, '0')}`;
        }
    })
    .catch(error => {
        console.error(error);
    })
})

const cancel = () => {
    showDatePickerDialog.value = false;

    if (selectedDate.value !== null) {
        selectedDate.value = null;
    }

    if (selectedTime.value !== null) {
        selectedTime.value = null;
        selectedAmPm.value = '오전';
        selectedHour.value = '12';
        selectedMinute.value = '00';
    }
};

const confirm = () => {
    if (selectedDate.value === null) {
        isDateError.value = true;
    }

    if (selectedTime.value === null) {
        isTimeError.value = true;
    }

    if (selectedDate.value !== null && selectedTime.value !== null) {
        const [ampm, timeString] = selectedTime.value.split(' ');
        const [hour, minute] = timeString.split(':');
        let hours24 = parseInt(hour);

        if (ampm === '오후' && hours24 !== 12) {
            hours24 += 12;
        } else if (ampm === '오전' && hours24 === 12) {
            hours24 = 0;
        }

        const selectedDateTime = dayjs(selectedDate.value).hour(hours24).minute(parseInt(minute));
        const now = dayjs();

        if (selectedDateTime.isBefore(now)) {
            isTimeBeforeNowError.value = true;
            return;
        } else {
            isTimeBeforeNowError.value = false;
        }
    }

    if (selectedDate.value !== null && selectedTime.value !== null) {
        date.value = selectedDate.value;
        time.value = selectedTime.value;

        showDatePickerDialog.value = false;
    }
};

const onTimePickerClose = (value) => {
    if (!value) {
        selectedTime.value = `${selectedAmPm.value} ${String(selectedHour.value).padStart(2, '0')}:${String(selectedMinute.value).padStart(2, '0')}`;
    }
};

watch(showDatePickerDialog, (show) => {
    if (show) {
        if (date.value) {
            selectedDate.value = date.value;
        }

        if (time.value) {
            selectedTime.value = time.value;

            const [ampm, timeValue] = time.value.split(' ');
            const [hour, minute] = timeValue.split(':');

            selectedAmPm.value = ampm;
            selectedHour.value = hour;
            selectedMinute.value = minute;
        }
    } else {
        isTimeBeforeNowError.value = false;
        isDateError.value = false;
        isTimeError.value = false;
    }
});

watch(isDateMenuOpen, (isOpen) => {
    if (isOpen) {
        isDateError.value = false;

        isTimeBeforeNowError.value = false;
    }
});

watch(isTimeMenuOpen, (isOpen) => {
    if (isOpen) {
        isTimeError.value = false;
        isTimeBeforeNowError.value = false;
    }
});

const scrollToBottom = () => {
    nextTick(() => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    });
};

const addComponent = () => {
    const lastIndex = totalComponent.value.length > 0
        ? totalComponent.value[totalComponent.value.length - 1].id
        : -1;

    // 새로운 빈 질문 객체 생성
    const newQuestionData = {
        body: "",
        questionType: "OBJ_SINGLE", // 기본값으로 객관식(단일) 설정
        selectionList: [
            {
                body: "",
                isEtc: false
            },
        ]
    };

    const newObj = { 
        id: lastIndex + 1,
        data: newQuestionData  // 새로운 질문 데이터 추가
    }

    totalComponent.value.push(newObj);

    nextTick(() => {
        surveyItems.value = surveyItems.value.slice();
        scrollToBottom();
    });
}

const removeComponent = (id) => {
    if (totalComponent.value.length === 1)
        return;
    totalComponent.value = totalComponent.value.filter(item => item.id !== id);
};

const stepBack = () => {
    router.back();
}

const parseTime = (timeStr) => {
    if (!timeStr) return null;
    const [ampm, time] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);

    if (ampm === '오후' && hour !== 12) {
        hour += 12;
    } else if (ampm === '오전' && hour === 12) {
        hour = 0;
    }

    return `${hour.toString().padStart(2, '0')}:${minutes}:00`;
}

const handleSubmit = () => {
    // survey-item의 모든 값을 가져오기
    const title = surveyTitle.value.trim();
    const description = surveyDescription.value.trim();
    let valid = true;

    if (!title) {
        titleError.value = true
        valid = false;
        dialogs.value.showSaveDialog.isVisible = false;
    }

    if (!date.value || !time.value) {
        dateError.value = true
        valid = false;
        dialogs.value.showSaveDialog.isVisible = false;
    }

    const values = surveyItems.value.map((item) => item.getValue()); // getValue()는 각 survey-item에서 필요한 값을 반환하는 메서드

    const jsonData = { surveyId: surveyId.value, title: title,
                        description: description, questionList: values,
                        createDate : createDate.value }

    const emptyPath = checkEmptyValues(jsonData);

    const isExistQuestionList = emptyPath.filter((path) => path.includes("questionList"))

    /**
     * 비어있는 경로가 questionList 안에서 발견되는 것이 아니면 통과
     * 제목이나 날짜 입력이 안됐으면,
     * 질문 항목들 중에 빈 값이 있나 확인하고 스타일 적용 및 경고창 준 뒤에 바로 리턴
     * jsonData는 보내지 않음
     * 
     */
    if (isExistQuestionList.length > 0 || !valid) {
        dialogs.value.showSaveDialog.isVisible = false;
        showDialog(dialogs.value.showDefaultDialog, '입력되지 않은 항목이 있습니다.');
        return;
    } else {
        dialogs.value.showSaveDialog.isVisible = false;

        const dateFormatted = dayjs(date.value).format('YYYY-MM-DD');
        const timeFormatted = parseTime(time.value);

        const dateTime = `${dateFormatted}T${timeFormatted}`;

        const currentDateTime = dayjs();
        const selectedDateTime = dayjs(dateTime);

        if (selectedDateTime.isBefore(currentDateTime)) {
            dateError.value = true;
            showDialog(dialogs.value.showDefaultDialog, '종료 시간은 현재보다 이전으로 설정할 수 없습니다.');
            return;
        }

        jsonData.expireDate = dateTime;

        axios.post(`${baseUrl}/survey/manage/modify`, JSON.stringify(jsonData), {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(() => {
            saveStatusStore.setSaved();
            showDialog(dialogs.value.showSuccessDialog, "설문조사가 수정되었습니다.");
        })
        .catch((error) => {
            if(error.response.status === 400){
                showDialog(dialogs.value.showDefaultDialog, error.response.data.errorMessage);
            } else {
                showDialog(dialogs.value.showDefaultDialog, "설문조사 수정 중 오류가 발생했습니다.");
            }
        });
    }
};

const redirectionToMySurvey = () => {
    showSuccessDialog.value = false;
    router.go(-1);
    setTimeout(() => {
            router.replace({
            name: "SurveyResult",
            params: {id : encrypt(surveyId.value)}
        });
    }, 100);
}
</script>

<style scoped>
.root-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.toolbar {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 64px;
    background-color: #fff;
    z-index: 50;
}

.back {
    width: 20px;
    height: 20px;
    margin-left: 24px;
    cursor: pointer;
}

.submit-btn {
    width: 56px;
    height: 32px;
    border-radius: 8px;
    background-color: var(--primary);
    font-size: 0.8125rem;
    color: white;
    margin: 0 24px 0 auto;
}

.survey-item-container {
    width: 100%;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    background-color: #FAF8F8;
    border: solid 1px #eff0f6;
    border-radius: 16px;
    box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.15);
    padding: 20px 16px 0px 16px;
    margin-bottom: 16px;
}

.survey-title-section {
    background-color: #F8FBFF;
    border: solid 1px #EFF0F6;
    box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.15);
    border-radius: 15px;
    margin-bottom: 20px;
    padding: 8px 8px;
    box-sizing: border-box;
}

.survey-title {
    margin-top: 12px;
    border: none;
    font-size: 1.25rem;
    font-weight: bold;
    color: #464748;
}

.survey-title::placeholder {
    color: #787a7c;
}

.survey-title:focus::placeholder {
    color: transparent;
}

.survey-description {
    margin-top: 12px;
    font-size: 1rem;
    color: #868686;
}

.survey-description::placeholder {
    color: #C1C3C5;
}

.survey-description:focus::placeholder {
    color: transparent;
}

.select-deadline-section {
    margin: 32px 12px 0 12px;
    padding: 0 4px;
    height: 32px;
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 0.8175rem;
    color: #757575;
}

.datetime-container {
    display: flex;
    cursor: pointer;
    margin-left: 8px;
}

.datetime-text {
    color: #ABABB6;
    font-size: 0.8175rem;
}

.datetime-icon {
    width: 20px;
    height: 20px;
    margin-left: 8px;
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

.delete-btn.disabled {
    cursor: not-allowed;
}

.isVisible {
    visibility: hidden;
}

.input-section {
    width: 100%;
    display: flex;
    justify-content: start;
}

input {
    width: 100%;
    margin: 0 16px;
    outline: none;
    transition: all 0.3s;
}

.title-error .survey-title::placeholder {
    color: #F77D7D;
}

.error {
    border-radius: 12px;
    box-shadow: 0 0 0 2px #F77D7D;
}

.date-error {
    color : #F77D7D;
}

.create-btn-container {
    width: 100%;
    max-width: 800px;
    padding: 0 24px;
    margin: 0 0 160px 0;
    cursor: pointer;
}

.create-btn-section {
    position: relative;
    background-color: #fff;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: solid 1px #EFF0F6;
    border-radius: 15px;
    box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.15);
    padding: 0 24px;
}

.add-icon {
    width: 24px;
    height: 24px;
    position: absolute;
    left: 24px;
}

.add-text {
    font-weight: bold;
    font-size: 1rem;
    color: #8C8C8C;
}

.v-card {
    padding: 0;
    border-radius: 16px !important;
}

.picker-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 120px;
    padding: 4px 24px;
}

.scroll-container {
    display: flex;
    position: relative;
    height: 120px;
    overflow-y: auto;
    scrollbar-width: none;
}

.time-picker-container {
    display: flex;
    position: relative;
    height: 120px;
    overflow-y: auto;
    scrollbar-width: none;
}

.time-separator {
    width: 20px;
    height: 20px;
    z-index: 1000;
}

.highlight {
    position: absolute;
    top: 50%;
    left: 20px;
    right: 20px;
    width: calc(100% - 40px);
    height: 40px;
    background-color: #F3F3F3;
    border-radius: 8px;
    transform: translateY(-50%);
}

.dialog-background {
    background-color: #FAF8F8;
    border: 1px solid #EFF0F6;
}

.dialog-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 32px 20px 32px;
}

.dialog-title {
    font-size: 1rem;
    font-weight: bold;
    color: #757576;
    margin-bottom: 16px;
}

.dialog-item {
    width: 100%;
    height: 60px;
    margin-bottom: 4px;
    background: #FFFFFF;
    border: 1px solid #EFF0F7;
    box-shadow: 0px 5px 16px rgba(8, 15, 52, 0.06);
}

.dialog-item-container {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0 16px;
}

.dialog-item-icon {
    width: 20px;
    height: 20px;
    z-index: 1000;
}

.hidden {
    visibility: hidden;
}

.dialog-item-text {
    font-size: 1rem;
    font-weight: bold;
    color: #ABABB6;
    margin: auto;
}

.selected {
    color: #757576;
}

.error-text {
    font-size: 0.875rem;
    line-height: 20px;
    color: #F77D7D;
}

.dialog-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    margin: 16px 8px 0 8px;
}

.v-dialog .v-btn {
    height: 44px;
    flex-grow: 1;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 16px;
    border: 1px solid #EFF0F7;
    box-shadow: 0px 5px 16px rgba(8, 15, 52, 0.06);
}

.dialog-cancel-btn {
    background: #FFFFFF;
    color: #757576;
}

.dialog-confirm-btn {
    color: #FFFFFF;
}

.error {
    border-width: 2px;
    border-color: #F77D7D;
}

.v-date-picker {
    margin: 0 auto;
}

/* 년, 월 */
.v-date-picker :deep(.v-date-picker-controls .v-btn__content) {
    font-size: 0.875rem;
}

/* 요일 */
.v-date-picker :deep(.v-date-picker-month__day) {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
    margin-bottom: 4px;
}

/* 날짜 */
.v-date-picker :deep(.v-date-picker-month__day button) {
    width: 32px;
    height: 32px;
}

.dialog-message {
    margin: 32px 0 16px 0;
    font-size: 1.125rem;
    font-weight: bold;
    color: #757576;
}

.dialog-error-message {
    margin: 32px 0 0 0;
    font-size: 1.125rem;
    font-weight: bold;
    color: #757576;
}

.v-card-actions {
    padding: 20px;
}

.dialog-close-btn {
    width: 100%;
    margin: 0;
    color: #FFFFFF !important;
    background-color: var(--primary);
    border-radius: 16px;
    height: 48px;
    font-size: 0.875rem;
}

.survey-items-wrapper {
    width: 100%;
}

.survey-delete-move {
    transition: transform 0.2s ease;
}

.survey-delete-enter-active {
    transition: all 0.2s ease;
}

.survey-delete-leave-active {
    transition: all 0.2s ease;
    animation: slide-fade-out 0.2s ease forwards;
}

.survey-delete-enter-from,
.survey-delete-leave-to {
    opacity: 0;
}

@keyframes slide-fade-out {
    0% {
        opacity: 1;
        transform: translateX(0);
        max-height: 500px;
        margin-bottom: 16px;
    }

    100% {
        opacity: 0;
        transform: translateX(-30px);
        max-height: 0;
        margin-bottom: -2px;
    }
}

/* Rest of the styles remain the same */
</style>