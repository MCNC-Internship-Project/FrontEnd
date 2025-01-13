<template>
  <div>
    <SubjectiveQuestion v-if="question.questionType === 'SUBJECTIVE'" :question="question" />
    <ObjectiveQuestion v-else :question="question" />
  </div>
</template>

<script setup>
/**
 * @fileoverview 설문통계 - 객관식 및 주관식 항목 렌더링 컴포넌트
 * @author 김은수 (kimeunsu@mcnc.co.kr)
 * @date 2024-12-10
 * @lastModified 2024-12-20
 * @description 설문 문항의 유형(객관식/주관식)에 따라 적절한 컴포넌트를 렌더링하는 컴포넌트.
 */

import SubjectiveQuestion from '@/components/result/SubjQuestion.vue';
import ObjectiveQuestion from '@/components/result/ObjQuestion.vue';
import { defineProps } from 'vue';
defineProps({
  question: Object,
});
</script>