<template>
    <div class="root-container">
        <header class="toolbar">
            <img class="back" src="@/assets/images/icon_arrow_left.svg" alt="back" @click="stepBack">
            <button class="submit-btn" @click="showDialog(dialogs.confirmDialog, '저장하시겠습니까?', false, handleSubmit)" v-ripple>저장</button>
        </header>

        <div class="survey-container">
            <div class="survey-title-section">
                <div class="input-section">
                        <v-textarea
                            v-model="surveyTitle"
                            class="survey-title"
                            rows="1"
                            auto-grow
                            variant="none"
                            color="#464748"
                            @focus="titleError = false; titlePlaceholderVisible = false"
                            @blur="titlePlaceholderVisible = true"
                            maxlength="255"
                            hide-details="false"
                            :class="{ 'title-error': titleError }"
                            :placeholder="titlePlaceholderVisible ? (titleError ? '(제목 없음)' : '설문조사 제목') : ''"
                        />
                </div>

                <div class="input-section">
                    <v-textarea
                            v-model="surveyDescription"
                            class="survey-description" 
                            rows="1"
                            auto-grow
                            variant="none"
                            color="#C1C3C5"
                            @focus="descriptionPlaceholderVisible = false"
                            @blur="descriptionPlaceholderVisible = true"
                            maxlength="512"
                            hide-details="false"
                            :placeholder="descriptionPlaceholderVisible ? '설문조사 설명' : ''"
                        />
                </div>
                <div class="select-deadline-section">
                    <div class="deadline">설문 기간</div>

                    <div class="datetime-container" @click="showDatePickerDialog = true; dateError = false"
                        :class="{ 'date-error': dateError }">
                        <span class="datetime-text" v-html="date === null && time === null ?
                            (dateError ? '마감 기한을 설정해주세요.' : '미설정')
                            : ` ~&nbsp;${dayjs(date).format('YYYY.MM.DD')}&nbsp;&nbsp;${time}`"></span>
                        <img src="@/assets/images/icon_calendar3.svg" class="datetime-icon" alt="calendar icon" />
                    </div>

                </div>
            </div>

            <div>
                <transition-group name="survey-delete" tag="div" class="survey-items-wrapper">
                    <div class="survey-item-container" v-for="(com, index) in totalComponent" :key="com.id"
                        :class="{ 'date-error': dateError }">
                        <survey-item ref="surveyItems" @delete-item="removeComponent(com.id)"
                            :is-single="totalComponent.length === 1" :item-number="index + 1" />
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

        <v-dialog v-model="showDatePickerDialog" max-width="400" persistent min-width="300px">
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
                                    :min="dayjs().format('YYYY-MM-DD')"></v-date-picker>
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
                                <div class="time-picker-container">
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
                                    <v-btn class="time-picker-btn" @click="isTimeMenuOpen = false; onTimePickerClose(false)">
                                        확인
                                    </v-btn>
                                </div>
                            </v-card>
                        </template>
                    </v-menu>

                    <div class="error-text" v-if="isDateError || isTimeError">*날짜와 시간을 모두 선택해주세요.</div>
                    <div class="error-text" v-if="isTimeBeforeNowError">*종료 시간은 현재보다 이전으로 설정할 수 없습니다.</div>

                    <div class="dialog-actions">
                        <v-btn class="dialog-cancel-btn" @click="datePickerCancel">취소</v-btn>
                        <v-btn class="dialog-confirm-btn" color="#7796E8" @click="datePickerConfirm">확인</v-btn>
                    </div>
                </div>
            </v-card>
        </v-dialog>

        <default-dialog v-model="dialogs.defaultDialog.isVisible" :message="dialogs.defaultDialog.message"
            :isPersistent="dialogs.defaultDialog.isPersistent" @confirm="defaultDialogConfirm" />

        <confirm-dialog v-model="dialogs.confirmDialog.isVisible" :message="dialogs.confirmDialog.message"
            :isPersistent="dialogs.confirmDialog.isPersistent" @confirm="handleSubmit" />
    </div>
</template>

<script setup>
/**
 * @fileoverview 설문 생성 컴포넌트
 * @author 김원재 (kimwonjae@mcnc.co.kr)
 * @date 2024-11-08
 * @lastModified 2024-12-19
 * @description 설문 생성에 대한 화면 구현.
 */
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { ref, nextTick, watch, onMounted, onUnmounted } from 'vue';
import axios from '@/utils/axiosInstance';
import dayjs from 'dayjs'
import { checkEmptyValues } from '@/utils/checkEmptyValues';
import SurveyItem from './component/SurveyItem.vue';
import TimePickerComponent from './component/TimePickerComponent.vue';
import { useSaveStatusStore } from '@/stores/saveStatusStore';

