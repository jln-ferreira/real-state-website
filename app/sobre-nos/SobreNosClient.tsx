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
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 items-center">

            {/* Photo column */}
            <div
              className="mx-auto w-full max-w-[290px] sm:max-w-[360px] lg:mx-0 lg:max-w-[380px] xl:max-w-[420px] transition-all duration-700"
              style={{
                opacity: storyVisible ? 1 : 0,
                transform: storyVisible ? 'translateX(0)' : 'translateX(-40px)',
                transitionDelay: '100ms',
              }}
            >
              <div className="relative inline-block w-full">
                {/* Decorative background blob */}
                <div className="absolute -inset-2 rounded-3xl bg-[#6B6B99]/10 -rotate-2 sm:-inset-4 sm:-rotate-3" />
                {/* Photo frame */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white rotate-0 sm:rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/image.png"
                    alt="Casa Baccarat"
                    className="block h-auto w-full"
                  />
                  {/* Fun overlay badge */}
                  <div className="absolute bottom-3 left-3 rounded-xl bg-white px-3 py-1.5 shadow-lg border border-[#E0DACE] sm:bottom-4 sm:left-4 sm:px-4 sm:py-2">
                    <p className="text-xs font-bold text-[#4A5240]">Julia Baccarat</p>
                    <p className="text-[11px] text-[#9898BB]">Fundador & CEO</p>
                  </div>
                </div>
                {/* Floating emoji sticker */}
                <div className="absolute -top-3 -right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow-lg border border-[#E0DACE] animate-float sm:-top-4 sm:-right-4 sm:h-14 sm:w-14 sm:text-2xl">
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
                Por que a Casa Baccarat existe
              </h2>

              <div className="space-y-4 text-[#4E6B5E] leading-relaxed">
                <p>
                  Depois de anos projetando casas, percebi que o maior problema não era o projeto.
                  Era a escolha errada do imóvel.
                </p>
                <p>
                  Vi famílias que compraram o lugar errado, bonito por fora, equivocado por dentro.
                  Que gastaram meses e muito dinheiro tentando adaptar um espaço que nunca foi feito
                  para elas. E percebi algo que nenhum corretor costuma falar: Comprar um imóvel de
                  alto padrão sem um olhar técnico é como contratar um arquiteto só para a obra e
                  ignorar o projeto.
                </p>
                <p>
                  Foi por isso que a Casa Baccarat nasceu.
                </p>
                <p>
                  Não somos uma imobiliária de anúncios. Somos uma curadoria, onde cada imóvel
                  passa pelo olhar de quem passou anos entendendo como os espaços influenciam a
                  vida das pessoas. Se você está buscando um imóvel em Alphaville e quer alguém
                  que entenda o seu momento de vida antes de te mostrar qualquer coisa, você
                  chegou ao seu lugar.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3 flex-nowrap">
                <p className="text-sm font-medium text-[#4A5240] whitespace-nowrap">
                  Quer conhecer nossa curadoria?
                </p>
                <Link
                  href="/#listings"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#6B6B99] px-5 py-2.5
                             whitespace-nowrap text-sm font-semibold text-white shadow-sm
                             transition-colors duration-200 hover:bg-[#5757A0]"
                >
                  botão para página de imóveis
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
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
              description="Você está tomando uma das decisões mais importantes da sua vida. A Casa Baccarat existe para que você chegue ao imóvel certo com clareza — não com pressa, não com pressão, não com dúvida. Cada palavra nossa é um compromisso que levamos a sério."
            />
            <ValueCard
              delay={120}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              }
              title="Curadoria"
              description="Não mostramos tudo. Mostramos o certo. Cada imóvel que chega até você já passou pelo olhar técnico de uma arquiteta — avaliado por função, por conforto, por potencial e por aderência ao seu momento de vida. Isso é o que nos separa de uma imobiliária comum."
            />
            <ValueCard
              delay={240}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              title="Discrição"
              description="O alto padrão não precisa se anunciar. Nosso atendimento é individual, reservado e totalmente focado em você. Sem listas genéricas, sem exposição desnecessária — apenas uma relação de confiança construída com atenção e respeito ao seu tempo."
            />
          </div>
        </div>
      </section>

      {/* ── Parceiros ────────────────────────────────────────────────────────── */}
      <section className="bg-[#F5F0E8] pt-20 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 animate-fade-up">
            <p className="font-monument text-[10px] text-[#6B6B99] mb-3">
              Rede de confiança
            </p>
            <h2 className="font-monument text-3xl sm:text-4xl text-[#4A5240]">
              Parceiros que indicamos
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-[#E0DACE] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <div className="mb-5 flex h-28 items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/placeholder-property.svg"
                  alt="Asprino & Figueiredo Advogados"
                  className="h-20 w-20 opacity-45"
                />
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#4A5240]">
                Asprino &amp; Figueiredo Advogados
              </h3>
              <p className="mb-4 text-sm font-medium text-[#6B6B99]">
                Assessoria jurídica especializada em direito imobiliário.
              </p>
              <div className="space-y-4 text-sm leading-relaxed text-[#4E6B5E]">
                <p>
                  Uma transação bem-feita precisa de respaldo jurídico sólido. O
                  escritório Asprino &amp; Figueiredo assessora desde a análise de
                  documentação e elaboração de contratos até questões de locação,
                  regularização e incorporação imobiliária, com a profundidade técnica
                  que uma decisão dessa magnitude exige.
                </p>
                <p>
                  Para os clientes da Casa Baccarat que desejam chegar à assinatura com
                  total segurança jurídica, são os especialistas que indicamos.
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-[#E0DACE] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <div className="mb-5 flex h-28 items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/moran.png"
                  alt="Moran & Anders Arquitetura"
                  className="max-h-20 w-auto object-contain"
                />
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#4A5240]">
                Moran &amp; Anders Arquitetura
              </h3>
              <p className="mb-4 text-sm font-medium text-[#6B6B99]">
                Arquitetura e design de interiores desde 2002.
              </p>
              <div className="space-y-4 text-sm leading-relaxed text-[#4E6B5E]">
                <p>
                  Um escritório que entende que projeto bom começa pela escuta. Com mais
                  de duas décadas de atuação nos segmentos residencial e corporativo,
                  Moran &amp; Anders conduz cada projeto do conceito à execução, com a
                  mesma atenção ao detalhe do início ao fim.
                </p>
                <p>
                  Para os clientes da Casa Baccarat que desejam ir além do imóvel e
                  transformar o espaço em algo verdadeiramente seu, são parceiros de
                  confiança que recomendamos com tranquilidade.
                </p>
              </div>
            </article>
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
    <section className="bg-[#F5F0E8] pt-10 pb-20">
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
              Depois de anos projetando casas, entendi que o maior presente que
              posso oferecer não é um imóvel bonito. É a certeza de que você
              está no lugar certo.
            </p>
            <div className="mt-8 flex flex-col items-center gap-1">
              <div className="w-10 h-0.5 bg-[#6B6B99] rounded-full mb-4" />
              <p className="text-base sm:text-lg font-bold text-[#4A5240]">Julia Baccarat</p>
              <p className="text-sm sm:text-base text-[#9898BB]">Arquiteta e fundadora, Casa Baccarat Imóveis</p>
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
        <p className="font-monument text-sm sm:text-base text-[#6B6B99] mb-3">
          Quando estiver pronta para dar o próximo passo
        </p>
        <h2 className="font-monument text-3xl sm:text-4xl text-[#4A5240] mb-4">
          O lugar certo existe. A Casa Baccarat ajuda você a encontrá-lo.
        </h2>
        <p className="text-lg text-[#9898BB] max-w-2xl mx-auto mb-10 leading-relaxed">
          Cada imóvel foi selecionado com atenção ao que realmente
          importa — para que você encontre não só um endereço, mas
          o lugar onde vai querer viver.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/#listings"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#6B6B99] text-white font-semibold text-sm
                       hover:bg-[#4E6B5E] transition-all duration-200 shadow-[0_4px_14px_rgba(109,109,133,0.35)]
                       hover:shadow-[0_6px_20px_rgba(109,109,133,0.45)] hover:-translate-y-0.5"
          >
            Ver Imóveis Selecionados
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
            Falar com Especialista
          </Link>
        </div>
      </div>
    </section>
  )
}
