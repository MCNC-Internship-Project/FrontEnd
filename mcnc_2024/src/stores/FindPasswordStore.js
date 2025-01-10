/**
 * 비밀번호 찾기시 입력한 값을 임시로 저장하는 pinia store
 *
 * @author 반명우
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