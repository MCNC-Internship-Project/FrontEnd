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