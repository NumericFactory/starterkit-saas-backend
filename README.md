## STARTERKIT SaaS App
Based on nodeJS with Adonis Framework. 
This is a role based app with 3 sections : 
- user
- admin
- power admin

the auth system is build on OAT tokens. 
Server keep tokens in DB and each token belongs to a user in DB

@Author : Frederic Lossignol, Senior software dev & teacher.
Feel free to talk with me on my <a href="https://www.linkedin.com/in/flossignol/">Linkedin Profile</a>

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
Now you can test API on postman or use endpoins in frontend app

GUEST
| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `POST`    | `/auth/register`                        | user create a new account                |
| `GET`   | `/auth/validate-account`                  | user validate his account                |
| `POST`    | `/auth/login`                           | user login                               |
| `POST`  | `/auth/remember-password`                 | user ask a new password                  |
| `POST`   | `/auth/reset-password`                   | user set a new password                  |
| `GET`    | `/auth/logout`                           | user logout                              |

USER
| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `/me`                                    | user can fetch his data                  |

ADMIN
| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `GET`    | `/admin/users`                           | admin can ask users list                 |
| `GET`    | `/admin/users/:id`                       | admin can ask user detail                |
| `POST`   | `/admin/users`                           | admin can create user                    |
| `PUT`    | `/admin/users/:id`                       | admin can update user                    |
| `DELETE` | `/admin/users/:id`                       | admin can delete user                    |
| `POST`   | `/admin/users/:id/roles`                 | admin can set roles of a user                   |
