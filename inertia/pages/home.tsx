import { Head, Link, useForm, router } from '@inertiajs/react'
import React, { useState } from 'react'

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

export default function Home({ tickets, filters = {} }: { tickets: Ticket[]; filters?: Filters }) {  // Gestion du formulaire de création de S.O.S
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <Head title="Pixel-Soluce | S.O.S. Anti-Spoil" />

      <div className="max-w-4xl mx-auto">
        {/* EN-TÊTE */}
        <header className="mb-10 text-center border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-extrabold text-amber-400 tracking-tight mb-2">
            👾 PIXEL-SOLUCE
          </h1>
          <p className="text-slate-400">
            Le forum d'entraide <span className="text-amber-300 font-semibold">par indices progressifs.</span> 
          </p>
        </header>

        {/* FORMULAIRE DE CRÉATION DE TICKET (S.O.S) */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-10 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-amber-400">Lancer un S.O.S</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Ton Pseudo</label>
                <input
                  type="text"
                  value={data.pseudo}
                  onChange={(e) => setData('pseudo', e.target.value)}
                  placeholder="Ex: LinkDu77"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
                {errors.pseudo && <p className="text-red-400 text-xs mt-1">{errors.pseudo}</p>}
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Jeu vidéo</label>
                <input
                  type="text"
                  value={data.game}
                  onChange={(e) => setData('game', e.target.value)}
                  placeholder="Ex: Ico, Silent Hill 2..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
                {errors.game && <p className="text-red-400 text-xs mt-1">{errors.game}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Sujet</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                placeholder="Ex: Bloqué devant le cadenas de l'hôpital (sans spoil svp !)"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                required
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Où en es-tu exactement ? (Min. 10 caractères)</label>
              <textarea
                rows={3}
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Explique ce que tu as déjà trouvé pour qu'on t'aide sans te spoiler la suite..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                required
              />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
            </div>

            <button
              type="submit"
              disabled={processing}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg transition cursor-pointer"
            >
              {processing ? 'Envoi...' : 'Publier mon S.O.S'}
            </button>
          </form>
        </section>

        {/* SECTION RECHERCHE ET FILTRES */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Barre de recherche par jeu */}
          <div className="w-full md:w-1/2 flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Rechercher un jeu (ex: Ico, Zelda...)"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
            />
            <button
              onClick={() => handleFilterChange(undefined, search)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
            >
              Filtrer
            </button>
          </div>

          {/* Boutons de filtres par statut */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end overflow-x-auto">
            <button
              onClick={() => handleFilterChange('', search)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                !filters.status ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => handleFilterChange('pending', search)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                filters.status === 'pending' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ⏳ En galère
            </button>
            <button
              onClick={() => handleFilterChange('resolved', search)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                filters.status === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ✅ Résolus
            </button>
          </div>
        </section>

        {/* LISTE DES TICKETS */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📋 Les appels à l'aide</h2>
          {tickets.length === 0 ? (
            <p className="text-slate-500 italic bg-slate-900/40 p-6 rounded-xl border border-slate-800/60 text-center">
              Aucun S.O.S trouvé avec ces critères.
            </p>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.id}`}
                  className="block bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-xl p-5 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                      🎮 {ticket.game}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        ticket.isResolved
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {ticket.isResolved ? '✅ Résolu' : '⏳ En cours'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{ticket.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-3">{ticket.description}</p>

                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Posté par <strong className="text-slate-300">{ticket.pseudo}</strong></span>
                    <span className="text-amber-400 font-medium">
                      💡 {ticket.solutions?.length || 0} soluce(s) anti-spoil →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}