import { getAuditLog } from '@/lib/audit'

function formatDate(ts: string) {
  return new Date(ts).toLocaleString('en-CA', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

const ACTION_STYLES: Record<string, string> = {
  CREATE: 'bg-green-100 text-green-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
  DUPLICATE: 'bg-purple-100 text-purple-700',
}

export default async function AuditPage() {
  let log: any[] = []
  try {
    log = await getAuditLog(100)
  } catch {
    log = []
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900">Log de Auditoria</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Todas as ações administrativas em imóveis</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-neutral-100 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Data/Hora</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Ação</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">ID do Imóvel</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Campo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">Valor Anterior</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">Novo Valor</th>
            </tr>
          </thead>
          <tbody>
            {log.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-sm text-neutral-400">Nenhuma ação registrada ainda</td></tr>
            ) : log.map((row: any) => (
              <tr key={row.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 text-xs text-neutral-500 whitespace-nowrap">{formatDate(row.timestamp)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${ACTION_STYLES[row.action] ?? 'bg-neutral-100 text-neutral-600'}`}>{row.action}</span>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-neutral-500">{row.property_id ?? '—'}</td>
                <td className="px-4 py-3 text-xs text-neutral-500 hidden md:table-cell">{row.field ?? '—'}</td>
                <td className="px-4 py-3 text-xs text-neutral-500 hidden lg:table-cell max-w-xs truncate">{row.old_value ?? '—'}</td>
                <td className="px-4 py-3 text-xs text-neutral-500 hidden lg:table-cell max-w-xs truncate">{row.new_value ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
