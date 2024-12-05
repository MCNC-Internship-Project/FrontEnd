import { createRouter, createWebHistory } from 'vue-router';
import homeRoutes from './home/home';
import authRoutes from './auth/auth';
import surveyRoutes from './survey/survey';
import axiosInstance from '@/utils/axiosInstance';

const routes = [
    ...homeRoutes,
    ...authRoutes,
    ...surveyRoutes,
    { 
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component : () => import("@/components/error/NotFound.vue"),
      meta: { requiresAuth: true },
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// 라우트 가드 설정
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  } else if (to.meta.requiresAuth) {
    axiosInstance.get(`/auth/session`)
      .then((response) => {
          if (response.status === 200) {

            if(to.path.includes("/create-survey") || to.path.includes("/update-survey")) {
              window.addEventListener('beforeunload', handleBeforeUnload);
            } else {
              window.removeEventListener('beforeunload', handleBeforeUnload);
            }

            const confirmationMessage = '정말 나가시겠습니까? 저장되지 않은 변경 사항이 있을 수 있습니다.';
            if (from.name === 'create-survey' || from.name === 'update-survey') {
              if (!window.confirm(confirmationMessage)) {
                return next(false); // 이동 취소
              }
            }

            next();
          }
      })
      .catch(error => {
        console.log(error)
        next({ path: '/login', query: { redirect: to.fullPath } });
      })
  } else {
    next();
  }
});

function handleBeforeUnload(event) {
  const confirmationMessage = 'Are you sure you want to leave this page? Changes may not be saved.';
  event.preventDefault();
  event.returnValue = confirmationMessage;
  return confirmationMessage;
}

export default router;