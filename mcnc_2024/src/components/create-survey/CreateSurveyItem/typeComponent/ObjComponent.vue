<template>
    <div id="root-container">
        <ul class="survey-item-list">
            <li v-for="item in totalItem" :key="item.id" class="list-item">
                <input :type="componentType" :name="componentType" class="type-input">
                <input type="text" v-model="item.value" class="item-input" required/>
                <button class="list-delete-btn" @click="deleteItem(item.id)">항목 삭제</button>
            </li>
        </ul>

        <div class="item-add-section">
            <button class="item-add-btn" @click="addItem">항목 추가</button>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';


// 부모 컴포넌트인 SurveyItem의 type 데이터를 전달받는 곳
const props = defineProps({
    type : String,
})

const totalItem = ref([
    {id:0, value: "새로운 항목"},
]);

// 부모 컴포넌트로부터 select 항목 선택에 따라 computed로 자식 컴포넌트의 타입 재계산 후 적용
const componentType = computed(() => (props.type === "obj_radio" ? "radio" : "checkbox"));

/**
 *  현재 저장된 totalItem의 마지막 id++값을 id로 갖는 객체를 삽입
 *  deletItem에서 막아두긴 했지만 혹시나 id 자체가 없으면 lastIndex에 -1을 주고, +1한 값을 삽입
 */
const addItem = () => {
    const lastIndex = totalItem.value.length > 0 
        ? totalItem.value[totalItem.value.length - 1].id 
        : -1;

    const newObj = {id:lastIndex+1, value:"새로운 항목"};

    totalItem.value.push(newObj);
}

const deleteItem = (id) => {
    // 항목이 아예 사라지면 화면 뒤틀리는 김에 항목이 1개 이하로는 삭제 안되는 로직
    if(totalItem.value.length === 1) {return;}
    
    totalItem.value = totalItem.value.filter((component) => component.id !== id);
}
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
    list-style: none;
    padding : 0 8px;
}

.list-item {
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

.item-add-section {
    width : 100%;
    display : flex;
    align-items: center;
    justify-content: center;
    margin : 12px 0;
}

.item-add-btn {
    color : #1080E3;
}

.list-delete-btn {
    text-indent : -999em;
    background: url("../../../../assets/images/icon_x.svg") no-repeat;
    background-size: contain;
    width : 20px;
    height : 20px;
}
</style>