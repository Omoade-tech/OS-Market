import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Listing from '@/views/Listing.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import SellerDashboard from '@/views/SellerDashboard.vue'
import BuyerDashboard from '@/views/BuyerDashboard.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import Profile from '@/views/Profile.vue'
import ListingDetail from '@/views/ListingDetail.vue'
import AddListing from '@/views/seller/AddListing.vue'
import SellerLayout from '@/layouts/SellerLayout.vue'
import ViewSellerListing from '@/views/seller/ViewSellerListing.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: "/listing",
    name: 'listing',
    component: Listing
  },
  {
    path: "/listings/:id",
    name: 'listing-detail',
    component: ListingDetail,
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { 
      requiresGuest: true,
      hideNavbar: true,
      hideFooter: true 
    }
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
    meta: { 
      requiresGuest: true,
      hideNavbar: true,
      hideFooter: true 
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/seller',
    component: SellerLayout,
    meta: { 
      requiresAuth: true,
      role: 'seller'
    },
    children: [
      {
        path: 'dashboard',
        name: 'sellerdashboard',
        component: SellerDashboard
      },
      {
        path: 'add-listing',
        name: 'add-listing',
        component: AddListing
      },
      {
        path: 'listings',
        name: 'view-seller-listings',
        component: ViewSellerListing
      },
      {
        path: 'profile',
        name: 'seller-profile',
        component: Profile
      }
    ]
  },
  {
    path: '/buyerdashboard',
    name: 'buyerdashboard',
    component: BuyerDashboard,
    meta: { 
      requiresAuth: true,
      role: 'buyer'
    }
  },
  {
    path: '/admindashboard',
    name: 'admindashboard',
    component: AdminDashboard,
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
  const userRole = authStore.userRole;

  // Handle authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' });
    return;
  }

  // Handle guest routes
  if (to.meta.requiresGuest && isAuthenticated) {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'admin':
        next({ name: 'admindashboard' });
        break;
      case 'seller':
        next({ name: 'sellerdashboard' });
        break;
      case 'buyer':
        next({ name: 'buyerdashboard' });
        break;
      default:
        next({ name: 'home' });
    }
    return;
  }

  // Handle role-based access
  if (to.meta.role && isAuthenticated) {
    if (to.meta.role !== userRole) {
      // Redirect to appropriate dashboard if role doesn't match
      switch (userRole) {
        case 'admin':
          next({ name: 'admindashboard' });
          break;
        case 'seller':
          next({ name: 'sellerdashboard' });
          break;
        case 'buyer':
          next({ name: 'buyerdashboard' });
          break;
        default:
          next({ name: 'home' });
      }
      return;
    }
  }

  next();
});

export default router
