import { createRouter, createWebHistory } from 'vue-router'
import homeRoutes from './home/home'
import authRoutes from './auth/auth'

const routes = [
    ...homeRoutes,
    ...authRoutes,
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;