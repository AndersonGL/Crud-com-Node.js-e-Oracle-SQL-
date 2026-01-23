const sequelize = require("./config/database");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to Oracle.");

    const tableName = "USUARIOS_NOVO2";
    const [results] = await sequelize.query(`SELECT column_name, data_type FROM all_tab_columns WHERE table_name = '${tableName}'`);
    console.log(`Columns for ${tableName}:`, results);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await sequelize.close();
  }
})();