const saveStore = useSaveStatusStore();
const router = useRouter();
const isSessionValid = ref(true);
const totalComponent = ref([{ id: 0 },]);           // 설문 항목들을 담는 배열
const surveyItems = ref([]);                        // 각 survey-item 컴포넌트를 참조하여 해당 컴포넌트의 값들을 담는 변수
const surveyTitle = ref("");                        
const titlePlaceholderVisible = ref(true);
const titleError = ref(false);
const surveyDescription = ref("");
const descriptionPlaceholderVisible = ref(true);
const dateError = ref(false);
const isDateError = ref(false);
const isTimeError = ref(false);
const isTimeBeforeNowError = ref(false);
const showDatePickerDialog = ref(false);
const isDateMenuOpen = ref(false);
const isTimeMenuOpen = ref(false);
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

// showDialog 함수 호출 시 컴포넌트의 설정값을 담는 다이얼로그 바인딩 변수
const dialogs = ref({
    defaultDialog: {
        isVisible: false,       // 화면 상에 보이는지
        message: "",            // 다이얼로그 메세지
        isPersistent: false,    // 다이얼로그 외부 클릭 무시(true)
        callback: null          // 다이얼로그 확인 버튼을 누를 때 호출할 콜백함수
    },
    confirmDialog: {
        isVisible: false,
        message: "",
        isPersistent: false,
        callback: null
    }
})

/**
 * dialogs에 정의된 다이얼로그 객체의 isVisible을 true로 전환
 * 메세지와 콜백함수를 설정하는 함수
 * @author 김원재
 * @param dialog        // 다이얼로그 종류
 * @param message       // 다이얼로그 메세지
 * @param isPersistent  // 다이얼로그 외부 클릭 무시
 * @param callback      // 확인 버튼 클릭 후 콜백함수 호출
 */
const showDialog = (dialog, message, isPersistent = false, callback = null) => {
    dialog.message = message;
    dialog.isPersistent = isPersistent;
    dialog.callback = callback;
    dialog.isVisible = true
}

/**
 * defaluit-dialog에서 확인 버튼을 눌렀을때,
 * 콜백함수가 있으면 콜백을 실행하고 화면 상에서 다이얼로그 제거
 * @author 김원재
 */
const defaultDialogConfirm = () => {
    if (dialogs.value.defaultDialog.callback) {
        dialogs.value.defaultDialog.callback();
    }

    dialogs.value.defaultDialog.isVisible = false;
}

/** 
 * 페이지 새로고침 혹은 종료 전에 경고 메시지를 표시
 * @author 김원재
 */
const handleBeforeUnload = (event) => {
  event.preventDefault();
  return '';
};

/**
 * 생성 창이 마운트 될 때, 새로고침에 대한 이벤트 리스닝,
 * 새로고침 -> 페이지를 새로고치겠냐는 경고창 띄우기 위한 목적
 * @author 김원재
 */
onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
})

/**
 * 생성 창이 언마운트 될 때, 새로고침에 대한 이벤트 제거
 * @author 김원재
 */
 onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
})

/**
 * 호출 실패 상태 코드에 따른 다이얼로그 반환
 * @author 김원재
 * @param error api 호출 실패 error 객체
 */
const handleError = (error) => {
    switch (error.status) {
        case 401: // 세션이 만료됨
            isSessionValid.value = false;
            showDialog(dialogs.value.defaultDialog, "세션이 만료되었습니다. 다시 로그인 해주세요.", true, goLogin);
            break;
        default: // 그 외
            if (error?.response?.data?.errorMessage)
                showDialog(dialogs.value.defaultDialog, error?.response?.data?.errorMessage, false, null);
            else
                showDialog(dialogs.value.defaultDialog, "설문조사 생성 중 오류가 발생했습니다.", false, null);
    }
};

/**
 * 설문 생성에서 라우터가 이동할 때 수행
 * @author 김원재
 */
onBeforeRouteLeave((to, from, next) => {
    // 세션이 만료됐으면 경고 메세지 출력하지 않음
    if(!isSessionValid.value){
        next();
        return;
    }

    // 설문을 생성하지 않았을 때
    if (!saveStore.isSaved) { 
        const confirmationMessage = '정말 나가시겠습니까? 변경사항이 저장되지 않을 수 있습니다.';
        if (window.confirm(confirmationMessage)) {
            next(); // 저장하지 않고 나갈 경우, 라우팅을 진행
        } else {
            next(false); // 이동을 취소
        }
    } else { // 설문이 생성된 경우, saveStore의 isSaved값을 초기화 후 이동
        saveStore.resetStatus();
        next();
    }
});

