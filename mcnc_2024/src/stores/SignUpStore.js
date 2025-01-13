/**
 * @fileoverview 회원가입 컴포넌트에서 사용하는 pinia store
 * @author 반명우 (banmyungwoo@mcnc.co.kr)
 * @date 2024-12-03
 * @lastModified 2024-12-19
 * @description 회원가입 시 값을 임시로 저장
 */

import { defineStore } from 'pinia';

export const useSignUpStore = defineStore('signUp', {
    state: () => ({
        userId: '',
        email: '',
        code: '',
        userIdVerified: false,
        emailVerified: false,
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
        setCode(code) {
            this.code = code;
        },
        setUserIdVerified(userIdVerified) {
            this.userIdVerified = userIdVerified;
        },
        setEmailVerified(emailVerified) {
            this.emailVerified = emailVerified;
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
        stepTo1() {
            this.email = '';
            this.code = '';
            this.userIdVerified = false;
            this.emailVerified = false;
            this.step = 1;
        },
        reset() {
            this.userId = '';
            this.email = '';
            this.code = '';
            this.userIdVerified = false;
            this.emailVerified = false;
            this.password = '';
            this.passwordConfirm = '';
            this.name = '';
            this.birth = null;
            this.gender = null;
            this.step = 1;
        }
    }
});