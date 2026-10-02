import type { FrontendModule } from './module.types'
import { routes as demoRoutes, menu as demoMenu } from '@limin/ui-demo-module'

export const modules: FrontendModule[] = [
  {
    name: 'demo',
    routes: demoRoutes,
    menu: demoMenu
  }
]
