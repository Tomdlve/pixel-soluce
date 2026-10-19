import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'solutions'

async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('ticket_id').unsigned().references('id').inTable('tickets').onDelete('CASCADE') // Si un ticket est supprimé, ses solutions sont supprimées avec
      
      table.string('pseudo').notNullable()
      table.text('hint_1').notNullable() // Indice léger
      table.text('hint_2').notNullable() // Piste précise
      table.text('full_answer').notNullable() // Solution directe

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}