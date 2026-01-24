-- ============================================
-- Script de criação da tabela USERS
-- Oracle Database
-- ============================================

-- Remove a tabela se ela já existir (cuidado em produção!)
-- DROP TABLE users CASCADE CONSTRAINTS;

-- Cria a tabela de usuários
CREATE TABLE users (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    age NUMBER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_age CHECK (age >= 0 AND age <= 150)
);

-- Cria índice no campo email para melhorar performance de buscas
CREATE INDEX idx_users_email ON users(email);

-- Comentários na tabela e colunas
COMMENT ON TABLE users IS 'Tabela de usuários do sistema';
COMMENT ON COLUMN users.id IS 'ID único do usuário (auto-incremento)';
COMMENT ON COLUMN users.name IS 'Nome completo do usuário';
COMMENT ON COLUMN users.email IS 'Email único do usuário';
COMMENT ON COLUMN users.age IS 'Idade do usuário';
COMMENT ON COLUMN users.created_at IS 'Data e hora de criação do registro';

-- Insere alguns dados de exemplo (opcional)
INSERT INTO users (name, email, age) VALUES ('João Silva', 'joao.silva@example.com', 30);
INSERT INTO users (name, email, age) VALUES ('Maria Santos', 'maria.santos@example.com', 25);
INSERT INTO users (name, email, age) VALUES ('Pedro Oliveira', 'pedro.oliveira@example.com', 35);
INSERT INTO users (name, email, age) VALUES ('Ana Costa', 'ana.costa@example.com', 28);

-- Confirma as alterações
COMMIT;

-- Verifica os dados inseridos
SELECT * FROM users;

-- Exibe informações da tabela
SELECT 
    column_name, 
    data_type, 
    data_length, 
    nullable
FROM user_tab_columns 
WHERE table_name = 'USERS'
ORDER BY column_id;
