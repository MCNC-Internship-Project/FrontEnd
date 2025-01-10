<!--
    - 설문통계: 객관식, 주관식 항목 렌더링
    - @author 김은수
-->
<template>
  <div>
    <SubjectiveQuestion v-if="question.questionType === 'SUBJECTIVE'" :question="question" />
    <ObjectiveQuestion v-else :question="question" />
  </div>
</template>

<script setup>
import SubjectiveQuestion from '@/components/result/SubjQuestion.vue';
import ObjectiveQuestion from '@/components/result/ObjQuestion.vue';
import { defineProps } from 'vue';
defineProps({
  question: Object,
});
</script>