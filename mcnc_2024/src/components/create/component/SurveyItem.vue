<template>
    <div class="root-container">
        <div class="header-container">
            <div class="header-input" :class="{ 'error': titleError }" >
                <v-textarea
                    v-model="surveyTitle"
                    rows="1"
                    auto-grow
                    variant="none"
                    color="#464748"
                    @focus="titleError = false; titlePlaceholderVisible = false"
                    @blur="titlePlaceholderVisible = true"
                    maxlength="255"
                    hide-details="false"
                    :placeholder="titlePlaceholderVisible ? `질문 ${itemNumber}` : ''"
                />
            </div>
            <img class="header-icon" :class="{ 'disabled': isSingle, 'hidden': isSingle }"
                src="@/assets/images/icon_trash.svg" alt="trash icon" @click="deleteItem" />
        </div>
        <div class="body-container">
            <div class="type-select-container">
                <v-menu v-model="showTypeMenu" class="type-select-menu" :location="'bottom'" offset-y>
                    <template v-slot:activator="{ props }">
                        <div class="type-select-selector-container" v-bind="props">
                            <img class="type-select-selector-type-icon" :src="surveyTypeIcon" alt="type icon" />
                            <div class="type-select-selector-text">{{ surveyTypeText }}</div>
                            <img class="type-select-selector-dropdown-icon" src="@/assets/images/icon_dropdown2.svg"
                                alt="dropdown icon" />
                        </div>
                    </template>

                    <v-list>
                        <v-list-item v-for="(option, index) in surveyTypeMenuOptions" :key="index"
                            @click="surveyTypeText = option.text; showTypeMenu = false;">
                            <div class="type-select-menu-item">
                                <img class="type-select-selector-type-icon" :src="option.icon" alt="type icon" />
                                <div class="type-select-selector-text">{{ option.text }}</div>
                            </div>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </div>
        <div class="footer-container">
            <subj-component v-if="surveyType === 'SUBJECTIVE'" ref="subjComponentRef" />
            <obj-component v-else :survey-type="surveyType" ref="objComponentRef" />
        </div>
    </div>
</template>

<script setup>
/**
 * @fileoverview 설문 생성 파트의 설문 항목 컴포넌트
 * @author 김원재 (kimwonjae@mcnc.co.kr)
 * @date 2024-11-08
 * @lastModified 2024-12-19
 * @description 생성 파트 설문 항목에 대한 화면 구현.
 */
import { ref, watch, defineExpose, defineEmits, defineProps } from 'vue';

import ObjComponent from './ObjComponent.vue'
import SubjComponent from './SubjComponent.vue'

import iconSingle from '@/assets/images/icon_single.svg';
import iconMulti from '@/assets/images/icon_multi.svg';
import iconSubj from '@/assets/images/icon_subj.svg';

const props = defineProps({
    isSingle: {
        type: Boolean,
        default: false
    },
    itemNumber: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['delete-item']);

const subjComponentRef = ref(null);
const objComponentRef = ref(null);
const surveyTitle = ref("");
const titlePlaceholderVisible = ref(true);
const surveyTypes = ["OBJ_SINGLE", "OBJ_MULTI", "SUBJECTIVE"];
const surveyTypeTexts = ["단일 선택", "다중 선택", "주관식"];
const surveyType = ref(surveyTypes[0]);
const surveyTypeText = ref(surveyTypeTexts[0]);
const surveyTypeIcon = ref(iconSingle);
const showTypeMenu = ref(false);
const titleError = ref(false);
const surveyTypeMenuOptions = [
    { text: surveyTypeTexts[0], icon: iconSingle },
    { text: surveyTypeTexts[1], icon: iconMulti },
    { text: surveyTypeTexts[2], icon: iconSubj },
]

/**
 * 선택한 타입 값이 바뀌면 이미지와 텍스트도 변경
 * @author 김원재
 */
watch(surveyTypeText, (type) => {
    switch (type) {
        case surveyTypeTexts[0]:
            surveyType.value = surveyTypes[0];
            surveyTypeIcon.value = iconSingle;
            break;
        case surveyTypeTexts[1]:
            surveyType.value = surveyTypes[1];
            surveyTypeIcon.value = iconMulti;
            break;
        case surveyTypeTexts[2]:
            surveyType.value = surveyTypes[2];
            surveyTypeIcon.value = iconSubj;
            break;
    }
});

/**
 * 각 설문 항목의 값 유효성 및 반환하는 함수
 * @author 김원재
 */
const getValue = () => {
    let isValid = true;
    let values = {};

    // 제목 검사
    if (!surveyTitle.value.trim()) {
        surveyTitle.value = "";
        titleError.value = true;
        isValid = false;
    }

    // 컴포넌트 타입에 따른 검증 및 값 수집
    if (surveyType.value === 'SUBJECTIVE') {
        values = [];
    } else {
        const objData = objComponentRef.value.getValue();
        if (!objData || objData.length === 0) {
            isValid = false;
        }
        values = objData.map(item => ({ body: item.value, isEtc: item.id === "etcId" ? true : false }));
    }

    // 유효성 검사 실패시 null 반환
    if (!isValid) {
        return null;
    }

    return {
        body: surveyTitle.value,
        questionType: surveyType.value,
        selectionList: values
    };
};

/**
 * 설문 항목이 2개 이상일 때
 * 설문 항목을 지우는 함수
 * @author 김원재
 */
const deleteItem = () => {
    if (!props.isSingle) {
        emit('delete-item');
    }
}

/**
 * CreteSurvey의 surveyItems에서 호출하는 자식 컴포넌트의 getValue 함수를 접근 가능하게 함
 * @author 김원재
 */
defineExpose({
    getValue,
})
</script>

<style scoped>
.root-contaienr {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.header-container {
    display: flex;
    align-items: center;
    width: 100%;
}

.header-input {
    border: none;
    width: 100%;
    background-color: #fff;
    border-radius : 12px;
    overflow-wrap: break-word;
    outline: none;
}

.header-input:deep(.v-field) {
    font-size : 1rem;
    font-weight : bold;
    padding : 8px 0;
}

.header-input:deep(.v-field__input::placeholder) {
    font-size: 1rem;
    font-weight: bold;
    color: #B0B0B0;
}

.header-input.error {
    box-shadow: 0 0 0 2px #F76C6A;
}

.header-icon {
    width: 24px;
    height: 24px;
    margin-left: 16px;
    cursor: pointer;
}

.body-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 8px 0;
}

.type-select-container {
    width: 100%;
    height: 36px;
    display: flex;
    padding: 0 48px 0 8px;
}

.type-select-icon {
    width: 20px;
    height: 20px;
    margin-right: 12px;
}

.type-select-selector-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    border: solid 1px #D9D9D9;
    background-color: #fff;
    display: flex;
    padding: 0 12px 0 8px;
    cursor: pointer;
}

.type-select-selector-type-icon {
    width: 16px;
    height: 16px;
}

.type-select-selector-text {
    width: 100%;
    font-size: 1rem;
    margin: auto;
    text-align: left;
    margin-left: 12px;
}

.type-select-selector-dropdown-icon {
    width: 12px;
    height: 12px;
}

.v-list {
    padding: 0;
}

.v-list-item {
    padding: 0 !important;
    min-height: 0 !important;
}

.type-select-menu-item {
    width: 100%;
    height: 36px;
    display: flex;
    align-items: center;
    padding: 0 8px;
}

.footer-container {
    width: 100%;
}

.hidden {
    visibility: hidden;
}
</style>