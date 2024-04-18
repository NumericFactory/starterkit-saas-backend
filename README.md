

## BACKEND ADONIS JS
I build this starterkit to build skeleton app ready for Saas Development MVP
### Stack
- backend : Adonis JS
- DB : SQL (but you ca go with Postgre if you want)
- frontend : Angular (React & VueJs are in my todo)
- mail service : resend.com (you can use another but resend is pretty cool)

@Author : Frederic Lossignol, Senior software dev & teacher.
Feel free to talk with me on my <a href="">Linkin Profile</a>

------------------------

### Install dependencies
`npm install`
 
### install the DB
Connect your SQL DB
in .env file, please provide your access data
`node ace migration:status`
`node ace migration:run`
`node ace migration:status`

### Seed the DB
`node ace db:seed`

### Run app on localhost:3333
`npm run dev`

### test endpoints

-------------------

## FRONTEND ANGULAR

### Install dependencies
`npm install`

### Run app on localhost:4200
`ng serve` 