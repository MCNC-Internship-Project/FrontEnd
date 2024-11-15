<template>
    <div id="root-container">

        <header class="toolbar">
            <div class="back-container">
                <img class="back" src="../../assets/images/icon_arrow_left.svg" alt="back" @click="stepBack">
            </div>

            <div class="menu-container">
                <button class="submit-btn" @click="isShowSaveModal = true">저장</button>
            </div>

            
        </header>

        <div class="survey-section">
            <div class="survey-title-section">
                <div class="input-section" :class="{'error': titleError}">
                    <input type="text" name="survey-title" class="survey-title" v-model="surveyTitle" placeholder="설문조사 제목"
                    maxlength="255" @input="titleError = false"/>
                </div>
                
                <div class="input-section">
                    <input type="text" name="survey-description" class="survey-description" v-model="surveyDescription" placeholder="설문지 설명" maxlength="255">
                </div>

                <div class="select-deadline-section" :class="{'date-error': dateError}">
                    <div class="deadline">
                        설문 기간
                    </div>

                    <div class="select-deadline" @click="isShowModal = true">
                        <span v-html="selectDate === null && selectTime === null ? '미설정' : ` ~&nbsp;${selectDateFormat}&nbsp;&nbsp;&nbsp;${selectTime}`"></span>
                    </div>

                    <div class="calender-container" @click="isShowModal = true">
                        calender
                    </div>
                </div>
            </div>

            <div class="survey-item-container">
                <div class="survey-item-section" v-for="com in totalComponent" :key="com.id">
                    <survey-item ref="surveyItems"/>
                    <div class="delete-btn-container">
                        <button @click="removeComponent(com.id)" class="delete-btn"></button>
                    </div>
                </div>
            </div>
        </div>

        <div class="create-btn-container">
             <div class="create-btn-section" @click="addComponent">
                <div class="add-icon-container">
                    <div class="add-icon">
                        add
                    </div>
                </div>
                질문 추가하기
             </div>
        </div>


        <div class="modal-container" v-if="isShowModal">
            <div class="modal-background">
                <div class="modal-section">

                    <div class="modal-content-container">

                        <div class="modal-content-title">
                            종료 날짜 설정
                        </div>

                        <!-- 날짜 선택 영역 -->
                        <div class="modal-datepicker-section" @click="showDatePicker = true">
                            <div>{{ selectDateFormat || '날짜 선택' }}</div>
                            <!--
                                이 영역에는 클릭 이벤트가 2중으로 설정,
                                icon-x-section에서 클릭을 누르면, 부모인 .modal-datepicker-section 까지 클릭 이벤트가 전파
                                자식 영역 이벤트에 .stop을 붙임으로써 이벤트 버블링 방지
                            -->
                            <div class="icon-x-container" @click.stop="deleteDateValue">
                                x
                            </div>
                        </div>

                        <!-- 시간 선택 영역 -->
                        <div class="modal-timepicker-section" @click="showTimePicker = true">
                            <div>{{ selectTime || '시간 선택' }}</div>
                            <div class="icon-x-container" @click.stop="deleteTimeValue">
                                x
                            </div>
                        </div>

                        <v-dialog v-model="showDatePicker" max-width="350px" width="100%" persistent>
                            <v-card>
                                <v-date-picker 
                                    v-model="selectDate" 
                                    :min="new Date()" 
                                    locale="ko" 
                                    cancel-text="취소" 
                                    ok-text="확인" 
                                    hide-header
                                    width="300px"
                                />
                                <v-btn text @click="closeDatePicker">닫기</v-btn>
                            </v-card>
                            </v-dialog>

                            <!-- 시간 선택 모달 -->
                            <v-dialog v-model="showTimePicker" max-width="350px" width="100%" persistent>
                            <v-card>
                                <v-time-picker
                                    v-model="selectTime" 
                                    cancel-text="취소" 
                                    ok-text="확인" 
                                    title="시간 선택"
                                    :style="{ width: '100%' }"
                                />
                                <v-btn text @click="showTimePicker = false">닫기</v-btn>
                            </v-card>
                            </v-dialog>


                    </div>

                    <div class="modal-btn-container">

                        <div class="modal-btn-section modal-cancle-btn" @click="cancleDeadline">
                            취소
                        </div>
                        <div class="modal-btn-section modal-submit-btn" @click="initDeadline">
                            확인
                        </div>

                    </div>

                </div>
            </div>
        </div>


        <div class="modal-container" v-if="isShowSaveModal">
            <div class="modal-background">
                <div class="modal-section">

                    <div class="modal-content-container">

                        <div class="modal-content-title">
                            저장하시겠습니까?
                        </div>

                    <div class="modal-btn-container">
                        <div class="modal-btn-section modal-cancle-btn" @click="isShowSaveModal = false">
                            취소
                        </div>
                        <div class="modal-btn-section modal-submit-btn" @click="handleSubmit">
                            확인
                        </div>

                    </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import SurveyItem from './create-survey-item/SurveyItem.vue';
