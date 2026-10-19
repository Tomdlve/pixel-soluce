import type { HttpContext } from '@adonisjs/core/http'
import Ticket from '#models/ticket'
import vine from '@vinejs/vine'

// Schéma de validation VineJS pour un Ticket
const createTicketValidator = vine.compile(
  vine.object({
    pseudo: vine.string().trim().minLength(2).maxLength(50),
    game: vine.string().trim().minLength(2).maxLength(100),
    title: vine.string().trim().minLength(5).maxLength(150),
    description: vine.string().trim().minLength(10),
  })
)

export default class TicketsController {
  // READ : Afficher tous les tickets avec filtres optionnels (recherche par jeu & statut)
  async index({ request, inertia }: HttpContext) {
    const search = request.input('search')
    const status = request.input('status')

    // On initialise la requête Lucid ORM de base
    const query = Ticket.query().preload('solutions').orderBy('created_at', 'desc')

    // 1. Filtrer par nom de jeu si le paramètre 'search' est présent
    if (search) {
      query.where('game', 'like', `%${search}%`)
    }

    // 2. Filtrer par statut (résolu ou en galère) si le paramètre 'status' est présent
    if (status === 'resolved') {
      query.where('isResolved', true)
    } else if (status === 'pending') {
      query.where('isResolved', false)
    }

    const tickets = await query

    // On renvoie les tickets ET les filtres actifs à React pour garder l'état visuel
    return inertia.render('home', { 
      tickets, 
      filters: { search, status } 
    })
  }

  // READ : Afficher un ticket précis et ses solutions
  async show({ params, inertia }: HttpContext) {
    const ticket = await Ticket.query()
      .where('id', params.id)
      .preload('solutions', (query) => query.orderBy('created_at', 'asc'))
      .firstOrFail()

    return inertia.render('ticket_show', { ticket: ticket.serialize() })
  }

  // CREATE : Enregistrer un nouveau ticket
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createTicketValidator)
    await Ticket.create({
      ...payload,
      isResolved: false,
    })
    return response.redirect().back()
  }

  // UPDATE : Basculer le statut Résolu / Non résolu
  async toggleStatus({ params, response }: HttpContext) {
    const ticket = await Ticket.findOrFail(params.id)
    ticket.isResolved = !ticket.isResolved
    await ticket.save()
    return response.redirect().back()
  }

  // DELETE : Supprimer un ticket
  async destroy({ params, response }: HttpContext) {
    const ticket = await Ticket.findOrFail(params.id)
    await ticket.delete()
    return response.redirect().toPath('/')
  }
}