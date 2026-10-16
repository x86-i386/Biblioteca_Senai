# Módulo 6 — Requisitos de Sistema

## 1. O que vamos fazer neste módulo

Nos módulos anteriores, o sistema da biblioteca foi construído com cadastro, login, perfis de usuário, controle de estoque, paginação, filtros, rastreabilidade e exclusão protegida.

Neste módulo, vamos documentar **o que o sistema deve fazer** e **quais condições ele deve respeitar**. Essa documentação serve como referência para desenvolvimento, validação e testes.

Ao final, os requisitos estarão classificados em:

- **Requisitos funcionais (RF):** ações que o sistema executa.
- **Requisitos não funcionais (RNF):** qualidades, limites ou tecnologias do sistema.
- **Regras de negócio (RN):** regras da biblioteca que devem ser respeitadas.

## 2. O que é um requisito

Requisito é tudo aquilo que o sistema precisa fazer ou uma característica que precisa ter para atender às necessidades do usuário e do negócio.

Os requisitos funcionam como um contrato entre quem solicita o sistema e quem o desenvolve. Eles ajudam a definir escopo, prazo, prioridades e testes.

| Tipo | Sigla | Pergunta respondida |
| --- | --- | --- |
| Requisito funcional | RF | O que o sistema faz? |
| Requisito não funcional | RNF | Como o sistema deve ser? |
| Regra de negócio | RN | Qual regra da biblioteca precisa ser respeitada? |

## 3. Requisitos funcionais

Um requisito funcional descreve uma ação do usuário ou do próprio sistema. Normalmente pode ser associado a uma rota, tela, botão ou processo automático.

Formato recomendado:

> **RFxx — O sistema deve permitir que [quem] [faça o quê].**

### Requisitos funcionais da biblioteca

| Código | Requisito | Implementação |
| --- | --- | --- |
| RF01 | O sistema deve permitir o cadastro de usuários com nome, e-mail, senha e perfil de acesso. | `POST /usuarios` |
| RF02 | O sistema deve permitir o cadastro de clientes. | `POST /clientes` |
| RF03 | O sistema deve permitir que o usuário faça login com e-mail e senha. | `POST /login` |
| RF04 | O sistema deve permitir que o usuário autenticado consulte o próprio perfil. | `GET /clientes/perfil` |
| RF05 | O sistema deve permitir que um usuário autenticado cadastre livros. | `POST /livros` |
| RF06 | O sistema deve permitir que um usuário autenticado consulte os livros cadastrados. | `GET /livros` |
| RF07 | O sistema deve permitir a consulta de livros com paginação. | Parâmetros `pagina` e `limite` |
| RF08 | O sistema deve permitir filtrar livros pelo título e pela data de cadastro. | Parâmetros `nome` e `data` |
| RF09 | O sistema deve permitir o registro de entradas e saídas de estoque. | `POST /movimentacoes` |
| RF10 | O sistema deve registrar o usuário responsável por cada movimentação. | Campo `usuario_id` |
| RF11 | O sistema deve permitir que um administrador exclua um livro pelo identificador. | `DELETE /livros/:id` |

## 4. Requisitos não funcionais

Um requisito não funcional descreve uma qualidade, um limite, uma restrição ou uma tecnologia. Ele não representa necessariamente uma ação executada pelo usuário.

### Categorias comuns

- **Segurança:** proteção dos dados e controle de acesso.
- **Desempenho:** tempo e capacidade de resposta.
- **Usabilidade:** clareza e facilidade de utilização.
- **Compatibilidade:** ambientes em que o sistema funciona.
- **Infraestrutura:** linguagens, bancos e ferramentas utilizadas.
- **Manutenibilidade:** facilidade de compreender e alterar o código.

### Requisitos não funcionais da biblioteca