import { ref, nextTick, watch } from 'vue';
import router from '@/router';
import { formatDate } from '@/utils/dateCalculator';
import { checkEmptyValues } from '@/utils/checkEmptyValues';

const totalComponent = ref([
    {id:0},
]);
const surveyItems = ref([]);

const surveyTitle = ref("");
const titleError = ref(false);

const surveyDescription = ref("")

const selectDate = ref(null);
const dateError = ref(false);

watch(selectDate, (newValue) => {
    if (newValue) {
        dateError.value = false;
    }
});

const selectDateFormat = ref("");
const selectTime = ref(null);
const isShowModal = ref(false);
const isShowSaveModal = ref(false);

const showDatePicker = ref(false)  // 날짜 선택 모달 상태
const showTimePicker = ref(false)  // 시간 선택 모달 상태


const addComponent = () => {
    const lastIndex = totalComponent.value.length > 0 
        ? totalComponent.value[totalComponent.value.length - 1].id 
        : -1;

    const newObj = {id: lastIndex+1}

    totalComponent.value.push(newObj);

    // nextTick으로 DOM 업데이트 후에 ref 배열이 최신 상태로 반영되도록 함
    nextTick(() => {
    surveyItems.value = surveyItems.value.slice(); // 새로운 참조로 배열을 갱신
  });
}

const removeComponent = (id) => {
    totalComponent.value = totalComponent.value.filter((component) => component.id !== id);
};

const stepBack = () =>{
    router.push("/")
}

const cancleDeadline = () => {
    if(selectDate.value === null && selectTime.value !== null) {
        selectTime.value = null;
    }
    isShowModal.value = false;
}

const initDeadline = () => {
    if(selectDate.value === null && selectTime.value !== null) {
        alert("날짜를 선택해주세요.");
        return;
    }

    // 날짜가 선택되었고 시간이 선택되지 않은 경우
    if(selectDate.value !== null && selectTime.value === null) {
        const selectedDate = new Date(selectDate.value); // 선택된 날짜 객체로 변환

        // 선택된 날짜의 하루를 더함 (다음 날로 설정)
        selectedDate.setDate(selectedDate.getDate() + 1); // 하루 더함

        selectDate.value = selectedDate;
        selectDateFormat.value = formatDate(selectDate.value)

        // 선택된 날짜의 시간을 00:00:00으로 설정
        selectedDate.setHours(0, 0, 0, 0);

        // 새로 수정된 날짜를 00:00 형식으로 selectTime에 반영
        selectTime.value = selectedDate.toLocaleTimeString('en-GB',  { hour12: false, hour: '2-digit', minute: '2-digit' });
    }
    isShowModal.value = false;
}

const closeDatePicker = () => {
    if (selectDate.value) {
        selectDateFormat.value = formatDate(selectDate.value)
    }
    showDatePicker.value = false;
}

const deleteDateValue = () => {
    selectDate.value = null;
    selectDateFormat.value = "";
    return;
}

const deleteTimeValue = () => {
    selectTime.value = null;
    return;
}

