import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable('users', (table) => {
      // add new columns or remove existing
      table.string('firstname').nullable()
      table.string('lastname').nullable()
    })
  }

  async down() {
    this.schema.alterTable('users', (table) => {
      // revert changes
      table.dropColumn('firstname')
      table.dropColumn('lastname')
    })
  }
}