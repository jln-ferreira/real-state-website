import type { Metadata } from 'next'
import Layout from '@/components/Layout'

export const metadata: Metadata = {
  title: 'Termos de Uso — Casa Baccarat',
  description: 'Leia os Termos de Uso da Casa Baccarat antes de utilizar nossa plataforma.',
}

export default function TermosPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold text-[#2E2E3A]">Termos de Uso</h1>
        <p className="mb-10 text-sm text-neutral-400">Última atualização: abril de 2025</p>

        <div className="prose prose-neutral max-w-none text-[#4A4A5A] [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[#2E2E3A] [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1">

          <p>
            Bem-vindo à <strong>Casa Baccarat Imóveis</strong>. Ao acessar ou utilizar nossa
            plataforma, você concorda com os presentes Termos de Uso. Leia-os atentamente antes
            de prosseguir.
          </p>

          <h2>1. Aceitação dos termos</h2>
          <p>
            O uso deste site implica a aceitação integral destes Termos de Uso. Caso não concorde
            com qualquer disposição, pedimos que não utilize nossos serviços.
          </p>

          <h2>2. Descrição do serviço</h2>
          <p>
            A Casa Baccarat é uma plataforma de divulgação de imóveis para venda e locação. Os
            anúncios publicados são de responsabilidade dos respectivos anunciantes. A Casa
            Baccarat atua como intermediária e não se responsabiliza pela veracidade das
            informações fornecidas por terceiros.
          </p>

          <h2>3. Cadastro de usuário</h2>
          <ul>
            <li>Para anunciar imóveis, é necessário criar uma conta e aguardar aprovação.</li>
            <li>Você é responsável por manter a confidencialidade de suas credenciais.</li>
            <li>É proibido criar contas com informações falsas ou se passar por outra pessoa.</li>
            <li>Reservamos o direito de recusar ou encerrar contas a nosso critério.</li>
          </ul>

          <h2>4. Anúncio de imóveis</h2>
          <ul>
            <li>Todos os imóveis cadastrados passam por aprovação antes de serem publicados.</li>
            <li>É proibido anunciar imóveis com informações enganosas, fotos falsas ou preços incorretos.</li>
            <li>O anunciante declara ter autorização para divulgar o imóvel.</li>
            <li>A Casa Baccarat pode remover anúncios que violem estas regras sem aviso prévio.</li>
          </ul>

          <h2>5. Conduta do usuário</h2>
          <p>É vedado utilizar esta plataforma para:</p>
          <ul>
            <li>Violar leis brasileiras ou direitos de terceiros.</li>
            <li>Enviar spam, conteúdo ofensivo ou prejudicial.</li>
            <li>Tentar acessar áreas restritas do sistema de forma não autorizada.</li>
            <li>Coletar dados de outros usuários sem consentimento.</li>
          </ul>

          <h2>6. Propriedade intelectual</h2>
          <p>
            Todo o conteúdo desta plataforma — incluindo textos, imagens, logotipos e código —
            é de propriedade da Casa Baccarat ou de seus licenciantes, protegido pela Lei de
            Direitos Autorais (Lei nº 9.610/1998). A reprodução não autorizada é proibida.
          </p>

          <h2>7. Limitação de responsabilidade</h2>
          <p>
            A Casa Baccarat não garante a disponibilidade ininterrupta do serviço e não se
            responsabiliza por danos decorrentes do uso ou impossibilidade de uso da plataforma,
            nem por negócios realizados entre usuários.
          </p>

          <h2>8. Alterações nos termos</h2>
          <p>
            Podemos revisar estes Termos a qualquer momento. A versão mais recente estará sempre
            disponível nesta página. O uso continuado após alterações implica aceitação dos novos
            termos.
          </p>

          <h2>9. Lei aplicável e foro</h2>
          <p>
            Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca
            de domicílio do usuário para dirimir eventuais controvérsias, salvo disposição legal
            em contrário.
          </p>

          <h2>10. Contato</h2>
          <p>
            Para dúvidas sobre estes Termos, entre em contato:{' '}
            <a href="mailto:hello@casabaccarat.com" className="text-[#6B6B99] underline">
              hello@casabaccarat.com
            </a>
          </p>
        </div>
      </div>
    </Layout>
  )
}