const handleSubmit = () => {
    // survey-item의 모든 값을 가져오기
    const title = surveyTitle.value.trim();
    const description = surveyDescription.value.trim();
    let valid = true;

    if(!title) {
        titleError.value = true
        valid = false;
        alert("설문조사 제목을 입력해주세요.")
        isShowSaveModal.value = false;
    }

    if(!selectDate.value) {
        dateError.value = true
        valid = false;
        alert("설문 마감 기한을 설정해주세요.")
        isShowSaveModal.value = false;
    }

    const dateStr = selectDateFormat.value + " " + selectTime.value;

    // date 값 넘길때는 서버 타입에 맞춰 변환
    let date = dateStr.replace(" ", "T").replaceAll(".", "-") + ":00";

    const values = surveyItems.value.map((item) => item.getValue()); // getValue()는 각 survey-item에서 필요한 값을 반환하는 메서드로 가정

    const jsonData = {title : title, description : description, expireDate: date, questionList : values}


    const emptyPath = checkEmptyValues(jsonData);

    const isExistQuestionList = emptyPath.filter((path) => path.includes("questionList"))

    /**
     * 비어있는 경로가 questionList 안에서 발견되는 것이 아니면 통과
     * 
     */
    if (isExistQuestionList.length > 0) {
        alert("입력되지 않은 항목이 있습니다.");
        isShowSaveModal.value = false;
        return;
    } else {
        /**
         * 제목이나 날짜 입력이 안됐으면,
         * 질문 항목들 중에 빈 값이 있나 확인하고 스타일 적용 및 경고창 준 뒤에 바로 리턴
         * jsonData는 보내지 않음
         */
        if(!valid) {
            isShowSaveModal.value = false;
            return;
        }

        // 서버로 데이터 생성 로직 추가
        isShowSaveModal.value = false;
        console.log(JSON.stringify(jsonData))
    }
};

</script>

<style scoped>
#root-container {
    width : 100%;
    display : flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.toolbar {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 64px;
    background-color: #fff;
    z-index : 50;
}

.back-container {
    display: flex;
    align-items: center;
    padding-left: 24px;
}

.menu-container {
    display : flex;
    align-items: center;
    position: absolute;
    right: 0;
    padding-right: 24px;
}

.submit-btn {
    display : inline-block;
    width : 56px;
    height : 32px;
    border : none;
    border-radius: 8px;
    text-align : center;
    background-color: var(--primary);
    font-size : 0.8125rem;
    color : white;
}

.survey-section {
    width : 100%;
    padding : 0 24px;
    margin-top : 64px;
}

.survey-title-section {
    background-color: #EFF0F6;
    border-radius: 15px;
    margin-bottom : 20px;
    padding : 8px 8px;
    box-sizing: border-box;
    box-shadow : 0 2px 4px rgba(0, 0, 0, 0.3);
}

.survey-title::placeholder {
    color : #464748;
}

.survey-title:focus::placeholder {
    color : transparent;
}

.survey-description::placeholder {
    color : #C1C3C5;
}

.survey-description:focus::placeholder {
    color : transparent;
}

.select-deadline-section {
    margin : 16px 12px 0 12px;
    padding : 0 4px;
    height : 32px;
    display : flex;
    align-items: center;
    font-weight : bold;
    font-size : 0.8175rem;
    color : #757575;
}

.select-deadline {
    color : #ABABB6;
    margin : 0 8px;
    font-size : 0.8175rem;
}

.calender-container {
    text-indent : -999em;
    background: url("../../assets/images/icon_calendar.svg") no-repeat;
    background-size: contain;
    width : 20px;
    height : 20px;
}

.survey-item-container {
    width : 100%;
    display : flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
}

.survey-item-section {
    background-color: #FAF8F8;
    margin-bottom : 12px;
    display : flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    padding: 0;
    border : solid 1px #eff0f6;
    border-radius : 15px;
    box-shadow : 0 2px 4px rgba(0, 0, 0, 0.3);
}

