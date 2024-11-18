<template>
    <div id="root-container">
        <ul class="survey-item-list">
            <li v-for="(item, index) in displayItems" :key="item.id" class="list-item" :class="{ 'error': item.hasError }">
                <input :type="componentType" :name="componentType" class="type-input" :disabled="item.id === 'etcId'">
                <input
                    type="text"
                    v-model="item.value"
                    placeholder="새로운 항목"
                    class="item-input"
                    :disabled="item.id === 'etcId'"
                    :ref="el => itemInputs[index] = el"
                    @input="clearError(index)"
                />
                <div class="delete-btn-container">
                    <button class="list-delete-btn" @click="deleteItem(item.id)" v-if="totalItem.length !== 1" v-ripple>항목 삭제</button>
                </div>
            </li>
        </ul>

        <div class="item-add-section">
            <button class="item-add-btn" @click="addItem" v-ripple>항목 추가</button>
            <button class="etc-add-btn" @click="addEtcItem" v-if="!isExistEtc" v-ripple>기타 추가</button>
        </div>
    </div>
</template>

<script setup>
import { ref, watchEffect, defineProps, computed, defineExpose } from 'vue';

const props = defineProps({
    type : String,
})

const totalItem = ref([
    {id:0, value: ""},
]);

const itemInputs = ref([]);

watchEffect(() => {
  itemInputs.value = Array(totalItem.value.length).fill(null);
});

const isExistEtc = ref(false);

const componentType = computed(() => (props.type === "OBJ_SINGLE" ? "radio" : "checkbox"));

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
    if(totalItem.value.length >= 15) {
        return;
    }

    const regularItems = totalItem.value.filter(item => item.id !== 'etcId');
    const lastIndex = regularItems.length > 0 
        ? regularItems[regularItems.length - 1].id 
        : -1;

    const newObj = {id: lastIndex + 1, value: ""};
    
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
     if(totalItem.value.length === 2 && totalItem.value.some((item) => item.id === "etcId")) {
        if(id === "etcId") {
            isExistEtc.value = false;
            totalItem.value = totalItem.value.filter((item) => item.id !== id);
        }
        return;
    }

    /**
     * 질문 항목에 기타 항목이 있지만, length가 2 이상일때(일반 항목이 여러 개)는 선택한 항목이 뭐든 삭제 가능
     */
    if(totalItem.value.length > 2 && totalItem.value.some((item) => item.id === "etcId")) {
        if(id === "etcId") {
            isExistEtc.value = false;
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
    if (!isExistEtc.value) {
        isExistEtc.value = true;
        totalItem.value.push({id:"etcId", value:"기타"});
    }
}

const getValue = () => {
  totalItem.value.forEach(item => item.hasError = false);

  const checkEmptyValueArray = totalItem.value.map((item) => item.value.trim());
  let hasEmptyFields = false;
  let firstEmptyIndex = -1;

  checkEmptyValueArray.forEach((value, index) => {
    if (value === "") {
      totalItem.value[index].hasError = true;
      hasEmptyFields = true;
      
      if (firstEmptyIndex === -1) {
        firstEmptyIndex = index;
      }
    }
  });

  if (hasEmptyFields && firstEmptyIndex !== -1 && itemInputs.value[firstEmptyIndex]) {
    itemInputs.value[firstEmptyIndex].focus();
    return [];
  }

  return totalItem.value;
};

const clearError = (index) => {
  totalItem.value[index].hasError = false;
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
    padding : 0;
    margin-top : 8px;
}

.list-item {
    width : 100%;
    display : flex;
    align-items: center;
    padding : 0 4px;
    margin : 8px 0;
    box-sizing: border-box;
    line-height : 32px;
}

.item-input {
    width : 100%;
    margin-left : 4px;
    padding-left : 8px;
    outline : none;
}

.item-input::placeholder {
    color : #dcdcdc;
}

.item-input:focus::placeholder {
    color : transparent;
}

.list-item.error {
  border-color: #F77D7D;
  border-radius : 8px;
  outline: none;
  box-shadow: 0 0 0 1px #F77D7D;
}

/* 포커스 상태일 때도 에러 스타일 유지 */
.list-item.error:focus {
  border-color: #F77D7D;
  outline: none;
  box-shadow: 0 0 0 1px #F77D7D;
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
    border-radius: 8px;
    width : 80px;
    height : 32px
}

.etc-add-btn {
    margin-top : 4px;
    border-radius: 8px;
    width : 80px;
    height : 32px
}

.delete-btn-container {
    width : 100%;
    display : flex;
    align-items: center;
    justify-content: end;
}

.list-delete-btn {
    border-radius: 8px;
    text-indent : -999em;
    background: url("../../../../assets/images/icon_x.svg") no-repeat;
    background-size: contain;
    width : 20px;
    height : 20px;
}
</style>