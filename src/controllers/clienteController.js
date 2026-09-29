const bcrypt = require('bcrypt');
const Cliente = require('../models/Cliente');
const { Op } = require('sequelize');

async function cadastrar(req, res) {
  try {
    const {
      nome,
      email,
      senha,
      tipo
    } = req.body;

    if (
      !nome ||
      !email ||
      !senha || 
      !tipo
    ) {
      return res.status(400).json({
        mensagem: 'Todos os campos são obrigatórios'
      });
    }

    const clienteExistente = await Cliente.findOne({
      where: {
        [Op.or]: [{ email }]
      }
    });

    if (clienteExistente) {
      return res.status(409).json({
        mensagem: 'Email já cadastrados'
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const cliente = await Cliente.create({
      nome,
      email,
      tipo,
      senha: senhaHash
    });

    return res.status(201).json({
      mensagem: 'Cliente cadastrado com sucesso',
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        tipo: cliente.tipo,
        email: cliente.email
      }
    });

  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao cadastrar cliente',
      erro: erro.message
    });
  }
}

async function perfil(req, res) {
  try {
    const cliente = await Cliente.findByPk(req.cliente.id, {
      attributes: {
        exclude: ['senha']
      }
    });

    if (!cliente) {
      return res.status(404).json({
        mensagem: 'Cliente não encontrado'
      });
    }

    return res.json(cliente);

  } catch (erro) {
    return res.status(500).json({
      mensagem: 'Erro ao buscar perfil',
      erro: erro.message
    });
  }
}

module.exports = {
  cadastrar,
  perfil
};