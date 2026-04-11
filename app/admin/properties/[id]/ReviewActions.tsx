'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReviewActions({ propertyId }: { propertyId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rejectMode, setRejectMode] = useState(false)
  const [reason, setReason] = useState('')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleApprove() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/approvals/properties/${propertyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminStatus: 'approved' }),
      })
      if (res.ok) {
        showToast('Imóvel aprovado.', 'success')
        setTimeout(() => router.push('/admin/approvals'), 1500)
      } else {
        showToast('Erro ao aprovar.', 'error')
      }
    } catch {
      showToast('Erro de conexão.', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleReject() {
    if (!reason.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/approvals/properties/${propertyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminStatus: 'rejected', rejectionReason: reason.trim() }),
      })
      if (res.ok) {
        showToast('Imóvel recusado.', 'success')
        setTimeout(() => router.push('/admin/approvals'), 1500)
      } else {
        showToast('Erro ao recusar.', 'error')
      }
    } catch {
      showToast('Erro de conexão.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toast — top right */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Review banner */}
      <div className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/approvals')}
            className="p-2 rounded-lg hover:bg-amber-100 transition-colors text-amber-700"
            title="Voltar para aprovações"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div>
            <p className="text-sm font-semibold text-amber-800">Modo de Revisão</p>
            <p className="text-xs text-amber-600">Revise os detalhes antes de aprovar ou recusar.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRejectMode(true)}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold bg-red-50 text-red-700 border border-red-200 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            Recusar
          </button>
          <button
            onClick={handleApprove}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : 'Aprovar'}
          </button>
        </div>
      </div>

      {/* Rejection modal */}
      {rejectMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => { setRejectMode(false); setReason('') }}
        >
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
                onClick={() => { setRejectMode(false); setReason('') }}
                className="px-4 py-2 text-sm text-[#6B6B99] hover:text-[#4F4F6B] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={loading || !reason.trim()}
                className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Recusando...' : 'Confirmar Recusa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
