/**
 * 사용자 프로필 전용 라우터
 * /profile         (프로필)
 * /profile/info    (내 정보)
 * @author 김원재
 */

const profileRoutes = [
    {
        path : "/profile",
        name : "Profile",
        component : () => import("@/components/home/profile/UserProfile.vue"),
        meta: { requiresAuth: true },
    },
    {
        path : "/profile/info",
        name : "MyInfo",
        component : () => import("@/components/home/profile/MyInfo.vue"),
        meta: { requiresAuth: true },
    }
]

export default profileRoutes;