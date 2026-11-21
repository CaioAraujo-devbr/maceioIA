# MACEIÓ.IA

Agente de turismo inteligente para **Maceió, Alagoas**. Site em Next.js 16 (App Router) com chat em português, inglês e espanhol.

Neste MVP as respostas são **simuladas** (conhecimento local no servidor, sem API key). O prompt do sistema e o payload `buildLlmMessages` já estão prontos para um provedor depois.

## Rodar localmente

Requisitos: Node.js 20.9+ (Node 22 indicado em `.nvmrc`).

Com nvm instalado, execute `nvm install` e `nvm use` antes de instalar as dependências.

```bash
cd ~/Projects/maceio-ia
npm ci
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). O chat fica em `/chat`.

## Deploy na Vercel (GitHub já conectado)

Repositório: https://github.com/CaioAraujo-devbr/maceioIA · Endereço público informado: https://maceio-ia.vercel.app.
Configuração de Production: `NEXT_PUBLIC_SITE_URL=https://maceio-ia.vercel.app` (atualize se adotar domínio próprio).

1. Faça o commit e envie as alterações revisadas ao repositório conectado ao projeto da Vercel.
2. No projeto da Vercel, confirme diretório raiz, preset Next.js e Node 22. Build: `npm run build`; instalação: `npm ci`.
3. Em Settings → Environment Variables, defina `NEXT_PUBLIC_SITE_URL` com a URL HTTPS pública final **para Production**. Sem essa variável, a aplicação tenta usar `VERCEL_PROJECT_PRODUCTION_URL`, fornecida pela Vercel quando suas variáveis de sistema estão habilitadas. Nunca configure localhost em produção.
4. Gere um novo deployment. Variáveis públicas e metadados são definidos no build. O build de Production falha se o endereço público não estiver configurado corretamente.
5. Confira `/api/health`, `/robots.txt`, `/sitemap.xml`, um roteiro, o chat, salvar/reabrir viagem e o menu no celular. Deployment Preview deve permanecer sem indexação, inclusive quando herdar o domínio de produção.
6. Após conferir o domínio final, cadastre-o no Google Search Console e envie `/sitemap.xml`. Isso permite acompanhar descoberta e indexação; não garante posição ou tráfego.

O código local não publica nem faz push automaticamente. Não é necessária chave de IA. Exemplos de configuração em `.env.example` e `.env.local.example`.

### Verificação e métricas

- `npm run check`: testes, lint e TypeScript.
- `npm run verify:live -- https://maceio-ia.vercel.app`: após o deploy, confere rotas públicas, cabeçalhos, canonical, robots e sitemap; retorna erro se a versão publicada ainda estiver antiga ou mal configurada. Não altera o site.
- `npm run release:check`: exige URL pública válida e executa verificações e build.
- Workflow de CI preparado localmente em `.github/workflows/ci.yml`, ainda não publicado: a credencial de push atual não possui o escopo `workflow`. O lançamento é validado por `npm run check` e build locais. Publicar o workflow depois por uma sessão autorizada do GitHub; ele não faz deploy.
- `/api/health`: diagnóstico simples da aplicação, sem dados privados. Não verifica serviços externos.
- Web Analytics é opcional e desativado por padrão. Para usar, habilite Analytics no painel da Vercel, confira os limites do seu plano e configure `NEXT_PUBLIC_ANALYTICS_ENABLED=true` antes de um novo deploy. O SDK remove query/hash da URL dos eventos, respeita Do Not Track e não recebe conversas. Esta etapa mede visitas, não conversões de roteiro.
- Chat: 30 requisições/minuto e 300 por janela de 24 horas por identificador derivado do IP confiável da Vercel. A integração opcional com Upstash compartilha os limites entre instâncias; sem ela, há apenas proteção local. Consulte a configuração e as limitações abaixo.
- Páginas `/sobre` e `/privacidade` explicam escopo, fontes, armazenamento local e métricas. Antes do lançamento comercial, completar canal real de contato do responsável.

## Scripts

