import { Head, Link, router, useForm, usePage } from '@inertiajs/react'
import React from 'react'
import '../css/ticket_show.css'

interface Solution {
  id: number
  userId: number
  pseudo: string
  hint1: string
  hint2: string
  fullAnswer: string
}

interface Ticket {
  id: number
  userId: number
  pseudo: string
  game: string
  title: string
  description: string
  isResolved: boolean
  solutions: Solution[]
}

export default function TicketShow({ ticket }: { ticket: Ticket }) {
  // Récupération de l'utilisateur connecté
  const { user } = usePage().props as { user?: { id: number; fullName: string } }

  const { data, setData, post, processing, reset, errors } = useForm({
    pseudo: '',
    hint1: '',
    hint2: '',
    fullAnswer: '',
  })

  const handleSolutionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post(`/tickets/${ticket.id}/solutions`, {
      onSuccess: () => reset(),
    })
  }

  return (
    <main className="ps-app">
      <Head title={`${ticket.title} | Pixel-Soluce`} />

      <Link href="/" className="ps-back">
        ← Retour aux demandes
      </Link>

      {/* DÉTAIL DU PROBLÈME */}
      <article className="ps-card ps-detail-card">
        <header className="ps-card-meta">
          <span className="ps-tag">{ticket.game}</span>
          <span className={`ps-status ${ticket.isResolved ? 'is-resolved' : ''}`}>
            {ticket.isResolved ? 'Résolu' : 'En cours'}
          </span>
          <span className="ps-author">par {ticket.pseudo}</span>

          <div className="ps-actions">
            <button
              onClick={() => router.patch(`/tickets/${ticket.id}/toggle`)}
              className="ps-btn ps-btn--secondary ps-btn--sm"
            >
              {ticket.isResolved ? 'Rouvrir' : 'Marquer résolu'}
            </button>
            <button
              onClick={() => {
                if (confirm('Supprimer cette demande ?')) {
                  router.delete(`/tickets/${ticket.id}`)
                }
              }}
              className="ps-btn ps-btn--danger ps-btn--sm"
            >
              Supprimer
            </button>
          </div>
        </header>

        <h1>{ticket.title}</h1>
        <p className="ps-detail-desc">{ticket.description}</p>
      </article>

      {/* LISTE DES SOLUTIONS */}
      <section className="ps-section">
        <h2>Solutions ({ticket.solutions?.length || 0})</h2>
        <p className="ps-section-sub">
          Dévoilez les indices au fur et à mesure pour ne pas vous gâcher le jeu.
        </p>

        {!ticket.solutions || ticket.solutions.length === 0 ? (
          <p className="ps-empty">
            Aucune solution pour l'instant. Aidez {ticket.pseudo} avec le formulaire ci-dessous !
          </p>
        ) : (
          <div className="ps-list">
            {ticket.solutions.map((sol) => {
              // Vérifie si l'utilisateur connecté est l'auteur de la solution
              const isSolutionOwner = user && user.id === sol.userId

              return (
                <article key={sol.id} className="ps-card ps-solution-item">
                  <header className="ps-solution-header">
                    <span>Proposé par <strong>{sol.pseudo}</strong></span>

                    {/* Le bouton de suppression s'affiche uniquement pour le propriétaire */}
                    {isSolutionOwner && (
                      <button
                        onClick={() => {
                          if (confirm('Voulez-vous vraiment supprimer cette solution ?')) {
                            router.delete(`/solutions/${sol.id}`)
                          }
                        }}
                        className="ps-link-danger"
                      >
                        Supprimer
                      </button>
                    )}
                  </header>

                  <details className="ps-spoiler">
                    <summary>1. Indice léger</summary>
                    <p>{sol.hint1}</p>
                  </details>

                  <details className="ps-spoiler">
                    <summary>2. Piste précise</summary>
                    <p>{sol.hint2}</p>
                  </details>

                  <details className="ps-spoiler">
                    <summary>3. Solution complète</summary>
                    <p>{sol.fullAnswer}</p>
                  </details>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* FORMULAIRE POUR AJOUTER UNE SOLUTION */}
      <section className="ps-section ps-form-section">
        <h2>Proposer une solution en 3 étapes</h2>
        <form onSubmit={handleSolutionSubmit} className="ps-form">
          <label>
            <span>Votre pseudo</span>
            <input
              type="text"
              value={data.pseudo}
              onChange={(e) => setData('pseudo', e.target.value)}
              placeholder="Ex: GuideMaster"
              required
            />
            {errors.pseudo && <small className="ps-error">{errors.pseudo}</small>}
          </label>

          <label>
            <span>Étape 1 : Indice léger (orienter sans dévoiler)</span>
            <input
              type="text"
              value={data.hint1}
              onChange={(e) => setData('hint1', e.target.value)}
              placeholder="Ex: As-tu bien inspecté les tableaux au 2e étage ?"
              required
            />
            {errors.hint1 && <small className="ps-error">{errors.hint1}</small>}
          </label>

          <label>
            <span>Étape 2 : Piste précise (expliquer la mécanique)</span>
            <input
              type="text"
              value={data.hint2}
              onChange={(e) => setData('hint2', e.target.value)}
              placeholder="Ex: Compte les éléments rouges sur chaque tableau."
              required
            />
            {errors.hint2 && <small className="ps-error">{errors.hint2}</small>}
          </label>

          <label>
            <span>Étape 3 : Solution directe</span>
            <input
              type="text"
              value={data.fullAnswer}
              onChange={(e) => setData('fullAnswer', e.target.value)}
              placeholder="Ex: Le code du cadenas est 7-3-9."
              required
            />
            {errors.fullAnswer && <small className="ps-error">{errors.fullAnswer}</small>}
          </label>

          <button
            type="submit"
            disabled={processing}
            className="ps-btn ps-btn--primary"
          >
            {processing ? 'Publication...' : 'Publier la solution'}
          </button>
        </form>
      </section>
    </main>
  )
}