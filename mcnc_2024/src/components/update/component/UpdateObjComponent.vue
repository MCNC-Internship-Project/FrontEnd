<template>
    <div class="root-container">
        <div class="item-container">
            <transition-group name="list" tag="ul" class="survey-list">
                <li v-for="(item, index) in displayItems" :key="item.id">
                    <div class="item-selection-container" :class="{ 'error': item.hasError, 'last-item' : totalItem.length === 100 && index === totalItem.length - 1 }">
                        <v-radio v-if="props.surveyType === 'OBJ_SINGLE'" color="#7796E8" disabled />
                        <v-checkbox-btn v-else color="#7796E8" disabled />
                        <input type="text" v-model="item.value" class="item-input" 
                            :placeholder="`항목 ${index + 1}`" maxlength="255"
                            :disabled="item.id === 'etcId'"
                            @focus="clearError(index)" @input="handleInput($event, index)" @blur="handleBlur(index)" />
                        <img class="item-icon" src="@/assets/images/icon_x.svg" alt="delete icon"
                            v-show="showDeleteIcon(item.id)" @click="deleteItem(item.id)" />
                    </div>
                    <div class="duplicate-container" v-if="item.isDuplicated" :class="{'duplicated': item.isDuplicated}">*중복된 항목이 있습니다.</div>
                </li>
            </transition-group>
        </div>

        <div class="add-item-container" v-if="totalItem.length < 100">
            <v-radio v-if="surveyType === 'OBJ_SINGLE'" color="#7796E8" disabled />
            <v-checkbox-btn v-else color="#7796E8" disabled />
            <div class="add-item-option" @click="addItem">항목 추가</div>
            <div class="add-item-or" v-if="!isExistEtc">&nbsp;또는&nbsp;</div>
            <div class="add-item-etc" @click="addEtcItem" v-if="!isExistEtc">'기타' 추가</div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, computed, defineExpose, watch } from 'vue';

const props = defineProps({
    surveyType: String,
    selectionList : Object,
})

const totalItem = ref([]);
const isExistEtc = ref(false);

/**
 * 질문 항목들이 변경(마운트 될때)되면,
 * 화면에 질문 항목들이 렌더링 되도록 반응형 데이터에 주입
 * @author 김원재
 */
watch(
    () => props.selectionList,
    (newVal) => {
        // 기존 데이터 초기화
        totalItem.value = [];
        
        // 새 데이터가 있을 경우에만 처리
        if (newVal && newVal.length > 0) {
            newVal.forEach((item, index) => {
                if (item.isEtc) {
                    totalItem.value.push({ id: "etcId", value: "기타" });
                    isExistEtc.value = true;
                } else {
                    totalItem.value.push({ id: index, value: item.body });
                }
            });
        } else {
            // 데이터가 없는 경우 기본 항목 추가
            totalItem.value = [{ id: 0, value: "" }];
        }
    },
    { immediate: true } // 컴포넌트 마운트 시 즉시 실행
);

/**
 * 질문 항목 순서 나열
 * 기타 항목이 가장 하위 순위로 정렬
 * @author 김원재
 */
const displayItems = computed(() => {
    const regularItems = totalItem.value.filter(item => item.id !== 'etcId');
    const etcItem = totalItem.value.find(item => item.id === 'etcId');

    if (etcItem) {
        return [...regularItems, etcItem];
    }
    return regularItems;
});

/**
 * 일반 항목 추가, 최대 항목 개수 100개 제한
 * @author 김원재
 */
const addItem = () => {
    if (totalItem.value.length >= 100) {
        return;
    }

    const regularItems = totalItem.value.filter(item => item.id !== 'etcId');
    const lastIndex = regularItems.length > 0
        ? regularItems[regularItems.length - 1].id
        : -1;

    const newObj = { id: lastIndex + 1, value: "" };

    if (isExistEtc.value) { // 기타 항목이 있으면 최하위로 정렬
        const etcItem = totalItem.value.find(item => item.id === 'etcId');
        totalItem.value = [...regularItems, newObj, etcItem];
    } else { // 없으면 배열에 push
        totalItem.value.push(newObj);
    }
}

/**
 * 질문 항목을 삭제하는 함수
 * 해당 항목의 id를 추적하여 필터링
 * @author 김원재
 * @param id 
 */
const deleteItem = (id) => {
    /**
     * 질문 항목이 일반 항목, 기타 항목 1개씩 있을 때는 기타 항목만 삭제 가능
     */
    if (totalItem.value.length === 2 && totalItem.value.some((item) => item.id === "etcId")) {
        if (id === "etcId") {
            isExistEtc.value = false;
            totalItem.value = totalItem.value.filter((item) => item.id !== id);
        }
        return;
    }

    /**
     * 질문 항목에 기타 항목이 있지만, length가 2 이상일때(일반 항목이 여러 개)는 선택한 항목 삭제 가능
     */
    if (totalItem.value.length > 2 && totalItem.value.some((item) => item.id === "etcId")) {
        if (id === "etcId") {
            isExistEtc.value = false;
            totalItem.value = totalItem.value.filter((item) => item.id !== id);
        }
        totalItem.value = totalItem.value.filter((item) => item.id !== id);
        return;
    }

     // 항목이 1개 이하로는 리턴
    if (totalItem.value.length === 1) { return; }

    totalItem.value = totalItem.value.filter((item) => item.id !== id);
}

