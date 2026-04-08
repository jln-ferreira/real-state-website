import type { Metadata } from 'next'
import Layout from '@/components/Layout'

export const metadata: Metadata = {
  title: 'Política de Privacidade — Casa Baccarat',
  description: 'Saiba como a Casa Baccarat coleta, usa e protege seus dados pessoais de acordo com a LGPD.',
}

export default function PrivacidadePage() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold text-[#2E2E3A]">Política de Privacidade</h1>
        <p className="mb-10 text-sm text-neutral-400">Última atualização: abril de 2025</p>

        <div className="prose prose-neutral max-w-none text-[#4A4A5A] [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[#2E2E3A] [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1">

          <p>
            A <strong>Casa Baccarat Imóveis</strong> ("nós", "nosso") se compromete a proteger a
            privacidade dos usuários que acessam nosso site e utilizam nossos serviços. Esta
            Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos
            suas informações pessoais, em conformidade com a <strong>Lei Geral de Proteção de
            Dados (Lei nº 13.709/2018 — LGPD)</strong>.
          </p>

          <h2>1. Dados que coletamos</h2>
          <p>Coletamos os seguintes dados pessoais:</p>
          <ul>
            <li><strong>Cadastro:</strong> nome, sobrenome, e-mail, telefone e senha.</li>
            <li><strong>Formulário de contato:</strong> nome, e-mail, telefone e mensagem.</li>
            <li><strong>Navegação:</strong> páginas visitadas, cliques em anúncios e interações com o WhatsApp.</li>
          </ul>

          <h2>2. Finalidade do tratamento</h2>
          <p>Utilizamos seus dados para:</p>
          <ul>
            <li>Criar e gerenciar sua conta de usuário.</li>
            <li>Processar e encaminhar mensagens de contato sobre imóveis.</li>
            <li>Melhorar nossos serviços com base em estatísticas de uso.</li>
            <li>Enviar comunicações relacionadas à sua conta (aprovação, notificações).</li>
          </ul>

          <h2>3. Base legal</h2>
          <p>
            O tratamento dos seus dados é realizado com base no seu <strong>consentimento</strong>
            (Art. 7º, I da LGPD) e na <strong>execução de contrato</strong> ou procedimentos
            preliminares (Art. 7º, V da LGPD) quando necessário para a prestação dos serviços.
          </p>

          <h2>4. Compartilhamento de dados</h2>
          <p>
            Não vendemos nem alugamos seus dados pessoais. Podemos compartilhá-los com
            prestadores de serviço essenciais (como plataformas de envio de e-mail) sob obrigação
            contratual de confidencialidade, ou quando exigido por lei.
          </p>

          <h2>5. Retenção de dados</h2>
          <p>
            Seus dados são mantidos enquanto sua conta estiver ativa ou pelo prazo necessário
            para cumprir as finalidades descritas nesta política. Você pode solicitar a exclusão a
            qualquer momento.
          </p>

          <h2>6. Seus direitos (LGPD)</h2>
          <p>Nos termos da LGPD, você tem direito a:</p>
          <ul>
            <li>Confirmar a existência de tratamento dos seus dados.</li>
            <li>Acessar, corrigir ou atualizar seus dados.</li>
            <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
            <li>Revogar seu consentimento a qualquer momento.</li>
            <li>Solicitar a portabilidade dos seus dados.</li>
          </ul>
          <p>
            Para exercer seus direitos, entre em contato pelo e-mail{' '}
            <a href="mailto:hello@casabaccarat.com" className="text-[#6B6B99] underline">
              hello@casabaccarat.com
            </a>.
          </p>

          <h2>7. Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso
            não autorizado, perda ou divulgação, incluindo criptografia de senhas e comunicações
            via HTTPS.
          </p>

          <h2>8. Alterações nesta política</h2>
          <p>
            Podemos atualizar esta política periodicamente. Notificaremos mudanças significativas
            por e-mail ou por aviso em destaque no site.
          </p>

          <h2>9. Contato</h2>
          <p>
            Dúvidas sobre esta política? Fale conosco:{' '}
            <a href="mailto:hello@casabaccarat.com" className="text-[#6B6B99] underline">
              hello@casabaccarat.com
            </a>
          </p>
        </div>
      </div>
    </Layout>
  )
}
