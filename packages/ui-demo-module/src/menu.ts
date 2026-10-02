// Menu metadata. Its presence is what makes a module appear in the sidebar -
// there is deliberately no separate `exposed` flag, because two fields would be
// two sources of truth for one decision.
export const menu = {
  label: 'Demo',
  icon: 'i-heroicons-squares-2x2',
  order: 10
} as const