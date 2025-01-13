/**
 * @fileoverview 비밀번호 찾기 컴포넌트에서 사용하는 pinia store
 * @author 반명우 (banmyungwoo@mcnc.co.kr)
 * @date 2024-12-03
 * @lastModified 2024-12-19
 * @description 비밀번호 찾기 시 값을 임시로 저장
 */

import { defineStore } from 'pinia';

export const useFindPasswordStore = defineStore('findPassword', {
    state: () => ({
        userId: '',
        email: '',
        step: 1,
    }),
    actions: {
        setUserId(userId) {
            this.userId = userId;
        },
        setEmail(email) {
            this.email = email;
        },
        nextStep() {
            if (this.step < 3)
                this.step++;
        },
        prevStep() {
            if (this.step > 1)
                this.step--;
        },
        stepTo1() {
            this.email = '';
            this.step = 1;
        },
        reset() {
            this.userId = '';
            this.email = '';
            this.step = 1;
        }
    }
});