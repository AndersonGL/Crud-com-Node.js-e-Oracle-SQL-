const db = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const result = await db.execute(
      'SELECT id, nome, email FROM usuarios_novo'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  console.log(req.body); // 👈 DEBUG

  const { nome, email } = req.body;
  try {
    await db.execute(
      'INSERT INTO usuarios_novo (nome, email) VALUES (:nome, :email)',
      { nome, email },
      { autoCommit: true }
    );
    res.status(201).json({ message: 'Usuário criado!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  try {
    const result = await db.execute(
      'UPDATE usuarios_novo SET nome = :nome, email = :email WHERE id = :id',
      { id, nome, email }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário atualizado!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.execute(
      'DELETE FROM usuarios_novo WHERE id = :id',
      { id }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário removido!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
