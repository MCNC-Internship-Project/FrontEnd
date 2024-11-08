/**
 * 홈 화면 전용 라우터
 * home -> notice
 * home -> profile
 */
import UserProfile from "./user_profile/user-profile";

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
    ...UserProfile
]

export default HomeRoutes;