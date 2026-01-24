const oracledb = require('oracledb');
require('dotenv').config();

// Configuração para retornar resultados como objetos JavaScript
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Configuração do pool de conexões
const poolConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTION_STRING,
    poolMin: parseInt(process.env.POOL_MIN) || 2,
    poolMax: parseInt(process.env.POOL_MAX) || 10,
    poolIncrement: parseInt(process.env.POOL_INCREMENT) || 1,
    poolTimeout: 60, // Timeout em segundos
    queueTimeout: 60000 // Timeout da fila em milissegundos
};

let pool;

/**
 * Inicializa o pool de conexões com o banco Oracle
 */
async function initialize() {
    try {
        pool = await oracledb.createPool(poolConfig);
        console.log('✓ Pool de conexões Oracle criado com sucesso');
        console.log(`  - Pool Min: ${poolConfig.poolMin}`);
        console.log(`  - Pool Max: ${poolConfig.poolMax}`);
    } catch (err) {
        console.error('✗ Erro ao criar pool de conexões:', err);
        throw err;
    }
}

/**
 * Obtém uma conexão do pool
 */
async function getConnection() {
    try {
        if (!pool) {
            throw new Error('Pool não foi inicializado. Chame initialize() primeiro.');
        }
        return await pool.getConnection();
    } catch (err) {
        console.error('Erro ao obter conexão do pool:', err);
        throw err;
    }
}

/**
 * Fecha o pool de conexões
 */
async function close() {
    try {
        if (pool) {
            await pool.close(10); // Aguarda 10 segundos antes de forçar o fechamento
            console.log('✓ Pool de conexões fechado');
        }
    } catch (err) {
        console.error('✗ Erro ao fechar pool:', err);
        throw err;
    }
}

/**
 * Executa uma query e retorna os resultados
 * @param {string} sql - Query SQL a ser executada
 * @param {object} binds - Parâmetros de bind
 * @param {object} options - Opções adicionais
 */
async function execute(sql, binds = {}, options = {}) {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(sql, binds, options);
        return result;
    } catch (err) {
        console.error('Erro ao executar query:', err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close(); // Retorna a conexão ao pool
            } catch (err) {
                console.error('Erro ao fechar conexão:', err);
            }
        }
    }
}

module.exports = {
    initialize,
    getConnection,
    close,
    execute
};
