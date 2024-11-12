<template>
    <div id="root-container">

        <div class="input-container">
             <textarea name="subj" id="subj" class="subj-textarea" placeholder="답변을 입력해주세요." disabled></textarea>
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
    height : 64px;
    margin : 12px 0;
}

.subj-textarea {
    width : 100%;
    height : 100%;
    box-sizing : border-box;
    resize : none;
    border : solid 2px #D9D9D9;
    border-radius : 10px;
    padding : 4px 8px;
    background-color: #FFF;
}
</style>