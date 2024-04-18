import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'add_phone_at_to_users'

  async up() {
    this.schema.alterTable('users', (table) => {
      // add new column to the table
      table.string('phone').nullable()
    })
  }

  async down() {
    this.schema.alterTable('users', (table) => {
      // revert changes
      table.dropColumn('phone')
    })
  }
}