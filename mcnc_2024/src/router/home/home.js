/**
 * 홈 화면 전용 라우터
 */
const HomeRoutes = [
    {
        path : "/",
        name : "Home",
        component : () => import("../../components/home/HomeComponent.vue")
    },
]

export default HomeRoutes;