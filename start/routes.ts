import router from '@adonisjs/core/services/router'

const TicketsController = () => import('#controllers/tickets_controller')
const SolutionsController = () => import('#controllers/solutions_controller')

// Routes pour les Tickets (CRUD complet)
router.get('/', [TicketsController, 'index'])
router.get('/tickets/:id', [TicketsController, 'show'])
router.post('/tickets', [TicketsController, 'store'])
router.patch('/tickets/:id/toggle', [TicketsController, 'toggleStatus'])
router.delete('/tickets/:id', [TicketsController, 'destroy'])

// Routes pour les Solutions
router.post('/tickets/:ticketId/solutions', [SolutionsController, 'store'])
router.delete('/solutions/:id', [SolutionsController, 'destroy'])