<template>
    <div id="root-container">

        <div class="input-container">
            <input type="text" name="subj" class="subj-input" placeholder="주관식" required/>
        </div>

    </div>
</template>

<script setup>

</script>

<style scoped>
#root-container {
    width : 100%;
    display : flex;
    flex-direction : column;
    align-items: start;
    justify-content: start;
}

.input-container {
    width : 100%;
    margin : 15px 0;
}

.subj-input {
    width : 100%;
    height : 44px;
    border: none;                  /* 기본 테두리 제거 */
    border-bottom: 2px solid gray; /* 밑줄만 추가 */
    outline: none;                 /* 포커스 outline 제거 */
    padding: 8px 0;                /* 위아래 여백 추가 */
    transition: all 0.3s; /* 포커스 시 애니메이션 */
}

.subj-input:hover {
    border-bottom: 2px solid #7796E8;
}
</style>