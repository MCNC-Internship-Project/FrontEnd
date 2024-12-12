<template>
    <div class="root-container">
        <div class="item-container">
            <transition-group name="list" tag="ul" class="survey-list">
                <li v-for="(item, index) in displayItems" :key="item.id">
                    <div class="item-selection-container" :class="{ 'error': item.hasError }">
                        <v-radio v-if="props.surveyType === 'OBJ_SINGLE'" color="#7796E8" disabled />
                        <v-checkbox-btn v-else color="#7796E8" disabled />
                        <input type="text" v-model="item.value" class="item-input" 
                            :placeholder="`항목 ${index + 1}`" maxlength="255"
                            :disabled="item.id === 'etcId'" :ref="el => itemInputs[index] = el"
                            @focus="clearError(index)" @input="handleInput($event, index)" @blur="handleBlur(index)" />
                        <img class="item-icon" src="@/assets/images/icon_x.svg" alt="delete icon"
                            v-show="showDeleteIcon(item.id)" @click="deleteItem(item.id)" />
                    </div>
                    <div class="duplicate-container" v-if="item.isDuplicated" :class="{'duplicated': item.isDuplicated}">*중복된 항목이 있습니다.</div>
                </li>
            </transition-group>
        </div>

        <div class="add-item-container">
            <v-radio v-if="surveyType === 'OBJ_SINGLE'" color="#7796E8" disabled />
            <v-checkbox-btn v-else color="#7796E8" disabled />
            <div class="add-item-option" @click="addItem">항목 추가</div>
            <div class="add-item-or" v-if="!isExistEtc">&nbsp;또는&nbsp;</div>
            <div class="add-item-etc" @click="addEtcItem" v-if="!isExistEtc">'기타' 추가</div>
        </div>
    </div>
</template>

<script setup>
import { ref, watchEffect, defineProps, computed, defineExpose, watch } from 'vue';

const props = defineProps({
    surveyType: String,
    selectionList : Object,
})

const totalItem = ref([]);

const itemInputs = ref([]);

watchEffect(() => {
    itemInputs.value = Array(totalItem.value.length).fill(null);
});

const isExistEtc = ref(false);

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

const displayItems = computed(() => {
    const regularItems = totalItem.value.filter(item => item.id !== 'etcId');
    const etcItem = totalItem.value.find(item => item.id === 'etcId');

    if (etcItem) {
        return [...regularItems, etcItem];
    }
    return regularItems;
});

const addItem = () => {
    if (totalItem.value.length >= 15) {
        return;
    }

    const regularItems = totalItem.value.filter(item => item.id !== 'etcId');
    const lastIndex = regularItems.length > 0
        ? regularItems[regularItems.length - 1].id
        : -1;

    const newObj = { id: lastIndex + 1, value: "" };

    if (isExistEtc.value) {
        const etcItem = totalItem.value.find(item => item.id === 'etcId');
        totalItem.value = [...regularItems, newObj, etcItem];
    } else {
        totalItem.value.push(newObj);
    }
}

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
     * 질문 항목에 기타 항목이 있지만, length가 2 이상일때(일반 항목이 여러 개)는 선택한 항목이 뭐든 삭제 가능
     */
    if (totalItem.value.length > 2 && totalItem.value.some((item) => item.id === "etcId")) {
        if (id === "etcId") {
            isExistEtc.value = false;
            totalItem.value = totalItem.value.filter((item) => item.id !== id);
        }
        totalItem.value = totalItem.value.filter((item) => item.id !== id);
        return;
    }

     // 항목이 아예 사라지면 화면 뒤틀리는 김에 항목이 1개 이하로는 삭제 안되는 로직
    if (totalItem.value.length === 1) { return; }

    totalItem.value = totalItem.value.filter((item) => item.id !== id);
}

const addEtcItem = () => {
    if (!isExistEtc.value) {
        isExistEtc.value = true;
        totalItem.value.push({ id: "etcId", value: "기타..." });
    }
}

const handleInput = (event, index) => {
    const newValue = event.target.value;
    totalItem.value[index].value = newValue;
    isDuplicateValue(index);
};

const isDuplicateValue = (index) => {
    const currentValue = totalItem.value[index].value;
    
    // 빈 값 체크
    if (!currentValue || currentValue.trim() === '') {
        totalItem.value[index].isDuplicated = false; // 중복 상태 초기화
        totalItem.value[index].hasError = false; // 에러 상태 초기화
        return false;
    }

    // 중복 체크 (대소문자 구분 없이)
    const isDuplicate = totalItem.value.some((item, i) => {
        if (i === index) return false;
        return item.value === currentValue;
    });

    totalItem.value[index].isDuplicated = isDuplicate;

    // 즉시 에러 상태 업데이트
    totalItem.value[index].hasError = isDuplicate;
    return isDuplicate;
}

const handleBlur = (index) => {
    // 포커스 해제 시 중복 확인
    if (isDuplicateValue(index)) {
        totalItem.value[index].value = ''; // 값을 비움
        totalItem.value[index].hasError = false;
        totalItem.value[index].isDuplicated = false; // 중복 상태 유지
    } else {
        // 중복이 아니면 공백 제거
        totalItem.value[index].value = totalItem.value[index].value.trim();
        totalItem.value[index].isDuplicated = false; // 중복 상태 초기화
    }
}

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

const clearError = (index) => {
    totalItem.value[index].hasError = false;
};

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
    margin: 0 auto;
    outline: none;
    width: 100%;
    margin: 0 12px 0 16px;
}

.item-input[disabled] {
    color: #939393;
    font-size: 0.875rem;
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
}

.add-item-option {
    color: #A4A4A4;
    cursor: pointer;
    margin-left: 16px;
    font-size: 0.875rem;
}

.add-item-or {
    font-size: 0.875rem;
}

.add-item-etc {
    color: #7796E8;
    cursor: pointer;
    font-size: 0.875rem;
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