Desenvolvimento e build usam Webpack para evitar a falha de criação de processos do Turbopack observada neste ambiente. O build baixa as fontes do Google e requer acesso à rede.

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm start` — serve o build
- `npm run lint` — ESLint
- `npm run typecheck` — validação TypeScript
- `npm test` — testes de regressão do chat e da API

## Onde está o “cérebro”

- `lib/system-prompt.ts` — persona e conhecimento profundo de Maceió
- `lib/knowledge.ts` — respostas simuladas por tema e idioma
- `lib/simulate-reply.ts` — escolha de tema + idioma
- `app/api/chat/route.ts` — API do chat

## Limites do chat

A API aceita JSON com 1–40 mensagens (`user` ou `assistant`), até 2.000 caracteres por mensagem e corpo de até 64 KiB. A última mensagem deve ser do usuário. O chat indica quando é necessário iniciar uma nova conversa.

O idioma é estimado por palavras completas, preservando o anterior em mensagens ambíguas. O chat combina textos por tema com um planejador por regras para roteiros completos de 1–7 dias. Prioriza destinos pedidos e informa quais não couberam. Períodos maiores exigem escolher um bloco de até sete dias; o formulário não oferece 30 dias. Cada dia tem orientações de organização e alternativa na página de resultados. Conversa e rascunho são preservados em sessionStorage na mesma aba, respeitando o pedido de entrada; “Nova conversa” limpa o histórico. Não há modelo de IA conectado nem consulta em tempo real. Perguntas diretas de maré e balneabilidade explicam essa limitação e abrem fontes oficiais.

## Próximas evoluções

Próximas evoluções: notícias de Maceió úteis a turistas dentro do portal, com fonte, data de publicação e revisão, e uma base local mais ampla para as respostas.

## Portal de viagem

A página inicial concentra dois caminhos: montar um roteiro em `/planejar` ou tirar uma dúvida em `/chat`. Exibe três destinos e fontes oficiais recolhidas em “Antes de sair”. O formulário e os detalhes de planejamento ficam na página interna. A camada visual atual usa Source Sans 3 para títulos e leitura. Os parâmetros do formulário são validados e usados pela lógica compartilhada de planejamento.

- `/destinos/pajucara`, `/destinos/ponta-verde`, `/destinos/gunga`: guias introdutórios e acesso ao mapa e ao chat.
- “Antes de sair”: links oficiais da Marinha, IMA/AL e Prefeitura; não representa integração ou atualização automática.
- Fotografias locais em `public/images`, com créditos e licenças disponíveis no rodapé. Fotos ilustrativas e históricas, otimizadas em WebP.

## Identidade MACEIÓ.IA

A arte oficial enviada pelo proprietário está em `public/brand/logo-oficial.jpg`, preservada sem alteração. O componente `OfficialSeal` enquadra o selo em um círculo usando CSS. A identidade usa azul profundo, turquesa e areia no portal, nas páginas de destino e no chat. O arquivo também é referência de ícone de navegação.

## Fluxo de planejamento

O formulário entrega o roteiro diretamente em `/planejar`, com preferências editáveis, cópia de texto e impressão/PDF pelo navegador. `createItinerary` é compartilhado pela página e pelo chat. Não há persistência em servidor; as escolhas ficam na URL e podem ser salvas no navegador, enquanto o chat usa a sessão da aba.

O planejador aceita interesse e transporte, prioriza atividades próximas quando o visitante está sem carro e respeita pedidos explícitos de incluir ou retirar Gunga, Ipioca e Maragogi. A frase “troque Gunga por Ipioca” mantém o contexto anterior. As sugestões seguem regras; não são reservas, preços verificados nem condições atuais do mar.

## Guia prático para visitantes

`/guia` reúne seis assuntos: transporte, hospedagem, alimentação, praias, família e informações oficiais. A busca é local, normaliza acentos e consulta títulos, descrições e palavras-chave. Cada assunto tem uma página em `/guia/[slug]`; não há consulta externa automática. A página inicial mantém o azul profundo e o turquesa da marca e prioriza busca, planejamento e acesso direto às orientações.


### Correções da auditoria e primeiro guia local

O guia `/guia/transporte` compara aplicativo, táxi, transfer e ônibus, orienta chegada, viagem com crianças e retorno ao MCZ. Inclui fontes primárias Aena Brasil e Uber consultadas em 15/11/2026, sem copiar tarifas ou prometer tempos fixos. A busca consulta também o conteúdo dos guias e reconhece voo e emergência. A localização do Gunga foi corrigida para Roteiro na base, no prompt e na página de destino. Testes de regressão cobrem os casos reais da auditoria.


### Retomar e compartilhar a viagem

“Salvar minha viagem” guarda as escolhas do formulário em localStorage, apenas no navegador atual. `/minha-viagem` permite reabrir ou remover o último roteiro; a página inicial mostra um atalho quando há um roteiro salvo. O armazenamento é opcional: se bloqueado, o visitante ainda pode baixar o texto. A viagem é reconstruída com o conteúdo atual; o download preserva a versão textual. Compartilhamento usa a folha nativa do dispositivo; sem suporte, copia o texto. Não envia URLs de localhost para outras pessoas.

### Preparação para publicação

Defina `NEXT_PUBLIC_SITE_URL=https://SEU-DOMINIO-REAL` **antes do build de produção**. Essa configuração alimenta canonical, Open Graph, `/sitemap.xml` e `/robots.txt`. Prévias mantêm a indexação desativada. Produção exige um domínio HTTPS configurado explicitamente ou fornecido pela Vercel. Não há deploy automático neste projeto. `/chat`, `/minha-viagem` e resultados de busca não são páginas para indexar. Search Console e a ativação opcional das métricas ainda dependem de configuração no lançamento.