/**
 * 기타 항목 추가, 1개만 추가 가능
 * @author 김원재
 */
const addEtcItem = () => {
    if (totalItem.value.length >= 100) {
        return;
    }

    if (!isExistEtc.value) {
        isExistEtc.value = true;
        totalItem.value.push({ id: "etcId", value: "기타..." });
    }
}

/**
 * 질문 항목 입력 시 IME 카운트 조절, 중복 항목 확인
 * @author 김원재
 * @param event 입력이 발생한 이벤트 객체
 * @param index 질문 항목 배열 인덱스
 */
const handleInput = (event, index) => {
    const newValue = event.target.value;
    totalItem.value[index].value = newValue;
    isDuplicateValue(index);
};

/**
 * 질문 항목 index 값으로 해당 index와 중복된 값을 갖는 질문 항목 탐색
 * @author 김원재
 * @param index 
 */
const isDuplicateValue = (index) => {
    const currentValue = totalItem.value[index].value;
    
    // 빈 값 체크
    if (!currentValue || currentValue.trim() === '') {
        totalItem.value[index].isDuplicated = false; // 중복 상태 초기화
        totalItem.value[index].hasError = false; // 에러 상태 초기화
        return false;
    }

    // 중복 체크
    const isDuplicate = totalItem.value.some((item, i) => {
        if (i === index) return false;
        return item.value === currentValue;
    });

    totalItem.value[index].isDuplicated = isDuplicate;

    // 즉시 에러 상태 업데이트
    totalItem.value[index].hasError = isDuplicate;
    return isDuplicate;
}

/**
 * 포커스 해제될 때 중복확인
 * @author 김원재
 * @param index 
 */
const handleBlur = (index) => {
    // 포커스 해제 시 중복 확인
    if (isDuplicateValue(index)) {
        totalItem.value[index].value = ''; // 값을 비움
        totalItem.value[index].hasError = false;
        totalItem.value[index].isDuplicated = false;
    } else {
        // 중복이 아니면 공백 제거
        totalItem.value[index].value = totalItem.value[index].value.trim();
        totalItem.value[index].isDuplicated = false;
    }
}

/**
 * 각 항목의 값 유효성 및 반환하는 함수
 * @author 김원재
 */
const getValue = () => {
    totalItem.value.forEach(item => item.hasError = false);

    const checkEmptyValueArray = totalItem.value.map((item) => item.value.trim());
    let firstEmptyIndex = -1;

    checkEmptyValueArray.forEach((value, index) => {
        if (value === "") {
            totalItem.value[index].hasError = true;
            totalItem.value[index].value = "";

            if (firstEmptyIndex === -1) {
                firstEmptyIndex = index;
            }
        }
    });

    return totalItem.value.map(item => {
        if (item.id === 'etcId') {
            return { ...item, value: '기타' };
        }
        return item;
    });
};

/**
 * 바인딩 클래스 제거
 * @author 김원재
 * @param index 
 */
const clearError = (index) => {
    totalItem.value[index].hasError = false;
};

/**
 * 질문 항목이 1개일 경우 삭제 아이콘 숨김 처리
 * @author 김원재
 * @param itemId 
 */
const showDeleteIcon = (itemId) => {
    // 기타 항목은 삭제 아이콘 보임
    if (itemId === 'etcId') 
        return true;

    // 일반 항목 개수
    const generalItemCount = totalItem.value.filter(item => item.id !== 'etcId').length;

    // 일반 항목만 1개 있는 경우 삭제 아이콘 숨김
    if (generalItemCount === 1) 
        return false;

    return true;
}

/**
 * UpdateSurveyItem의 objComponentRef에서 호출하는 자식 컴포넌트의 getValue 함수를 접근 가능하게 함
 * @author 김원재
 */
defineExpose({
    getValue,
})
</script>

<style scoped>
.root-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px 48px 36px 8px;
}

.item-container {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.survey-list {
    width: 100%;
    list-style: none;
    padding: 0;
    position: relative; /* 추가: transition-group 내부 요소들의 위치 기준점 */
}

.item-selection-container {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    padding-left: 8px;
    margin-bottom: 8px;
}

.last-item {
    margin-bottom : 0;
}

.item-selection-container.error {
    border-color: #F76C6A;
    border-radius: 4px;
    outline: none;
    box-shadow: 0 0 0 1.5px #F76C6A;
}

.duplicate-container.duplicated {
    color: #F76C6A;
    font-size : 0.75rem;
}

:deep(.v-selection-control) {
    --v-selection-control-size: 16px !important;
    flex: none;
}

.item-input {
    font-size : 1rem;
    margin: 0 auto;
    outline: none;
    width: 100%;
    margin: 0 12px 0 16px;
}

.item-input[disabled] {
    color: #939393;
    font-size: 1rem;
}

.item-input:focus::placeholder {
    color: transparent;
}

.item-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.add-item-container {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 5px;
    padding-left: 8px;
    font-size : 1rem;
}

.add-item-option {
    color: #A4A4A4;
    cursor: pointer;
    margin-left: 16px;
}

.add-item-etc {
    color: #7796E8;
    cursor: pointer;
}

.list-enter-active,
.list-leave-active {
    transition: all 0.2s ease;
}

.list-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.list-move {
    transition: transform 0.2s ease;
}
</style>