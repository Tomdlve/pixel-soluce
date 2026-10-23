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
  // Afficher tous les tickets sur la page d'accueil (avec filtres)
  async index({ request, inertia }: HttpContext) {
    const { search, status } = request.qs()

    const query = Ticket.query().preload('solutions').orderBy('created_at', 'desc')

    if (search) {
      query.where('game', 'LIKE', `%${search}%`)
    }

    if (status === 'resolved') {
      query.where('is_resolved', true)
    } else if (status === 'pending') {
      query.where('is_resolved', false)
    }

    const tickets = await query
    return inertia.render('home' as any, {
      tickets: tickets.map((t) => t.serialize()),
      filters: { search, status },
    })
  }

  // Afficher un ticket précis et ses solutions
  async show({ params, inertia }: HttpContext) {
    const ticket = await Ticket.query()
      .where('id', params.id)
      .preload('solutions', (query) => query.orderBy('created_at', 'asc'))
      .firstOrFail()

    return inertia.render('ticket_show' as any, { ticket: ticket.serialize() })
  }

  // CREATE : Enregistrer un nouveau ticket lié à l'utilisateur connecté
  async store({ request, response, auth }: HttpContext) {
    if (!auth.user) {
      return response.redirect().toRoute('session.create')
    }

    const payload = await request.validateUsing(createTicketValidator)

    await Ticket.create({
      ...payload,
      userId: auth.user.id,
      isResolved: false,
    })

    return response.redirect().back()
  }

  // UPDATE : Basculer le statut (sécurisé : propriétaire uniquement)
  async toggleStatus({ params, response, auth }: HttpContext) {
    const ticket = await Ticket.findOrFail(params.id)

    if (!auth.user || ticket.userId !== auth.user.id) {
      return response.forbidden('Action non autorisée sur ce ticket.')
    }

    ticket.isResolved = !ticket.isResolved
    await ticket.save()
    return response.redirect().back()
  }

  // DELETE : Supprimer un ticket (sécurisé : propriétaire uniquement)
  async destroy({ params, response, auth }: HttpContext) {
    const ticket = await Ticket.findOrFail(params.id)

    if (!auth.user || ticket.userId !== auth.user.id) {
      return response.forbidden('Action non autorisée sur ce ticket.')
    }

    await ticket.delete()
    return response.redirect().toPath('/')
  }
}