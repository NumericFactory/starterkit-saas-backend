import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'add_validated_at_to_users'

  async up() {
    this.schema.alterTable('users', (table) => {
      // add new column to the table
      table.timestamp('validated_at').nullable()
    })
  }

  async down() {
    this.schema.alterTable('users', (table) => {
      // revert changes
      table.dropColumn('validated_at')
    })
  }
}