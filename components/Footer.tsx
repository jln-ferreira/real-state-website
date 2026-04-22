import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Início',  href: '/#home'     },
  { label: 'Imóveis', href: '/#listings' },
  { label: 'Sobre',   href: '/sobre-nos' },
  { label: 'Blog',    href: '/blog'      },
  { label: 'Contato', href: '/#contact'  },
]

const COMPANY_LINKS = [
  { label: 'Casa Baccarat', href: '/sobre-nos' },
  { label: 'Curadoria',     href: '/#listings' },
  { label: 'Blog',          href: '/blog'      },
]

const LEGAL_LINKS = [
  { label: 'Política de Privacidade', href: '/privacidade' },
  { label: 'Termos de Uso',           href: '/termos'      },
  { label: 'Política de Cookies',     href: '/cookies'     },
]

const linkCls =
  'text-sm text-[#F5F0E8]/65 font-light transition-colors duration-200 hover:text-[#F5F0E8]'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="border-t border-white/10 bg-[#4E6B5E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Main grid ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4">

          {/* Section 1 — Brand */}
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <a href="/#home" aria-label="Casa Baccarat início" className="w-fit">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Casa Baccarat Imóveis" className="h-28 w-auto" />
            </a>
            <p className="max-w-xs text-center text-sm leading-relaxed text-[#F5F0E8]/65 font-light sm:text-left">
              Curadoria de imóveis de alto padrão em Alphaville e região.
              Cada imóvel selecionado com olhar de arquiteta — para quem
              entende que morar bem é uma escolha.
            </p>
          </div>

          {/* Section 2 — Explorar */}
          <div className="hidden sm:block">
            <h3 className="mb-5 font-monument text-xs tracking-widest text-[#C8DDB8] uppercase">
              Explorar
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className={linkCls}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3 — Empresa */}
          <div className="hidden sm:block">
            <h3 className="mb-5 font-monument text-xs tracking-widest text-[#C8DDB8] uppercase">
              Empresa
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className={linkCls}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4 — Contato & Social */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="mb-5 font-monument text-xs tracking-widest text-[#C8DDB8] uppercase">
              Contato
            </h3>

            <address className="not-italic">
              <ul className="flex flex-col items-center gap-3 sm:items-start" role="list">
                <li className="flex items-start gap-2.5">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#C8DDB8]" fill="none"
                       viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <a href="mailto:baccarat.julia@gmail.com" className={linkCls}>
                    baccarat.julia@gmail.com
                  </a>
                </li>

                <li className="flex items-start gap-2.5">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#C8DDB8]" fill="none"
                       viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <a href="tel:+5511982659982" className={linkCls}>
                    +55 11 9.8265.9982
                  </a>
                </li>

                <li className="flex items-start gap-2.5">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#C8DDB8]" fill="none"
                       viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="text-sm text-[#F5F0E8]/65 font-light">
                    Alphaville · Barueri, São Paulo
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#C8DDB8]" fill="none"
                       viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                  </svg>
                  <span className="text-sm text-[#F5F0E8]/65 font-light">
                    Atendendo Alphaville e região
                  </span>
                </li>
              </ul>
            </address>

            {/* Social */}
            <div className="mt-6 flex items-start justify-center gap-4 sm:justify-start">
              {/* Instagram */}
              <div className="flex flex-col items-center gap-1">
                <a
                  href="https://instagram.com/casabaccarat"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10
                             text-[#C8DDB8] transition-all duration-200 hover:bg-white/20 hover:text-white hover:scale-110"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <span className="text-[10px] text-[#F5F0E8]/65">@casabaccarat</span>
              </div>

              {/* WhatsApp */}
              <div className="flex flex-col items-center gap-1">
                <a
                  href="https://wa.me/5511982659982"
                  aria-label="WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10
                             text-[#C8DDB8] transition-all duration-200 hover:bg-white/20 hover:text-white hover:scale-110"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
                <span className="text-[10px] text-[#F5F0E8]/65">WhatsApp</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-3 border-t border-white/10 py-6
                        sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#F5F0E8]/65 font-light">
            © {year} Casa Baccarat Imóveis. Todos os direitos reservados. · CRECI/SP nº 322261-F
          </p>

          <nav aria-label="Legal links" className="hidden sm:block">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-1" role="list">
              {LEGAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-[#F5F0E8]/65 font-light transition-colors duration-200 hover:text-[#F5F0E8]">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

      </div>
    </footer>
  )
}
