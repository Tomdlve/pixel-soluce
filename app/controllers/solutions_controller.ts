import type { HttpContext } from '@adonisjs/core/http'
import Solution from '#models/solution'
import vine from '@vinejs/vine'

// Validation de la solution
const createSolutionValidator = vine.compile(
  vine.object({
    pseudo: vine.string().trim().minLength(2).maxLength(50),
    hint1: vine.string().trim().minLength(5),
    hint2: vine.string().trim().minLength(5),
    fullAnswer: vine.string().trim().minLength(5),
  })
)

export default class SolutionsController {
  // Création de solution
  async store({ params, request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createSolutionValidator)
    
    await Solution.create({
      ...payload,
      ticketId: Number(params.ticketId),
      userId: auth.user!.id,
    })
    
    return response.redirect().back()
  }

  // DELETE : Supprimer une solution (Sécurisé)
  async destroy({ params, auth, response }: HttpContext) {
    const solution = await Solution.findOrFail(params.id)

    // Vérifie si l'utilisateur connecté est bien l'auteur de la solution
    if (solution.userId !== auth.user?.id) {
      return response.badRequest('Action non autorisée')
    }

    await solution.delete()
    return response.redirect().back()
  }
}