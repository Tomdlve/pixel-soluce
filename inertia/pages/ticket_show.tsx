import { Head, Link, router, useForm } from '@inertiajs/react'
import React from 'react'

interface Solution {
  id: number
  pseudo: string
  hint1: string
  hint2: string
  fullAnswer: string
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

export default function TicketShow({ ticket }: { ticket: Ticket }) {
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <Head title={`${ticket.title} | Pixel-Soluce`} />

      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-amber-400 hover:underline text-sm mb-6 inline-block">
          ← Retour à tous les S.O.S
        </Link>

        {/* DÉTAIL DU PROBLÈME */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
            <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">
              🎮 {ticket.game}
            </span>

            <div className="flex items-center gap-2">
              {/* BOUTON UPDATE (Résolu / Non résolu) */}
              <button
                onClick={() => router.patch(`/tickets/${ticket.id}/toggle`)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition ${
                  ticket.isResolved
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {ticket.isResolved ? '✅ Résolu (Cliquer pour rouvrir)' : '☑️ Marquer comme résolu'}
              </button>

              {/* BOUTON DELETE TICKET */}
              <button
                onClick={() => {
                  if (confirm('Supprimer ce S.O.S ?')) {
                    router.delete(`/tickets/${ticket.id}`)
                  }
                }}
                className="bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs px-3 py-1.5 rounded-lg cursor-pointer"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">{ticket.title}</h1>
          <p className="text-slate-300 whitespace-pre-line mb-4">{ticket.description}</p>
          <p className="text-xs text-slate-500">Demandé par <strong className="text-slate-300">{ticket.pseudo}</strong></p>
        </div>

        {/* LISTE DES SOLUTIONS ANTI-SPOIL (3 PALIERS) */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-amber-400">
            Réponses ({ticket.solutions?.length || 0})
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Clique sur les paliers un par un pour te débloquer la solution
          </p>

          {!ticket.solutions || ticket.solutions.length === 0 ? (
            <p className="text-slate-500 italic bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              Aucune réponse pour l'instant. Aide {ticket.pseudo} en remplissant le formulaire ci-dessous !
            </p>
          ) : (
            <div className="space-y-6">
              {ticket.solutions.map((sol) => (
                <div key={sol.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-sm text-slate-400">
                      Soluce proposée par <strong className="text-white">{sol.pseudo}</strong>
                    </span>
                    <button
                      onClick={() => router.delete(`/solutions/${sol.id}`)}
                      className="text-xs text-rose-400 hover:underline cursor-pointer"
                    >
                      Supprimer
                    </button>
                  </div>

                  {/* PALIER 1 */}
                  <details className="bg-slate-950 border border-slate-800 rounded-lg p-3 group">
                    <summary className="font-semibold text-emerald-400 cursor-pointer select-none">
                      🔍 Palier 1 : Indice léger (Cliquer pour dévoiler)
                    </summary>
                    <p className="mt-2 text-slate-200 pl-4 border-l-2 border-emerald-500">{sol.hint1}</p>
                  </details>

                  {/* PALIER 2 */}
                  <details className="bg-slate-950 border border-slate-800 rounded-lg p-3 group">
                    <summary className="font-semibold text-amber-400 cursor-pointer select-none">
                      🧭 Palier 2 : Piste précise (Cliquer pour dévoiler)
                    </summary>
                    <p className="mt-2 text-slate-200 pl-4 border-l-2 border-amber-500">{sol.hint2}</p>
                  </details>

                  {/* PALIER 3 */}
                  <details className="bg-slate-950 border border-rose-950/60 rounded-lg p-3 group">
                    <summary className="font-semibold text-rose-400 cursor-pointer select-none">
                      ⚠️ Palier 3 : Solution brute (Spoil complet)
                    </summary>
                    <p className="mt-2 text-slate-200 pl-4 border-l-2 border-rose-500">{sol.fullAnswer}</p>
                  </details>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FORMULAIRE POUR AJOUTER UNE SOLUTION */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 text-white">💡 Proposer une soluce en 3 paliers</h3>
          <form onSubmit={handleSolutionSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Ton Pseudo</label>
              <input
                type="text"
                value={data.pseudo}
                onChange={(e) => setData('pseudo', e.target.value)}
                placeholder="Ex: GuideMaster"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                required
              />
              {errors.pseudo && <p className="text-red-400 text-xs mt-1">{errors.pseudo}</p>}
            </div>

            <div>
              <label className="block text-sm text-emerald-400 mb-1">🔍 Palier 1 : Indice subtil (orienter sans donner la réponse)</label>
              <input
                type="text"
                value={data.hint1}
                onChange={(e) => setData('hint1', e.target.value)}
                placeholder="Ex: As-tu bien inspecté les tableaux au 2e étage ?"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                required
              />
              {errors.hint1 && <p className="text-red-400 text-xs mt-1">{errors.hint1}</p>}
            </div>

            <div>
              <label className="block text-sm text-amber-400 mb-1">🧭 Palier 2 : Piste précise (expliquer la mécanique)</label>
              <input
                type="text"
                value={data.hint2}
                onChange={(e) => setData('hint2', e.target.value)}
                placeholder="Ex: Compte les éléments rouges sur chaque tableau dans l'ordre du couloir."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                required
              />
              {errors.hint2 && <p className="text-red-400 text-xs mt-1">{errors.hint2}</p>}
            </div>

            <div>
              <label className="block text-sm text-rose-400 mb-1">⚠️ Palier 3 : Solution directe (pour ceux qui abandonnent)</label>
              <input
                type="text"
                value={data.fullAnswer}
                onChange={(e) => setData('fullAnswer', e.target.value)}
                placeholder="Ex: Le code du cadenas est 7-3-9."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                required
              />
              {errors.fullAnswer && <p className="text-red-400 text-xs mt-1">{errors.fullAnswer}</p>}
            </div>

            <button
              type="submit"
              disabled={processing}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg transition cursor-pointer"
            >
              {processing ? 'Publication...' : 'Envoyer ma soluce anti-spoil'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}