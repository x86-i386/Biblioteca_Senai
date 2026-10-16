(function () {
  const auth = window.bibliotecaAuth;
  if (!auth) return;

  const formulario = document.getElementById('form-movimentacao');
  const campoLivro = document.getElementById('livro_id');
  const mensagem = document.getElementById('mensagem');
  const mensagemHistorico = document.getElementById('mensagem-historico');
  const lista = document.getElementById('lista-movimentacoes');

  function mostrarMensagem(texto, tipo = 'sucesso') {
    mensagem.textContent = texto;
    mensagem.className = texto ? `mensagem mensagem-${tipo}` : 'mensagem';
  }

  function mostrarMensagemHistorico(texto, tipo = 'erro') {
    mensagemHistorico.textContent = texto;
    mensagemHistorico.className = texto ? `mensagem mensagem-${tipo}` : 'mensagem';
  }

  async function requisicao(url, opcoes = {}) {
    const resposta = await fetch(url, {
      ...opcoes,
      headers: {
        ...auth.cabecalhos(),
        ...(opcoes.headers || {}),
      },
    });

    const dados = await resposta.json().catch(() => ({}));

    if (resposta.status === 401) {
      localStorage.removeItem('biblioteca_token');
      window.location.replace('index.html');
      throw new Error('Sua sessão expirou. Entre novamente.');
    }

    if (!resposta.ok) {
      throw new Error(dados.mensagem || 'Não foi possível concluir a operação.');
    }

    return dados;
  }

  function celula(texto) {
    const td = document.createElement('td');
    td.textContent = texto;
    return td;
  }

  async function carregarLivros(silencioso = false) {
    try {
      const livros = await requisicao('/livros?pagina=1&limite=100');
      campoLivro.replaceChildren();

      const inicial = document.createElement('option');
      inicial.value = '';
      inicial.textContent = livros.length ? 'Selecione um livro' : 'Nenhum livro cadastrado';
      campoLivro.appendChild(inicial);

      livros.forEach((livro) => {
        const opcao = document.createElement('option');
        opcao.value = livro.id;
        opcao.textContent = `${livro.titulo} — estoque: ${livro.quantidade_estoque}`;
        campoLivro.appendChild(opcao);
      });
      campoLivro.disabled = false;
    } catch (erro) {
      campoLivro.replaceChildren();
      const opcao = document.createElement('option');
      opcao.textContent = 'Erro ao carregar livros';
      campoLivro.appendChild(opcao);
      campoLivro.disabled = true;
      if (!silencioso) {
        mostrarMensagem(erro.message, 'erro');
      }
    }
  }

  function renderizarMovimentacoes(movimentacoes) {
    lista.replaceChildren();

    if (!movimentacoes.length) {
      const linha = document.createElement('tr');
      const td = celula('Nenhuma movimentação registrada.');
      td.colSpan = 4;
      td.className = 'estado-tabela';
      linha.appendChild(td);
      lista.appendChild(linha);
      return;
    }

    movimentacoes.forEach((movimentacao) => {
      const linha = document.createElement('tr');
      const data = new Date(movimentacao.data || movimentacao.createdAt);
      const livro = movimentacao.Livro?.titulo
        || (movimentacao.livro_id ? `Livro #${movimentacao.livro_id}` : 'Livro não informado');
      const tipo = document.createElement('td');
      const etiqueta = document.createElement('span');
      etiqueta.className = `etiqueta ${movimentacao.tipo}`;
      etiqueta.textContent = movimentacao.tipo === 'entrada' ? 'Entrada' : 'Saída';
      tipo.appendChild(etiqueta);

      linha.append(
        celula(Number.isNaN(data.getTime()) ? '—' : data.toLocaleString('pt-BR')),
        celula(livro),
        tipo,
        celula(movimentacao.quantidade),
      );
      lista.appendChild(linha);
    });
  }

  async function carregarMovimentacoes(silencioso = false) {
    try {
      const movimentacoes = await requisicao('/movimentacoes');
      renderizarMovimentacoes(movimentacoes);
      mostrarMensagemHistorico('');
    } catch (erro) {
      renderizarMovimentacoes([]);
      if (!silencioso) {
        mostrarMensagemHistorico(erro.message, 'erro');
      }
    }
  }

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    mostrarMensagem('');
    const botao = formulario.querySelector('button[type="submit"]');
    const dados = {
      livro_id: Number(campoLivro.value),
      tipo: document.getElementById('tipo').value,
      quantidade: Number(document.getElementById('quantidade').value),
    };

    if (!Number.isInteger(dados.livro_id) || !Number.isInteger(dados.quantidade) || dados.quantidade <= 0) {
      mostrarMensagem('Selecione um livro e informe uma quantidade maior que zero.', 'erro');
      return;
    }

    botao.disabled = true;
    try {
      await requisicao('/movimentacoes', {
        method: 'POST',
        body: JSON.stringify(dados),
      });
      formulario.reset();
      document.getElementById('quantidade').value = 1;
      mostrarMensagem('Movimentação registrada com sucesso.');
      await Promise.all([
        carregarLivros(true),
        carregarMovimentacoes(true),
      ]);
    } catch (erro) {
      mostrarMensagem(erro.message, 'erro');
    } finally {
      botao.disabled = false;
    }
  });

  Promise.allSettled([carregarLivros(), carregarMovimentacoes()]);
})();
