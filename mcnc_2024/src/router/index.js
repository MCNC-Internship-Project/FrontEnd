/**
 * Vue Router를 관리하기 위한 라우터 인스턴스 생성 파일
 * @author 김원재
 */
import { createRouter, createWebHistory } from 'vue-router';
import homeRoutes from './home';
import authRoutes from './auth';
import surveyRoutes from './survey';
import profile from './profile';
import axiosInstance from '@/utils/axiosInstance';

/**
 * App.vue가 관리할 수 있는 route들을 정의하는 배열
 * @author 김원재
 */
const routes = [
    // 페이지 별 정의한 route spread
    ...homeRoutes,
    ...authRoutes,
    ...surveyRoutes,
    ...profile,
    {
        // routes에 정의되지 않은 모든 path에 대해 렌더링할 컴포넌트 정의
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import("@/components/error/NotFound.vue"),

        /**
         * 라우터 가드 첫번째 조건식에서 사용되는 meta 속성
         * requiresAuth가 false이면 세션 유효 요청 보내지 않음,
         * true일때 /auth/session에 요청 전송 후 클라이언트가 갖고 있는 세션값의 유효성 판단
         */
        meta: { requiresAuth: false },
    }
];

/**
 * 라우터 인스턴스 생성
 * 히스토리를 관리하고, 정의한 route들을 갖음.
 * 새로운 경로로 이동할 때 스크롤위치 top 0으로 고정
 * @author 김원재
 */
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    },
});

/**
 * 라우터 가드 설정
 * beforeEach => 라우터가 이동하기 전마다 조건식 검사하는 함수
 * @author 김원재
 */
router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) { // route 배열 속성 중 meta.requiresAuth가 true이면 서버에 세션 유효 체크 요청 전송
        axiosInstance.get(`/auth/session`)
            .then(() => {
                // 세션이 유효할 때
                sessionStorage.setItem(btoa('isLoggedIn'), btoa(true)); // 현재 로그인 중인 정보를 세션 스토리지에 저장
                next();
            })
            .catch((error) => {
                // 세션이 무효할 때
                if (error.status === 401) {
                    if (sessionStorage.getItem(btoa('isLoggedIn')) === null || sessionStorage.getItem(btoa('isLoggedIn')) === btoa(false)) {
                        // 현재 세션 스토리지에 저장된 로그인 중인 정보가 없을 때
                        alert("로그인이 필요합니다.");
                    } else if (sessionStorage.getItem(btoa('isLoggedIn')) === btoa(true)) {
                        // 현재 세션 스토리지에 저장된 로그인 정보가 있을 때
                        alert("세션이 만료되었습니다.");
                    }
                }

                next({ path: '/login', query: { redirect: to.fullPath } });
            });
    } else { // meta.requiresAuth가 false인 라우트들은 바로 이동
        next();
    }
});

export default router;