'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Property } from '@/data/properties'

interface Props {
  properties: Property[]
}

function StatusBadge({ status }: { status?: string }) {
  if (status === 'approved') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
        Aprovado
      </span>
    )
  }
  if (status === 'rejected') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
        Recusado
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
      Pendente
    </span>
  )
}

function typeLabel(type: string) {
  const map: Record<string, string> = {
    apartment: 'Apartamento', house: 'Casa', commercial: 'Comercial', land: 'Terreno',
  }
  return map[type] ?? type
}

function formatPrice(p: Property) {
  const n = p.price.amount.toLocaleString('pt-BR')
  const currency = p.price.currency === 'BRL' ? 'R$' : p.price.currency === 'USD' ? 'US$' : 'CA$'
  return p.price.type === 'rent' ? `${currency} ${n}/mês` : `${currency} ${n}`
}

export default function UserDashboardClient({ properties: initialProperties }: Props) {
  const [properties, setProperties] = useState<Property[]>(initialProperties)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/user/properties/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProperties(prev => prev.filter(p => p.id !== id))
        showToast('Imóvel excluído.', 'success')
      } else {
        showToast('Erro ao excluir imóvel.', 'error')
      }
    } catch {
      showToast('Erro de conexão.', 'error')
    } finally {
      setDeletingId(null)
      setConfirmDelete(null)
    }
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A5F]">Meus Imóveis</h1>
          <p className="text-sm text-[#6B6B99] mt-1">
            {properties.length === 0
              ? 'Nenhum imóvel cadastrado ainda'
              : `${properties.length} imóvel${properties.length !== 1 ? 'is' : ''} cadastrado${properties.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link
          href="/user/properties/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#6B6B99] hover:bg-[#4F4F6B] text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Cadastrar Imóvel
        </Link>
      </div>

      {/* Empty state */}
      {properties.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E6E6EF] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F7F7FA] flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#A3A3C2]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-[#1E3A5F] mb-2">Nenhum imóvel ainda</h3>
          <p className="text-sm text-[#6B6B99] mb-6">
            Cadastre seu primeiro imóvel para que ele seja avaliado pelo nosso time.
          </p>
          <Link
            href="/user/properties/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6B6B99] hover:bg-[#4F4F6B] text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Cadastrar primeiro imóvel
          </Link>
        </div>
      )}

      {/* Properties list */}
      {properties.length > 0 && (
        <div className="space-y-3">
          {properties.map(property => (
            <div key={property.id} className="bg-white rounded-2xl border border-[#E6E6EF] p-4">
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#F7F7FA]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={property.media.thumbnail || property.img}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = '/placeholder-property.svg' }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1E3A5F] truncate">{property.title}</p>
                      <p className="text-xs text-[#6B6B99] mt-0.5">
                        {typeLabel(property.propertyDetails.type)} · {formatPrice(property)}
                      </p>
                    </div>
                    <StatusBadge status={property.adminStatus ?? 'pending'} />
                  </div>

                  {/* View count */}
                  {(property.metrics?.views ?? 0) > 0 && (
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-[#A3A3C2]">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.637 0-8.572-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.metrics.views} visualizaç{property.metrics.views === 1 ? 'ão' : 'ões'}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <Link
                    href={`/user/properties/${property.id}/edit`}
                    className="text-xs text-[#6B6B99] hover:text-[#4F4F6B] border border-[#E6E6EF] rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => setConfirmDelete(property.id)}
                    className="text-xs text-red-500 hover:text-red-700 border border-red-100 hover:border-red-200 rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap"
                  >
                    Excluir
                  </button>
                </div>
              </div>

              {/* Rejection reason */}
              {property.adminStatus === 'rejected' && property.rejectionReason && (
                <div className="mt-3 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                  <p className="text-xs font-semibold text-red-700 mb-0.5">Motivo da recusa:</p>
                  <p className="text-xs text-red-600">{property.rejectionReason}</p>
                  <p className="text-xs text-red-500 mt-1.5">
                    Você pode editar o imóvel e enviá-lo para aprovação novamente.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-[#1E3A5F] mb-1">Excluir imóvel?</h3>
            <p className="text-sm text-[#6B6B99] mb-5">Esta ação não pode ser desfeita. O imóvel será removido permanentemente.</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm text-[#6B6B99] hover:text-[#4F4F6B] transition-colors">
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete}
                className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50"
              >
                {deletingId === confirmDelete ? 'Excluindo...' : 'Sim, excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={[
          'fixed top-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl shadow-lg text-sm font-medium',
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white',
        ].join(' ')}>
          {toast.msg}
        </div>
      )}

      {/* Info box */}
      <div className="mt-8 bg-[#6B6B99]/5 border border-[#6B6B99]/15 rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-[#4F4F6B] mb-2">Como funciona?</h4>
        <ul className="text-xs text-[#6B6B99] space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 w-4 h-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
            Cadastre seu imóvel e envie para análise.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 w-4 h-4 rounded-full bg-[#6B6B99]/15 text-[#6B6B99] flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
            Nossa equipe avalia e aprova em até 24 horas.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 w-4 h-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
            Após aprovação, seu imóvel aparece no site.
          </li>
        </ul>
      </div>
    </div>
  )
}
