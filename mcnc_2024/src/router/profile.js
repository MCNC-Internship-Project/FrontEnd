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
        path : "/profile/edit",
        name : "EditProfile",
        component : () => import("@/components/home/profile/EditProfile.vue"),
        meta: { requiresAuth: true },
    }
]

export default profileRoutes;