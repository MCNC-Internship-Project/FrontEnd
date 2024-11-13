<template>
    <div id="root-container">
        <ul class="survey-item-list">
            <li v-for="item in totalItem" :key="item.id" class="list-item">
                <input :type="componentType" :name="componentType" class="type-input" :disabled="item.id === 'etcId'">
                <input type="text" v-model="item.value" placeholder="새로운 항목" class="item-input" required :disabled="item.id === 'etcId'"/>
                <button class="list-delete-btn" @click="deleteItem(item.id)" v-if="totalItem.length !== 1">항목 삭제</button>
            </li>
        </ul>

        <div class="item-add-section">
            <button class="item-add-btn" @click="addItem" v-if="!isExistEtc">항목 추가</button>
            <button class="etc-add-btn" @click="addEtcItem" v-if="!isExistEtc">기타 추가</button>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, computed, defineExpose } from 'vue';

// 부모 컴포넌트인 SurveyItem의 type 데이터를 전달받는 곳
const props = defineProps({
    type : String,
})

const totalItem = ref([
    {id:0, value: ""},
]);

const isExistEtc = ref(false);

// 부모 컴포넌트로부터 select 항목 선택에 따라 computed로 자식 컴포넌트의 타입 재계산 후 적용
const componentType = computed(() => (props.type === "OBJ_SINGLE" ? "radio" : "checkbox"));

/**
 *  현재 저장된 totalItem의 마지막 id++값을 id로 갖는 객체를 삽입
 *  deletItem에서 막아두긴 했지만 혹시나 id 자체가 없으면 lastIndex에 -1을 주고, +1한 값을 삽입
 */
const addItem = () => {
    
    if(totalItem.value.length >= 15) {
        return;
    }

    const lastIndex = totalItem.value.length > 0 
        ? totalItem.value[totalItem.value.length - 1].id 
        : -1;

    const newObj = {id:lastIndex+1, value:""};

    totalItem.value.push(newObj);
}

const deleteItem = (id) => {

    /**
     * 질문 항목이 일반 항목, 기타 항목 1개씩 있을 때는 기타 항목만 삭제 가능
     */
    if(totalItem.value.length === 2 && totalItem.value.some((item) => item.id === "etcId")) {
        if(id === "etcId") {
            isExistEtc.value = !isExistEtc.value;
            totalItem.value = totalItem.value.filter((item) => item.id !== id);
        }
        return;
    }

    /**
     * 질문 항목에 기타 항목이 있지만, length가 2 이상일때(일반 항목이 여러 개)는 선택한 항목이 뭐든 삭제 가능
     */
    if(totalItem.value.length > 2 && totalItem.value.some((item) => item.id === "etcId")) {
        if(id === "etcId") {
            isExistEtc.value = !isExistEtc.value;
            totalItem.value = totalItem.value.filter((item) => item.id !== id);
        }
        totalItem.value = totalItem.value.filter((item) => item.id !== id);
        return;
    }

    // 항목이 아예 사라지면 화면 뒤틀리는 김에 항목이 1개 이하로는 삭제 안되는 로직
    if(totalItem.value.length === 1) {return;}
    
    totalItem.value = totalItem.value.filter((item) => item.id !== id);
}

const addEtcItem = () => {
    isExistEtc.value = !isExistEtc.value;
    totalItem.value.push({id:"etcId", value:"기타"})
}

const getValue = () => {
  return totalItem.value
};

defineExpose({
    getValue,
})
</script>

<style scoped>
#root-container {
    width : 100%;
    display : flex;
    flex-direction : column;
    align-items: start;
    justify-content: start;
}

.survey-item-list {
    width : 100%;
    list-style: none;
    padding : 0 8px;
}

.list-item {
    width : 100%;
    display : flex;
    align-items: center;
    justify-content: start;
    margin : 12px 0;
    box-sizing: border-box;
}

.item-input {
    width : 100%;
    margin-left : 8px;
    outline : none;
}

.etc-input {
    width : 100%;
    margin-left : 8px;
    outline : none;
}

.item-add-section {
    width : 100%;
    display : flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding-left : 36px;
    margin : 12px 0;
}

.item-add-btn {
    color : #1080E3;
}

.etc-add-btn {
    margin-top : 8px;
}

.list-delete-btn {
    text-indent : -999em;
    background: url("../../../../assets/images/icon_x.svg") no-repeat;
    background-size: contain;
    width : 20px;
    height : 20px;
}
</style>