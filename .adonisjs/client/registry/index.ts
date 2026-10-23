/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [[0,"login"]],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [[0,"login"]],
    types: placeholder as Registry['session.store']['types'],
  },
  'auth.register': {
    methods: ["GET","HEAD"],
    pattern: '/register',
    tokens: [[0,"register"]],
    types: placeholder as Registry['auth.register']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/register',
    tokens: [[0,"register"]],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [[0,"/"]],
    types: placeholder as Registry['home']['types'],
  },
  'tickets.show': {
    methods: ["GET","HEAD"],
    pattern: '/tickets/:id',
    tokens: [[0,"tickets"],[1,"id"]],
    types: placeholder as Registry['tickets.show']['types'],
  },
  'tickets.store': {
    methods: ["POST"],
    pattern: '/tickets',
    tokens: [[0,"tickets"]],
    types: placeholder as Registry['tickets.store']['types'],
  },
  'tickets.toggle_status': {
    methods: ["PATCH"],
    pattern: '/tickets/:id/toggle',
    tokens: [[0,"tickets"],[1,"id"],[0,"toggle"]],
    types: placeholder as Registry['tickets.toggle_status']['types'],
  },
  'tickets.destroy': {
    methods: ["DELETE"],
    pattern: '/tickets/:id',
    tokens: [[0,"tickets"],[1,"id"]],
    types: placeholder as Registry['tickets.destroy']['types'],
  },
  'solutions.store': {
    methods: ["POST"],
    pattern: '/tickets/:ticketId/solutions',
    tokens: [[0,"tickets"],[1,"ticketId"],[0,"solutions"]],
    types: placeholder as Registry['solutions.store']['types'],
  },
  'solutions.destroy': {
    methods: ["DELETE"],
    pattern: '/solutions/:id',
    tokens: [[0,"solutions"],[1,"id"]],
    types: placeholder as Registry['solutions.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
