import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'tickets.index': { paramsTuple?: []; params?: {} }
    'tickets.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tickets.store': { paramsTuple?: []; params?: {} }
    'tickets.toggle_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'tickets.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'solutions.store': { paramsTuple: [ParamValue]; params: {'ticketId': ParamValue} }
    'solutions.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'tickets.index': { paramsTuple?: []; params?: {} }
    'tickets.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'tickets.index': { paramsTuple?: []; params?: {} }
    'tickets.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'tickets.store': { paramsTuple?: []; params?: {} }
    'solutions.store': { paramsTuple: [ParamValue]; params: {'ticketId': ParamValue} }
  }
  PATCH: {
    'tickets.toggle_status': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'tickets.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'solutions.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}