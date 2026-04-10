'use client'

import { useState } from 'react'
import type { Property } from '@/data/properties'
import type { UserAccount } from '@/lib/users'

type SafeUser = Omit<UserAccount, 'password_hash'>

interface Props {
  initialUsers: SafeUser[]
  initialProperties: Property[]
  userMap: Record<string, string>
}

type Tab = 'users' | 'properties'

function StatusBadge({ status }: { status: string }) {
  if (status === 'approved') return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Aprovado</span>
  )
  if (status === 'rejected') return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Recusado</span>
  )
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Pendente</span>
  )
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function formatPrice(p: Property) {
  const prefix = p.price.currency === 'BRL' ? 'R$' : p.price.currency === 'USD' ? 'US$' : 'CA$'
  const n = p.price.amount.toLocaleString('pt-BR')
  return `${prefix} ${n}${p.price.type === 'rent' ? '/mês' : ''}`
}

const FEATURE_LABELS: Record<string, string> = {
  balcony: 'Varanda', parking: 'Estacionamento', gym: 'Academia', pool: 'Piscina',
  garden: 'Jardim', furnished: 'Mobiliado', 'pet-friendly': 'Aceita Pets',
  concierge: 'Portaria', baccarat: 'Exclusivo Baccarat', fireplace: 'Lareira',
  rooftop: 'Cobertura', storage: 'Depósito', elevator: 'Elevador', security: 'Segurança',
  '24h security': 'Segurança 24h', 'ev charging': 'Carregador Elétrico',
}

