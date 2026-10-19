import { Head, Link, useForm, router } from '@inertiajs/react'
import React, { useState } from 'react'
import '../css/home.css'

interface Solution {
  id: number
}

interface Ticket {
  id: number
  pseudo: string
  game: string
  title: string
  description: string
  isResolved: boolean
  solutions: Solution[]
}

interface Filters {
  search?: string
  status?: string
}

export default function Home({ tickets, filters = {} }: { tickets: Ticket[]; filters?: Filters }) {
  // Gestion du formulaire de création de S.O.S
  const { data, setData, post, processing, reset, errors } = useForm({
    pseudo: '',
    game: '',
    title: '',
    description: '',
  })

  // États locaux pour les filtres de recherche
  const [search, setSearch] = useState(filters?.search || '')
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/tickets', {
      onSuccess: () => reset(),
    })
  }

  // Fonction pour déclencher le filtre / recherche via Inertia
  const handleFilterChange = (newStatus?: string, newSearch?: string) => {
    router.get(
      '/',
      {
        status: newStatus !== undefined ? newStatus : filters.status,
        search: newSearch !== undefined ? newSearch : search,
      },
      {
        preserveState: true,
        replace: true,
      }
    )
  }

  return (
    <main className="ps-app">
      <Head title="Pixel-Soluce | Forum d'entraide" />

      {/* EN-TÊTE */}
      <header className="ps-header">
        <h1>Pixel-Soluce</h1>
        <p>Le forum d'entraide par indices progressifs, sans spoil.</p>
      </header>

      {/* RECHERCHE ET FILTRES */}
      <section className="ps-filters">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un jeu (ex: Ico, Zelda...)"
          className="ps-input"
        />
        <button
          onClick={() => handleFilterChange(undefined, search)}
          className="ps-btn ps-btn--secondary"
        >
          Filtrer
        </button>

        <div className="ps-filter-tabs">
          <button
            onClick={() => handleFilterChange('', search)}
            className={`ps-tab ${!filters.status ? 'is-active' : ''}`}
          >
            Tous
          </button>
          <button
            onClick={() => handleFilterChange('pending', search)}
            className={`ps-tab ${filters.status === 'pending' ? 'is-active' : ''}`}
          >
            En cours
          </button>
          <button
            onClick={() => handleFilterChange('resolved', search)}
            className={`ps-tab ${filters.status === 'resolved' ? 'is-active' : ''}`}
          >
            Résolus
          </button>
        </div>
      </section>

      {/* LISTE DES TICKETS */}
      <section className="ps-section">
        <h2>Appels à l'aide</h2>
        {tickets.length === 0 ? (
          <p className="ps-empty">Aucune demande trouvée avec ces critères.</p>
        ) : (
          <div className="ps-list">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className="ps-card"
              >
                <div className="ps-card-meta">
                  <span className="ps-tag">{ticket.game}</span>
                  <span className={`ps-status ${ticket.isResolved ? 'is-resolved' : ''}`}>
                    {ticket.isResolved ? 'Résolu' : 'En cours'}
                  </span>
                  <span className="ps-author">par {ticket.pseudo}</span>
                </div>

                <h3>{ticket.title}</h3>
                <p>{ticket.description}</p>

                <span className="ps-card-soluces">
                  {ticket.solutions?.length || 0} soluce(s) disponible(s) →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* FORMULAIRE DE CRÉATION */}
      <section className="ps-section ps-form-section">
        <h2>Lancer un S.O.S</h2>
        <form onSubmit={handleSubmit} className="ps-form">
          <div className="ps-form-grid">
            <label>
              <span>Ton Pseudo</span>
              <input
                type="text"
                value={data.pseudo}
                onChange={(e) => setData('pseudo', e.target.value)}
                placeholder="Ex: LinkDu77"
                required
              />
              {errors.pseudo && <small className="ps-error">{errors.pseudo}</small>}
            </label>

            <label>
              <span>Jeu vidéo</span>
              <input
                type="text"
                value={data.game}
                onChange={(e) => setData('game', e.target.value)}
                placeholder="Ex: Ico, Silent Hill 2..."
                required
              />
              {errors.game && <small className="ps-error">{errors.game}</small>}
            </label>
          </div>

          <label>
            <span>Sujet</span>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              placeholder="Ex: Bloqué devant le cadenas de l'hôpital"
              required
            />
            {errors.title && <small className="ps-error">{errors.title}</small>}
          </label>

          <label>
            <span>Où en es-tu exactement ?</span>
            <textarea
              rows={3}
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              placeholder="Explique ce que tu as déjà trouvé pour qu'on t'aide sans te spoiler la suite..."
              required
            />
            {errors.description && <small className="ps-error">{errors.description}</small>}
          </label>

          <button
            type="submit"
            disabled={processing}
            className="ps-btn ps-btn--primary"
          >
            {processing ? 'Envoi...' : 'Publier mon S.O.S'}
          </button>
        </form>
      </section>
    </main>
  )
}