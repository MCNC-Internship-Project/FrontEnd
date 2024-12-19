import { createRouter, createWebHistory } from 'vue-router';
import homeRoutes from './home';
import authRoutes from './auth';
import surveyRoutes from './survey';
import profile from './profile';
import axiosInstance from '@/utils/axiosInstance';
import { useSaveStatusStore } from '@/stores/saveStatusStore';

const routes = [
    ...homeRoutes,
    ...authRoutes,
    ...surveyRoutes,
    ...profile,
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import("@/components/error/NotFound.vue"),
        meta: { requiresAuth: false },
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    },
});

// 라우터 가드 설정
router.beforeEach((to, from, next) => {
    const saveStore = useSaveStatusStore();

    if (to.meta.requiresAuth) {
        axiosInstance.get(`/auth/session`)
            .then(() => {
                sessionStorage.setItem(btoa('isLoggedIn'), btoa(true)); // Base64로 저장

                if(saveStore.isSaved) {
                    saveStore.resetStatus();
                }
                next();
            })
            .catch((error) => {
                if (error.status === 401) {
                    if (sessionStorage.getItem(btoa('isLoggedIn')) === null || sessionStorage.getItem(btoa('isLoggedIn')) === btoa(false)) {
                        alert("로그인이 필요합니다.");
                    } else if (sessionStorage.getItem(btoa('isLoggedIn')) === btoa(true)) {
                        alert("세션이 만료되었습니다.");
                    }
                }

                next({ path: '/login', query: { redirect: to.fullPath } });
            });
    } else {
        next();
    }
});

export default router;