import { createRouter, createWebHistory } from 'vue-router'
import homeRoutes from './home/home'
import authRoutes from './auth/auth'
import surveyRoutes from './survey/survey'

const routes = [
    ...homeRoutes,
    ...authRoutes,
    ...surveyRoutes,
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;