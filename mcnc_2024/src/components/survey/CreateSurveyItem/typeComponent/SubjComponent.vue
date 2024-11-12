<template>
    <div id="root-container">

        <div class="input-container">
            <input type="text" name="subj" class="subj-input" placeholder="주관식 답안" disabled/>
        </div>

    </div>
</template>

<script setup>

</script>

<style scoped>
#root-container {
    width : 100%;
}

.input-container {
    width : 100%;
    margin : 8px 0;
}

.subj-input {
    width : 100%;
    height : 44px;  
    border: none;
    border-bottom: 2px solid gray;
    outline: none;
    padding: 0;
}
</style>