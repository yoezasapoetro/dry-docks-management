import type { RouteRecordRaw } from 'vue-router'

// Imported synchronously by the registry, which keeps the route table
// synchronous as vue-router requires. Page components are still lazy-loaded
// inside each route.
export const routes: RouteRecordRaw[] = [
  {
    path: '',
    component: () => import('./pages/DemoListPage.vue'),
    meta: { title: 'Demo' }
  },
  {
    path: 'detail/:id?',
    component: () => import('./pages/DemoDetailPage.vue'),
    meta: { title: 'Demo detail' }
  },
  {
    path: 'dashboard',
    component: () => import('./pages/DemoDashboardPage.vue'),
    meta: { title: 'Demo dashboard' }
  }
]