function PropertyDetailModal({ property, ownerName, onClose }: {
  property: Property
  ownerName: string
  onClose: () => void
}) {
  const images = property.media?.images?.filter(Boolean) ?? []
  const thumbnail = property.media?.thumbnail || property.img
  const allImages = thumbnail ? [thumbnail, ...images.filter(i => i !== thumbnail)] : images
  const [activeImg, setActiveImg] = useState(0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6E6EF]">
          <div>
            <h2 className="text-base font-bold text-[#1E3A5F] line-clamp-1">{property.title}</h2>
            <p className="text-xs text-[#A3A3C2] mt-0.5">{property.id}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F7F7FA] text-[#6B6B99] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Image gallery */}
          {allImages.length > 0 && (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={allImages[activeImg]}
                alt={property.title}
                className="w-full h-48 object-cover rounded-xl bg-[#F7F7FA]"
                onError={e => { (e.target as HTMLImageElement).src = '/placeholder-property.svg' }}
              />
              {allImages.length > 1 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {allImages.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={img}
                      alt=""
                      onClick={() => setActiveImg(i)}
                      className={`w-12 h-10 object-cover rounded-lg cursor-pointer border-2 transition-colors ${i === activeImg ? 'border-[#6B6B99]' : 'border-transparent'}`}
                      onError={e => { (e.target as HTMLImageElement).src = '/placeholder-property.svg' }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-[#F7F7FA] rounded-xl p-3">
              <p className="text-xs text-[#A3A3C2] mb-0.5">Tipo</p>
              <p className="font-semibold text-[#1E3A5F] capitalize">{property.propertyDetails?.type ?? '—'}</p>
            </div>
            <div className="bg-[#F7F7FA] rounded-xl p-3">
              <p className="text-xs text-[#A3A3C2] mb-0.5">Preço</p>
              <p className="font-semibold text-[#1E3A5F]">{formatPrice(property)}</p>
            </div>
            <div className="bg-[#F7F7FA] rounded-xl p-3">
              <p className="text-xs text-[#A3A3C2] mb-0.5">Suítes / Lavabos</p>
              <p className="font-semibold text-[#1E3A5F]">
                {property.propertyDetails?.bedrooms ?? 0} suítes · {property.propertyDetails?.lavabo ?? property.propertyDetails?.bathrooms ?? 0} lavabos
              </p>
            </div>
            <div className="bg-[#F7F7FA] rounded-xl p-3">
              <p className="text-xs text-[#A3A3C2] mb-0.5">Área</p>
              <p className="font-semibold text-[#1E3A5F]">{property.propertyDetails?.areaSqFt ?? 0} m²</p>
            </div>
            <div className="bg-[#F7F7FA] rounded-xl p-3">
              <p className="text-xs text-[#A3A3C2] mb-0.5">Localização</p>
              <p className="font-semibold text-[#1E3A5F] text-xs">{property.location?.city}, {property.location?.province}</p>
              <p className="text-[#6B6B99] text-xs mt-0.5">{property.location?.address}</p>
            </div>
            <div className="bg-[#F7F7FA] rounded-xl p-3">
              <p className="text-xs text-[#A3A3C2] mb-0.5">Cadastrado por</p>
              <p className="font-semibold text-[#1E3A5F] text-xs">{ownerName}</p>
              <p className="text-[#6B6B99] text-xs mt-0.5">{property.timestamps?.createdAt ? formatDate(property.timestamps.createdAt) : '—'}</p>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div>
              <p className="text-xs font-semibold text-[#6B6B99] mb-1">Descrição</p>
              <p className="text-sm text-[#4F4F6B] leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Features */}
          {property.features?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[#6B6B99] mb-2">Características</p>
              <div className="flex flex-wrap gap-1.5">
                {property.features.map(f => (
                  <span key={f} className="px-2 py-0.5 bg-[#6B6B99]/10 text-[#4F4F6B] text-xs rounded-lg font-medium">
                    {FEATURE_LABELS[f] ?? f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="border-t border-[#E6E6EF] pt-3">
            <p className="text-xs font-semibold text-[#6B6B99] mb-2">Contato</p>
            <div className="space-y-1 text-sm">
              <p className="text-[#4F4F6B]"><span className="text-[#A3A3C2]">Nome:</span> {property.agent?.name ?? '—'}</p>
              <p className="text-[#4F4F6B]"><span className="text-[#A3A3C2]">Tel:</span> {property.agent?.phone ?? '—'}</p>
              <p className="text-[#4F4F6B]"><span className="text-[#A3A3C2]">E-mail:</span> {property.agent?.email ?? '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RejectionModal({ onConfirm, onCancel, loading }: {
  onConfirm: (reason: string) => void
  onCancel: () => void
  loading: boolean
}) {
  const [reason, setReason] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-base font-bold text-[#1E3A5F] mb-1">Recusar imóvel</h3>
        <p className="text-xs text-[#6B6B99] mb-4">O motivo será exibido ao usuário que cadastrou o imóvel.</p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={4}
          placeholder="Descreva o motivo da recusa (obrigatório)..."
          className="w-full px-3 py-2.5 bg-[#F7F7FA] border border-[#E6E6EF] rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-300/40 focus:border-red-300 transition resize-none"
        />
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-[#6B6B99] hover:text-[#4F4F6B] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!reason.trim()) return
              onConfirm(reason.trim())
            }}
            disabled={loading || !reason.trim()}
            className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Recusando...' : 'Confirmar Recusa'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ApprovalsClient({ initialUsers, initialProperties, userMap }: Props) {
  const [tab, setTab] = useState<Tab>('users')
  const [users, setUsers] = useState<SafeUser[]>(initialUsers)
  const [properties, setProperties] = useState<Property[]>(initialProperties)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [detailProperty, setDetailProperty] = useState<Property | null>(null)
  const [rejectTarget, setRejectTarget] = useState<string | null>(null)

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleUserAction(id: string, status: 'approved' | 'rejected') {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/approvals/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id))
        showToast(status === 'approved' ? 'Usuário aprovado.' : 'Usuário recusado.', 'success')
      } else {
        showToast('Erro ao atualizar status.', 'error')
      }
    } catch {
      showToast('Erro de conexão.', 'error')
    } finally {
      setLoadingId(null)
    }
  }

  async function handlePropertyApprove(id: string) {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/approvals/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminStatus: 'approved' }),
      })
      if (res.ok) {
        setProperties(prev => prev.filter(p => p.id !== id))
        showToast('Imóvel aprovado.', 'success')
      } else {
        showToast('Erro ao aprovar.', 'error')
      }
    } catch {
      showToast('Erro de conexão.', 'error')
    } finally {
      setLoadingId(null)
    }
  }

  async function handlePropertyReject(id: string, rejectionReason: string) {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/approvals/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminStatus: 'rejected', rejectionReason }),
      })
      if (res.ok) {
        setProperties(prev => prev.filter(p => p.id !== id))
        setRejectTarget(null)
        showToast('Imóvel recusado.', 'success')
      } else {
        showToast('Erro ao recusar.', 'error')
      }
    } catch {
      showToast('Erro de conexão.', 'error')
    } finally {
      setLoadingId(null)
    }
  }

  const pendingUsers = users.filter(u => u.status === 'pending')
  const pendingProperties = properties.filter(p => p.adminStatus === 'pending')

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E3A5F]">Aprovações</h1>
        <p className="text-sm text-[#6B6B99] mt-1">Gerencie usuários e imóveis pendentes de aprovação.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-white rounded-xl border border-[#E6E6EF] p-1 w-fit">
        <button
          onClick={() => setTab('users')}
          className={[
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            tab === 'users'
              ? 'bg-[#6B6B99] text-white'
              : 'text-[#6B6B99] hover:bg-[#F7F7FA]',
          ].join(' ')}
        >
          Usuários Pendentes
          {pendingUsers.length > 0 && (
            <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${tab === 'users' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
              {pendingUsers.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('properties')}
          className={[
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            tab === 'properties'
              ? 'bg-[#6B6B99] text-white'
              : 'text-[#6B6B99] hover:bg-[#F7F7FA]',
          ].join(' ')}
        >
          Imóveis Pendentes
          {pendingProperties.length > 0 && (
            <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${tab === 'properties' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
              {pendingProperties.length}
            </span>
          )}
        </button>
      </div>

      {/* Users tab */}
      {tab === 'users' && (
        <div className="bg-white rounded-2xl border border-[#E6E6EF] overflow-hidden">
          {users.length === 0 ? (
            <div className="py-16 text-center text-[#A3A3C2] text-sm">
              Nenhum usuário cadastrado ainda.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E6E6EF] bg-[#F7F7FA]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B99]">Nome</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B99]">E-mail</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B99] hidden md:table-cell">Telefone</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B99] hidden lg:table-cell">Data</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B99]">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B6B99]">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E6EF]">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-[#F7F7FA]/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-[#1E3A5F]">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-4 py-3 text-[#6B6B99]">{user.email}</td>
                    <td className="px-4 py-3 text-[#6B6B99] hidden md:table-cell">{user.phone}</td>
                    <td className="px-4 py-3 text-[#A3A3C2] hidden lg:table-cell">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                    <td className="px-4 py-3">
                      {user.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUserAction(user.id, 'approved')}
                            disabled={loadingId === user.id}
                            className="px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                          >
                            {loadingId === user.id ? '...' : 'Aprovar'}
                          </button>
                          <button
                            onClick={() => handleUserAction(user.id, 'rejected')}
                            disabled={loadingId === user.id}
                            className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            {loadingId === user.id ? '...' : 'Recusar'}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#A3A3C2] text-right block">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Properties tab */}
      {tab === 'properties' && (
        <div className="bg-white rounded-2xl border border-[#E6E6EF] overflow-hidden">
          {properties.length === 0 ? (
            <div className="py-16 text-center text-[#A3A3C2] text-sm">
              Nenhum imóvel pendente de aprovação.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E6E6EF] bg-[#F7F7FA]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B99]">Imóvel</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B99] hidden md:table-cell">Enviado por</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B99] hidden lg:table-cell">Data</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B6B99]">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6B6B99]">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E6EF]">
                {properties.map(property => (
                  <tr
                    key={property.id}
                    className="hover:bg-[#F7F7FA]/50 transition-colors cursor-pointer"
                    onClick={() => setDetailProperty(property)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[#F7F7FA]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={property.media.thumbnail || property.img}
                            alt={property.title}
                            className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).src = '/placeholder-property.svg' }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-[#1E3A5F] line-clamp-1">{property.title}</p>
                          <p className="text-xs text-[#A3A3C2]">{property.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#6B6B99] hidden md:table-cell">
                      {property.ownerId ? (userMap[property.ownerId] ?? property.ownerId) : '—'}
                    </td>
                    <td className="px-4 py-3 text-[#A3A3C2] hidden lg:table-cell">
                      {property.timestamps?.createdAt ? formatDate(property.timestamps.createdAt) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={property.adminStatus ?? 'pending'} />
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      {(!property.adminStatus || property.adminStatus === 'pending') ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handlePropertyApprove(property.id)}
                            disabled={loadingId === property.id}
                            className="px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                          >
                            {loadingId === property.id ? '...' : 'Aprovar'}
                          </button>
                          <button
                            onClick={() => setRejectTarget(property.id)}
                            disabled={loadingId === property.id}
                            className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            Recusar
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#A3A3C2] text-right block">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Property detail modal */}
      {detailProperty && (
        <PropertyDetailModal
          property={detailProperty}
          ownerName={detailProperty.ownerId ? (userMap[detailProperty.ownerId] ?? detailProperty.ownerId) : 'Admin'}
          onClose={() => setDetailProperty(null)}
        />
      )}

      {/* Rejection reason modal */}
      {rejectTarget && (
        <RejectionModal
          loading={loadingId === rejectTarget}
          onConfirm={reason => handlePropertyReject(rejectTarget, reason)}
          onCancel={() => setRejectTarget(null)}
        />
      )}

      {/* Toast — top center */}
      {toast && (
        <div className={[
          'fixed top-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all',
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white',
        ].join(' ')}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
