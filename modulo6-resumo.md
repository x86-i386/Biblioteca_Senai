# Módulo 6 — Requisitos da Biblioteca

## 1. Para que servem os requisitos?

Requisitos são as necessidades que o sistema precisa atender. Eles ajudam a explicar o que será desenvolvido e permitem conferir, depois, se o sistema ficou completo.

Existem três tipos principais:

- **RF — Requisito funcional:** função que o sistema oferece.
- **RNF — Requisito não funcional:** característica ou condição do sistema.
- **RN — Regra de negócio:** regra que deve ser obedecida pela biblioteca.

## 2. Requisitos funcionais

Os requisitos funcionais descrevem as ações disponíveis para os usuários.

| Código | O sistema deve... |
| --- | --- |
| RF01 | Cadastrar usuários com os perfis administrador ou operador. |
| RF02 | Cadastrar clientes. |
| RF03 | Permitir o login com e-mail e senha. |
| RF04 | Mostrar o perfil do cliente autenticado. |
| RF05 | Cadastrar livros. |
| RF06 | Listar os livros cadastrados. |
| RF07 | Dividir a lista de livros em páginas. |
| RF08 | Buscar livros pelo título ou pela data de cadastro. |
| RF09 | Registrar entradas e saídas de estoque. |
| RF10 | Guardar qual usuário registrou cada movimentação. |
| RF11 | Permitir que um administrador exclua um livro. |

Exemplo de requisito funcional:

> RF05 — O sistema deve permitir que um usuário autenticado cadastre um livro.

## 3. Requisitos não funcionais

Os requisitos não funcionais não representam uma ação específica. Eles definem como o sistema deve funcionar.

| Código | Categoria | Condição |
| --- | --- | --- |
| RNF01 | Segurança | As senhas devem ser protegidas com hash antes de serem salvas. |
| RNF02 | Segurança | As rotas privadas devem exigir um token JWT válido. |
| RNF03 | Segurança | O token deve expirar depois de 8 horas. |
| RNF04 | Desempenho | A listagem de livros deve utilizar paginação. |
| RNF05 | Usabilidade | As mensagens de erro devem ser claras e escritas em português. |
| RNF06 | Tecnologia | O projeto deve usar Node.js, Express, Sequelize e MariaDB. |
| RNF07 | Organização | Controllers, models, rotas e middlewares devem ficar separados. |

Exemplo de requisito não funcional:

> RNF01 — As senhas não podem ser armazenadas em texto puro.

## 4. Regras de negócio

As regras de negócio são decisões da própria biblioteca. Elas continuariam valendo mesmo se o controle fosse feito em papel.

| Código | Regra |
| --- | --- |
| RN01 | Somente o administrador pode excluir livros. |
| RN02 | O operador pode consultar e cadastrar, mas não pode excluir livros. |
| RN03 | Não é permitido retirar mais livros do que a quantidade disponível. |
| RN04 | A quantidade de uma movimentação deve ser maior que zero. |
| RN05 | Toda movimentação deve identificar o usuário responsável. |
| RN06 | O perfil deve ser administrador ou operador. |
| RN07 | O tipo da movimentação deve ser entrada ou saída. |

### Onde essas regras aparecem no código?

- A permissão de exclusão é controlada pelo middleware `checkRole.js`.
- A autorização é aplicada na rota `DELETE /livros/:id`.
- A quantidade do estoque é validada no controller de movimentações.
- O usuário responsável vem de `req.usuario.id`, e não do corpo da requisição.
- Os valores permitidos para perfil e movimentação estão definidos nos models.

## 5. Como saber o tipo de cada requisito?

Faça estas perguntas:

1. A frase fala de uma ação? É **RF**.
2. A frase fala de segurança, velocidade, tecnologia ou qualidade? É **RNF**.
3. A frase fala de uma regra da empresa? É **RN**.

| Exemplo | Classificação |
| --- | --- |
| O sistema deve cadastrar livros. | RF |
| O sistema deve usar MariaDB. | RNF |
| A senha deve ser criptografada. | RNF |
| Apenas o administrador pode apagar livros. | RN |
| O administrador deve conseguir apagar livros. | RF |

## 6. Características de um bom requisito

Um requisito bem escrito deve ser:

- **Claro:** sem mais de uma interpretação.
- **Específico:** com informações exatas.
- **Testável:** possível de verificar.
- **Único:** descrevendo apenas uma necessidade.
- **Identificado:** usando um código.

### Exemplos

| Frase ruim | Versão melhor |
| --- | --- |
| O sistema deve ser rápido. | A API deve responder à listagem de livros em até 2 segundos. |
| O sistema deve ser seguro. | As senhas devem ser armazenadas usando bcrypt. |
| O sistema deve cadastrar livros e usuários. | Criar um requisito para o cadastro de livros e outro para o cadastro de usuários. |

## 7. Exercícios resolvidos

### Classificação

| Nº | Frase | Resposta |
| --- | --- | --- |
| 1 | O professor lança as notas dos alunos. | RF |
| 2 | O sistema funciona no Chrome, Edge e Firefox. | RNF |
| 3 | Aluno com mais de 25% de faltas é reprovado. | RN |
| 4 | O sistema gera o boletim em PDF. | RF |
| 5 | As páginas carregam em até 2 segundos. | RNF |
| 6 | O aluno altera sua senha. | RF |
| 7 | Somente a coordenação altera nota fechada. | RN |
| 8 | Os dados ficam em um banco MySQL. | RNF |
| 9 | O sistema envia e-mail quando uma nota é lançada. | RF |
| 10 | A média é calculada com as quatro notas bimestrais. | RN |

### Reescrita

| Frase original | Problema | Nova versão |
| --- | --- | --- |
| O sistema deve ser bonito. | Termo subjetivo. | A interface deve seguir o protótipo visual aprovado. |
| O sistema deve abrir rápido no celular. | Não informa um tempo. | A tela inicial deve abrir em até 2 segundos em uma conexão 4G. |
| O sistema deve cadastrar clientes e emitir notas. | Duas funções juntas. | Separar em um requisito para cadastrar clientes e outro para emitir notas. |
| O sistema deve proteger os dados. | Não explica como. | Somente usuários autenticados e autorizados podem consultar os dados dos clientes. |

## 8. Resumo do projeto

O sistema da biblioteca deve permitir o cadastro e a autenticação de usuários, o cadastro e a consulta de livros, o controle do estoque e o registro das movimentações.

Além disso, deve proteger as senhas, exigir autenticação nas rotas privadas e respeitar os perfis de acesso. A principal regra é que apenas administradores podem excluir livros.

Esses requisitos servem como base para os testes e para verificar se o projeto atende ao que foi solicitado.