.delete-btn {
    text-indent : -999em;
    background: url("../../assets/images/icon_trash.svg") no-repeat;
    background-size: contain;
    width : 24px;
    height : 24px;
    margin-top : 36px;
    margin-right : 12px;
}

.input-section {
    width : 100%;
    display : flex;
    justify-content: start;
}

input {
    width : 100%;
    margin : 0 16px;
    height : 44px;
    padding : 0 16px;
    outline: none;                 /* 포커스 outline 제거 */
    padding: 8px 0;                /* 위아래 여백 추가 */
    transition: all 0.3s; /* 포커스 시 애니메이션 */
}

.survey-title {
    border: none;                  /* 기본 테두리 제거 */
    font-size : 1rem;
    font-weight : bold;
    color : #464748;
}

.error{
    border-radius : 12px;
    box-shadow: 0 0 0 2px #F77D7D;
}

.date-error{
    border-radius : 8px;
    box-shadow: 0 0 0 2px #F77D7D;
}

.survey-description {
    font-size : 0.875rem;
    color : #C1C3C5;
}

.create-btn-container {
    width : 100%;
    padding : 0 24px;
    margin : 16px 0;
}

.create-btn-section {
    position : relative;
    background-color: #fff;
    height : 60px;
    display : flex;
    align-items: center;
    justify-content: center;
    border : solid 1px #EFF0F6;
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    font-weight : bold;
    font-size : 1rem;
    color : #8C8C8C;
}

.add-icon-container {
    position : absolute;
    top : 18px;
    left : 24px;
}

.add-icon {
    text-indent : -999em;
    background: url("../../assets/images/icon_add.svg");
    background-size: contain;
    width : 24px;
    height : 24px;
}

.modal-container {
    position: fixed;  /* 모달을 고정 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;  /* 다른 요소들 위에 위치 */
}

.modal-background {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);  /* 배경을 반투명 회색으로 설정 */
    display: flex;
    justify-content: center;
    align-items: center; 
}

.modal-section {
    background-color: #fff;  /* 모달 창의 배경을 흰색으로 */
    padding: 20px;
    border-radius: 10px;
    width: 300px;
    display : flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.modal-content-container {
    width : 100%;
    display : flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.modal-content-title {
    margin-bottom : 12px;
    font-size : 1rem;
    font-weight : bold;
    color : #757576;
}

.modal-btn-container {
    width : 100%;
    margin-top : 24px;
    display : flex;
    align-items: center;
    justify-content: space-around;
}

.modal-btn-section {
    width : 120px;
    height : 40px;
    font-size : 1rem;
    font-weight : bold;
    border-radius: 15px;
    border : solid 1px #757575;
    display : flex;
    align-items: center;
    justify-content: center;
}

.modal-cancle-btn {
    background-color: #fff;
    color : #757575;
}

.modal-submit-btn {
    background-color: var(--primary);
    color : #fff;
}

.modal-datepicker-section, .modal-timepicker-section {
    position : relative;
    width : 250px;
    height : 60px;
    margin : 8px 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 15px;
}

.icon-x-container {
    position : absolute;
    display : flex;
    align-items: center;
    justify-content: center;
    top : 19px;
    right : 20px;
    text-indent : -999em;
    background: url("../../assets/images/icon_x.svg") no-repeat;
    background-size: contain;
    width : 20px;
    height : 20px;
}

.v-dialog {
  max-width: 90vw; /* Limit to 90% of the viewport width */
  width: 100%; /* Ensure dialog takes up the full width */
}

.v-card {
  width: 100%; /* Ensure card takes up the full width of dialog */
}

.v-dialog__content {
  display: flex;
  justify-content: center; /* Center the dialog content */
  align-items: center; /* Vertically center the content */
}


.v-date-picker, .v-time-picker {
  max-width: 100%;
  min-width: 200px; /* Ensure it's not too small on mobile */
  width: 100%; /* Ensure full width of its container */
  margin: 0 auto; /* Center the content inside */
}
</style>