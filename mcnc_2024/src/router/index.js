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
        meta: { requiresAuth: true },
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
    const isLoggedInKey = btoa('isLoggedIn'); // Base64 인코딩된 키
    const isLoggedInValue = btoa('true');    // Base64 인코딩된 값
    const isFirstAccess = !localStorage.getItem(isLoggedInKey); // 첫 접근 여부 확인
    
    if (to.meta.requiresAuth) {
        axiosInstance.get(`/auth/session`)
            .then((response) => {
                if (response.status === 200) {
                    localStorage.setItem(isLoggedInKey, isLoggedInValue); // Base64로 저장

                    if (to.path.includes("/create-survey") || to.path.includes("/update-survey")) {
                        window.addEventListener('beforeunload', handleBeforeUnload);
                    } else {
                        window.removeEventListener('beforeunload', handleBeforeUnload);
                    }

                    const confirmationMessage = '정말 나가시겠습니까? 변경사항이 저장되지 않을 수 있습니다.';
                    if (from.name === 'create-survey' || from.name === 'update-survey') {
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
            .catch(error => {
                console.log(error);

                if (!isFirstAccess) { // 이전에 로그인한 적이 있는 경우에만 알림 표시
                    alert("세션이 만료되었습니다.");
                }

                localStorage.removeItem(isLoggedInKey); // Base64로 저장된 키 삭제
                next({ path: '/login', query: { redirect: to.fullPath } });
            });
    } else {
        next();
    }
});

// 새로고침 시 beforeunload 핸들러 활성화 보장
window.addEventListener('beforeunload', (event) => {
    const isCreateOrUpdate = location.pathname.includes("/create-survey") || location.pathname.includes("/update-survey");
    if (isCreateOrUpdate) {
        handleBeforeUnload(event); // 핸들러 강제 호출
    }
});

function handleBeforeUnload(event) {
    const confirmationMessage = 'Are you sure you want to leave this page? Changes may not be saved.';
    event.preventDefault();
    event.returnValue = confirmationMessage;
    return confirmationMessage;
}

export default router;
