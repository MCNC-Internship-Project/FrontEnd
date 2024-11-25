/**
 * 홈 화면 전용 라우터
 * home -> notice
 * home -> profile
 */
import UserProfile from "./user-profile/user-profile";

const HomeRoutes = [
    {
        path : "/",
        name : "Home",
        component : () => import("../../components/home/HomeComponent.vue"),
        meta: { requiresAuth: true },
    },
    {
        path : "/surveys",
        name : "Surveys",
        component : () => import("../../components/home/search/SearchResult.vue"),
        meta: { requiresAuth: true },
    },
    ...UserProfile,
]

export default HomeRoutes;