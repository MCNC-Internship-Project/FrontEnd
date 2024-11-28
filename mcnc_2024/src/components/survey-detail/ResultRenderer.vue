<template>
    <div>
      <SubjectiveQuestion v-if="question.questionType === 'SUBJECTIVE'" :question="question" />
      <ObjectiveQuestion v-else :question="question" />
    </div>
  </template>
  
  <script setup>
  import SubjectiveQuestion from '@/components/survey-detail/SubjQuestion.vue';
  import ObjectiveQuestion from '@/components/survey-detail/ObjQuestion.vue';
  import { defineProps } from 'vue';
  defineProps({
    question: Object,
  });
  </script>
  