/**
 *  설문 마감 기간 설정 다이얼로그 닫기
 *  다이얼로그 내부에서 선택했던 날짜, 시간값이 있으면 초기화
 * @author 김원재
 */
const datePickerCancel = () => {
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

/**
 * 설문기간 설정 시 마감 기한의 유효성 검사
 * @author 김원재
 */
const datePickerConfirm = () => {
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

        date.value = selectedDate.value;
        time.value = selectedTime.value;

        showDatePickerDialog.value = false;
    }
};

/**
 * 설문 마감 기간 다이얼로그의 타임 피커를 닫을 때
 * selectedAmPm, selectedHour, selectedMinute 저장
 * @author 김원재
 * @param value isTimeMenuOpen 값의 변경에 따라 전달되는 값 : 메뉴가 열릴 때 -> true, 닫힐 때 -> false
 */
const onTimePickerClose = (value) => {
    if (!value) {
        selectedTime.value = `${selectedAmPm.value} ${String(selectedHour.value).padStart(2, '0')}:${String(selectedMinute.value).padStart(2, '0')}`;
    }
};

/**
 * 설문기간 설정 다이얼로그가 켜지거나 꺼질때
 * 기존에 설정된 date, time값이 있으면 해당 값으로 초기화
 * @author 김원재
 */
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

/**
 * 데이트피커를 열 때, 에러 전용 바인딩 클래스를 false로 전환
 * @author 김원재
 */
watch(isDateMenuOpen, (isOpen) => {
    if (isOpen) {
        isDateError.value = false;
        isTimeBeforeNowError.value = false;
    }
});

/**
 * 타임피커를 열 때, 에러 전용 바인딩 클래스를 false로 전환
 * @author 김원재
 */
watch(isTimeMenuOpen, (isOpen) => {
    if (isOpen) {
        isTimeError.value = false;
        isTimeBeforeNowError.value = false;
    }
});

/**
 * 설문 항목을 추가하는 함수
 * @author 김원재
 */
const addComponent = () => {
    const lastIndex = totalComponent.value.length > 0
        ? totalComponent.value[totalComponent.value.length - 1].id
        : -1;

    const newObj = { id: lastIndex + 1 }

    totalComponent.value.push(newObj);
    scrollToBottom();
}

/**
 * 설문 항목이 추가된만큼 스크롤 높이 조절
 * @author 김원재
 */
const scrollToBottom = () => {
    // nextTick으로 DOM 업데이트 후에 스크롤 이동
    nextTick(() => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    });
};

/**
 * 설문 항목을 삭제하는 함수
 * 해당 항목의 id를 추적하여 필터링
 * @author 김원재
 * @param id 삭제버튼을 클릭한 항목 id
 */
const removeComponent = (id) => {
    if (totalComponent.value.length === 1)
        return;
    totalComponent.value = totalComponent.value.filter(item => item.id !== id);
};

/**
 * 이전으로 돌아가는 함수
 * @author 김원재
 */
const stepBack = () => {
    router.back();
}

/**
 * 오후 10:00 -> 22:00:00
 * 서버에 전송하기 위한 시간 포맷 변환 함수
 * @author 김원재
 * @param timeStr 설문 만료시간 문자열
 */
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

/**
 * 세션 만료 시, 로그인 화면으로 보내는 함수
 * @author 김원재
 */
const goLogin = () => {
    dialogs.value.defaultDialog.isVisible = true;
    const currentPath = router.currentRoute.value.path;

    window.removeEventListener('beforeunload', handleBeforeUnload);
    
    router.replace({ path: '/login', query: { redirect: currentPath } })
}

/**
 * 설문 생성을 위해 항목의 값들을 json 형태로 만들어 API 요청
 * @author 김원재
 */
