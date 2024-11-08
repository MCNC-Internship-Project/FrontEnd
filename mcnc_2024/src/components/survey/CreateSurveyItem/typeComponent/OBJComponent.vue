<template>
    <div id="root-container">
        <ul class="survey-item-list">
            <li v-for="item in totalItem" :key="item.id">
                <input :type="componentType" :name="componentType" class="type-input">
                <input type="text" :value="item.value" />
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
    console.log("클릭")
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

.item-add-section {
    width : 100%;
    display : flex;
    align-items: center;
    justify-content: center;
}

.item-add-btn {
    color : #1080E3;
}
</style>