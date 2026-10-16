const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '.env'),
  quiet: true,
});

const express = require('express');
const sequelize = require('./config/database');
const usuarioRoutes = require('./routes/usuarioRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const authRoutes = require('./routes/authRoutes');
const livroRoutes = require('./routes/livroRoutes');
const movimentacaoRoutes = require('./routes/movimentacaoRoutes');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public'), {
  etag: false,
  setHeaders(res) {
    res.setHeader('Cache-Control', 'no-store');
  },
}));

app.use(usuarioRoutes);
app.use(clienteRoutes);
app.use(authRoutes);
app.use(livroRoutes);
app.use(movimentacaoRoutes);

async function iniciarServidor(porta = Number(process.env.PORT) || 3000) {
  await sequelize.authenticate();
  console.log('Conectado ao banco de dados');

  await sequelize.sync();

  return app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
  });
}

if (require.main === module) {
  iniciarServidor().catch((erro) => {
    console.error('Erro ao iniciar o servidor:', erro.message);
    process.exitCode = 1;
  });
}

module.exports = { app, iniciarServidor };
