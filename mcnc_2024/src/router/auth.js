/**
 * 로그인 / 회원가입 전용 라우터
 */
const authRoutes = [
    {
        path : "/login",
        name : "Login",
        component : () => import("@/components/auth/LoginComponent.vue"),
        meta: { requiresAuth: false },
    },
    {
        path : "/sign-up",
        name : "SignUp",
        component : () => import("@/components/auth/SignUpComponent.vue"),
        meta: { requiresAuth: false },
    },
    {
        path : "/find-password",
        name : "FindPassword",
        component : () => import("@/components/auth/FindPasswordComponent.vue"),
        meta: { requiresAuth: false },
    }
];

export default authRoutes;