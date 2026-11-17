# Arquitetura — Kurio

Este documento descreve o que foi observado no código revisado e os pontos que precisam ser comprovados antes da entrega. Os contratos-alvo vêm do enunciado; caminhos e formatos ainda não conferidos não são apresentados como API implementada.

## Organização do frontend

| Área                     | Responsabilidade                                                                |
| ------------------------ | ------------------------------------------------------------------------------- |
| `src/pages`              | Composição das páginas e interação com o roteamento                             |
| `src/components`         | Componentes da interface, incluindo detalhes, carrinho, autenticação e checkout |
| `src/api`                | Funções de acesso às APIs, incluindo NFTs, carteiras e pedidos                  |
| `src/lib/cartStore.ts`   | Estado do carrinho e aplicação do resultado de um pedido confirmado             |
| `src/lib/demoSession.ts` | Consulta, assinatura das mudanças e encerramento da sessão de demonstração      |
| `src/mocks`              | Configuração do MSW e handlers da API simulada                                  |

O detalhe usa o parâmetro `nftId` do TanStack Router. A consulta é executada pelo TanStack Query e recebe um `AbortSignal`. A página distingue carregamento, NFT inexistente (`404`) e outras falhas, para as quais oferece nova tentativa.

## Contratos REST

| Recurso        | Operações exigidas                                              | Evidência no código ou teste                                                                                           |
| -------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Sessão e conta | Cadastro, login, consulta, logout e expiração                   | Sessão de demonstração é lida pela interface. Confirmar métodos, rotas, credenciais e persistência nos handlers        |
| NFTs           | Listagem parametrizada e detalhe por identificador              | `getNftById(nftId, signal)` e tratamento de `404`. Conferir nomes dos parâmetros da listagem                           |
| Favoritos      | Consultar, adicionar e remover por conta                        | O coração do detalhe usa estado local no trecho revisado. Persistência e integração REST ainda precisam de comprovação |
| Carrinho       | Consultar, inserir, atualizar e remover por NFT e edição        | `addToCart` e leitura pelo `cartStore`. Confirmar integração REST e como a edição participa da identidade do item      |
| Cotação        | Revalidar cupom, preço, disponibilidade, desconto, taxa e total | Totais locais observados. Confirmar endpoint e uso da resposta da API antes de fechar o pedido                         |
| Carteiras      | Consultar, cadastrar e atualizar principal e secundária         | `getWallets` é chamado no checkout. Foram observadas respostas `401` na consulta                                       |
| Pedidos        | Criar de forma idempotente, consultar estado e recuperar recibo | `POST /api/orders` retornou `201` em teste anterior. Conferir contrato de consulta, conflitos e retomada               |
| Perfil         | Consultar e atualizar dados, avatar e senha                     | Interface observada. Conferir mutations, validação e persistência                                                      |

Para concluir a documentação dos contratos, registrar em cada operação: **método e caminho**, parâmetros, autenticação exigida, exemplo de requisição, exemplo de sucesso e formato dos erros. Cobrir `400` para validação, `401` para sessão inválida, `403` para falta de permissão, `404` para recurso inexistente, `409` para conflito e `5xx` para falha transitória, conforme as respostas efetivas dos handlers.

O contrato exigido pelo desafio prevê valores em ETH como **strings decimais** e quantidades como inteiros. No código revisado, o detalhe converte `price` para `Number` e o resumo calcula em milésimos de ETH. Isso demonstra os valores do cenário observado, mas ainda precisa ser revisto para preços com mais de três casas decimais. A cotação aceita pela API deve ser a fonte dos valores do pedido e do recibo.

## Sessão e isolamento por usuário

O checkout lê `getDemoSession()` para decidir se abre o diálogo de autenticação. A consulta de carteiras vista no componente é habilitada quando há e-mail na sessão e usa a chave `['wallets', email]`.

A presença de nome e e-mail na interface não comprova que a sessão é aceita pela API. No caso observado, a tela ainda exibia dados do usuário com `wallets` retornando `401`. O fallback manual foi exibido. O botão **Sair** do perfil também não respondeu no teste relatado; a causa ainda não foi identificada.

A política de entrega deve cobrir:

- Recuperação da sessão após refresh e retorno à rota original após login.
- Tratamento de `401` em rotas privadas e no checkout, preservando o carrinho e o contexto para retomada.
- Logout e troca de usuário com remoção das consultas privadas do cache, cancelamento de requisições em andamento e encerramento das subscriptions da sessão anterior.
- Separação dos dados privados por identidade autenticada, incluindo carteiras, perfil, favoritos e pedidos.
- Fixtures fictícias para testes, sem senhas em claro armazenadas pela aplicação.

## Carrinho, cotação e pedidos

O fluxo do detalhe revisado adiciona o NFT ao carrinho e navega para `/carrinho`. A chamada observada é `addToCart(nft.id, quantity)`; a edição escolhida não é passada nessa chamada. Para cumprir o requisito de disponibilidade por edição, é necessário verificar ou completar a identificação do item no store, na cotação e no pedido.

No checkout revisado:

1. A página verifica sessão, presença de itens, validade do formulário e formato do endereço da carteira.
2. Envia um snapshot de IDs e quantidades, junto à carteira e ao identificador da tentativa.
3. Uma trava em memória evita cliques simultâneos durante o envio.
4. Para o mesmo usuário, itens e endereço, a tentativa pode reutilizar o identificador enquanto a página estiver montada.
5. O código só aplica o pedido no carrinho e navega para `/confirmacao` ao receber estado `confirmed`.

