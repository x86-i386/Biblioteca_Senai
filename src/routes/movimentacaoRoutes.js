const express = require('express');
const router = express.Router();
const { cadastrar } = require('../controllers/movimentacaoControllers');
const auth = require('../middlewares/auth');
router.post('/movimentacoes', auth, cadastrar);

module.exports = router;