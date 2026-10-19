import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Ticket from '#models/ticket'

export default class Solution extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ticketId: number

  @column()
  declare pseudo: string

  @column()
  declare hint1: string

  @column()
  declare hint2: string

  @column()
  declare fullAnswer: string

  @belongsTo(() => Ticket)
  declare ticket: BelongsTo<typeof Ticket>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}