const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const User = require("./models/user.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inicializa banco e tabela
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectado ao Oracle");

    await sequelize.sync(); // cria tabela se não existir
    console.log("Tabela sincronizada");
  } catch (err) {
    console.error("Erro de conexão:", err);
  }
})();

// Rotas
app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const newUser = await User.create({ name, email, age });
    res.json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;
    await User.update({ name, email, age }, { where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Tentando excluir usuário com ID: ${id}`);
    const deleted = await User.destroy({ where: { id } });
    console.log(`Usuários excluídos: ${deleted}`);
    
    if (deleted === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error("Erro ao excluir:", err);
    res.status(400).json({ error: err.message });
  }
});

// Servir HTML
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

