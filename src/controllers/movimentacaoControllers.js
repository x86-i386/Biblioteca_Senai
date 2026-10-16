const Movimentacao = require('../models/Movimentacao');
const Livro = require('../models/Livro');
const Usuario = require('../models/Usuario');
const sequelize = require('../config/database');

async function cadastrar(req, res) {
    let transacao;

    try {
        const { livro_id, tipo, quantidade } = req.body;

        if (!['entrada', 'saida'].includes(tipo)) {
            return res.status(400).json({
                mensagem: 'O tipo deve ser entrada ou saida',
            });
        }

        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            return res.status(400).json({
                mensagem: 'A quantidade deve ser um número inteiro maior que zero',
            });
        }

        transacao = await sequelize.transaction();

        const livro = await Livro.findByPk(livro_id, {
            transaction: transacao,
            lock: transacao.LOCK.UPDATE,
        });

        if (!livro) {
            await transacao.rollback();
            return res.status(404).json({
                mensagem: 'Livro não encontrado',
            });
        }

        if (tipo === 'saida' && livro.quantidade_estoque < quantidade) {
            await transacao.rollback();
            return res.status(400).json({
                mensagem: 'Quantidade insuficiente em estoque',
            });
        }

        const novaQuantidade = tipo === 'entrada'
            ? livro.quantidade_estoque + quantidade
            : livro.quantidade_estoque - quantidade;

        await livro.update(
            { quantidade_estoque: novaQuantidade },
            { transaction: transacao },
        );

        const movimentacao = await Movimentacao.create({
            livro_id,
            tipo,
            quantidade,
            usuario_id: req.usuario.id,
        }, { transaction: transacao });

        await transacao.commit();

        return res.status(201).json(movimentacao);
    } catch (erro) {
        if (transacao && !transacao.finished) {
            await transacao.rollback();
        }

        return res.status(400).json({
            mensagem: 'Erro ao cadastrar movimentação',
            erro: erro.message,
        });
    }
}

async function listar(req, res) {
    try {
        const movimentacoes = await Movimentacao.findAll({
            include: [
                {
                    model: Livro,
                    attributes: ['id', 'titulo'],
                },
                {
                    model: Usuario,
                    attributes: ['id', 'nome'],
                },
            ],
            order: [['data', 'DESC']],
            limit: 50,
        });

        return res.json(movimentacoes);
    } catch (erro) {
        return res.status(400).json({
            mensagem: 'Erro ao listar movimentações',
            erro: erro.message,
        });
    }
}

module.exports = { cadastrar, listar };
