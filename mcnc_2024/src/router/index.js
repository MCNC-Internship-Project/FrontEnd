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

//             if(to.path.includes("/create-survey") || to.path.includes("/update-survey")) {
//               window.addEventListener('beforeunload', handleBeforeUnload);
//             } else {
//               window.removeEventListener('beforeunload', handleBeforeUnload);
//             }

//             next();
//           }
//       })
//       .catch(error => {
//         console.log(error)
//         next('/login');
//       })
//   } else {
//     next();
//   }
// });

// function handleBeforeUnload(event) {
//   const confirmationMessage = 'Are you sure you want to leave this page? Changes may not be saved.';
//   event.preventDefault();
//   event.returnValue = confirmationMessage;
//   return confirmationMessage;
// }

export default router;