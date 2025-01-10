/**
 * 홈 화면 전용 라우터
 * /home    (홈)
 * /search  (검색창)
 * 
 * @author 김원재
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