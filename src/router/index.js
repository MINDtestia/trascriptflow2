import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/transcribe',
    name: 'transcribe',
    component: () => import('../views/TranscriptionView.vue')  
  },
  {
    path: '/text-to-audio',
    name: 'text-to-audio',
    component: () => import('../views/TextToAudioView.vue')
  },
  {
    path: '/youtube',
    name: 'youtube',
    component: () => import('../views/YouTubeView.vue')
  },
  {
    path: '/video',
    name: 'video',
    component: () => import('../views/VideoView.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue')
  },
  {
    path: '/api-keys',
    name: 'api-keys',
    component: () => import('../views/ApiKeysView.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue')
  }
]

const setFavicon = (href) => {
  let link = document.querySelector("link[rel~='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = href
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/text-to-audio') {
    setFavicon('/text-to-audio-favicon.svg')
  } else {
    setFavicon('/favicon.svg')
  }
  next()
})

export default router 