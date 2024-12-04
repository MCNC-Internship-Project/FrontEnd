import { defineStore } from 'pinia';

export const useSignUpStore = defineStore('signUp', {
    state: () => ({
        userId: '',
        email: '',
        password: '',
        passwordConfirm: '',
        name: '',
        birth: null,
        gender: null,
        step: 1,
    }),
    actions: {
        setUserId(userId) {
            this.userId = userId;
        },
        setEmail(email) {
            this.email = email;
        },
        setPassword(password) {
            this.password = password;
        },
        setPasswordConfirm(passwordConfirm) {
            this.passwordConfirm = passwordConfirm;
        },
        setName(name) {
            this.name = name;
        },
        setBirth(birth) {
            this.birth = birth;
        },
        setGender(gender) {
            this.gender = gender;
        },
        nextStep() {
            if (this.step < 3)
                this.step++;
        },
        prevStep() {
            if (this.step > 1)
                this.step--;
        },
        reset() {
            this.userId = '';
            this.email = '';
            this.password = '';
            this.passwordConfirm = '';
            this.name = '';
            this.birth = null;
            this.gender = null;
            this.step = 1;
        }
    }
});