Os guias de alimentação e hospedagem têm uma seleção inicial de estabelecimentos com endereço, telefone, site e mapa, baseada nos canais oficiais consultados em 15/11/2026. Não há tarifas, disponibilidade ou ranking de qualidade.


### Layout costeiro

A página inicial usa fotografia real de Pajuçara, mantém azul e turquesa da marca e oferece um formulário curto de roteiro (dias, grupo e transporte). Destinos, guias e fontes oficiais têm seções separadas. A camada visual atual está em `app/professional.css`; ajustes para 1050, 800, 600 e 360px preservam leitura e navegação. O menu móvel fecha após selecionar um destino e suporta Escape. Nenhuma API de IA foi conectada nesta alteração.


## Piloto com dez turistas

Situação inicial em 15/11/2026: **0 de 10 participantes observados**. Testes automatizados e acessos da equipe não contam como usuários reais. O proprietário ainda reunirá os participantes. Não registrar resultados que não foram observados.

### Convite para o proprietário encaminhar

“Estou testando o MACEIÓ.IA com pessoas que visitam ou planejam visitar Maceió. Você pode dedicar cerca de 10 minutos para organizar uma viagem no celular e me contar o que foi fácil ou difícil? É um teste do site, sem compra ou cadastro. A participação é voluntária.”

Encaminhar apenas a pessoas que aceitem participar; nenhum convite foi enviado automaticamente. Buscar perfis diferentes: primeira visita, viagem com crianças, com e sem carro. Não coletar nomes, documentos ou dados de contato na ficha de observação. Usar códigos P01 a P10. Pedir autorização antes de observar a tela e não gravá-la por padrão.

### Sessão de teste

Abrir https://maceio-ia.vercel.app no celular do participante. Explicar: “Estamos testando o site; você não está sendo avaliado. Diga em voz alta o que espera encontrar.” Não ensinar onde clicar antes de cada tarefa.

1. “Você vai passar três dias em Maceió. Organize um roteiro que combine com sua viagem.” Cronometrar desde a abertura até o resultado; anotar conclusão sem ajuda, com ajuda ou abandono.
2. “Escolha uma atividade e encontre a orientação de transporte ou alimentação que você usaria.” Anotar se encontrou uma informação útil e onde houve dúvida.
3. “Guarde o roteiro para consultar depois.” Conferir se salvou de verdade, sem instruir o nome do botão antes da tentativa.
4. “Volte ao início e encontre novamente a viagem que guardou.” Confirmar que o roteiro reabre no mesmo navegador, com as escolhas preservadas.
5. Perguntar: “O que você ainda precisaria confirmar antes de usar esse roteiro?”, “De 1 a 5, foi fácil organizar a viagem?” e “Você recomendaria o site? Por quê?”. Registrar as palavras do participante, sem transformar interesse em recomendação efetiva.

### Registro inicial — não são resultados

Copiar esta ficha para um arquivo local privado antes de registrar observações. Não publicar dados pessoais ou gravações no GitHub. Campos não preenchidos significam ausência de observação, não falha nem sucesso.

| Participante | Situação | Roteiro sem ajuda | Tempo (s) | Salvou | Reabriu | Facilidade 1–5 | Recomendaria | Maior dificuldade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P01 | A recrutar | — | — | — | — | — | — | — |
| P02 | A recrutar | — | — | — | — | — | — | — |
| P03 | A recrutar | — | — | — | — | — | — | — |
| P04 | A recrutar | — | — | — | — | — | — | — |
| P05 | A recrutar | — | — | — | — | — | — | — |
| P06 | A recrutar | — | — | — | — | — | — | — |
| P07 | A recrutar | — | — | — | — | — | — | — |
| P08 | A recrutar | — | — | — | — | — | — | — |
| P09 | A recrutar | — | — | — | — | — | — | — |
| P10 | A recrutar | — | — | — | — | — | — | — |

Critério de decisão proposto, definido antes dos testes: pelo menos 8 de 10 concluem o roteiro, salvam e reabrem sem ajuda; mediana de até 180 segundos para gerar o primeiro roteiro. Se não ocorrer, corrigir os obstáculos recorrentes antes de investir em aquisição. Esses números são metas internas deste piloto, não benchmarks de mercado; dez pessoas não demonstram demanda em escala.

### Acompanhamento após o lançamento

No painel Web Analytics da Vercel, registrar o intervalo observado, visitas, páginas mais acessadas e origem dos acessos. Separar a data de ativação e os acessos de QA do período de divulgação. Visita à página não comprova roteiro salvo ou recomendação; essas conclusões vêm da observação do piloto. Não há gravação de sessão nem eventos personalizados nesta versão.

