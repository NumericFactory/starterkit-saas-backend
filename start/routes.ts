/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
*/
import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controllers/auth_controller';
import UserController from '../app/controllers/auth_controllers/user_controller.js';
import { middleware } from './kernel.js';
import { Role } from '#middleware/authorize_middleware';
import AdminController from '#controllers/auth_controllers/admin_controller';


// 1 Authentication routes
router.group(() => {
  router.post('/auth/register', [AuthController, 'register']);
  router.get('/auth/validate-account', [AuthController, 'validateAccount']);
  router.post('/auth/login', [AuthController, 'login']);
  router.post('/auth/remember-password', [AuthController, 'rememberPassword']);
  router.post('/auth/reset-password', [AuthController, 'resetPassword']);
  // router.get('/auth/logout', [AuthController, 'logout']).use(middleware.auth({ guards: ['api'] })).as('user.logout')
}).prefix('/api/v1')


/**
 * 2 User routes
 *   Define here what your users can do
 */
router.group(() => {
  router.get('/me', [UserController, 'show']);
  router.get('/movie/:id/comments', [UserController, 'getComments'])
  router.post('/movie/:id/comments', [UserController, 'postComment'])
  // add more routes here
})
  .prefix('/api/v1')
  .middleware(middleware.auth({ guards: ['api'] }))
  .middleware(middleware.authorize({ guards: [Role.user, Role.admin, Role.poweradmin] }))


// 3 Admin routes 
router.group(() => {
  router.get('/users', [AdminController, 'getUsers'])
  router.get('/users/:id', [UserController, 'show'])
})
  .prefix('/api/v1/admin')
  .middleware(middleware.auth({ guards: ['api'] }))
  .middleware(middleware.authorize({ guards: [Role.admin] }))


// 4 PowerAdmin routes
router.group(() => {
  router.post('/users', [AdminController, 'registerUser'])
  router.put('/users/:id', [AdminController, 'updateUser'])
  router.delete('/users/:id/', [AdminController, 'deleteUser'])
  router.post('/users/:id/roles', [AdminController, 'setRole'])
})
  .prefix('/api/v1/admin')
  .middleware(middleware.auth({ guards: ['api'] }))
// .middleware(middleware.authorize({ guards: [Role.poweradmin] }))


// Home public route
router.get('/', async () => {
  return `<h1>SaaS Airskill Auth System</h1><p>@airskill.fr ©2024</p>`
})


router.group(() => {
  // admin auth
  router.get('admin/register', [AdminController, 'viewRegisterAdmin']).as('admin.register')
  router.post('admin/register', [AdminController, 'handleRegisterAdmin'])
  router.get('admin/login', [AdminController, 'viewLoginAdmin']).as('admin.login')
  router.post('admin/login', [AdminController, 'handleLoginAdmin'])
})
  .middleware(middleware.guest({ guards: ['web'] }))

router.group(() => {
  // admin routes
  router.post('admin/logout', [AdminController, 'logout']).as('admin.logout')
  router.get('/admin', [AdminController, 'home']).as('admin.home')
  router.get('/admin/users', [AdminController, 'getUsers']).as('admin.users')
  router.get('/admin/users/:id', [AdminController, 'getUser']).as('admin.user-edit')
  router.get('/admin/roles', [AdminController, 'getRoles']).as('admin.roles')
  router.get('/admin/roles/add', [AdminController, 'addRole']).as('admin.role-add')

})
  .middleware(middleware.auth({ guards: ['web'] }))
  .middleware(middleware.authorize({ guards: [Role.poweradmin] }))
