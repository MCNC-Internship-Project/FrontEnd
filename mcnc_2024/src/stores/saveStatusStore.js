/**
 * 생성, 수정 화면 이동 시 저장 결과의 유무를 저장하는 상태 관리
 * @author 김원재
 */
import { defineStore } from 'pinia';

export const useSaveStatusStore = defineStore('saveStatus', {
  state: () => ({
    isSaved: false,  // 저장 상태
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
