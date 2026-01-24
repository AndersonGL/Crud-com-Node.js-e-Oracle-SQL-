const database = require('../src/config/database');

async function setup() {
    try {
        await database.initialize();

        console.log('Criando tabela users...');
        try {
            await database.execute(`
                CREATE TABLE users (
                    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    name VARCHAR2(100) NOT NULL,
                    email VARCHAR2(100) UNIQUE NOT NULL,
                    age NUMBER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT check_age CHECK (age >= 0 AND age <= 150)
                )
            `, {}, { autoCommit: true }); // DDL implicits commit but good to be explicit if needed, though autoCommit is usually for DML
            console.log('Tabela users criada.');
        } catch (e) {
            if (e.message.includes('ORA-00955')) {
                console.log('Tabela users já existe.');
            } else {
                throw e;
            }
        }

        console.log('Criando índice...');
        try {
            await database.execute(`CREATE INDEX idx_users_email ON users(email)`);
            console.log('Índice criado.');
        } catch (e) {
            if (e.message.includes('ORA-00955') || e.message.includes('ORA-01408')) {
                 console.log('Índice já existe.');
            } else {
                 console.log('Aviso ao criar índice:', e.message);
            }
        }

        console.log('Inserindo dados iniciais...');
        const users = [
            ['João Silva', 'joao.silva@example.com', 30],
            ['Maria Santos', 'maria.santos@example.com', 25],
            ['Pedro Oliveira', 'pedro.oliveira@example.com', 35],
            ['Ana Costa', 'ana.costa@example.com', 28]
        ];

        for (const user of users) {
            try {
                await database.execute(
                    `INSERT INTO users (name, email, age) VALUES (:1, :2, :3)`,
                    user,
                    { autoCommit: true }
                );
            } catch (e) {
                if (e.message.includes('ORA-00001')) { // Unique constraint
                    console.log(`Usuário ${user[1]} já existe.`);
                } else {
                    console.error(`Erro ao inserir ${user[0]}:`, e.message);
                }
            }
        }

        console.log('Setup concluído com sucesso!');
    } catch (err) {
        console.error('Erro fatal no setup:', err);
    } finally {
        await database.close();
    }
}

setup();
