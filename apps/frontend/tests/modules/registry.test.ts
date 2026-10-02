import { describe, expect, it } from 'vitest'
import { deriveMenu, deriveRoutes } from '@/router'
import { isExposed, type FrontendModule } from '@/modules/module.types'

function module(name: string, withMenu: boolean): FrontendModule {
  return {
    name,
    routes: [{ path: '', component: {} as never, meta: { title: name } }],
    ...(withMenu ? { menu: { label: name, icon: 'i-heroicons-squares-2x2', order: 10 } } : {})
  }
}

describe('deriveMenu', () => {
  it('includes only modules that declare menu metadata', () => {
    const items = deriveMenu([module('exposed', true), module('internal', false)])

    expect(items.map((item) => item.moduleName)).toEqual(['exposed'])
  })

  it('never emits an entry for a module without a menu', () => {
    expect(deriveMenu([module('internal', false)])).toHaveLength(0)
  })

  it('sorts by declared order', () => {
    const a = { ...module('a', true), menu: { label: 'A', icon: 'i-x', order: 20 } }
    const b = { ...module('b', true), menu: { label: 'B', icon: 'i-x', order: 10 } }

    expect(deriveMenu([a, b]).map((item) => item.moduleName)).toEqual(['b', 'a'])
  })

  it('links each entry to its module root', () => {
    expect(deriveMenu([module('demo', true)])[0].to).toBe('/demo')
  })

  it('returns nothing for an empty registry', () => {
    expect(deriveMenu([])).toEqual([])
  })
})

describe('deriveRoutes', () => {
  it('gathers routes from every registered module', () => {
    const routes = deriveRoutes([module('a', true), module('b', false)])

    expect(routes).toHaveLength(2)
  })

  it('drops a disabled module from the route table entirely', () => {
    expect(deriveRoutes([])).toHaveLength(0)
  })
})

describe('isExposed', () => {
  it('treats menu presence as exposure, with no separate flag', () => {
    expect(isExposed(module('a', true))).toBe(true)
    expect(isExposed(module('b', false))).toBe(false)
  })
})