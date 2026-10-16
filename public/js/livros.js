(function () {
  const auth = window.bibliotecaAuth;
  if (!auth) return;

  const formulario = document.getElementById('form-livro');
  const mensagem = document.getElementById('mensagem');
  const lista = document.getElementById('lista-livros');
  const busca = document.getElementById('busca-nome');
  const botaoBuscar = document.getElementById('botao-buscar');
  const botaoAnterior = document.getElementById('botao-anterior');
  const botaoProxima = document.getElementById('botao-proxima');
  const numeroPagina = document.getElementById('numero-pagina');
  const limite = 5;
  let pagina = 1;
  let nome = '';

  function mostrarMensagem(texto, tipo = 'sucesso') {
    mensagem.textContent = texto;
    mensagem.className = `mensagem mensagem-${tipo}`;
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

  function renderizar(livros) {
    lista.replaceChildren();

    if (!livros.length) {
      const linha = document.createElement('tr');
      const td = celula(nome ? 'Nenhum livro encontrado para essa busca.' : 'Nenhum livro cadastrado.');
      td.colSpan = 5;
      td.className = 'estado-tabela';
      linha.appendChild(td);
      lista.appendChild(linha);
      return;
    }

    livros.forEach((livro) => {
      const linha = document.createElement('tr');
      linha.append(
        celula(livro.id),
        celula(livro.titulo),
        celula(livro.autor),
        celula(livro.quantidade_estoque),
      );

      const acoes = document.createElement('td');
      if (auth.usuario.tipo === 'administrador') {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'botao botao-perigo botao-pequeno';
        botao.textContent = 'Excluir';
        botao.addEventListener('click', () => excluirLivro(livro));
        acoes.appendChild(botao);
      } else {
        const restricao = document.createElement('span');
        restricao.className = 'acao-indisponivel';
        restricao.textContent = 'Somente administrador';
        acoes.appendChild(restricao);
      }

      linha.appendChild(acoes);
      lista.appendChild(linha);
    });
  }

  async function carregarLivros() {
    numeroPagina.textContent = pagina;
    botaoAnterior.disabled = pagina === 1;
    botaoProxima.disabled = true;

    try {
      const parametros = new URLSearchParams({ pagina, limite });
      if (nome) parametros.set('nome', nome);
      const livros = await requisicao(`/livros?${parametros}`);
      renderizar(livros);
      botaoProxima.disabled = livros.length < limite;
    } catch (erro) {
      renderizar([]);
      mostrarMensagem(erro.message, 'erro');
    }
  }

  async function excluirLivro(livro) {
    const confirmado = window.confirm(`Excluir “${livro.titulo}”? Esta ação não pode ser desfeita.`);
    if (!confirmado) return;

    try {
      await requisicao(`/livros/${livro.id}`, { method: 'DELETE' });
      mostrarMensagem('Livro excluído com sucesso.');
      await carregarLivros();
    } catch (erro) {
      mostrarMensagem(erro.message, 'erro');
    }
  }

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const botao = formulario.querySelector('button[type="submit"]');
    const dados = {
      titulo: document.getElementById('titulo').value.trim(),
      autor: document.getElementById('autor').value.trim(),
      quantidade_estoque: Number(document.getElementById('quantidade_estoque').value),
    };

    if (!dados.titulo || !dados.autor || !Number.isInteger(dados.quantidade_estoque) || dados.quantidade_estoque < 0) {
      mostrarMensagem('Preencha título, autor e um estoque inicial válido.', 'erro');
      return;
    }

    botao.disabled = true;
    try {
      await requisicao('/livros', {
        method: 'POST',
        body: JSON.stringify(dados),
      });
      formulario.reset();
      document.getElementById('quantidade_estoque').value = 0;
      pagina = 1;
      mostrarMensagem('Livro cadastrado com sucesso.');
      await carregarLivros();
    } catch (erro) {
      mostrarMensagem(erro.message, 'erro');
    } finally {
      botao.disabled = false;
    }
  });

  function executarBusca() {
    nome = busca.value.trim();
    pagina = 1;
    carregarLivros();
  }

  botaoBuscar.addEventListener('click', executarBusca);
  busca.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
      evento.preventDefault();
      executarBusca();
    }
  });

  botaoAnterior.addEventListener('click', () => {
    if (pagina > 1) {
      pagina -= 1;
      carregarLivros();
    }
  });

  botaoProxima.addEventListener('click', () => {
    pagina += 1;
    carregarLivros();
  });

  carregarLivros();
})();