| Código | Categoria | Requisito |
| --- | --- | --- |
| RNF01 | Segurança | As senhas devem ser armazenadas usando hash criptográfico, nunca em texto puro. |
| RNF02 | Segurança | As rotas protegidas devem exigir um token JWT válido. |
| RNF03 | Segurança | O token de autenticação deve expirar após 8 horas. |
| RNF04 | Desempenho | A listagem de livros deve usar paginação para evitar o retorno de todos os registros em uma única resposta. |
| RNF05 | Usabilidade | As respostas de erro devem informar o problema em português e usar códigos HTTP adequados. |
| RNF06 | Infraestrutura | A API deve ser executada com Node.js e Express. |
| RNF07 | Infraestrutura | Os dados devem ser persistidos em um banco MariaDB usando Sequelize. |
| RNF08 | Manutenibilidade | A aplicação deve separar rotas, controllers, models e middlewares em módulos próprios. |

## 5. Regras de negócio

Uma regra de negócio representa uma regra da biblioteca que continuaria existindo mesmo que os registros fossem feitos em papel.

| Código | Regra | Onde aparece no sistema |
| --- | --- | --- |
| RN01 | Apenas o administrador pode excluir livros. | `permitir('administrador')` em `src/routes/livroRoutes.js` |
| RN02 | O operador pode consultar e cadastrar livros, mas não pode excluí-los. | Middleware `checkRole.js` |
| RN03 | Uma saída não pode ser maior que a quantidade disponível no estoque. | Validação em `movimentacaoControllers.js` |
| RN04 | A quantidade de uma movimentação deve ser um número inteiro maior que zero. | Validação em `movimentacaoControllers.js` |
| RN05 | Uma movimentação deve registrar o usuário autenticado que a realizou. | `usuario_id: req.usuario.id` |
| RN06 | O tipo de usuário deve ser `operador` ou `administrador`. | Model `Usuario.js` |
| RN07 | O tipo de movimentação deve ser `entrada` ou `saida`. | Model `Movimentacao.js` |

## 6. Como diferenciar RF, RNF e RN

Use as perguntas abaixo nesta ordem:

1. A frase descreve uma ação que o usuário faz ou que o sistema executa? Nesse caso, é **RF**.
2. A frase descreve qualidade, limite, tempo, proteção ou tecnologia? Nesse caso, é **RNF**.
3. A frase descreve uma regra da empresa que existiria mesmo sem computador? Nesse caso, é **RN**.

| Frase | Tipo | Motivo |
| --- | --- | --- |
| O sistema deve gerar um relatório de movimentações. | RF | Descreve uma ação. |
| O relatório deve carregar em até 3 segundos. | RNF | Define um limite de desempenho. |
| O sistema deve funcionar no Chrome e no Edge. | RNF | Define compatibilidade. |
| O sistema deve usar banco de dados MariaDB. | RNF | Define infraestrutura. |
| As senhas devem ser criptografadas. | RNF | Define segurança. |
| Só o administrador pode excluir livros. | RN | Define uma regra da biblioteca. |
| O sistema deve permitir que o administrador exclua livros. | RF | Descreve uma ação disponível. |

## 7. Como escrever um bom requisito

Um bom requisito deve ser:

- **Claro:** qualquer pessoa deve compreendê-lo da mesma forma.
- **Específico:** deve evitar termos vagos como “rápido”, “fácil” e “bonito”.
- **Testável:** deve ser possível provar se foi atendido.
- **Único:** deve descrever uma coisa só.
- **Identificado:** deve possuir um código, como `RF01` ou `RNF01`.

| Requisito mal escrito | Problema | Reescrita |
| --- | --- | --- |
| O sistema deve ser rápido. | “Rápido” não define um limite mensurável. | A listagem de livros deve responder em até 2 segundos para uma consulta de até 10 mil registros. |
| O sistema deve ser seguro. | É genérico e não informa qual proteção será aplicada. | As senhas devem ser armazenadas com hash usando bcrypt. |
| O sistema deve ser fácil de usar. | “Fácil” é subjetivo e não pode ser verificado diretamente. | As mensagens de erro devem explicar o problema em português e informar o status HTTP correspondente. |
| O sistema deve cadastrar livros, usuários e movimentações. | Reúne três funções em um único requisito. | Criar um requisito separado para o cadastro de livros, outro para usuários e outro para movimentações. |

