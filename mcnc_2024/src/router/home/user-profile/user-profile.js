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
        component : () => import("@/components/home/user-profile/UserProfile.vue"),
        meta: { requiresAuth: true },
    },
    {
        path : "/profile/update",
        name : "UpdateProfile",
        component : () => import("@/components/home/user-profile/profile-menu/UpdateProfile.vue"),
        meta: { requiresAuth: true },
    }
]

export default profileRoutes;