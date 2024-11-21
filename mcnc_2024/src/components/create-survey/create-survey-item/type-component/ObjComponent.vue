<template>
    <div class="root-container">
        <div class="item-container">
            <ul class="survey-list">
                <li v-for="(item, index) in displayItems" :key="item.id">
                    <div class="item-selection-container" :class="{ 'error': item.hasError }">
                        <v-radio v-if="props.surveyType === 'OBJ_SINGLE'" color="#7796E8" disabled />
                        <v-checkbox-btn v-else color="#7796E8" disabled />
                        <input type="text" v-model="item.value" class="item-input" :placeholder="`항목 ${index + 1}`"
                            :disabled="item.id === 'etcId'" :ref="el => itemInputs[index] = el"
                            @focus="clearError(index)" />
                        <img class="item-icon" src="@/assets/images/icon_x.svg" alt="delete icon"
                            v-show="totalItem.length !== 1" @click="deleteItem(item.id)" />
                    </div>
                </li>
            </ul>
        </div>

        <div class="add-item-container">
            <v-radio v-if="surveyType === 'OBJ_SINGLE'" color="#7796E8" disabled />
            <v-checkbox-btn v-else color="#7796E8" disabled />
            <div class="add-item-option" @click="addItem">옵션 추가</div>
            <div class="add-item-or" v-if="!isExistEtc">또는</div>
            <div class="add-item-etc" @click="addEtcItem" v-if="!isExistEtc">'기타' 추가</div>
        </div>
    </div>
</template>

<script setup>
import { ref, watchEffect, defineProps, computed, defineExpose } from 'vue';

const props = defineProps({
    surveyType: String,
})

const totalItem = ref([
    { id: 0, value: "" },
]);

const itemInputs = ref([]);

watchEffect(() => {
    itemInputs.value = Array(totalItem.value.length).fill(null);
});

const isExistEtc = ref(false);

// 표시될 항목들을 계산하는 computed 속성 추가
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
        // 기타 항목을 찾아서 임시로 제거
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

const getValue = () => {
    totalItem.value.forEach(item => item.hasError = false);

    const checkEmptyValueArray = totalItem.value.map((item) => item.value.trim());
    let firstEmptyIndex = -1;

    checkEmptyValueArray.forEach((value, index) => {
        if (value === "") {
            totalItem.value[index].hasError = true;

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
    margin: 0 4px;
    font-size: 0.875rem;
}

.add-item-etc {
    color: #7796E8;
    cursor: pointer;
    font-size: 0.875rem;
}
</style>