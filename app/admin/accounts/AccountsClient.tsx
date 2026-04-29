'use client'

import { useMemo, useState } from 'react'
import type { UserAccount } from '@/lib/users'

type SafeUser = Omit<UserAccount, 'password_hash'>

function StatusBadge({ status }: { status: SafeUser['status'] }) {
  if (status === 'approved')
    return <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">Aprovado</span>
  if (status === 'rejected')
    return <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">Recusado</span>
  return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">Pendente</span>
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function AccountsClient({
  initialUsers,
  propertyCountByOwner,
}: {
  initialUsers: SafeUser[]
  propertyCountByOwner: Record<string, number>
}) {
  const [users, setUsers] = useState<SafeUser[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | SafeUser['status']>('all')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function deleteAccount(id: string) {
    if (!window.confirm('Excluir esta conta? Esta ação não pode ser desfeita.')) return
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/accounts/${id}`, { method: 'DELETE' })

      if (!res.ok) {
        showToast('Erro ao excluir conta.', 'error')
        return
      }

      setUsers(prev => prev.filter(user => user.id !== id))
      showToast('Conta excluída.', 'success')
    } catch {
      showToast('Erro de conexão.', 'error')
    } finally {
      setLoadingId(null)
    }
  }

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase()
    return users.filter(user => {
      if (statusFilter !== 'all' && user.status !== statusFilter) return false
      if (!term) return true
      return [
        `${user.first_name} ${user.last_name}`,
        user.email,
        user.phone,
      ].some(value => value.toLowerCase().includes(term))
    })
  }, [users, search, statusFilter])

  const counts = {
    total: users.length,
    pending: users.filter(user => user.status === 'pending').length,
    approved: users.filter(user => user.status === 'approved').length,
    rejected: users.filter(user => user.status === 'rejected').length,
  }

  return (
    <div className="mx-auto max-w-6xl">
      {toast && (
        <div className={[
          'fixed right-4 top-4 z-50 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg',
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600',
        ].join(' ')}>
          {toast.msg}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E3A5F]">Contas criadas</h1>
        <p className="mt-1 text-sm text-[#6B6B99]">
          Gerencie os usuários cadastrados e o status de acesso de cada conta.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Total', value: counts.total, tone: 'text-[#1E3A5F]' },
          { label: 'Pendentes', value: counts.pending, tone: 'text-amber-700' },
          { label: 'Aprovadas', value: counts.approved, tone: 'text-green-700' },
          { label: 'Recusadas', value: counts.rejected, tone: 'text-red-700' },
        ].map(card => (
          <div key={card.label} className="rounded-2xl border border-[#E6E6EF] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#A3A3C2]">{card.label}</p>
            <p className={`mt-2 text-2xl font-bold ${card.tone}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#E6E6EF] bg-white p-4 md:flex-row md:items-center">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail ou telefone..."
          className="w-full rounded-xl border border-[#E6E6EF] bg-[#F7F7FA] px-3 py-2.5 text-sm outline-none focus:border-[#6B6B99]"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-xl border border-[#E6E6EF] bg-[#F7F7FA] px-3 py-2.5 text-sm outline-none focus:border-[#6B6B99]"
        >
          <option value="all">Todos os status</option>
          <option value="pending">Pendentes</option>
          <option value="approved">Aprovadas</option>
          <option value="rejected">Recusadas</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E6E6EF] bg-white">
        {filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#A3A3C2]">
            Nenhuma conta encontrada com os filtros atuais.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-[#E6E6EF] bg-[#F7F7FA]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B99]">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B99]">E-mail</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B99]">Telefone</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B99]">Imóveis</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B99]">Cadastro</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B99]">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B6B99]">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E6EF]">
                {filteredUsers.map(user => {
                  const propertiesCount = propertyCountByOwner[user.id] ?? 0
                  return (
                    <tr key={user.id} className="hover:bg-[#F7F7FA]/60 transition-colors">
                      <td className="px-4 py-3 font-medium text-[#1E3A5F]">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-4 py-3 text-[#6B6B99]">{user.email}</td>
                      <td className="px-4 py-3 text-[#6B6B99]">{user.phone}</td>
                      <td className="px-4 py-3 text-[#6B6B99]">{propertiesCount}</td>
                      <td className="px-4 py-3 text-[#6B6B99]">{formatDate(user.created_at)}</td>
                      <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => deleteAccount(user.id)}
                            disabled={loadingId === user.id}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {loadingId === user.id ? '...' : 'Excluir'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
