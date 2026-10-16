# Plano de testes do sistema da biblioteca

## Objetivo

Verificar os fluxos principais da API da biblioteca definidos nos módulos anteriores: autenticação, proteção por token, cadastro, listagem e exclusão de livros e movimentações de estoque vinculadas ao usuário responsável.

## Escopo

Estão incluídos:

- login com credenciais válidas e inválidas;
- proteção das rotas privadas;
- cadastro, paginação, filtro e exclusão de livros;
- permissão de exclusão por perfil;
- validação e registro de movimentações;
- associação da movimentação ao usuário autenticado.

As telas do Módulo 8 são verificadas separadamente quanto à estrutura, navegação e responsividade. A integração das telas com a API pertence ao Módulo 9.

## Ambiente e estratégia

- Node.js 18 ou superior;
- API Express e models Sequelize do projeto;
- MariaDB para a execução manual de sistema;
- testes automatizados isolados com `node:test`, executados por `npm test`;
- técnicas de caixa-preta, caminho feliz, caminho de erro e valor limite.

Os testes automatizados substituem os models por respostas controladas. Dessa forma, verificam a regra da aplicação sem alterar o banco local. Para a evidência completa de persistência, os mesmos casos CT04, CT06, CT09 e CT10 devem ser repetidos contra o MariaDB e conferidos no banco.

## Critérios de entrada

- dependências instaladas com `npm install` dentro de `src`;
- variáveis do arquivo `src/.env` configuradas;
- para a execução manual: MariaDB ativo, banco criado, um administrador, um operador e pelo menos três livros cadastrados.

## Critérios de saída

- todos os dez casos executados;
- nenhum caso falho ou bloqueado;
- nenhum defeito crítico ou de severidade alta aberto;
- regressão executada após qualquer correção.

## Casos de teste

| ID | Requisito | Cenário | Entrada | Resultado esperado |
| --- | --- | --- | --- | --- |
| CT01 | RF03 / RNF03 | Login correto | E-mail e senha válidos | Status 200, token válido com expiração de 8 horas |
| CT02 | RF03 | Login com senha errada | E-mail válido e senha incorreta | Status 401, mensagem clara e nenhum token |
| CT03 | RNF02 | Listar livros sem token | `GET /livros` sem Authorization | Status 401 e acesso negado |
| CT04 | RF05 | Cadastrar livro válido | Token e dados completos | Status 201 e livro criado |
| CT05 | RN01 / RN02 | Operador exclui livro | Token de operador e ID existente | Status 403 e livro preservado |
| CT06 | RF11 / RN01 | Administrador exclui livro | Token de administrador e ID existente | Status 200 e livro removido |
| CT07 | RF07 | Listar com paginação | `pagina=2&limite=2` | No máximo dois itens e deslocamento correto |
| CT08 | RF08 | Filtrar pelo título | `nome=dom` | Somente títulos compatíveis com “dom” |
| CT09 | RF09 / RF10 / RN05 | Registrar movimentação | Livro, tipo e quantidade válidos | Status 201, estoque atualizado e `usuario_id` do token |
| CT10 | RN04 | Quantidade igual a zero | Quantidade `0` | Status 400, sem transação e sem alteração no banco |

## Matriz de rastreabilidade

| Requisito | Casos | Cobertura |
| --- | --- | --- |
| RF03 | CT01, CT02 | caminho feliz e erro |
| RF05 | CT04 | caminho feliz |
| RF07 | CT07 | paginação |
| RF08 | CT08 | filtro parcial |
| RF09 | CT09, CT10 | caminho feliz e limite inválido |
| RF10 | CT09 | usuário responsável |
| RF11 | CT05, CT06 | perfis sem e com permissão |
| RNF02 | CT03 | rota protegida |
| RNF03 | CT01 | expiração de 8 horas |
| RN01 | CT05, CT06 | autorização por perfil |
| RN02 | CT05 | restrição do operador |
| RN04 | CT10 | valor limite inferior |
| RN05 | CT09 | vínculo com o usuário autenticado |

## Execução automatizada

Na pasta `src`, executar:

```bash
npm test
```

Resultado da regressão em 16 de outubro de 2026:

| Total | Passou | Falhou | Bloqueado | Defeitos abertos |
| ---: | ---: | ---: | ---: | ---: |
| 10 | 10 | 0 | 0 | 0 |

## Registro de defeito

Quando um caso falhar, registrar:

- ID e título;
- caso de teste relacionado;
- passos exatos para reproduzir;
- resultado esperado e resultado obtido;
- severidade;
- evidência;
- status do defeito.

Após a correção, repetir o caso que falhou e executar novamente toda a suíte de regressão.
