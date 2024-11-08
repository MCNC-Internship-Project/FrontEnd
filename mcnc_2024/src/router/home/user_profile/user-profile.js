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
        component : () => import("../../../components/home/user_profile/UserProfile.vue"),
        children : [
        ]
    },
]

export default profileRoutes;