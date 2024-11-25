import { createRouter, createWebHistory } from 'vue-router'
import homeRoutes from './home/home'
import authRoutes from './auth/auth'
import surveyRoutes from './survey/survey'
// import axios from 'axios'
// const baseUrl = process.env.VUE_APP_API_URL;

const routes = [
    ...homeRoutes,
    ...authRoutes,
    ...surveyRoutes,
]

const router = createRouter({
    history: createWebHistory(),
    routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// // 라우트 가드 설정
// router.beforeEach((to, from, next) => {
//   // 로그인 페이지는 항상 통과
//   if (to.path === '/login') {
//     next();
//   } else if (to.meta.requiresAuth) {
//     axios.get(`${baseUrl}/auth/session`, {
//       withCredentials: true,
//       headers: {
//           'Content-Type': 'application/json'
//       }
//       })
//       .then((response) => {
//           if (response.status === 200) {
//             next(); // 세션이 있으면 통과
//           }
//       })
//       .catch(error => {
//         console.log(error)
//         next('/login'); // 세션이 없으면 로그인 페이지로 리디렉션
//       })
//   } else {
//     next(); // 인증이 필요 없는 페이지는 통과
//   }
// });

export default router;