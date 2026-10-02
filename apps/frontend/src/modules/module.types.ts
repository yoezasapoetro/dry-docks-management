import type { RouteRecordRaw } from 'vue-router'

export interface MenuMetadata {
  label: string
  icon: string
  order: number
}

export interface FrontendModule {
  name: string
  routes: RouteRecordRaw[]
  menu?: MenuMetadata
}

export function isExposed(module: FrontendModule): module is FrontendModule & {
  menu: MenuMetadata
} {
  return module.menu !== undefined
}