Ao concluir as dez sessões, contar os resultados observados, listar os três problemas mais frequentes e escolher uma melhoria prioritária. Notícias, guias novos e parcerias devem responder às lacunas encontradas. Enviar apenas anotações anônimas para análise, se desejar apoio na consolidação.


## Proteção distribuída do chat

Implementação preparada nesta branch; não basta alterar o código local para ativá-la na publicação. O chat continua respondendo por regras, sem provedor de IA pago.

### Configurar na Vercel quando esta alteração for publicada

Crie ou selecione um banco Upstash Redis e configure estas variáveis **somente no servidor**, no ambiente Production do projeto MaceióIA:

| Variável | Conteúdo |
| --- | --- |
| `UPSTASH_REDIS_REST_URL` | Endpoint REST HTTPS do banco, sem caminho, query ou credenciais na URL. |
| `UPSTASH_REDIS_REST_TOKEN` | Token REST de escrita (não o token somente leitura). |
| `CHAT_RATE_LIMIT_SECRET` | Segredo aleatório exclusivo com pelo menos 32 caracteres, igual em todas as instâncias desse ambiente. |

Mantenha essas variáveis fora do GitHub e nunca use prefixo `NEXT_PUBLIC_`. Gere o segredo com um gerenciador de senhas ou ferramenta criptográfica. Use outro banco/segredo para Preview para não consumir a quota da produção nos testes. Alterar o segredo ou trocar o banco reinicia a identidade dos contadores. Faça um novo deployment depois de configurar. Nenhuma conta, banco ou contratação foi criada por esta alteração; confira os limites do serviço antes de ativar.

### Comportamento

- Por IP confiável da Vercel: 30 requisições por janela de 60 segundos e 300 por janela de 24 horas. As janelas começam na primeira requisição admitida; o limite diário não reinicia à meia-noite. Requisições inválidas também passam pela proteção antes da validação do corpo.
- Sem IP confiável, os visitantes dividem uma cota de 200/minuto e 2.000/24 horas. Headers de IP enviados fora da Vercel não são aceitos como identidade. Uma rede compartilhada pode dividir quota entre pessoas.
- Uma chamada HTTPS `EVAL` verifica e incrementa os dois contadores atomicamente no Redis. As chaves contêm apenas um HMAC do identificador, com TTL; mensagens, IP original e preferências não são enviados. O contador não renova o prazo quando uma tentativa é bloqueada. A execução depende de um backend compatível com a API REST/EVAL do Upstash e de contadores sem remoção antecipada por política de eviction.
- Há uma proteção local adicional, com até 5.000 identificadores por instância, para conter excesso de chamadas ao Redis. Seu relógio de janela pode divergir do Redis e tornar a quota mais restritiva. Quando a memória atinge a capacidade, novos identificadores são recusados até haver espaço.
- Sem configuração completa/válida, com HTTP de erro, retorno inesperado ou timeout de 1,5 segundo, o chat usa os contadores locais. Não há retry automático. Falhas de conexão, cabeçalhos e tokens não são registrados pelo aplicativo.
- O fallback local **não é distribuído**: pode reiniciar em cold starts e não é um teto global de gasto. `allowPaidProvider` fica falso no fallback, nas recusas e quando não há IP confiável. Um futuro adaptador de IA paga deverá obrigatoriamente exigir essa autorização, além de sua própria flag/chave e controle de orçamento. Esta branch não contém esse adaptador.
- Bloqueios retornam HTTP 429 e `Retry-After` em segundos; o limite diário tem mensagem própria. Respostas bem-sucedidas informam `X-Chat-Rate-Limit: local` ou `distributed`, sem expor identificadores, contagens ou credenciais.
- As respostas são limitadas a 12.000 caracteres, com indicação de resumo caso sejam cortadas. Esse teto de saída não controla tokens faturados de uma futura API: o adaptador também precisará configurar o limite no provedor.

### Verificar sem serviços reais

`npm run check` executa os testes sem acessar Upstash nem uma API de IA. Os mocks cobrem protocolo REST, identidade estável entre instâncias, concorrência em backend simulado, bloqueio por minuto/dia, expiração local, falhas HTTP/rede/JSON, timeout de conexão/corpo, fallback, ausência de IP confiável e limite de resposta. O Lua não é executado contra um Redis real nesses testes; validar a integração num ambiente de Preview separado antes de ativar em Production. Execute também `npm run build`.

Referências do contrato: [REST API do Upstash](https://upstash.com/docs/redis/features/restapi) e [EVAL](https://upstash.com/docs/redis/sdks/ts/commands/scripts/eval).
