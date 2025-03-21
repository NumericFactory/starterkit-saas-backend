import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  async up() {
    this.schema.alterTable('comments', (table) => {
      // add new column to the table
      table.integer('score').nullable()
    })
  }

  async down() {
    this.schema.alterTable('comments', (table) => {
      // revert changes
      table.dropColumn('score')
    })
  }
}