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

// 라우트 가드 설정
router.beforeEach((to, from, next) => {
    const saveStore = useSaveStatusStore();
    
    if (to.meta.requiresAuth) {
        axiosInstance.get(`/auth/session`)
            .then((response) => {
                if (response.status === 200) {
                    sessionStorage.setItem(btoa('isLoggedIn'), btoa(true)); // Base64로 저장

                    if (to.path.includes("/create") || to.path.includes("/update")) {
                        window.addEventListener('beforeunload', handleBeforeUnload);
                    } else {
                        window.removeEventListener('beforeunload', handleBeforeUnload);
                    }

                    const confirmationMessage = '정말 나가시겠습니까? 변경사항이 저장되지 않을 수 있습니다.';
                    if (from.name === 'Create' || from.name === 'Update') {
                        if(saveStore.isSaved) {
                            saveStore.resetStatus();
                            next();
                            return;
                        } else {
                            if (!window.confirm(confirmationMessage)) {
                                return next(false); // 이동 취소
                            }
                        }
                    }
                    next();
                }
            })
            .catch(() => {
                if (sessionStorage.getItem(btoa('isLoggedIn')) === null || sessionStorage.getItem(btoa('isLoggedIn')) === btoa(false)) {
                    alert("로그인이 필요합니다.");
                } else if (sessionStorage.getItem(btoa('isLoggedIn')) === btoa(true)) {
                    alert("세션이 만료되었습니다.");
                }

                next({ path: '/login', query: { redirect: to.fullPath } });
            });
    } else {
        next();
    }
});

// 새로고침 시 beforeunload 핸들러 활성화 보장
window.addEventListener('beforeunload', (event) => {
    const isCreateOrUpdate = location.pathname.includes("/create") || location.pathname.includes("/update");
    if (isCreateOrUpdate) {
        handleBeforeUnload(event); // 핸들러 강제 호출
    }
});

function handleBeforeUnload(event) {
    event.preventDefault();
    return '';
}

export default router;