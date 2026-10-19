/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  tickets: {
    index: typeof routes['tickets.index']
    show: typeof routes['tickets.show']
    store: typeof routes['tickets.store']
    toggleStatus: typeof routes['tickets.toggle_status']
    destroy: typeof routes['tickets.destroy']
  }
  solutions: {
    store: typeof routes['solutions.store']
    destroy: typeof routes['solutions.destroy']
  }
}
