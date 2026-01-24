const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * Rotas para operações CRUD de usuários
 * Base URL: /api/users
 */

// GET /api/users/count - Conta total de usuários
router.get('/count', userController.count);

// GET /api/users/email/:email - Busca usuário por email
router.get('/email/:email', userController.getByEmail);

// GET /api/users - Lista todos os usuários
router.get('/', userController.getAll);

// GET /api/users/:id - Busca usuário por ID
router.get('/:id', userController.getById);

// POST /api/users - Cria novo usuário
router.post('/', userController.create);

// PUT /api/users/:id - Atualiza usuário
router.put('/:id', userController.update);

// DELETE /api/users/:id - Remove usuário
router.delete('/:id', userController.delete);

module.exports = router;
