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
  // READ : Afficher tous les tickets sur la page d'accueil
  async index({ inertia }: HttpContext) {
    const tickets = await Ticket.query().preload('solutions').orderBy('created_at', 'desc')
    return inertia.render('home', { tickets })
  }

  // READ : Afficher un ticket précis et ses solutions
  async show({ params, inertia }: HttpContext) {
    const ticket = await Ticket.query()
      .where('id', params.id)
      .preload('solutions', (query) => query.orderBy('created_at', 'asc'))
      .firstOrFail()

    // .serialize() permet de transmettre proprement l'ID et les relations à React
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