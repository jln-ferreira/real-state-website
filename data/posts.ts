export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string         // ISO string e.g. "2025-03-15"
  category: string     // legacy — use categories[]
  categories?: string[]
  readTime: string
  published?: boolean  // defaults to true
  registeredAt?: string  // ISO string, auto-set on creation
  views?: number
}

/** Returns the post's categories, handling both old (string) and new (array) format */
export function getPostCategories(post: Post): string[] {
  if (post.categories && post.categories.length > 0) return post.categories
  if (post.category) return [post.category]
  return []
}

export const POSTS: Post[] = [
  {
    slug: 'como-escolher-imovel-ideal',
    title: 'Como Escolher o Imóvel Ideal para Sua Família',
    excerpt: 'Escolher o imóvel certo envolve muito mais do que o preço. Saiba como equilibrar localização, tamanho e potencial de valorização.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    date: '2025-03-15',
    category: 'Dicas',
    readTime: '6 min',
    content: `
      <p>Encontrar o imóvel ideal para a família é uma das decisões mais importantes da vida. Além do valor financeiro envolvido, essa escolha impacta diretamente a qualidade de vida, a rotina e os planos futuros de todos os moradores.</p>

      <h2>Defina seu orçamento com clareza</h2>
      <p>Antes de visitar qualquer imóvel, é fundamental ter clareza sobre quanto você pode gastar. Considere não apenas o valor do bem, mas também os custos adicionais: ITBI, escritura, registro, reformas iniciais e despesas de mudança. Uma regra prática é comprometer no máximo 30% da renda mensal familiar com o financiamento.</p>
      <p>Converse com seu banco e simule as condições do financiamento antes de começar a procurar. Saber exatamente sua capacidade de crédito evita frustrações.</p>

      <h2>Localização é tudo</h2>
      <p>O bairro onde você vai morar influencia diretamente a sua rotina diária. Avalie os seguintes pontos:</p>
      <ul>
        <li>Proximidade ao trabalho e escolas das crianças</li>
        <li>Acesso a transporte público e vias principais</li>
        <li>Comércio local: mercados, farmácias, serviços de saúde</li>
        <li>Segurança da região e infraestrutura urbana</li>
        <li>Potencial de valorização da área nos próximos anos</li>
      </ul>

      <h2>Espaço e planta do imóvel</h2>
      <p>Pense no número de dormitórios que a família precisa hoje e nos próximos 5 a 10 anos. Uma família que planeja ter filhos ou receber parentes frequentemente precisa de espaço extra. Analise também a distribuição dos cômodos: uma boa planta otimiza o espaço e melhora o conforto.</p>
      <p>Avalie áreas de serviço, garagem, varanda e a posição solar do apartamento ou casa. Imóveis com boa ventilação e iluminação natural têm melhor qualidade de vida e menor custo com energia.</p>

      <h2>Pense no futuro</h2>
      <p>Imóvel é investimento de longo prazo. Considere o potencial de revenda ou locação do bem caso você precise mudar de cidade ou de situação financeira. Bairros em desenvolvimento, próximos a novos projetos de infraestrutura, tendem a valorizar mais rapidamente.</p>

      <h2>Não negligencie a vistoria</h2>
      <p>Antes de fechar qualquer negócio, contrate um engenheiro ou arquiteto para realizar uma vistoria técnica. Problemas estruturais, infiltrações e instalações elétricas ou hidráulicas defeituosas podem representar custos altíssimos. Uma vistoria bem feita protege seu investimento e evita surpresas desagradáveis.</p>
      <p>Com planejamento e as informações certas, a escolha do imóvel ideal se torna uma experiência muito mais tranquila e segura para toda a família.</p>
    `,
  },
  {
    slug: 'tendencias-mercado-imobiliario-2025',
    title: 'Tendências do Mercado Imobiliário em 2025',
    excerpt: 'O mercado imobiliário está em constante transformação. Conheça as principais tendências que estão moldando o setor este ano.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
    date: '2025-03-08',
    category: 'Mercado',
    readTime: '5 min',
    content: `
      <p>O setor imobiliário em 2025 apresenta um cenário dinâmico, impulsionado por transformações tecnológicas, mudanças nos hábitos de consumo e oscilações econômicas. Para quem deseja comprar, vender ou investir, entender as tendências do mercado é essencial para tomar decisões mais inteligentes.</p>

      <h2>Alta demanda por imóveis de médio padrão</h2>
      <p>Com a estabilização parcial da taxa de juros, mais famílias voltaram a considerar a compra do primeiro imóvel. Os empreendimentos de médio padrão — entre 60 e 120 m² — seguem com alta absorção no mercado, especialmente em bairros bem conectados às principais centralidades urbanas.</p>
      <p>O programa governamental de habitação popular também aqueceu o segmento econômico, com novas faixas de renda sendo contempladas e mais crédito disponível.</p>

      <h2>Tecnologia transformando o setor</h2>
      <p>A digitalização do mercado imobiliário avançou significativamente. Hoje é possível:</p>
      <ul>
        <li>Fazer visitas virtuais em 3D sem sair de casa</li>
        <li>Assinar contratos de forma totalmente digital</li>
        <li>Comparar imóveis com ferramentas de inteligência artificial</li>
        <li>Acessar toda a documentação via plataformas online</li>
      </ul>
      <p>Essas inovações reduziram o tempo médio de negociação e tornaram o processo mais transparente para compradores e vendedores.</p>

      <h2>Regiões em crescimento</h2>
      <p>Cidades do interior e regiões metropolitanas de médio porte estão em evidência. A expansão do trabalho remoto permitiu que muitas famílias optassem por qualidade de vida fora dos grandes centros, impulsionando mercados imobiliários antes considerados secundários.</p>
      <p>Bairros com novos projetos de mobilidade urbana — ciclovias, corredores de ônibus e futuras estações de metrô — também demonstram crescimento consistente nos preços.</p>

      <h2>O impacto dos juros no crédito imobiliário</h2>
      <p>A taxa Selic permanece como o principal termômetro do crédito imobiliário. Qualquer redução nos juros representa diretamente mais acesso ao financiamento e aquecimento do mercado. Especialistas acompanham de perto as sinalizações do Banco Central para projetar o comportamento dos preços nos próximos trimestres.</p>
      <p>Para quem está planejando comprar, o momento de entrar no mercado depende muito do perfil financeiro individual — e uma consultoria especializada pode fazer toda a diferença.</p>
    `,
  },
  {
    slug: 'comprar-ou-alugar',
    title: 'Comprar ou Alugar: O Guia Definitivo',
    excerpt: 'Essa é uma das dúvidas mais comuns no mercado imobiliário. Entenda os prós e contras de cada opção e descubra o que faz mais sentido para o seu momento de vida.',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&q=80',
    date: '2025-02-28',
    category: 'Finanças',
    readTime: '7 min',
    content: `
      <p>Comprar ou alugar um imóvel é uma das decisões financeiras mais relevantes da vida. Não existe uma resposta universalmente correta — a escolha certa depende do seu momento de vida, situação financeira e planos para o futuro.</p>

      <h2>Vantagens de comprar um imóvel</h2>
      <p>A compra de um imóvel oferece estabilidade e segurança patrimonial. Entre os principais benefícios estão:</p>
      <ul>
        <li><strong>Patrimônio próprio:</strong> cada parcela paga agrega valor a um bem seu</li>
        <li><strong>Liberdade para personalizar:</strong> você pode reformar e decorar sem restrições</li>
        <li><strong>Proteção contra reajustes:</strong> sem surpresas de aumento no aluguel</li>
        <li><strong>Renda passiva:</strong> possibilidade de alugar o imóvel futuramente</li>
        <li><strong>Valorização:</strong> imóveis bem localizados tendem a se valorizar ao longo do tempo</li>
      </ul>

      <h2>Vantagens de alugar</h2>
      <p>Por outro lado, o aluguel oferece flexibilidade que a compra não permite:</p>
      <ul>
        <li><strong>Mobilidade:</strong> facilidade para mudar de cidade ou de imóvel conforme a necessidade</li>
        <li><strong>Menor comprometimento financeiro inicial:</strong> sem entrada, ITBI, escritura e registro</li>
        <li><strong>Manutenção estrutural:</strong> problemas estruturais são responsabilidade do proprietário</li>
        <li><strong>Capital livre:</strong> o dinheiro que seria a entrada pode ser investido com rendimento</li>
      </ul>

      <h2>Como decidir?</h2>
      <p>A decisão deve considerar alguns fatores-chave:</p>
      <p><strong>Estabilidade de renda:</strong> se sua renda é variável ou você está em transição de carreira, alugar pode ser mais prudente. Financiamentos exigem comprometimento de renda por décadas.</p>
      <p><strong>Planos de permanência:</strong> se você pretende ficar na mesma cidade por pelo menos 5 a 7 anos, a compra começa a fazer mais sentido financeiramente. Para períodos mais curtos, o aluguel costuma ser mais vantajoso.</p>
      <p><strong>Comparação de custos:</strong> compare o valor do aluguel com a parcela do financiamento equivalente. Se a parcela for até 20% maior que o aluguel para imóvel equivalente, pode valer a pena comprar. Acima disso, o aluguel pode ser mais eficiente financeiramente.</p>

      <h2>O papel do investimento alternativo</h2>
      <p>Uma análise completa deve considerar o custo de oportunidade: se você investir a entrada em renda fixa ou outros ativos, qual seria o retorno? Às vezes, alugar e investir o capital disponível pode gerar resultados superiores à compra no curto e médio prazo.</p>
      <p>Em qualquer cenário, o mais importante é alinhar a decisão com seus objetivos de vida — não apenas com a matemática fria dos números.</p>
    `,
  },
  {
    slug: 'valorizar-seu-imovel-antes-de-vender',
    title: '5 Formas de Valorizar Seu Imóvel Antes de Vender',
    excerpt: 'Pequenas melhorias podem aumentar significativamente o valor de mercado do seu imóvel. Veja as estratégias que realmente fazem diferença.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80',
    date: '2025-02-15',
    category: 'Dicas',
    readTime: '5 min',
    content: `
      <p>Antes de colocar seu imóvel à venda, existem ações simples e de custo acessível que podem aumentar consideravelmente seu valor de mercado e atrair compradores mais rapidamente. Confira as cinco estratégias mais eficientes.</p>

      <h2>1. Invista na fachada e áreas externas</h2>
      <p>A primeira impressão é definitiva. Uma fachada bem cuidada — com pintura renovada, jardim aparado e portão limpo — já sinaliza ao comprador que o imóvel foi bem mantido. O investimento nessa área costuma ter retorno de 3 a 5 vezes o valor aplicado.</p>
      <p>Se o imóvel tem área de lazer ou quintal, certifique-se de que estão limpos, organizados e funcionais. Uma churrasqueira bem conservada, por exemplo, pode ser um diferencial decisivo.</p>

      <h2>2. Modernize cozinha e banheiros</h2>
      <p>Esses são os ambientes que mais influenciam a decisão de compra. Não é necessário uma reforma completa: trocar metais e torneiras, instalar novos azulejos em pontos estratégicos, atualizar iluminação e substituir armários velhos por modelos mais modernos já fazem enorme diferença na percepção do comprador.</p>

      <h2>3. Pintura e iluminação renovadas</h2>
      <p>Uma pintura nova em cores neutras (branco, off-white, cinza claro) amplia visualmente os ambientes e transmite sensação de limpeza e cuidado. Evite cores muito pessoais que possam não agradar ao público geral.</p>
      <p>Revise também a iluminação: pontos de luz bem posicionados valorizam cada ambiente. Lâmpadas LED modernas são baratas, econômicas e muito mais atraentes do que lâmpadas amareladas antigas.</p>

      <h2>4. Organize, limpe e despersonalize</h2>
      <p>Antes das fotos e das visitas, retire objetos pessoais em excesso: fotos de família, coleções, móveis desnecessários. O objetivo é ajudar o comprador a imaginar sua própria vida naquele espaço — e isso é difícil quando o imóvel está carregado de personalidade alheia.</p>
      <p>Uma limpeza profissional — incluindo vidros, rejuntes e carpetes — é investimento obrigatório. Imóveis limpos e organizados são percebidos como mais valiosos e vendem mais rápido.</p>

      <h2>5. Regularize a documentação</h2>
      <p>Um imóvel com documentação em dia transmite segurança ao comprador e acelera o processo de negociação. Certifique-se de que o IPTU está pago, não há débitos de condomínio e a matrícula está atualizada no cartório. Imóveis com pendências documentais ficam meses parados enquanto os concorrentes já foram vendidos.</p>
      <p>Seguindo essas cinco etapas, você estará muito mais preparado para conseguir o melhor preço pelo seu imóvel no menor tempo possível.</p>
    `,
  },
  {
    slug: 'o-que-verificar-no-contrato-de-aluguel',
    title: 'O que Verificar Antes de Assinar um Contrato de Aluguel',
    excerpt: 'Assinar um contrato de aluguel sem a atenção devida pode gerar dores de cabeça sérias. Veja o checklist completo para se proteger.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80',
    date: '2025-02-05',
    category: 'Guias',
    readTime: '6 min',
    content: `
      <p>O contrato de aluguel é o documento que regula a relação entre locatário e proprietário durante toda a locação. Ler com atenção cada cláusula — e entender o que está sendo assinado — é fundamental para evitar conflitos e surpresas desagradáveis.</p>

      <h2>Dados do imóvel e das partes</h2>
      <p>Verifique se o contrato traz corretamente o endereço completo do imóvel, a metragem, o número de vagas de garagem e todos os itens que fazem parte da locação (móveis, eletrodomésticos, etc.). Os dados do locador, locatário e, se houver, da imobiliária devem estar completos e corretos.</p>
      <p>Confirme também que o locador é de fato o proprietário do imóvel, consultando a matrícula atualizada no cartório de registro de imóveis.</p>

      <h2>Valor, vencimento e reajuste</h2>
      <p>Atente-se a:</p>
      <ul>
        <li>Valor do aluguel e data de vencimento</li>
        <li>Índice de reajuste anual (IGP-M ou IPCA — verifique qual é mais vantajoso no cenário atual)</li>
        <li>Multa por atraso e forma de pagamento aceita</li>
        <li>Valores de condomínio e IPTU — quem paga cada um</li>
      </ul>

      <h2>Garantias exigidas</h2>
      <p>A Lei do Inquilinato permite diferentes formas de garantia: fiador, caução em dinheiro, seguro-fiança ou título de capitalização. Analise qual é mais viável para você. O seguro-fiança é prático mas tem custo anual; o fiador precisa ter imóvel próprio em nome.</p>
      <p>Não são permitidas cumulação de garantias pelo proprietário — se já há fiador, não pode exigir também caução em dinheiro.</p>

      <h2>Obrigações do locatário</h2>
      <p>O contrato deve especificar claramente quais manutenções são de responsabilidade do inquilino (pequenos reparos e conservação) e quais são do proprietário (estruturais e desgaste natural). Fique atento a cláusulas que tentam transferir para o inquilino obrigações que legalmente são do proprietário.</p>

      <h2>Prazo e condições de rescisão</h2>
      <p>O prazo mínimo em contrato garante direitos tanto ao locador quanto ao locatário. Verifique a multa proporcional por rescisão antecipada e os prazos de aviso prévio. A partir de 30 meses de contrato, o proprietário pode pedir o imóvel sem necessidade de justificativa — antes disso, há restrições legais.</p>
      <p>Faça também uma vistoria detalhada antes de entrar no imóvel, documentando em fotos e vídeos o estado de cada cômodo. Essa documentação é sua proteção na hora de devolver o imóvel.</p>
    `,
  },
  {
    slug: 'financiamento-imobiliario-guia-completo',
    title: 'Financiamento Imobiliário: Guia Completo para Realizar seu Sonho',
    excerpt: 'Entenda como funciona o financiamento imobiliário no Brasil, os principais sistemas e como aumentar suas chances de aprovação.',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80',
    date: '2025-01-20',
    category: 'Finanças',
    readTime: '8 min',
    content: `
      <p>O financiamento imobiliário é o caminho mais comum para a aquisição da casa própria no Brasil. Entender como ele funciona, quais são suas modalidades e o que fazer para aumentar as chances de aprovação pode poupar muito tempo e dinheiro.</p>

      <h2>Como funciona o financiamento</h2>
      <p>No financiamento imobiliário, uma instituição financeira (banco, caixa ou fintech) paga ao vendedor o valor do imóvel e o comprador devolve esse montante em parcelas mensais ao longo de anos — geralmente de 20 a 35 anos. O imóvel fica alienado fiduciariamente ao banco até a quitação total da dívida.</p>
      <p>O comprador costuma precisar dar uma entrada de pelo menos 20% do valor do imóvel, pois os bancos geralmente financiam até 80% (alguns chegam a 90% em casos específicos).</p>

      <h2>Principais sistemas de amortização</h2>
      <p>Existem dois sistemas principais no Brasil:</p>
      <ul>
        <li><strong>SAC (Sistema de Amortização Constante):</strong> as parcelas começam mais altas e diminuem ao longo do tempo. O valor amortizado é fixo, mas os juros caem com o saldo devedor. Melhor para quem quer pagar menos juros no total.</li>
        <li><strong>PRICE (Tabela Price):</strong> parcelas fixas durante todo o contrato. Facilita o planejamento mensal, mas resulta em maior pagamento de juros ao longo do financiamento.</li>
      </ul>

      <h2>FGTS no financiamento</h2>
      <p>O saldo do FGTS pode ser utilizado para reduzir o valor do financiamento, dar a entrada ou amortizar parcelas, desde que o comprador atenda aos requisitos legais: ter pelo menos 3 anos de trabalho sob regime do FGTS, não ser proprietário de outro imóvel na mesma cidade e que o imóvel seja residencial urbano.</p>

      <h2>Documentação necessária</h2>
      <p>Para solicitar o financiamento, você precisará de:</p>
      <ul>
        <li>Documentos pessoais (RG, CPF, comprovante de estado civil)</li>
        <li>Comprovante de renda dos últimos 3 meses</li>
        <li>Comprovante de residência atualizado</li>
        <li>Declaração de IR dos últimos 2 anos</li>
        <li>Documentos do imóvel: matrícula, certidões e habite-se</li>
      </ul>

      <h2>Dicas para aumentar suas chances de aprovação</h2>
      <p>Para ter o crédito aprovado com melhores condições:</p>
      <ul>
        <li>Mantenha o nome limpo — quitar pendências no SPC/Serasa antes de solicitar é essencial</li>
        <li>Comprove toda a renda: renda informal pode ser declarada com contrato social ou declaração do contador</li>
        <li>Simule em diferentes bancos: as taxas variam e a diferença pode ser de dezenas de milhares de reais</li>
        <li>Não comprometemos mais de 30% da renda com a parcela — os bancos geralmente não aprovam acima disso</li>
        <li>Tenha reserva além da entrada: ITBI, escritura e registro somam de 3% a 5% do valor do imóvel</li>
      </ul>
      <p>Com planejamento adequado e informações completas, o financiamento imobiliário pode ser uma ferramenta poderosa para conquistar o imóvel dos seus sonhos de forma segura e sustentável.</p>
    `,
  },
]

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS.find(p => p.slug === slug)
}

export function getRecentPosts(excludeSlug?: string, limit = 4): Post[] {
  return POSTS.filter(p => p.slug !== excludeSlug).slice(0, limit)
}

export function getCategories(): string[] {
  return [...new Set(POSTS.map(p => p.category))]
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
