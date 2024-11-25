<template>
    <div class="toolbar">
        <img class="back" src="../../assets/images/icon_arrow_left.svg" alt="back" @click="$emit('goBack')" />
        <slot></slot> <!--SurveyHeader-->
    </div>
</template>


<script setup>

</script>

<style scoped>
.toolbar {
    width: 100%;
    height: 64px;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    top: 0;
}

.back-container {
    display: flex;
    align-items: center;
}

.back {
    cursor: pointer;
    margin: 24px;
}

</style>
