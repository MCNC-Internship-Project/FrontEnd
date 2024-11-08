<template>
    <div id="root-container">
        <ul class="survey-item-list">
            <li v-for="item in totalItem" :key="item.id" class="list-item">
                <input :type="componentType" :name="componentType" class="type-input">
                <input type="text" :value="item.value" class="item-input" required/>
            </li>
        </ul>

        <div class="item-add-section">
            <button class="item-add-btn" @click="addItem">항목 추가</button>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';

const props = defineProps({
    type : String,
})

const totalItem = ref([
    {id:0, value: "새로운 항목"},
]);

const componentType = computed(() => (props.type === "obj_radio" ? "radio" : "checkbox"));

const addItem = () => {
    const lastIndex = totalItem.value.at(-1).id;
    const newObj = {id:lastIndex+1, value:"새로운 항목"};

    totalItem.value.push(newObj);
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
    width : calc(100% - 40px);
}

.list-item {
    margin : 12px 0;
}

.type-input {
    margin-left : 12px;
}

.item-input {
    margin-left : 16px;
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
</style>