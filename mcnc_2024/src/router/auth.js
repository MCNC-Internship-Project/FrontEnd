/**
 * 로그인 / 회원가입 전용 라우터
 * /login           (로그인)
 * /sign-up         (회원가입)
 * /find-password   (비밀번호 찾기)
 * 
 * @author 김원재
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