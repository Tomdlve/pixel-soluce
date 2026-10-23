import router from '@adonisjs/core/services/router'

const TicketsController = () => import('#controllers/tickets_controller')
const SolutionsController = () => import('#controllers/solutions_controller')
const SessionController = () => import('#controllers/session_controller')
const NewAccountController = () => import('#controllers/new_account_controller') // Ajuste le nom de ton contrôleur d'inscription si besoin

// Routes d'authentification (Connexion)
router.get('/login', async ({ inertia }) => {
  return inertia.render('auth/login', {})
}).as('auth.login').as('session.create')

router.post('/login', [SessionController, 'store']).as('session.store')

// Routes d'authentification (Inscription) - Enregistrée en POST pour le formulaire
router.get('/register', async ({ inertia }) => {
  return inertia.render('auth/signup' as any, {})
}).as('auth.register')

router.post('/register', [NewAccountController, 'store']).as('new_account.store')

router.post('/logout', async ({ auth, response }) => {
  await auth.use('web').logout()
  return response.redirect('/')
})

// Routes pour les Tickets (CRUD complet)
router.get('/', [TicketsController, 'index']).as('home')
router.get('/tickets/:id', [TicketsController, 'show'])
router.post('/tickets', [TicketsController, 'store'])
router.patch('/tickets/:id/toggle', [TicketsController, 'toggleStatus'])
router.delete('/tickets/:id', [TicketsController, 'destroy'])

// Routes pour les Solutions
router.post('/tickets/:ticketId/solutions', [SolutionsController, 'store'])
router.delete('/solutions/:id', [SolutionsController, 'destroy'])