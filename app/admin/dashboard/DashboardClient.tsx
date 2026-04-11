'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Property } from '@/data/properties'
import type { Post } from '@/data/posts'

interface EventRow { property_id: string; created_at: string }

interface Props {
  properties: Property[]
  posts: Post[]
  auditLog: unknown[]
  contactMessages: EventRow[]
  whatsappClicks: EventRow[]
  userMap: Record<string, string>
}

function toDateKey(iso: string): string {
  return iso.slice(0, 10) // 'YYYY-MM-DD'
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function getWeekStart(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDay() // 0=Sun
  const diff = day === 0 ? -6 : 1 - day // shift to Monday
  const monday = new Date(d)
  monday.setDate(d.getDate() + diff)
  return monday.toISOString().slice(0, 10)
}

function formatWeekRange(weekStartStr: string): string {
  const start = new Date(weekStartStr + 'T00:00:00')
  const end = new Date(weekStartStr + 'T00:00:00')
  end.setDate(start.getDate() + 6)
  const sameMonth = start.getMonth() === end.getMonth()
  const startLabel = start.toLocaleDateString('pt-BR', {
    day: '2-digit',
    ...(sameMonth ? {} : { month: 'short' }),
  })
  const endLabel = end.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  return `${startLabel}–${endLabel}`
}

export default function DashboardClient({ properties, posts, contactMessages, whatsappClicks, userMap }: Props) {
  const [velocityPeriod, setVelocityPeriod] = useState<'30d' | '12w' | '12m'>('30d')
  const [recentOpen, setRecentOpen] = useState(false)

  // ── Velocity: new listings over time ─────────────────────────────────────────
  const now   = new Date()
  const today = toDateKey(now.toISOString())

  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())

  const datedProperties = properties.filter(p => p.timestamps?.createdAt)

  // Count today / this week / this month
  const countToday = datedProperties.filter(p => toDateKey(p.timestamps!.createdAt) === today).length
  const countWeek  = datedProperties.filter(p => new Date(p.timestamps!.createdAt) >= startOfWeek).length
  const countMonth = datedProperties.filter(p => {
    const d = new Date(p.timestamps!.createdAt)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length

  // Build bar chart data depending on selected period
  type Bar = { label: string; count: number; key: string }
  let bars: Bar[] = []

  if (velocityPeriod === '30d') {
    bars = Array.from({ length: 30 }, (_, i) => {
      const d = addDays(now, -(29 - i))
      const key = toDateKey(d.toISOString())
      return {
        key,
        label: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        count: datedProperties.filter(p => toDateKey(p.timestamps!.createdAt) === key).length,
      }
    })
  } else if (velocityPeriod === '12w') {
    bars = Array.from({ length: 12 }, (_, i) => {
      const weekStart = addDays(now, -(11 - i) * 7 - now.getDay())
      const weekEnd   = addDays(weekStart, 6)
      return {
        key: toDateKey(weekStart.toISOString()),
        label: `${weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`,
        count: datedProperties.filter(p => {
          const d = new Date(p.timestamps!.createdAt)
          return d >= weekStart && d <= weekEnd
        }).length,
      }
    })
  } else {
    bars = Array.from({ length: 12 }, (_, i) => {
      const month = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
      return {
        key: `${month.getFullYear()}-${month.getMonth()}`,
        label: month.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        count: datedProperties.filter(p => {
          const d = new Date(p.timestamps!.createdAt)
          return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth()
        }).length,
      }
    })
  }

  const maxBar = Math.max(...bars.map(b => b.count), 1)

  // ── Contact KPIs (same period) ────────────────────────────────────────────────
  function countInPeriod(rows: EventRow[], from: Date, to: Date) {
    return rows.filter(r => { const d = new Date(r.created_at); return d >= from && d <= to }).length
  }

  const periodStart = velocityPeriod === '30d'
    ? addDays(now, -29)
    : velocityPeriod === '12w'
    ? addDays(now, -83)
    : new Date(now.getFullYear(), now.getMonth() - 11, 1)

  const contactInPeriod  = countInPeriod(contactMessages,  periodStart, now)
  const whatsappInPeriod = countInPeriod(whatsappClicks,   periodStart, now)
  const totalInPeriod    = contactInPeriod + whatsappInPeriod

  const contactBars: Bar[] = bars.map(bar => {
    if (velocityPeriod === '30d') {
      const d = new Date(bar.key)
      const next = addDays(d, 1)
      return { ...bar, count: countInPeriod([...contactMessages, ...whatsappClicks], d, next) }
    } else if (velocityPeriod === '12w') {
      const weekStart = new Date(bar.key)
      const weekEnd   = addDays(weekStart, 6)
      return { ...bar, count: countInPeriod([...contactMessages, ...whatsappClicks], weekStart, weekEnd) }
    } else {
      const [yr, mo] = bar.key.split('-').map(Number)
      const mStart = new Date(yr, mo, 1)
      const mEnd   = new Date(yr, mo + 1, 0, 23, 59, 59)
      return { ...bar, count: countInPeriod([...contactMessages, ...whatsappClicks], mStart, mEnd) }
    }
  })
  const maxContactBar = Math.max(...contactBars.map(b => b.count), 1)

  // ── Per-property contact breakdown (period-filtered) ─────────────────────────
  const propertyContactMap = new Map<string, { whatsapp: number; form: number }>()
  for (const r of contactMessages.filter(r => new Date(r.created_at) >= periodStart)) {
    const entry = propertyContactMap.get(r.property_id) ?? { whatsapp: 0, form: 0 }
    propertyContactMap.set(r.property_id, { ...entry, form: entry.form + 1 })
  }
  for (const r of whatsappClicks.filter(r => new Date(r.created_at) >= periodStart)) {
    const entry = propertyContactMap.get(r.property_id) ?? { whatsapp: 0, form: 0 }
    propertyContactMap.set(r.property_id, { ...entry, whatsapp: entry.whatsapp + 1 })
  }
  const propertyContactRows = [...propertyContactMap.entries()]
    .map(([id, counts]) => {
      const prop = properties.find(p => p.id === id)
      return { id, title: prop?.title ?? id, thumbnail: prop?.media?.thumbnail ?? prop?.img ?? '', ...counts, total: counts.whatsapp + counts.form }
    })
    .sort((a, b) => b.total - a.total)

  // ── Top 10 by views ──────────────────────────────────────────────────────────
  const topProperties = [...properties]
    .sort((a, b) => (b.metrics?.views ?? 0) - (a.metrics?.views ?? 0))
    .filter(p => (p.metrics?.views ?? 0) > 0)
    .slice(0, 10)

  const topPosts = [...posts]
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .filter(p => (p.views ?? 0) > 0)
    .slice(0, 10)

  return (
    <div className="space-y-6">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Visão geral do catálogo</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/properties/new"
            className="flex items-center gap-2 bg-[#6D6D85] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#585874] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Novo Imóvel
          </Link>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 border border-[#E6E6EF] bg-white text-[#4F4F6B] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#F7F7FA] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Novo Post
          </Link>
        </div>
      </div>

      {/* ── New Listings Velocity ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E6E6EF] p-5">

        {/* Title row */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-neutral-800">Novos Imóveis Cadastrados</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Velocidade de crescimento do catálogo</p>
          </div>
          {/* Period toggle */}
          <div className="flex bg-[#F7F7FA] rounded-xl p-0.5 gap-0.5">
            {([['30d', 'Últimos 30 dias'], ['12w', 'Últimas 12 semanas'], ['12m', 'Últimos 12 meses']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setVelocityPeriod(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  velocityPeriod === key
                    ? 'bg-white text-[#4F4F6B] shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI trio */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Hoje',       value: countToday },
            { label: 'Esta Semana', value: countWeek  },
            { label: 'Este Mês',   value: countMonth  },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#F7F7FA] rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-[#4F4F6B]">{value}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        {datedProperties.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-6">Nenhum imóvel com data de cadastro</p>
        ) : (
          <div className="flex items-end gap-px h-24" title="Novos imóveis por período">
            {bars.map((bar, i) => (
              <div key={bar.key} className="group relative flex-1 flex flex-col items-center justify-end h-full">
                <div
                  className={`w-full rounded-sm transition-all ${bar.count > 0 ? 'bg-[#6D6D85]' : 'bg-neutral-100'}`}
                  style={{ height: `${(bar.count / maxBar) * 100}%`, minHeight: bar.count > 0 ? '3px' : '2px' }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {bar.label}: {bar.count}
                </div>
                {/* X-axis label — show only first, middle, last */}
                {(i === 0 || i === Math.floor(bars.length / 2) || i === bars.length - 1) && (
                  <span className="absolute top-full mt-1 text-[9px] text-neutral-400 whitespace-nowrap -translate-x-1/2 left-1/2">
                    {bar.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Recent registrations — toggleable, grouped by week */}
        {datedProperties.length > 0 && (
          <div className="mt-8">
            <button
              onClick={() => setRecentOpen(o => !o)}
              className="flex items-center gap-2 w-full text-left group mb-3"
            >
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide flex-1">Cadastros recentes</h3>
              <svg
                className={`w-4 h-4 text-neutral-400 transition-transform ${recentOpen ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {recentOpen && (() => {
              const sorted = [...datedProperties].sort(
                (a, b) => new Date(b.timestamps!.createdAt).getTime() - new Date(a.timestamps!.createdAt).getTime()
              )
              const weekMap = new Map<string, typeof sorted>()
              for (const p of sorted) {
                const key = getWeekStart(p.timestamps!.createdAt)
                if (!weekMap.has(key)) weekMap.set(key, [])
                weekMap.get(key)!.push(p)
              }
              const weeks = [...weekMap.entries()].sort(([a], [b]) => b.localeCompare(a))

              return (
                <div className="space-y-4">
                  {weeks.map(([weekKey, props]) => (
                    <div key={weekKey}>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                        {formatWeekRange(weekKey)}
                      </p>
                      <div className="space-y-1">
                        {props.map(p => (
                          <Link
                            key={p.id}
                            href={`/property/${p.id}`}
                            className="flex items-center gap-3 py-2 border-b border-[#F0F0F5] last:border-0 hover:bg-[#F7F7FA] rounded-lg px-1 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-[#F7F7FA]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.media?.thumbnail || p.img}
                                alt={p.title}
                                className="w-full h-full object-cover"
                                onError={e => { (e.target as HTMLImageElement).src = '/placeholder-property.svg' }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[#1E3A5F] truncate group-hover:underline">{p.title}</p>
                              <p className="text-[10px] text-[#A3A3C2]">
                                {p.ownerId
                                  ? `Cadastrado por ${userMap[p.ownerId] ?? 'Usuário'}`
                                  : 'Cadastrado pelo admin'}
                              </p>
                            </div>
                            <span className="text-[10px] text-[#A3A3C2] flex-shrink-0">
                              {new Date(p.timestamps!.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        )}

      </div>

      {/* ── Contact KPIs ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E6E6EF] p-5">

        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-neutral-800">Contatos Recebidos</h2>
            <p className="text-xs text-neutral-400 mt-0.5">WhatsApp e formulário de contato · período: {velocityPeriod === '30d' ? 'últimos 30 dias' : velocityPeriod === '12w' ? 'últimas 12 semanas' : 'últimos 12 meses'}</p>
          </div>
          <span className="text-2xl font-bold text-[#4F4F6B]">{totalInPeriod}</span>
        </div>

        {/* KPI trio */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            {
              label: 'WhatsApp',
              value: whatsappInPeriod,
              color: 'text-green-600',
              icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-500">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.94 1.404 5.617L0 24l6.532-1.384A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.373l-.36-.213-3.732.979.995-3.641-.234-.374A9.818 9.818 0 1112 21.818z"/>
                </svg>
              ),
            },
            {
              label: 'Formulário',
              value: contactInPeriod,
              color: 'text-[#4F4F6B]',
              icon: (
                <svg className="w-4 h-4 text-[#6D6D85]" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              ),
            },
            {
              label: 'Total',
              value: totalInPeriod,
              color: 'text-neutral-800',
              icon: (
                <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              ),
            },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="bg-[#F7F7FA] rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5 mb-1">{icon}<span className="text-xs text-neutral-500">{label}</span></div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Combined bar chart */}
        {contactMessages.length === 0 && whatsappClicks.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-6">Nenhum contato registrado ainda</p>
        ) : (
          <div className="flex items-end gap-px h-24 mb-6">
            {contactBars.map((bar, i) => (
              <div key={bar.key} className="group relative flex-1 flex flex-col items-center justify-end h-full">
                <div
                  className={`w-full rounded-sm transition-all ${bar.count > 0 ? 'bg-[#6D6D85]' : 'bg-neutral-100'}`}
                  style={{ height: `${(bar.count / maxContactBar) * 100}%`, minHeight: bar.count > 0 ? '3px' : '2px' }}
                />
                <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {bar.label}: {bar.count}
                </div>
                {(i === 0 || i === Math.floor(contactBars.length / 2) || i === contactBars.length - 1) && (
                  <span className="absolute top-full mt-1 text-[9px] text-neutral-400 whitespace-nowrap -translate-x-1/2 left-1/2">
                    {bar.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Per-property breakdown */}
        {propertyContactRows.length > 0 && (
          <div className="mt-2 border-t border-[#E6E6EF] pt-4">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Por imóvel</p>
            <div className="space-y-2">
              {propertyContactRows.map((row, i) => {
                const maxTotal = propertyContactRows[0].total
                const pct = maxTotal > 0 ? (row.total / maxTotal) * 100 : 0
                return (
                  <Link
                    key={row.id}
                    href={`/admin/properties/${row.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <span className="text-xs font-bold text-neutral-300 w-4 flex-shrink-0 text-center">{i + 1}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {row.thumbnail
                      ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={row.thumbnail} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).src = '/placeholder-property.svg' }} />
                      : <div className="w-8 h-8 rounded-lg bg-neutral-100 flex-shrink-0" />
                    }
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-xs font-medium text-neutral-800 truncate group-hover:text-[#4F4F6B]">{row.title}</p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {row.whatsapp > 0 && (
                            <span className="flex items-center gap-0.5 text-[10px] text-green-600 font-medium">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.94 1.404 5.617L0 24l6.532-1.384A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.373l-.36-.213-3.732.979.995-3.641-.234-.374A9.818 9.818 0 1112 21.818z"/></svg>
                              {row.whatsapp}
                            </span>
                          )}
                          {row.form > 0 && (
                            <span className="flex items-center gap-0.5 text-[10px] text-[#6D6D85] font-medium">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                              {row.form}
                            </span>
                          )}
                          <span className="text-xs font-bold text-neutral-600 w-5 text-right">{row.total}</span>
                        </div>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-1 overflow-hidden">
                        <div className="h-full rounded-full bg-[#6D6D85]" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

      </div>

      {/* ── Top 10 by views ──────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Top 10 properties */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E6E6EF] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E6E6EF]">
            <div>
              <h2 className="text-sm font-bold text-neutral-800">Top 10 Imóveis</h2>
              <p className="text-xs text-neutral-400 mt-0.5">por visualizações</p>
            </div>
            <svg className="w-4 h-4 text-[#6D6D85]" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          {topProperties.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-10">Nenhuma visualização registrada</p>
          ) : (
            <div className="divide-y divide-[#E6E6EF]">
              {topProperties.map((p, i) => {
                const maxViews = topProperties[0].metrics.views
                const pct = maxViews > 0 ? (p.metrics.views / maxViews) * 100 : 0
                return (
                  <Link
                    key={p.id}
                    href={`/admin/properties/${p.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F7FA] transition-colors"
                  >
                    <span className="text-xs font-bold text-neutral-300 w-5 flex-shrink-0 text-center">{i + 1}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.media?.thumbnail ?? p.img} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).src = '/placeholder-property.svg' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{p.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 bg-neutral-100 rounded-full h-1 overflow-hidden">
                          <div className="h-full rounded-full bg-[#6D6D85]" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-neutral-500 flex-shrink-0 w-14 text-right">
                          {p.metrics.views.toLocaleString('pt-BR')} vis.
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Top 10 blog posts */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E6E6EF] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E6E6EF]">
            <div>
              <h2 className="text-sm font-bold text-neutral-800">Top 10 Posts do Blog</h2>
              <p className="text-xs text-neutral-400 mt-0.5">por visualizações</p>
            </div>
            <svg className="w-4 h-4 text-[#6D6D85]" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          {topPosts.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-10">Nenhuma visualização registrada</p>
          ) : (
            <div className="divide-y divide-[#E6E6EF]">
              {topPosts.map((p, i) => {
                const maxViews = topPosts[0].views ?? 0
                const pct = maxViews > 0 ? ((p.views ?? 0) / maxViews) * 100 : 0
                return (
                  <Link
                    key={p.slug}
                    href={`/admin/blog/${p.slug}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F7FA] transition-colors"
                  >
                    <span className="text-xs font-bold text-neutral-300 w-5 flex-shrink-0 text-center">{i + 1}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).src = '/placeholder-property.svg' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{p.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 bg-neutral-100 rounded-full h-1 overflow-hidden">
                          <div className="h-full rounded-full bg-[#6D6D85]" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-neutral-500 flex-shrink-0 w-14 text-right">
                          {(p.views ?? 0).toLocaleString('pt-BR')} vis.
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
