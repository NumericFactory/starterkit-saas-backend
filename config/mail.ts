import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'resend',


  // static address for the "from" property.
  from: {
    address: 'contact@skill.fr',
    name: 'Fred de Airskill',
  },

  // static address for the "replyTo" property.
  replyTo: {
    address: 'noreply@skill.fr',
    name: 'Fred de Airskill',
  },

  /**
   * The mailers object can be used to configure multiple mailers
   * each using a different transport or same transport with different
   * options.
  */
  mailers: {
    resend: transports.resend({
      key: env.get('RESEND_API_KEY'),
      baseUrl: 'https://api.resend.com',
    }),

  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> { }
}