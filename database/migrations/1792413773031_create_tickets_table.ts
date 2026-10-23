import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tickets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      // Clé étrangère pour lier le ticket à l'utilisateur connecté
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.string('pseudo').notNullable()
      table.string('game').notNullable()
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.boolean('is_resolved').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}