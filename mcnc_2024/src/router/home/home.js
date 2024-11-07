/**
 * 홈 화면 전용 라우터
 */
const HomeRoutes = [
    {
        path : "/",
        name : "Home",
        component : () => import("../../components/home/HomeComponent.vue")
    },
    {
        path : "/notice",
        name : "Notice",
        component : () => import("../../components/home/NoticeList.vue")
    }
]

export default HomeRoutes;