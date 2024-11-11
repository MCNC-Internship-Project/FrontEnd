/**
 * 로그인 / 회원가입 전용 라우터
 */
const authRoutes = [
    {
        path : "/login",
        name : "Login",
        component : () => import("../../components/auth/LoginComponent.vue")
    },
    {
        path : "/sign-up",
        name : "SignUp",
        component : () => import("../../components/auth/SignUpComponent.vue")
    },
];

export default authRoutes;