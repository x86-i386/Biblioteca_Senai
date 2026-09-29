const Livro = require('../models/Livro');
const { Op } = require('sequelize');
async function cadastrar(req, res) {
    try {
        const livro = await Livro.create(req.body);
        res.status(201).json(livro);
    } catch (erro) {
        res.status(400).json({
            mensagem: 'Erro ao cadastrar livro',
            erro: erro.message,
        });
    }
}

async function listar(req, res) {
    try {
        const { pagina = 1, limite = 10, nome, data } = req.query;
        const paginaNumerica = Number(pagina);
        const limiteNumerico = Number(limite);
        const filtro = {};

        if (!Number.isInteger(paginaNumerica) || paginaNumerica < 1 ||
            !Number.isInteger(limiteNumerico) || limiteNumerico < 1) {
            return res.status(400).json({
                mensagem: 'Pagina e limite devem ser números inteiros positivos',
            });
        }

        if (nome) {
            filtro.titulo = { [Op.like]: `%${nome}%` };
        }

        if (data) {
            const dataInicial = new Date(data);

            if (Number.isNaN(dataInicial.getTime())) {
                return res.status(400).json({
                    mensagem: 'Data inválida',
                });
            }

            filtro.createdAt = { [Op.gte]: dataInicial };
        }

        const livros = await Livro.findAll({
            where: filtro,
            limit: limiteNumerico,
            offset: (paginaNumerica - 1) * limiteNumerico,
        });

        res.json(livros);
    } catch (erro) {
        res.status(400).json({
            mensagem: 'Erro ao listar livros',
            erro: erro.message,
        });
    }
}

async function deletar(req, res) {
    try {
        const { id } = req.params;

        const livro = await Livro.findByPk(id);

        if (!livro) {
            return res.status(404).json({
                mensagem: 'Livro não encontrado',
            });
        }

        await livro.destroy();

        res.status(200).json({
            mensagem: 'Livro removido com sucesso',
        });

    } catch (erro) {
        res.status(400).json({
            mensagem: 'Erro ao deletar livro',
            erro: erro.message,
        });
    }
}

module.exports = { cadastrar, listar, deletar };