A trava e o identificador em memória precisam ser complementados com recuperação após refresh ou reconexão. A API simulada deve devolver o mesmo pedido ao receber a mesma chave com o mesmo conteúdo e responder com conflito se o conteúdo mudar. Uma cotação desatualizada deve exigir nova revisão antes da confirmação.

O recibo deve usar o snapshot confirmado, incluindo itens, quantidades, preços, descontos, taxas e total. Mudanças posteriores no catálogo não devem alterar o recibo. Estados `confirmed` e `refused` são terminais; o pedido pendente deve ser recuperável.

## Estratégia de cache e consultas

| Recurso                     | Comportamento observado                                                                            | Regra a concluir e testar                                                                           |
| --------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Detalhe                     | Chave `['nfts', 'detail', nftId]`, `AbortSignal` e `retry: false`                                  | Reconciliar o detalhe após alteração de preço ou disponibilidade                                    |
| Catálogo                    | Interface de catálogo observada                                                                    | Incluir todos os parâmetros da URL na chave; cancelar ou descartar respostas obsoletas              |
| Carteiras                   | Chave `['wallets', email]`, `retry: false`, sem nova consulta ao focar a janela no trecho revisado | Invalidar após cadastro/edição e remover dados no logout                                            |
| Perfil, favoritos e pedidos | Estratégia completa ainda não comprovada                                                           | Isolar por conta e invalidar após mutations e eventos relevantes                                    |
| Favoritos otimistas         | Estado local observado no detalhe                                                                  | Salvar o estado anterior, atualizar a interface, restaurar em caso de falha e reconciliar com a API |

`401` exige tratamento de sessão. Conflitos de preço, edição ou cupom exigem revisão do estado. A repetição de uma criação de pedido deve preservar a chave de idempotência.

## MSW, fixtures e reset

O MSW intercepta requisições na camada de rede. Os handlers devem compartilhar estado consistente entre catálogo, carteiras, perfil, favoritos, carrinho e pedidos. A interface deve reagir às respostas dos handlers, sem fabricar resultados de sucesso locais.

Documentar e verificar:

- Configuração que habilita os mocks em desenvolvimento, demonstração e E2E.
- Duas contas fictícias com dados distinguíveis e uma coleção que permita filtros combinados e paginação.
- Cenários determinísticos de latência, falha, sessão expirada, conflito, cotação alterada e pedido pendente.
- O reset de cada cenário, incluindo o que é restaurado em memória e o que persiste após refresh.
- Reuso dos mesmos contratos e fixtures para testes REST e de tempo real.

## Tempo real e reconciliação

| Evento exigido  | Recurso                | Comportamento esperado                                                                                   |
| --------------- | ---------------------- | -------------------------------------------------------------------------------------------------------- |
| `nft.updated`   | NFT e edição afetada   | Atualizar preço/disponibilidade no catálogo, detalhe e carrinho. Bloquear confirmação com cotação antiga |
| `order.updated` | Pedido da sessão ativa | Atualizar estado pendente; exibir confirmação ou recusa quando receber um estado terminal                |

O formato final deve registrar identidade estável do evento, ID do recurso, versão e payload. Ao receber o mesmo evento duas vezes ou uma versão mais antiga, a aplicação deve manter o estado mais recente. Após reconectar, deve consultar a API REST para recuperar os recursos ativos e corrigir eventos perdidos. Eventos da sessão anterior devem ser descartados.

Registrar a integração usada entre MSW e Socket.IO, a configuração do transporte, as limitações e como disparar os cenários. A instalação de `socket.io-client` por si só não comprova que os eventos percorrem o protocolo. A evidência deve mostrar a atualização chegando pelo cliente e a reconciliação pela API.

## Responsividade, acessibilidade e desvios do Figma

A tela móvel de detalhe, revisada em **361 px**, mostra o favorito no topo e quantidade, preço e botão de compra na barra inferior. O breakpoint mantém o preço perto do título no desktop. Ainda é necessário verificar os tamanhos mínimos exigidos de **390, 768 e 1440 px**.

Diferenças registradas no carrinho mobile:

- O card mostra **ID do token** onde o Figma mostra **Edição**. Exibir a edição efetivamente selecionada exige que ela chegue ao carrinho.
- No Figma, cupom, totais e botão compartilham o mesmo painel. No print atual, o botão está fixo no rodapé e separado do resumo.
- O protótipo exibe vários NFTs como exemplo. A aplicação deve renderizar os itens reais do cenário, inclusive quando houver apenas um NFT.
- Na tela de pagamento, verificar se a carteira **Reserva** aparece quando há uma carteira secundária cadastrada.

Validar navegação por teclado, foco visível, fechamento e retorno de foco em diálogos, labels, mensagens associadas aos campos, contraste e layout com zoom. Incluir skeletons com shimmer em catálogo, detalhe e resumo durante carregamento, respeitando movimento reduzido e reservando espaço para o conteúdo. Registrar no documento qualquer substituição de imagem ou fonte, com o motivo.

## O que ainda bloqueia a entrega

1. Resolver o `401` na consulta de carteiras e revalidar o pedido com duas unidades até o recibo; investigar separadamente o botão **Sair** do perfil.
2. Conferir os contratos reais contra os handlers, incluindo sessão, favoritos, cupom, cotação, edição e recuperação de pedidos.
3. Demonstrar eventos pelo Socket.IO com reconexão e impedir a confirmação de uma cotação antiga.
4. Executar os testes Playwright, gerar baselines e relatório e rodar as auditorias Lighthouse.
5. Validar o build de demonstração, publicar a aplicação e registrar a URL no README.
