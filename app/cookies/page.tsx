import type { Metadata } from 'next'
import Layout from '@/components/Layout'

export const metadata: Metadata = {
  title: 'Política de Cookies — Casa Baccarat',
  description: 'Entenda como a Casa Baccarat utiliza cookies e tecnologias similares.',
}

export default function CookiesPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold text-[#2E2E3A]">Política de Cookies</h1>
        <p className="mb-10 text-sm text-neutral-400">Última atualização: abril de 2025</p>

        <div className="prose prose-neutral max-w-none text-[#4A4A5A] [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[#2E2E3A] [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1 [&_table]:w-full [&_table]:border-collapse [&_th]:bg-neutral-100 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold [&_td]:border-t [&_td]:border-neutral-200 [&_td]:px-4 [&_td]:py-2 [&_td]:text-sm">

          <p>
            Esta Política de Cookies explica o que são cookies, quais utilizamos e como você pode
            controlá-los. Ao continuar navegando em nosso site, você concorda com o uso dos
            cookies descritos abaixo.
          </p>

          <h2>1. O que são cookies?</h2>
          <p>
            Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você
            visita um site. Eles permitem que o site reconheça seu dispositivo e lembre suas
            preferências em visitas futuras.
          </p>

          <h2>2. Cookies que utilizamos</h2>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Finalidade</th>
                <th>Duração</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>authjs.session-token</code></td>
                <td>Essencial</td>
                <td>Mantém a sessão do usuário autenticado.</td>
                <td>8 horas</td>
              </tr>
              <tr>
                <td><code>authjs.csrf-token</code></td>
                <td>Essencial</td>
                <td>Protege formulários contra ataques CSRF.</td>
                <td>Sessão</td>
              </tr>
              <tr>
                <td><code>authjs.callback-url</code></td>
                <td>Essencial</td>
                <td>Redireciona o usuário após login.</td>
                <td>Sessão</td>
              </tr>
            </tbody>
          </table>

          <p className="mt-6">
            No momento, utilizamos apenas cookies essenciais para o funcionamento da plataforma.
            Não utilizamos cookies de rastreamento, publicidade ou análise de terceiros.
          </p>

          <h2>3. Cookies essenciais</h2>
          <p>
            Os cookies essenciais são necessários para o funcionamento básico do site — como
            manter sua sessão ativa após o login. Eles não coletam informações para fins de
            marketing e não podem ser desativados sem comprometer o funcionamento da plataforma.
          </p>

          <h2>4. Como controlar os cookies</h2>
          <p>
            Você pode gerenciar ou excluir cookies a qualquer momento pelas configurações do
            seu navegador:
          </p>
          <ul>
            <li><strong>Google Chrome:</strong> Configurações → Privacidade e segurança → Cookies.</li>
            <li><strong>Mozilla Firefox:</strong> Opções → Privacidade e segurança → Cookies.</li>
            <li><strong>Safari:</strong> Preferências → Privacidade → Gerenciar dados de sites.</li>
            <li><strong>Microsoft Edge:</strong> Configurações → Privacidade → Cookies.</li>
          </ul>
          <p>
            Atenção: desativar cookies essenciais pode impedir o funcionamento correto do login
            e de outras funcionalidades do site.
          </p>

          <h2>5. Alterações nesta política</h2>
          <p>
            Podemos atualizar esta Política de Cookies conforme evoluímos nossos serviços.
            Quaisquer mudanças serão publicadas nesta página com a data de atualização.
          </p>

          <h2>6. Contato</h2>
          <p>
            Dúvidas sobre o uso de cookies? Entre em contato:{' '}
            <a href="mailto:hello@casabaccarat.com" className="text-[#6B6B99] underline">
              hello@casabaccarat.com
            </a>
          </p>
        </div>
      </div>
    </Layout>
  )
}
