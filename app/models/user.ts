import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Role from './role.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'



const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {



  @manyToMany(() => Role, {
    pivotTable: 'users_roles',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'role_id'
  })
  declare roles: ManyToMany<typeof Role>

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare firstname: string | null

  @column()
  declare lastname: string | null

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare phone: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare validatedAt: DateTime | null


  // @beforeSave()
  // public static async hashPassword(user: User) {
  //   if (user.$dirty.password) {
  //     user.password = await hash.make(user.password)
  //   }
  // }


  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    //tokenSecretLength: 40,
  })
}