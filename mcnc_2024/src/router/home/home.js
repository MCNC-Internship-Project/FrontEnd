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
    },
    {
        path : "/profile",
        name : "Profile",
        component : () => import("../../components/user_profile/UserProfile.vue")
    }
]

export default HomeRoutes;