const handleSubmit = () => {
    const title = surveyTitle.value.trim();
    const description = surveyDescription.value.trim();
    let valid = true;

    if (!title) {
        titleError.value = true
        surveyTitle.value = "";
        valid = false;
        dialogs.value.confirmDialog.isVisible = false;
    }

    if (!date.value || !time.value) {
        dateError.value = true
        valid = false;
        dialogs.value.confirmDialog.isVisible = false;
    }

    /**
     * survey-item 컴포넌트에 참조를 걸어
     * 생성된 각 설문 항목에 대한 제목, 항목값 가져오는 함수
     * @author 김원재
     */
    const values = surveyItems.value.map((item) => item.getValue());
    const jsonData = { title: title, description: description, questionList: values }

    const emptyPath = checkEmptyValues(jsonData);
    const isExistQuestionList = emptyPath.filter((path) => path.includes("questionList"))

    /**
     * 비어있는 경로가 questionList 안에서 발견되는 것이 아니면 통과
     * 설문 항목들 중에 빈 값이 있나 확인하고 에러 클래스 적용 및 다이얼로그 반환
     * @author 김원재
     */
    if (isExistQuestionList.length > 0 || !valid) {
        dialogs.value.confirmDialog.isVisible = false;
        showDialog(dialogs.value.defaultDialog, '입력되지 않은 항목이 있습니다.', false, null);
        return;
    } else {
        dialogs.value.confirmDialog.isVisible = false;

        const dateFormatted = dayjs(date.value).format('YYYY-MM-DD');
        const timeFormatted = parseTime(time.value);

        const dateTime = `${dateFormatted}T${timeFormatted}`;

        const currentDateTime = dayjs();
        const selectedDateTime = dayjs(dateTime);

        if (selectedDateTime.isBefore(currentDateTime)) {
            dateError.value = true;
            showDialog(dialogs.value.defaultDialog, '종료 시간은 현재보다 이전으로 설정할 수 없습니다.', false, null);
            return;
        }

        jsonData.expireDate = dateTime;

        axios.post(`/survey/manage/create`, JSON.stringify(jsonData))
            .then(() => {
                saveStore.setSaved();
                showDialog(dialogs.value.defaultDialog, "설문이 성공적으로 생성되었습니다!", true, goMySurvey);
            })
            .catch((error) => {
                handleError(error);
            });
    }
};

/**
 * 생성 후 go(-1)의 url에 따라 replace
 * @author 김원재
 */
const goMySurvey = () => {
    dialogs.value.defaultDialog.isVisible = false;

    /**
     * 히스토리 중복 이슈로 인한
     * 히스토리 이전으로 이동 후 이동한 페이지에서 replace 수행
     */
    router.go(-1);
    setTimeout(() => {
        const currentPath = router.currentRoute.value.path;

        if (currentPath === '/') {
            router.replace({ name: 'Home' });
        } else if (currentPath === '/my') {
            router.replace({ name: 'My' });
        }
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
    top: 0;
    display: flex;
    align-items: center;
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
    border: none;
    width: 100%;
    outline: none;
    color: #000;
    font-weight: bold;
    resize: none; /* 사용자가 크기 조절 못하도록 */
}

.survey-title:deep(.v-field__input::placeholder) {
    font-size: 1.25rem;
    font-weight: bold;
    color: #B0B0B0;
}

:deep(.v-field) {
    font-size : 1.25rem;
    --v-disabled-opacity: 1 !important;
}

.title-error:deep(.v-field__input::placeholder) {
    color : #F77D7D;
}

:deep(.v-input--density-default),
:deep(.v-field--variant-outlined),
:deep(.v-input--density-default),
:deep(.v-field--single-line),
:deep(.v-input--density-default),
:deep(.v-field--no-label) {
    --v-input-padding-top: 8px;
    --v-input-padding-bottom: 0px;
    --v-field-padding-bottom: 8px;
}

:deep(.v-textarea) {
    --v-input-control-height: 40px;
}

.survey-description:deep(.v-field) {
    font-size : 1rem;
    font-weight : bold;
}

.survey-description:deep(.v-field__input::placeholder) {
    font-size: 1rem;
    font-weight: bold;
    color: #B0B0B0;
}

.survey-description {
    border: none;
    width: 100%;
    outline: none;
}

.select-deadline-section {
    margin: 24px 12px 0 12px;
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

.error {
    border-radius: 12px;
    box-shadow: 0 0 0 2px #F77D7D;
}

.date-error .datetime-text {
    color: #F77D7D;
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

.time-picker-container {
    display: flex;
    flex-direction: column;
}

.picker-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 12px 24px;
}

.time-picker-btn {
    height: 40px;
    margin: 0 24px 24px 24px;
    background-color: var(--primary);
    color: #FFFFFF !important;
    border-radius: 12px;
    font-size: 0.875rem;
    box-shadow: 0px 5px 16px rgba(8, 15, 52, 0.06);
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
</style>