'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// ── Scroll-reveal hook ────────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return { ref, visible }
}

// ── Animated counter ──────────────────────────────────────────────────────────

function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 1400,
}: {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const { ref, visible } = useReveal()

  useEffect(() => {
    if (!visible) return
    let startTime: number
    const animate = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [visible, target, duration])

  return (
    <div ref={ref} className="tabular-nums">
      {prefix}{count}{suffix}
    </div>
  )
}

// ── Value card ────────────────────────────────────────────────────────────────

function ValueCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className="reveal"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
      }}
    >
      <div className="bg-white rounded-2xl p-8 border border-[#E0DACE] shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 h-full">
        <div className="w-12 h-12 rounded-xl bg-[#F5F0E8] border border-[#E0DACE] flex items-center justify-center mb-5 text-[#6B6B99]">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-[#4A5240] mb-3">{title}</h3>
        <p className="text-[#9898BB] text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SobreNosClient() {
  const storyRef = useRef<HTMLDivElement>(null)
  const [storyVisible, setStoryVisible] = useState(false)

  useEffect(() => {
    const el = storyRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setStoryVisible(true); obs.disconnect() }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-[#E0DACE] overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#6B6B99]/5 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-[#6B6B99]/5 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 animate-page-in relative">
          <p className="font-monument text-[10px] text-[#6B6B99] mb-4">
            Casa Baccarat
          </p>
          <h1 className="font-monument text-5xl sm:text-6xl text-[#4A5240] mb-6">
            Quem Somos
          </h1>
          <p className="text-xl text-[#9898BB] max-w-2xl leading-relaxed mb-8">
            Mais do que uma imobiliária — somos parceiros na realização do seu sonho.
            Com paixão pelo que fazemos e compromisso com cada cliente.
          </p>
          {/* Animated underline accent */}
          <div className="flex items-center gap-3">
            <div className="h-1 w-16 rounded-full bg-[#6B6B99] animate-scale-in" style={{ animationDelay: '200ms' }} />
            <div className="h-1 w-8 rounded-full bg-[#9898BB] animate-scale-in" style={{ animationDelay: '320ms' }} />
            <div className="h-1 w-4 rounded-full bg-[#E0DACE] animate-scale-in" style={{ animationDelay: '440ms' }} />
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#9898BB] animate-fade-up" style={{ animationDelay: '600ms' }}>
          <span className="text-xs tracking-widest uppercase">Role para baixo</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Nossa História ────────────────────────────────────────────────────── */}
      <section ref={storyRef} className="bg-[#F5F0E8] py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Photo column */}
            <div
              className="transition-all duration-700"
              style={{
                opacity: storyVisible ? 1 : 0,
                transform: storyVisible ? 'translateX(0)' : 'translateX(-40px)',
                transitionDelay: '100ms',
              }}
            >
              <div className="relative inline-block">
                {/* Decorative background blob */}
                <div className="absolute -inset-4 rounded-3xl bg-[#6B6B99]/10 -rotate-3" />
                {/* Photo frame */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Tiririca_na_camara.jpg/250px-Tiririca_na_camara.jpg"
                    alt="Julia Baccarat (foto temporária, obviamente)"
                    className="w-full h-auto block"
                    style={{ maxWidth: 420 }}
                  />
                  {/* Fun overlay badge */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-xl px-4 py-2 shadow-lg border border-[#E0DACE]">
                    <p className="text-xs font-bold text-[#4A5240]">Julia Baccarat</p>
                    <p className="text-[11px] text-[#9898BB]">Fundador & CEO</p>
                  </div>
                </div>
                {/* Floating emoji sticker */}
                <div className="absolute -top-4 -right-4 w-14 h-14 bg-white rounded-full shadow-lg border border-[#E0DACE] flex items-center justify-center text-2xl animate-float">
                  🏡
                </div>
              </div>
            </div>

            {/* Text column */}
            <div
              className="transition-all duration-700"
              style={{
                opacity: storyVisible ? 1 : 0,
                transform: storyVisible ? 'translateX(0)' : 'translateX(40px)',
                transitionDelay: '250ms',
              }}
            >
              <p className="font-monument text-[10px] text-[#6B6B99] mb-3">
                Nossa História
              </p>
              <h2 className="font-monument text-3xl sm:text-4xl text-[#4A5240] mb-6">
                Nascemos da vontade<br />de fazer diferente
              </h2>

              <div className="space-y-4 text-[##4E6B5E] leading-relaxed">
                <p>
                  A Casa Baccarat nasceu de um sonho simples: ajudar pessoas a encontrarem
                  não apenas um imóvel, mas um lar. Após anos trabalhando no mercado
                  imobiliário e percebendo que faltava humanidade nas transações,
                  Julia Baccarat decidiu criar algo diferente.
                </p>
                <p>
                  Desde o primeiro dia, nossa missão é clara — tratar cada cliente como
                  família. Aqui, você não é mais um número. Você é uma pessoa com sonhos,
                  necessidades e uma história única que merece ser ouvida com atenção.
                </p>
                <p>
                  Hoje, com uma equipe apaixonada e uma carteira de imóveis cuidadosamente
                  selecionados, seguimos fiéis a esse propósito. Cada negócio fechado é
                  uma conquista compartilhada — e isso nos motiva todos os dias.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm font-medium text-[#6B6B99] border border-[#E0DACE] shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  CRECI Regularizado
                </span>
                <span className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm font-medium text-[#6B6B99] border border-[#E0DACE] shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                  Avaliação 5 estrelas
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nossos Valores ────────────────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 animate-fade-up">
            <p className="font-monument text-[10px] text-[#6B6B99] mb-3">
              O que nos guia
            </p>
            <h2 className="font-monument text-3xl sm:text-4xl text-[#4A5240]">
              Nossos Valores
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ValueCard
              delay={0}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              }
              title="Confiança"
              description="Construímos relações duradouras baseadas na honestidade e na transparência. Cada palavra nossa é um compromisso que levamos muito a sério."
            />
            <ValueCard
              delay={120}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              }
              title="Excelência"
              description="Não nos contentamos com o suficiente. Buscamos sempre o melhor — nos imóveis que oferecemos, no atendimento que prestamos e nos resultados que entregamos."
            />
            <ValueCard
              delay={240}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              title="Transparência"
              description="Acreditamos que uma transação bem-feita começa com informação clara. Sem letras miúdas, sem surpresas — apenas clareza do início ao fim."
            />
          </div>
        </div>
      </section>

      {/* ── Em Números ───────────────────────────────────────────────────────── */}
      <section className="bg-[#4A5240] py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="font-monument text-[10px] text-[#9898BB] mb-3">
              Nossa trajetória
            </p>
            <h2 className="font-monument text-3xl sm:text-4xl text-white">
              Em Números
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { target: 12,  suffix: '+', label: 'Anos de experiência', prefix: '' },
              { target: 340, suffix: '+', label: 'Imóveis negociados',  prefix: '' },
              { target: 280, suffix: '+', label: 'Clientes satisfeitos', prefix: '' },
              { target: 98,  suffix: '%', label: 'Taxa de satisfação',  prefix: '' },
            ].map(({ target, suffix, label, prefix }) => (
              <div key={label} className="text-center">
                <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2 tracking-tight">
                  <AnimatedCounter target={target} suffix={suffix} prefix={prefix} />
                </div>
                <p className="text-[#9898BB] text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nossa Promessa ────────────────────────────────────────────────────── */}
      <PromisaSection />

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <CTASection />
    </>
  )
}

// ── Promise section (separate to isolate reveal hook) ─────────────────────────

function PromisaSection() {
  const { ref, visible } = useReveal()
  return (
    <section className="bg-[#F5F0E8] py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <div
          ref={ref}
          className="transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1)' : 'scale(0.95)',
          }}
        >
          <div className="relative bg-white rounded-3xl p-10 sm:p-14 border border-[#E0DACE] shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
            {/* Large quote mark */}
            <span className="absolute top-6 left-8 text-8xl font-serif text-[#E0DACE] leading-none select-none pointer-events-none">
              &ldquo;
            </span>
            <p className="relative text-xl sm:text-2xl text-[#4A5240] font-medium leading-relaxed italic">
              Não vendemos imóveis. Nós ajudamos pessoas a encontrarem o lugar
              onde a vida vai acontecer. Cada chave entregue é uma história que
              começa — e isso é o que nos faz levantar todo dia com vontade de fazer mais.
            </p>
            <div className="mt-8 flex flex-col items-center gap-1">
              <div className="w-10 h-0.5 bg-[#6B6B99] rounded-full mb-4" />
              <p className="text-sm font-bold text-[#4A5240]">Julia Baccarat</p>
              <p className="text-xs text-[#9898BB]">Fundador & CEO, Casa Baccarat</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── CTA section ────────────────────────────────────────────────────────────────

function CTASection() {
  const { ref, visible } = useReveal()
  return (
    <section className="bg-white border-t border-[#E0DACE] py-20">
      <div
        ref={ref}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
        }}
      >
        <p className="font-monument text-[10px] text-[#6B6B99] mb-3">
          Vamos conversar?
        </p>
        <h2 className="font-monument text-3xl sm:text-4xl text-[#4A5240] mb-4">
          Pronto para encontrar seu lar?
        </h2>
        <p className="text-lg text-[#9898BB] max-w-xl mx-auto mb-10">
          Nossa equipe está pronta para te ajudar a encontrar o imóvel ideal.
          Entre em contato ou explore nosso catálogo agora mesmo.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/#listings"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#6B6B99] text-white font-semibold text-sm
                       hover:bg-[#4E6B5E] transition-all duration-200 shadow-[0_4px_14px_rgba(109,109,133,0.35)]
                       hover:shadow-[0_6px_20px_rgba(109,109,133,0.45)] hover:-translate-y-0.5"
          >
            Ver Imóveis
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-[#6B6B99] font-semibold text-sm
                       border border-[#E0DACE] hover:border-[#6B6B99] transition-all duration-200
                       hover:-translate-y-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
          >
            Falar Conosco
          </Link>
        </div>
      </div>
    </section>
  )
}
