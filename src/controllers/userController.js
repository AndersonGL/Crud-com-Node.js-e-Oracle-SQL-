const userModel = require('../models/userModel');

/**
 * Controller para gerenciar as requisições relacionadas a usuários
 */
const userController = {
    /**
     * GET /api/users
     * Lista todos os usuários
     */
    async getAll(req, res) {
        try {
            const result = await userModel.findAll();
            
            res.status(200).json({
                success: true,
                count: result.count,
                data: result.data
            });
        } catch (err) {
            console.error('Erro no controller getAll:', err);
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar usuários',
                error: err.message
            });
        }
    },

    /**
     * GET /api/users/:id
     * Busca um usuário por ID
     */
    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            }

            const result = await userModel.findById(id);

            if (!result.success) {
                return res.status(404).json(result);
            }

            res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (err) {
            console.error('Erro no controller getById:', err);
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar usuário',
                error: err.message
            });
        }
    },

    /**
     * GET /api/users/email/:email
     * Busca um usuário por email
     */
    async getByEmail(req, res) {
        try {
            const email = req.params.email;

            const result = await userModel.findByEmail(email);

            if (!result.success) {
                return res.status(404).json(result);
            }

            res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (err) {
            console.error('Erro no controller getByEmail:', err);
            res.status(500).json({
                success: false,
                message: 'Erro ao buscar usuário por email',
                error: err.message
            });
        }
    },

    /**
     * POST /api/users
     * Cria um novo usuário
     */
    async create(req, res) {
        try {
            const { name, email, age } = req.body;

            // Validações básicas
            if (!name || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Nome e email são obrigatórios'
                });
            }

            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Email inválido'
                });
            }

            // Validação de idade
            if (age !== undefined && (isNaN(age) || age < 0 || age > 150)) {
                return res.status(400).json({
                    success: false,
                    message: 'Idade inválida'
                });
            }

            const result = await userModel.create({ name, email, age });

            res.status(201).json({
                success: true,
                message: result.message,
                data: {
                    id: result.id,
                    name,
                    email,
                    age
                }
            });
        } catch (err) {
            console.error('Erro no controller create:', err);
            
            // Tratamento de erro de email duplicado (ORA-00001)
            if (err.errorNum === 1 || err.message.includes('unique constraint')) {
                return res.status(409).json({
                    success: false,
                    message: 'Email já cadastrado'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Erro ao criar usuário',
                error: err.message
            });
        }
    },

    /**
     * PUT /api/users/:id
     * Atualiza um usuário existente
     */
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { name, email, age } = req.body;

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            }

            // Validação de email se fornecido
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email inválido'
                    });
                }
            }

            // Validação de idade se fornecida
            if (age !== undefined && (isNaN(age) || age < 0 || age > 150)) {
                return res.status(400).json({
                    success: false,
                    message: 'Idade inválida'
                });
            }

            const result = await userModel.update(id, { name, email, age });

            if (!result.success) {
                return res.status(404).json(result);
            }

            res.status(200).json({
                success: true,
                message: result.message,
                rowsAffected: result.rowsAffected
            });
        } catch (err) {
            console.error('Erro no controller update:', err);

            // Tratamento de erro de email duplicado (ORA-00001)
            if (err.errorNum === 1 || err.message.includes('unique constraint')) {
                return res.status(409).json({
                    success: false,
                    message: 'Email já cadastrado'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Erro ao atualizar usuário',
                error: err.message
            });
        }
    },

    /**
     * DELETE /api/users/:id
     * Remove um usuário
     */
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            }

            const result = await userModel.delete(id);

            if (!result.success) {
                return res.status(404).json(result);
            }

            res.status(200).json({
                success: true,
                message: result.message,
                rowsAffected: result.rowsAffected
            });
        } catch (err) {
            console.error('Erro no controller delete:', err);
            res.status(500).json({
                success: false,
                message: 'Erro ao excluir usuário',
                error: err.message
            });
        }
    },

    /**
     * GET /api/users/count
     * Retorna o total de usuários
     */
    async count(req, res) {
        try {
            const result = await userModel.count();

            res.status(200).json({
                success: true,
                total: result.total
            });
        } catch (err) {
            console.error('Erro no controller count:', err);
            res.status(500).json({
                success: false,
                message: 'Erro ao contar usuários',
                error: err.message
            });
        }
    }
};

module.exports = userController;
