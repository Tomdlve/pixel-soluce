import { Head, Link, useForm, router, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import NavLink from '../components/nav_link'
import '../css/home.css'

interface Solution {
  id: number
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

interface Filters {
  search?: string
  status?: string
}

export default function Home({ tickets, filters = {} }: { tickets: Ticket[]; filters?: Filters }) {
  // Récupération de l'utilisateur connecté via le middleware Inertia
  const { user } = usePage().props

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

  // Fonction pour supprimer un ticket (si on en est l'auteur)
  const handleDeleteTicket = (ticketId: number, e: React.MouseEvent) => {
    e.preventDefault() // Évite de cliquer sur le lien de la carte
    if (confirm('Voulez-vous vraiment supprimer ce ticket ?')) {
      router.delete(`/tickets/${ticketId}`)
    }
  }

  return (
    <main className="ps-app">
      <Head title="Pixel-Soluce | Forum d'entraide" />

      {/* NAVBAR UTILISANT TON NAVLINK AVEC LA ROUTE 'home' ET 'session.create' */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '10px 0', borderBottom: '1px solid #eaeaea' }}>
        <div>
          <NavLink route="home" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
            Pixel-Soluce
          </NavLink>
        </div>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>Bonjour, {user.fullName}</span>
            <Link 
              href="/logout" 
              method="post" 
              as="button" 
              style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', padding: 0 }}
            >
              Se déconnecter
            </Link>
          </div>
        ) : (
          <div>
            <NavLink route="session.create" style={{ textDecoration: 'none' }}>
              Se connecter
            </NavLink>
          </div>
        )}
      </nav>

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
            {tickets.map((ticket) => {
              // Vérifie si l'utilisateur connecté est le propriétaire du ticket
              const isOwner = user && user.id === ticket.userId

              return (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.id}`}
                  className="ps-card"
                  style={{ position: 'relative', display: 'block' }}
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span className="ps-card-soluces">
                      {ticket.solutions?.length || 0} soluce(s) disponible(s) →
                    </span>

                    {/* Bouton de suppression affiché uniquement pour le propriétaire */}
                    {isOwner && (
                      <button
                        onClick={(e) => handleDeleteTicket(ticket.id, e)}
                        style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', zIndex: 2 }}
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </Link>
              )
            })}
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