## 8. Exercícios de fixação

### 8.1 Classifique as frases

Contexto: um sistema escolar de notas e frequência.

| Nº | Frase | Tipo |
| --- | --- | --- |
| 1 | O sistema deve permitir que o professor lance as notas dos alunos. | RF |
| 2 | O sistema deve funcionar nos navegadores Chrome, Edge e Firefox. | RNF |
| 3 | O aluno com mais de 25% de faltas é reprovado. | RN |
| 4 | O sistema deve gerar o boletim do aluno em PDF. | RF |
| 5 | As páginas devem carregar em até 2 segundos. | RNF |
| 6 | O sistema deve permitir que o aluno altere a própria senha. | RF |
| 7 | Apenas a coordenação pode alterar uma nota já fechada. | RN |
| 8 | Os dados devem ser armazenados em um banco MySQL. | RNF |
| 9 | O sistema deve enviar um e-mail ao aluno quando uma nota for lançada. | RF |
| 10 | A média final é calculada pela média das quatro notas bimestrais. | RN |

### 8.2 Reescreva os requisitos mal escritos

| Nº | Problema | Reescrita clara e testável |
| --- | --- | --- |
| 1 | “Bonito” é subjetivo e não pode ser medido. | A interface deve seguir o padrão visual definido no protótipo aprovado e apresentar os mesmos elementos em todas as telas principais. |
| 2 | “Abrir rápido” não define tempo nem condições de teste. | A tela inicial deve carregar em até 2 segundos em um celular com conexão 4G. |
| 3 | Há duas funções diferentes no mesmo requisito. | RF01 — O sistema deve permitir cadastrar clientes.  \nRF02 — O sistema deve permitir emitir notas fiscais para clientes cadastrados. |
| 4 | “Proteger” é vago e não informa o mecanismo. | Os dados dos clientes devem ser acessíveis somente a usuários autenticados e autorizados. |

## 9. Requisitos do projeto da biblioteca

### Ações disponíveis

1. O sistema deve permitir cadastrar usuários com perfil de acesso.
2. O sistema deve permitir autenticar usuários por e-mail e senha.
3. O sistema deve permitir cadastrar livros.
4. O sistema deve permitir listar livros com paginação e filtros.
5. O sistema deve permitir registrar entradas e saídas de estoque.
6. O sistema deve permitir consultar o perfil do cliente autenticado.
7. O sistema deve permitir excluir livros quando o usuário for administrador.

### Qualidades, limites e tecnologias

1. As senhas devem ser armazenadas com hash bcrypt, como requisito de segurança.
2. As rotas protegidas devem aceitar somente tokens JWT válidos, como requisito de segurança.
3. A aplicação deve usar Node.js, Express, Sequelize e MariaDB, como requisito de infraestrutura.
4. A listagem deve usar paginação, como requisito de desempenho e uso eficiente de dados.

### Regras do negócio

1. Apenas administradores podem excluir livros. Essa regra aparece no middleware `checkRole.js`, aplicado à rota `DELETE /livros/:id`.
2. Uma saída não pode retirar mais unidades do que existem no estoque. Essa regra aparece na validação do controller de movimentações.
3. Toda movimentação deve identificar o usuário que a registrou. Essa regra aparece no preenchimento de `usuario_id` a partir de `req.usuario.id`.

Quando uma regra de negócio não aparece no código, significa que o sistema ainda não garante essa regra. Nesse caso, ela pode ser esquecida, aplicada de maneira inconsistente ou gerar dados incorretos; por isso, deve ser transformada em validação, middleware ou outra implementação verificável.

## 10. Conclusão

Os requisitos descrevem o escopo e os critérios para considerar o sistema pronto. Os requisitos funcionais representam as ações disponíveis, os requisitos não funcionais definem qualidades e restrições, e as regras de negócio preservam as normas da biblioteca.

Cada requisito deve ser claro, específico, único, identificado e testável. Essa organização será utilizada como base para definir os testes dos próximos módulos.