/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
  }
  auth: {
    register: typeof routes['auth.register']
  }
  newAccount: {
    store: typeof routes['new_account.store']
  }
  home: typeof routes['home']
  tickets: {
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
