const database = require('../config/database');
const oracledb = require('oracledb');

/**
 * Model para operações CRUD na tabela USERS
 * 
 * Estrutura da tabela esperada:
 * CREATE TABLE users (
 *     id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 *     name VARCHAR2(100) NOT NULL,
 *     email VARCHAR2(100) UNIQUE NOT NULL,
 *     age NUMBER,
 *     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 * );
 */

const userModel = {
    /**
     * CREATE - Cria um novo usuário
     * @param {object} userData - Dados do usuário (name, email, age)
     * @returns {object} Resultado da inserção
     */
    async create(userData) {
        const sql = `
            INSERT INTO users (name, email, age)
            VALUES (:name, :email, :age)
            RETURNING id INTO :id
        `;

        const binds = {
            name: userData.name,
            email: userData.email,
            age: userData.age || null,
            id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        };

        const options = {
            autoCommit: true
        };

        try {
            const result = await database.execute(sql, binds, options);
            return {
                success: true,
                id: result.outBinds.id[0],
                message: 'Usuário criado com sucesso'
            };
        } catch (err) {
            console.error('Erro ao criar usuário:', err);
            throw err;
        }
    },

    /**
     * READ - Busca todos os usuários
     * @returns {array} Lista de usuários
     */
    async findAll() {
        const sql = `
            SELECT id, name, email, age, 
                   TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI:SS') as created_at
            FROM users
            ORDER BY id DESC
        `;

        try {
            const result = await database.execute(sql);
            return {
                success: true,
                data: result.rows,
                count: result.rows.length
            };
        } catch (err) {
            console.error('Erro ao buscar usuários:', err);
            throw err;
        }
    },

    /**
     * READ - Busca um usuário por ID
     * @param {number} id - ID do usuário
     * @returns {object} Dados do usuário
     */
    async findById(id) {
        const sql = `
            SELECT id, name, email, age,
                   TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI:SS') as created_at
            FROM users
            WHERE id = :id
        `;

        const binds = { id };

        try {
            const result = await database.execute(sql, binds);
            
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: 'Usuário não encontrado'
                };
            }

            return {
                success: true,
                data: result.rows[0]
            };
        } catch (err) {
            console.error('Erro ao buscar usuário por ID:', err);
            throw err;
        }
    },

    /**
     * READ - Busca usuários por email
     * @param {string} email - Email do usuário
     * @returns {object} Dados do usuário
     */
    async findByEmail(email) {
        const sql = `
            SELECT id, name, email, age,
                   TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI:SS') as created_at
            FROM users
            WHERE email = :email
        `;

        const binds = { email };

        try {
            const result = await database.execute(sql, binds);
            
            if (result.rows.length === 0) {
                return {
                    success: false,
                    message: 'Usuário não encontrado'
                };
            }

            return {
                success: true,
                data: result.rows[0]
            };
        } catch (err) {
            console.error('Erro ao buscar usuário por email:', err);
            throw err;
        }
    },

    /**
     * UPDATE - Atualiza um usuário existente
     * @param {number} id - ID do usuário
     * @param {object} userData - Dados a serem atualizados
     * @returns {object} Resultado da atualização
     */
    async update(id, userData) {
        // Constrói dinamicamente a query baseado nos campos fornecidos
        const fields = [];
        const binds = { id };

        if (userData.name !== undefined) {
            fields.push('name = :name');
            binds.name = userData.name;
        }
        if (userData.email !== undefined) {
            fields.push('email = :email');
            binds.email = userData.email;
        }
        if (userData.age !== undefined) {
            fields.push('age = :age');
            binds.age = userData.age;
        }

        if (fields.length === 0) {
            return {
                success: false,
                message: 'Nenhum campo para atualizar'
            };
        }

        const sql = `
            UPDATE users
            SET ${fields.join(', ')}
            WHERE id = :id
        `;

        const options = {
            autoCommit: true
        };

        try {
            const result = await database.execute(sql, binds, options);

            if (result.rowsAffected === 0) {
                return {
                    success: false,
                    message: 'Usuário não encontrado'
                };
            }

            return {
                success: true,
                rowsAffected: result.rowsAffected,
                message: 'Usuário atualizado com sucesso'
            };
        } catch (err) {
            console.error('Erro ao atualizar usuário:', err);
            throw err;
        }
    },

    /**
     * DELETE - Remove um usuário
     * @param {number} id - ID do usuário
     * @returns {object} Resultado da exclusão
     */
    async delete(id) {
        const sql = `
            DELETE FROM users
            WHERE id = :id
        `;

        const binds = { id };

        const options = {
            autoCommit: true
        };

        try {
            const result = await database.execute(sql, binds, options);

            if (result.rowsAffected === 0) {
                return {
                    success: false,
                    message: 'Usuário não encontrado'
                };
            }

            return {
                success: true,
                rowsAffected: result.rowsAffected,
                message: 'Usuário excluído com sucesso'
            };
        } catch (err) {
            console.error('Erro ao excluir usuário:', err);
            throw err;
        }
    },

    /**
     * Conta o total de usuários
     * @returns {number} Total de usuários
     */
    async count() {
        const sql = `SELECT COUNT(*) as total FROM users`;

        try {
            const result = await database.execute(sql);
            return {
                success: true,
                total: result.rows[0].TOTAL
            };
        } catch (err) {
            console.error('Erro ao contar usuários:', err);
            throw err;
        }
    }
};

module.exports = userModel;
