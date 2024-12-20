/**
 * 사용자 프로필 전용 라우터
 * profile -> update-profile
 * profile -> my-surveys
 * profile -> my-participations
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