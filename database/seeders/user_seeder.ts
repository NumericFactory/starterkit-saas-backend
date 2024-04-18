import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        email: 'user@gg.co',
        password: 'secretpass',
        firstname: 'John',
        lastname: 'Doe',
        phone: '+33787878787',
      },
      {
        email: 'admin@gg.co',
        password: 'secretpass',
        firstname: 'Jane',
        lastname: 'Amin',
        phone: '+33720202020',
      },
      {
        email: 'power@gg.co',
        password: 'supersecretpass',
        firstname: 'Jack',
        lastname: 'Power',
        phone: '+33615151515',
      },
    ])

    // find the user and add roles
    const user1 = await User.findBy('email', 'user@gg.co')
    const user2 = await User.findBy('email', 'admin@gg.co')
    const user3 = await User.findBy('email', 'power@gg.co')
    if (user1) await user1.related('roles').sync([1])
    if (user2) await user2.related('roles').sync([2])
    if (user3) await user3.related('roles').sync([2, 3])

  }
}