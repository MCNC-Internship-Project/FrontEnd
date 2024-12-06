// stores/saveStatusStore.js
import { defineStore } from 'pinia';

export const useSaveStatusStore = defineStore('saveStatus', {
  state: () => ({
    isSaved: false,  // 저장 상태 (저장되었는지 여부)
  }),

  actions: {
    // 저장 완료 처리
    setSaved() {
      this.isSaved = true;
    },

    // 상태 초기화
    resetStatus() {
      this.isSaved = false;
    },
  },
});
