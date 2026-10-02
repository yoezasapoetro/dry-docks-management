import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { modules } from '@/modules'
import type { MenuMetadata } from '@/modules/module.types'

export function deriveRoutes(registered = modules): RouteRecordRaw[] {
  return registered.flatMap((module) => module.routes)
}

export interface MenuItem extends MenuMetadata {
  moduleName: string
  to: string
}

export function deriveMenu(registered = modules): MenuItem[] {
  return registered
    .filter((module) => module.menu !== undefined)
    .map((module) => ({
      moduleName: module.name,
      to: `/${module.name}`,
      ...module.menu!
    }))
    .sort((a, b) => a.order - b.order)
}

const moduleRoutes: RouteRecordRaw[] = modules.map((module) => ({
  path: `/${module.name}`,
  component: () => import('@/layout/AppLayout.vue'),
  children: module.routes.map((route) => ({
    ...route,
    // Module routes are authored relative to their module root.
    path: route.path === '' ? '' : route.path
  }))
}))

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: () => deriveMenu()[0]?.to ?? '/404' },
    ...moduleRoutes,
    { path: '/404', component: () => import('@/pages/NotFoundPage.vue') },
    { path: '/:pathMatch(.*)*', component: () => import('@/pages/NotFoundPage.vue') }
  ]
})
