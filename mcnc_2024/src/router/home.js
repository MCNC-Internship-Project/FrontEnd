/**
 * 홈 화면 전용 라우터
 * home -> notice
 * home -> search
 */

const HomeRoutes = [
    {
        path : "/",
        name : "Home",
        component : () => import("@/components/home/HomeComponent.vue"),
        meta: { requiresAuth: true },
    },
    {
        path : "/search",
        name : "Search",
        component : () => import("@/components/home/search/SearchResult.vue"),
        meta: { requiresAuth: true },
    },
]

export default HomeRoutes;