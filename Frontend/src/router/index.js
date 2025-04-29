import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/About.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { 
      requiresGuest: true,
      hideNavbar: true,
      hideFooter: true 
    }
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/Signup.vue'),
    meta: { 
      requiresGuest: true,
      hideNavbar: true,
      hideFooter: true 
    }
  },
  {
    path: '/sellerdashboard',
    name: 'sellerdashboard',
    component: () => import('@/views/SellerDashboard.vue'),
    meta: { 
      requiresAuth: true,
      role: 'seller'
    }
  },
  {
    path: '/buyerdashboard',
    name: 'buyerdashboard',
    component: () => import('@/views/BuyerDashboard.vue'),
    meta: { 
      requiresAuth: true,
      role: 'buyer'
    }
  },
  {
    path: '/admindashboard',
    name: 'admindashboard',
    component: () => import('@/views/AdminDashboard.vue'),
    meta: { 
      requiresAuth: true,
      role: 'admin'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // Redirect based on user role
    const userRole = authStore.userRole;
    if (userRole === 'admin') {
      next({ name: 'admindashboard' });
    } else if (userRole === 'seller') {
      next({ name: 'sellerdashboard' });
    } else {
      next({ name: 'buyerdashboard' });
    }
  } else {
    next();
  }
});

export default router
