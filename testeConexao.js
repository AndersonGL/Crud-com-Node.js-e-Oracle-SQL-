const oracledb = require('oracledb');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING,
};

(async () => {
  try {
    const conn = await oracledb.getConnection(dbConfig);
    console.log('Conexão Oracle OK!');
    await conn.close();
  } catch (err) {
    console.error('Erro de conexão:', err);
  }
})();
