const express = require('express');
const cors = require('cors');
require('dotenv').config();

const database = require('./config/database');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Habilita CORS
app.use(express.json()); // Parser de JSON
app.use(express.urlencoded({ extended: true })); // Parser de URL-encoded
app.use(express.static('public')); // Serve arquivos estáticos (HTML, CSS, JS)

// Middleware de log de requisições
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Rota raiz
// Rota raiz (comentada para servir o index.html da pasta public)
// app.get('/', (req, res) => {
//     res.json({
//         message: 'API CRUD Node.js + Oracle Database',
//         version: '1.0.0',
//         endpoints: {
//             users: '/api/users',
//             health: '/health'
//         }
//     });
// });

// Rota de health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Rotas da API
app.use('/api/users', userRoutes);

// Middleware de tratamento de rotas não encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada'
    });
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

/**
 * Inicializa o servidor e o pool de conexões
 */
async function startServer() {
    try {
        // Inicializa o pool de conexões Oracle
        await database.initialize();

        // Inicia o servidor Express
        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log(`📚 API Docs: http://localhost:${PORT}/api/users`);
            console.log('='.repeat(50));
        });
    } catch (err) {
        console.error('❌ Erro ao iniciar servidor:', err);
        process.exit(1);
    }
}

/**
 * Tratamento de encerramento gracioso
 */
async function shutdown(signal) {
    console.log(`\n${signal} recebido. Encerrando aplicação...`);
    
    try {
        await database.close();
        console.log('✓ Conexões fechadas com sucesso');
        process.exit(0);
    } catch (err) {
        console.error('✗ Erro ao encerrar:', err);
        process.exit(1);
    }
}

// Listeners para sinais de encerramento
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Listener para erros não tratados
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    shutdown('UNCAUGHT_EXCEPTION');
});

// Inicia o servidor
startServer();

module.exports = app;
